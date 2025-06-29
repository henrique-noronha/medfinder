import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Alert, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect, Href, useNavigation } from 'expo-router';
import { db, auth } from '@/firebaseConfig';
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  onSnapshot,
  Unsubscribe,
  QuerySnapshot,
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import styles from '@/styles/homestyles';
import { useAuth } from '@/hooks/AuthContext';

const normalizeText = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

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
  const navigation = useNavigation();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userName, setUserName] = useState<string>('Usuário');
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    if (user) {
      const fetchUserName = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUserName(userDoc.exists() && userDoc.data().fullName ? userDoc.data().fullName : (user.displayName || 'Usuário'));
      };
      fetchUserName();
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      const q = query(collection(db, 'userNotifications'), where('userId', '==', user.uid), where('read', '==', false));
      const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot) => {
        setUnreadCount(snapshot.size);
      });
      return () => unsubscribe();
    }, [user])
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {
      Alert.alert('Erro', 'Não foi possível sair.');
    }
  };

  const handleSearch = async () => {
    try {
      const professionalsRef = collection(db, 'healthcareProfessionals');
      const snapshot = await getDocs(professionalsRef);
      const allProfessionals = snapshot.docs.map(docSnapshot => ({ id: docSnapshot.id, ...docSnapshot.data() })) as HealthcareProfessional[];
      const queryNormalized = normalizeText(searchQuery.trim());
      
      const results = queryNormalized
        ? allProfessionals.filter((prof) => {
            const name = normalizeText(prof.fullName || '');
            const specialties = (prof.specialties || []).map(s => normalizeText(s));
            const places = (prof.placesOfService || []).map(p => normalizeText(p));
            const insurances = (prof.acceptedInsurances || []).map(i => normalizeText(i));
            return (
              name.includes(queryNormalized) ||
              specialties.some(s => s.includes(queryNormalized)) ||
              places.some(p => p.includes(queryNormalized)) ||
              insurances.some(i => i.includes(queryNormalized))
            );
          })
        : allProfessionals;

      const resultsString = JSON.stringify(results);
      const encodedResults = encodeURIComponent(resultsString);

      router.push(`/(user)/search?results=${encodedResults}&initialQuery=${searchQuery.trim()}` as Href);

    } catch (error) {
      console.error("Erro na busca:", error);
      Alert.alert('Erro na Busca', 'Não foi possível realizar a busca.');
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
            <Image source={require('@/assets/images/logo3.png')} style={styles.logoImage} />
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
              <Feather name="log-out" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(user)/edit' as Href)}>
              <Image
                source={{
                  uri: user?.photoURL || 'https://randomuser.me/api/portraits/men/1.jpg',
                }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/(user)/notifications' as Href)}
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
          <TouchableOpacity style={styles.card} onPress={() => router.push('/(user)/history' as Href)}>
            <FontAwesome5 name="book-open" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Histórico</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/(user)/pending' as Href)}>
            <Feather name="clock" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Pendentes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/(user)/help' as Href)}>
            <Feather name="help-circle" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Ajuda</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/(user)/results' as Href)}>
            <FontAwesome5 name="thermometer-half" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Resultados</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}