import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons'; // FontAwesome5 já está importado
import { useRouter } from 'expo-router';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'; // Adicionado collection, query, where, getDocs
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
        // Tenta buscar primeiro na coleção 'users'
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists() && userDocSnap.data().fullName) {
          setFullName(userDocSnap.data().fullName);
        } else {
          // Se não encontrar ou não tiver fullName, tenta buscar na coleção 'healthcareProfessionals' pelo authUid
          const professionalsQuery = query(collection(db, 'healthcareProfessionals'), where('authUid', '==', user.uid));
          const professionalSnapshot = await getDocs(professionalsQuery);

          if (!professionalSnapshot.empty) {
            const professionalData = professionalSnapshot.docs[0].data(); // Pega o primeiro documento correspondente
            setFullName(professionalData.fullName || 'Profissional');
          } else {
            setFullName(user.displayName || user.email?.split('@')[0] || 'Profissional');
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
              source={require('../assets/images/logo3.png')} // Confirme o caminho da imagem
              style={styles.logoImage}
            />
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
              <Feather name="log-out" size={24} color="#fff" />
            </TouchableOpacity>
            {/* Opcional: Manter o ícone de perfil no header se fizer sentido, ou remover/alterar */}
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
          {/* CARD ALTERADO ABAIXO */}
          <TouchableOpacity style={styles.card} onPress={() => router.push('/upload-results')}>
            <Feather name="upload" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Enviar Resultados</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}