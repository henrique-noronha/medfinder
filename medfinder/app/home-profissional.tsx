import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles from './styles/homestyles';

export default function HomeProfissionalScreen() {
  const router = useRouter();
  const auth = getAuth();
  const [fullName, setFullName] = useState('');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/auth/login');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setFullName(data.fullName || '');
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <LinearGradient colors={['#71C9F8', '#3167AF']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.appTitleContainer}>
            <Text style={styles.appTitleText}>MedFinder</Text>
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
              <Feather name="log-out" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="bell" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Saudação personalizada */}
        <Text style={styles.greetingText}>
          Seja bem-vindo, {fullName ? `Dr. ${fullName}` : 'Profissional'}!
        </Text>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card}>
            <FontAwesome5 name="book-open" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push('/pending-profissional')}>
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
    </LinearGradient>
  );
}
