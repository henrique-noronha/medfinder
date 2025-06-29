import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useNavigation, Href } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig'; 
import styles from '@/styles/homestyles';    
import { useAuth } from '@/hooks/AuthContext'; 

export default function HomeProfissionalScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { user } = useAuth(); 
  const [fullName, setFullName] = useState('');

  
  useEffect(() => {
    const fetchProfessionalData = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setFullName(userDocSnap.data().fullName || 'Profissional');
        }
      }
    };
    fetchProfessionalData();
  }, [user]); 


  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, 
    });
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível sair. Tente novamente.');
    }
  };

  return (
    <LinearGradient colors={['#004766', '#bfecff']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('@/assets/images/logo3.png')} 
              style={styles.logoImage}
            />
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 10 }}>
              <Feather name="log-out" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(user)/profile/edit' as Href)}>
              <Image
                source={{ uri: user?.photoURL || 'https://randomuser.me/api/portraits/men/1.jpg' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(user)/notifications' as Href)} style={{ marginLeft: 10 }}>
              <Feather name="bell" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.greetingText}>
          Seja bem-vindo, {fullName ? `Dr(a). ${fullName}` : 'Profissional'}!
        </Text>

        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/(professional)/history' as Href)}>
            <FontAwesome5 name="history" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Histórico</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/(professional)/pending' as Href)}>
            <Feather name="clock" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Pendentes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/(professional)/setAvailability' as Href)}>
            <Feather name="calendar" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Definir Horários</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/(professional)/upload-results' as Href)}>
            <Feather name="upload" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Enviar Resultados</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}