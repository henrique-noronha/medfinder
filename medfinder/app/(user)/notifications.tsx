import React, { useState, useCallback, useLayoutEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter, useFocusEffect, useNavigation } from 'expo-router';
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
import { db } from '@/firebaseConfig';
import { notificationsStyles as styles, gradientColors } from '@/styles/notificationStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/hooks/AuthContext';

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
  const navigation = useNavigation();
  const { user } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    if (!user) {
      setNotifications([]);
      setLoading(false);
      if (isRefresh) setRefreshing(false);
      return;
    }

    if (!isRefresh) setLoading(true);

    try {
      const q = query(
        collection(db, 'userNotifications'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedNotifications = querySnapshot.docs.map(docData => ({
        id: docData.id,
        ...(docData.data() as Omit<Notification, 'id'>),
      }));

      setNotifications(fetchedNotifications);

      const unread = fetchedNotifications.filter(n => !n.read);
      if (unread.length > 0) {
        const batch = writeBatch(db);
        unread.forEach(n => batch.update(doc(db, 'userNotifications', n.id), { read: true }));
        await batch.commit();
        setNotifications(prev =>
          prev.map(n => unread.find(u => u.id === n.id) ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      Alert.alert("Erro", "Não foi possível carregar as notificações.");
    } finally {
      if (!isRefresh) setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [fetchNotifications])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications(true);
  }, [fetchNotifications]);

  const getIconName = (type?: string) => {
    switch (type) {
      case 'appointment_status': return 'calendar';
      case 'new_result': return 'file-text';
      default: return 'bell';
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={gradientColors} style={styles.screenContainer}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Carregando notificações...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradientColors} style={styles.screenContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Notificações</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.contentContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        >
          {notifications.length === 0 ? (
            <View style={styles.noNotificationsContainer}>
              <Feather name="bell-off" size={48} color="rgba(255, 255, 255, 0.5)" />
              <Text style={[styles.noNotificationsText, { marginTop: 10 }]}>
                Nenhuma notificação no momento.
              </Text>
            </View>
          ) : (
            notifications.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.notificationCard, !item.read && styles.notificationCardUnread]}
              >
                <View style={styles.notificationHeader}>
                  <Feather
                    name={getIconName(item.type)}
                    size={18}
                    color={!item.read ? "#007bff" : "#555"}
                  />
                  <Text style={styles.notificationTitle}>{item.title}</Text>
                </View>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationDate}>
                  {item.createdAt?.toDate().toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                  })}{' '}
                  às{' '}
                  {item.createdAt?.toDate().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
