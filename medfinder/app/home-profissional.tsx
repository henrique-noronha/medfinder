import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
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
        } else {
          // Se não encontrar no 'users', pode ser que o nome esteja no 'healthcareProfessionals'
          // Esta é uma suposição, ajuste se o nome do profissional vier de outra fonte
          const professionalDocRef = doc(db, 'healthcareProfessionals', user.uid); // Assumindo que o ID aqui também é o authUid
          const professionalDocSnap = await getDoc(professionalDocRef);
          if (professionalDocSnap.exists() && professionalDocSnap.data().fullName) {
            setFullName(professionalDocSnap.data().fullName);
          }
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchUserData();
      } else {
        setFullName('');
        router.replace('/auth/login');
      }
    });
    return () => unsubscribe();
  }, [auth, router]);


  return (
    <LinearGradient colors={['#004766', '#bfecff']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logo3.png')}
              style={styles.logoImage}
            />
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
              <Feather name="log-out" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              <Image
                source={{ uri: auth.currentUser?.photoURL || 'https://randomuser.me/api/portraits/men/1.jpg' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert("Notificações", "Nenhuma nova notificação.")} style={{ marginLeft: 10 }}>
              <Feather name="bell" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.greetingText}>
          Seja bem-vindo, {fullName ? `Dr(a). ${fullName}` : 'Profissional'}!
        </Text>

        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/history-profissional')}>
            <FontAwesome5 name="history" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Histórico</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/pending-profissional')}>
            <Feather name="clock" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Pendentes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/setAvailability')}>
            <Feather name="calendar" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Definir Horários</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/profile/edit')}>
            <Feather name="user" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Meu Perfil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}