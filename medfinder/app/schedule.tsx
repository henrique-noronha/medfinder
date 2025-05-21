import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import styles, { gradientColors } from './styles/scheduleStyles';

import { getAuth } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function ScheduleScreen() {
  const router = useRouter();
  const {
    fullName,
    emailContact,
    phone,
    specialties,
    placesOfService,
  } = useLocalSearchParams<{
    fullName: string;
    emailContact: string;
    phone: string;
    specialties: string;
    placesOfService: string;
  }>();

  const specialtiesArray = JSON.parse(specialties || '[]');
  const placesArray = JSON.parse(placesOfService || '[]');

  const [selectedDate, setSelectedDate] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSchedule = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para agendar.');
      return;
    }

    if (!selectedDate) {
      Alert.alert('Erro', 'Por favor, selecione uma data.');
      return;
    }

    try {
      await addDoc(collection(db, 'appointments'), {
        userId: user.uid,
        userEmail: user.email,
        professionalName: fullName,
        professionalEmail: emailContact,
        date: selectedDate,
        status: 'pendente',
        createdAt: new Date()
      });

      Alert.alert('Sucesso', 'Solicitação de agendamento enviada!');
      router.back();
    } catch (error) {
      console.error('Erro ao agendar:', error);
      Alert.alert('Erro', 'Não foi possível agendar. Tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />

      {/* Cabeçalho com ícone de voltar e título */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Agendamento</Text>

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
        <Text style={styles.infoText}>{specialtiesArray.join(', ')}</Text>

        <Text style={styles.label}>Locais de Atendimento:</Text>
        <Text style={styles.infoText}>{placesArray.join(', ')}</Text>

        <Text style={styles.label}>E-mail:</Text>
        <Text style={styles.infoText}>{emailContact}</Text>

        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.infoText}>{phone}</Text>

        <Text style={styles.label}>Escolha uma data:</Text>
        <Calendar
          onDayPress={(day: { dateString: string }) => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, selectedColor: '#FF8C00' },
          }}
          theme={{
            selectedDayBackgroundColor: '#FF8C00',
            todayTextColor: '#FF8C0A',
            arrowColor: '#FF8C00',
          }}
        />

        <TouchableOpacity
          style={styles.scheduleButton}
          onPress={handleSchedule}
        >
          <Text style={styles.scheduleButtonText}>Confirmar Agendamento</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
