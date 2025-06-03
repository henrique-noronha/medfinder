import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet, 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router'; 
import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query, 
  where, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
import { getAuth, signOut, onAuthStateChanged, User } from 'firebase/auth';
import styles from './styles/homestyles'; 

const normalizeText = (text: string) =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();


interface HealthcareProfessional {
  id?: string;
  authUid?: string;
  fullName: string;
  specialties: string[];
  placesOfService: string[];
  emailContact: string;
  phone?: string;
  acceptedInsurances?: string[];
}

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userName, setUserName] = useState<string>('Usuário');
  const [unreadCount, setUnreadCount] = useState<number>(0); 
  const auth = getAuth();


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists() && docSnap.data().fullName) {
            setUserName(docSnap.data().fullName);
          } else if (user.displayName) {
            setUserName(user.displayName);
          } else {
            setUserName(user.email ? user.email.split('@')[0] : 'Usuário');
          }
        } catch {
          setUserName('Usuário');
        }
      } else {
        setUserName('Usuário');
        setUnreadCount(0); 
      }
    });
    return () => unsubscribeAuth();
  }, [auth]);


  useFocusEffect(
    useCallback(() => {
      let unsubscribeNotifications: Unsubscribe | undefined;
      const user = auth.currentUser;

      if (user) {
        const notificationsRef = collection(db, 'userNotifications');
        const q = query(
          notificationsRef,
          where('userId', '==', user.uid),
          where('read', '==', false)
        );

        unsubscribeNotifications = onSnapshot(q, (querySnapshot) => {
          setUnreadCount(querySnapshot.size);
        }, (error) => {
          console.error("Erro ao buscar contagem de notificações não lidas: ", error);
          setUnreadCount(0);
        });
      } else {
        setUnreadCount(0);
      }

      return () => {
        if (unsubscribeNotifications) {
          unsubscribeNotifications();
        }
      };
    }, [auth, auth.currentUser])
  );


  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/auth/login');
    } catch {
      Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
    }
  };

  const handleSearch = async () => {
    try {
      const professionalsRef = collection(db, 'healthcareProfessionals');
      const queryNormalized = normalizeText(searchQuery.trim());
      const snapshot = await getDocs(professionalsRef);

      const allProfessionals = snapshot.docs.map((docSnapshot) => {
        const data = docSnapshot.data();
        return {
          id: docSnapshot.id,
          authUid: data.authUid || '',
          fullName: data.fullName || '',
          specialties: data.specialties || [],
          placesOfService: data.placesOfService || [],
          emailContact: data.emailContact || '',
          phone: data.phone || '',
          acceptedInsurances: data.acceptedInsurances || [],
        } as HealthcareProfessional;
      });

      let combinedResults: HealthcareProfessional[] = [];

      if (queryNormalized) {
        const results = allProfessionals.filter((prof) => {
          const name = normalizeText(prof.fullName || '');
          const specialties = (prof.specialties || []).map((s: string) => normalizeText(s));
          const places = (prof.placesOfService || []).map((p: string) => normalizeText(p));
          const insurances = (prof.acceptedInsurances || []).map((i: string) => normalizeText(i));

          return (
            name.includes(queryNormalized) ||
            specialties.some((s) => s.includes(queryNormalized)) ||
            places.some((p) => p.includes(queryNormalized)) ||
            insurances.some((i) => i.includes(queryNormalized))
          );
        });
        
        const uniqueMap = new Map<string, HealthcareProfessional>();
        results.forEach((item) => uniqueMap.set(item.id || item.emailContact, item));
        combinedResults = Array.from(uniqueMap.values());

      } else {
        combinedResults = allProfessionals;
      }

      router.push({
        pathname: '/search',
        params: {
          results: JSON.stringify(combinedResults),
          initialQuery: searchQuery.trim(),
        },
      });
    } catch (error) {
      console.error("Erro na busca:", error);
      Alert.alert('Erro na Busca', 'Não foi possível realizar a busca no momento.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#004766', '#bfecff']} style={StyleSheet.absoluteFill} />

      <ScrollView
        style={{ zIndex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image source={require('../assets/images/logo3.png')} style={styles.logoImage} />
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
              <Feather name="log-out" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              <Image
                source={{
                  uri:
                    auth.currentUser?.photoURL ||
                    'https://randomuser.me/api/portraits/men/1.jpg',
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/notifications')} 
              style={[styles.notificationBellContainer, { marginLeft: 10 }]} 
            >
              <Feather name="bell" size={24} color="#fff" />
              {unreadCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.greetingText}>Seja bem-vindo, {userName}!</Text>

        <View style={styles.searchContainer}>
          <Text style={styles.searchLabel}>O que você procura?</Text>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Especialidade, nome, local ou convênio"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Feather name="search" size={25} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/history')}>
            <FontAwesome5 name="book-open" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Histórico</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/pending')}>
            <Feather name="clock" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Pendentes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/help')}>
            <Feather name="help-circle" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Ajuda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/results')}>
            <FontAwesome5 name="thermometer-half" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Resultados</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}