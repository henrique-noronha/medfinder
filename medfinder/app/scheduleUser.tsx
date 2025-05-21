import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import styles, { gradientColors } from './styles/scheduleStyles';

import { getAuth } from 'firebase/auth';

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

  const handleSchedule = () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para agendar.');
      return;
    }

    if (!selectedDate) {
      Alert.alert('Erro', 'Por favor, selecione uma data.');
      return;
    }

    // Substituir a tela atual para evitar retorno a ela
    router.replace({
      pathname: '/selectTime',
      params: {
        date: selectedDate,
        fullName,
        emailContact,
        phone,
        specialties,
        placesOfService,
      },
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />

      {/* Cabeçalho com ícone de voltar e título */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/search')}>
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
        {/* Círculo com inicial do nome */}
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
          <Text style={styles.scheduleButtonText}>Avançar para Horário</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
