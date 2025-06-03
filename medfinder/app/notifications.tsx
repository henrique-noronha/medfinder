// app/notifications.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getAuth, User as FirebaseUser } from 'firebase/auth';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
// Verifique se este caminho está correto em relação à localização de notifications.tsx
import { notificationsStyles as styles, gradientColors } from './styles/notificationStyles'; 
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  createdAt: Timestamp;
  read: boolean;
  type?: string;
  relatedAppointmentId?: string;
  professionalName?: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log("NotificationsScreen: Auth state listener setup.");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("NotificationsScreen: Auth state changed. User:", user ? user.uid : null);
      setCurrentUser(user);
      if (!user) {
        setLoading(false);
        setNotifications([]);
      }
    });
    return () => {
      console.log("NotificationsScreen: Auth state listener cleanup.");
      unsubscribe();
    }
  }, []);

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    console.log("NotificationsScreen: fetchNotifications called. Current user:", currentUser ? currentUser.uid : "null");
    if (!currentUser) {
      console.log("NotificationsScreen: No current user, returning from fetch.");
      setNotifications([]);
      setLoading(false);
      if (isRefresh) setRefreshing(false);
      return;
    }

    if (!isRefresh) setLoading(true);
    console.log("NotificationsScreen: Starting fetch, loading is true.");

    try {
      const notificationsRef = collection(db, 'userNotifications');
      const q = query(
        notificationsRef,
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      console.log(`NotificationsScreen: Querying for userId: ${currentUser.uid}`);

      const querySnapshot = await getDocs(q);
      console.log("NotificationsScreen: Query snapshot size:", querySnapshot.size);

      const fetchedNotifications: Notification[] = querySnapshot.docs.map(docData => {
        const data = docData.data();
        console.log("NotificationsScreen: Raw doc data:", data);
        return {
          id: docData.id,
          ...(data as Omit<Notification, 'id'>),
        };
      });
      console.log("NotificationsScreen: Fetched notifications (before setting state):", JSON.stringify(fetchedNotifications, null, 2));
      setNotifications(fetchedNotifications); // Define as notificações ANTES de tentar marcá-las como lidas

      const unreadNotifications = fetchedNotifications.filter(n => !n.read);
      console.log("NotificationsScreen: Unread notifications count:", unreadNotifications.length);

      if (unreadNotifications.length > 0) {
        console.log("NotificationsScreen: Attempting to mark unread notifications as read.");
        const batch = writeBatch(db);
        unreadNotifications.forEach(n => {
          const notificationRef = doc(db, 'userNotifications', n.id);
          batch.update(notificationRef, { read: true });
        });
        await batch.commit();
        console.log("NotificationsScreen: Batch commit successful for marking as read.");
        // Para forçar a re-renderização com o status 'read' atualizado visualmente na mesma carga:
        setNotifications(prev => prev.map(n => {
            const wasUnread = unreadNotifications.find(un => un.id === n.id);
            return wasUnread ? { ...n, read: true } : n;
        }));
        console.log("NotificationsScreen: Local state updated to reflect read status.");
      }

    } catch (error) {
      console.error("NotificationsScreen: Erro ao buscar notificações:", error);
      Alert.alert("Erro", "Não foi possível carregar as notificações.");
    } finally {
      console.log("NotificationsScreen: Fetch finished, setting loading to false.");
      if (!isRefresh) setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [currentUser]);

  useFocusEffect(
    useCallback(() => {
      console.log("NotificationsScreen: Focus effect triggered. Current user:", currentUser ? currentUser.uid : "null");
      if (currentUser) {
        fetchNotifications();
      }
    }, [currentUser, fetchNotifications])
  );

  const onRefresh = useCallback(() => {
    console.log("NotificationsScreen: Refresh triggered.");
    setRefreshing(true);
    fetchNotifications(true);
  }, [fetchNotifications]);

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    console.log(`NotificationsScreen: Marking notification ${notificationId} as read.`);
    try {
      const notificationRef = doc(db, 'userNotifications', notificationId);
      await updateDoc(notificationRef, { read: true });
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      console.log(`NotificationsScreen: Notification ${notificationId} marked as read in local state.`);
    } catch (error) {
      console.error("NotificationsScreen: Erro ao marcar notificação como lida:", error);
    }
  };
  
  const getIconName = (type?: string) => {
    switch (type) {
      case 'appointment_status':
        return 'calendar';
      case 'new_result':
        return 'file-text';
      default:
        return 'bell';
    }
  };

  console.log("NotificationsScreen: Rendering. Loading:", loading, "Notifications count:", notifications.length, "Current User:", currentUser ? currentUser.uid : "null");

  if (loading && notifications.length === 0) {
    return (
      <LinearGradient colors={gradientColors} style={styles.screenContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando notificações...</Text>
        </View>
      </LinearGradient>
    );
  }
  
  if (!currentUser) {
    return (
       <LinearGradient colors={gradientColors} style={styles.screenContainer}>
          <View style={styles.headerContainer}>
              <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/home')} style={styles.backButton}>
                  <Feather name="arrow-left" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.pageTitle}>Notificações</Text>
              <View style={{width: 24}} />
          </View>
          <View style={styles.noNotificationsContainer}>
               <Text style={styles.noNotificationsText}>Por favor, faça login para ver suas notificações.</Text>
                <TouchableOpacity onPress={() => router.replace('/auth/login')} style={{marginTop: 15, padding:10, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 5}}>
                  <Text style={{color: '#fff', fontWeight: 'bold'}}>Ir para Login</Text>
                </TouchableOpacity>
          </View>
       </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.screenContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/home')} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Notificações</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
      >
        {notifications.length === 0 && !loading ? (
          <View style={styles.noNotificationsContainer}>
            <Feather name="bell-off" size={48} color="rgba(255, 255, 255, 0.5)" />
            <Text style={[styles.noNotificationsText, {marginTop: 10}]}>Nenhuma notificação no momento.</Text>
          </View>
        ) : (
          notifications.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.notificationCard, !item.read && styles.notificationCardUnread]}
              onPress={() => {
                if (!item.read) {
                    handleMarkNotificationAsRead(item.id);
                }
              }}
            >
              <View style={styles.notificationHeader}>
                <Feather name={getIconName(item.type)} size={18} color={!item.read ? "#007bff" : "#555"} />
                <Text style={styles.notificationTitle}>{item.title}</Text>
              </View>
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.notificationDate}>
                {item.createdAt?.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })} às {item.createdAt?.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </LinearGradient>
  );
}