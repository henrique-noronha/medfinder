import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import styles, { gradientColors } from './styles/selectTimeStyles';

const availableHours = [
  '08:00', '08:30', '09:00', '09:30',
  '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30',
];

export default function SelectTimeScreen() {
  const router = useRouter();
  const {
    date,
    fullName,
    emailContact,
    phone,
    specialties,
    placesOfService,
  } = useLocalSearchParams<{
    date: string;
    fullName: string;
    emailContact: string;
    phone: string;
    specialties: string;
    placesOfService: string;
  }>();

  const specialtiesArray = JSON.parse(specialties || '[]');
  const placesArray = JSON.parse(placesOfService || '[]');

  const [selectedHour, setSelectedHour] = useState('');
  const [user, setUser] = useState<any | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingUser(false);
    });

    return unsubscribe;
  }, []);

  const handleConfirm = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para agendar.');
      return;
    }

    if (!selectedHour) {
      Alert.alert('Erro', 'Por favor, selecione um horário.');
      return;
    }

    try {
      await addDoc(collection(db, 'appointments'), {
        userId: user.uid,
        userEmail: user.email,
        professionalName: fullName,
        professionalEmail: emailContact,
        date,
        hour: selectedHour,
        status: 'pendente',
        createdAt: new Date(),
      });

      Alert.alert('Sucesso', 'Agendamento solicitado com sucesso!');
      router.push('/pending');
    } catch (error) {
      console.error('Erro ao agendar:', error);
      Alert.alert('Erro', 'Não foi possível concluir o agendamento.');
    }
  };

  if (loadingUser) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
        <View style={styles.content}>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
      
      {/* Cabeçalho com ícone de voltar e título */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.pageTitle}>Seleção de Horário</Text>
        
        <TouchableOpacity onPress={() => router.push('/profile/edit')}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {fullName?.trim()[0].toUpperCase()}
          </Text>
        </View>
        
        <Text style={styles.name}>{fullName}</Text>

        <Text style={styles.label}>Especialidades:</Text>
        <Text style={styles.info}>{specialtiesArray.join(', ')}</Text>

        <Text style={styles.label}>Locais de Atendimento:</Text>
        <Text style={styles.info}>{placesArray.join(', ')}</Text>

        <Text style={styles.label}>E-mail:</Text>
        <Text style={styles.info}>{emailContact}</Text>

        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.info}>{phone}</Text>

        <Text style={styles.label}>Horários disponíveis:</Text>
        <View style={styles.hoursContainer}>
          {availableHours.map((hour) => (
            <TouchableOpacity
              key={hour}
              style={[
                styles.hourButton,
                selectedHour === hour && styles.selectedHourButton,
              ]}
              onPress={() => setSelectedHour(hour)}
            >
              <Text
                style={[
                  styles.hourText,
                  selectedHour === hour && styles.selectedHourText,
                ]}
              >
                {hour}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}