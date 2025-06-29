import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Calendar, LocaleConfig, CalendarProps } from 'react-native-calendars';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import styles, { gradientColors, localStyles } from '@/styles/scheduleStyles';
import { useAuth } from '@/hooks/AuthContext';

// Configuração do calendário para português do Brasil
LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom.','Seg.','Ter.','Qua.','Qui.','Sex.','Sáb.'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

interface MyDateMarking {
  marked?: boolean;
  dotColor?: string;
  selected?: boolean;
  selectedColor?: string;
  disabled?: boolean;
  disableTouchEvent?: boolean;
  activeOpacity?: number;
}

export default function ScheduleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    professionalUID: string;
    fullName: string;
    emailContact: string;
    phone: string;
    specialties: string;
    placesOfService: string;
  }>();
  
  const { professionalUID, fullName, emailContact, phone, specialties, placesOfService } = params;
  const { user } = useAuth();

  const specialtiesArray = specialties ? JSON.parse(specialties) : [];
  const placesArray = placesOfService ? JSON.parse(placesOfService) : [];

  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState<CalendarProps['markedDates']>({});
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [availabilityData, setAvailabilityData] = useState<{ [date: string]: string[] }>({});

  const fetchProfessionalAvailability = useCallback(async () => {
    if (!professionalUID) {
      setIsLoadingAvailability(false);
      return;
    }
    setIsLoadingAvailability(true);
    try {
      const availabilityDocRef = doc(db, 'professionalAvailability', professionalUID);
      const docSnap = await getDoc(availabilityDocRef);

      let markedDatesLogic: CalendarProps['markedDates'] = {};
      let dataFromFirestore: { [date: string]: string[] } = {};

      if (docSnap.exists() && docSnap.data()?.availableSlotsByDate) {
        dataFromFirestore = docSnap.data().availableSlotsByDate;
        Object.keys(dataFromFirestore).forEach(dateStr => {
          if (Array.isArray(dataFromFirestore[dateStr]) && dataFromFirestore[dateStr].length > 0) {
            markedDatesLogic[dateStr] = { marked: true, dotColor: '#00BFA5' };
          }
        });
      }
      setAvailabilityData(dataFromFirestore);
      setMarkedDates(markedDatesLogic);
    } catch (error) {
      console.error("Erro ao buscar disponibilidade:", error);
      Alert.alert("Erro", "Não foi possível carregar a disponibilidade do profissional.");
    } finally {
      setIsLoadingAvailability(false);
    }
  }, [professionalUID]);

  useEffect(() => {
    fetchProfessionalAvailability();
  }, [fetchProfessionalAvailability]);

  const handleDayPress: CalendarProps['onDayPress'] = (day) => {
    const dateString = day.dateString;
    const dayHasSlots = availabilityData[dateString] && availabilityData[dateString].length > 0;

    if (!dayHasSlots) {
      Alert.alert("Dia Indisponível", "Este profissional não possui horários para esta data.");
      return;
    }

    setSelectedDate(dateString);

    const newMarkedVisual = { ...markedDates };
    Object.keys(newMarkedVisual).forEach(key => {
      if (newMarkedVisual[key]?.selected) {
        delete newMarkedVisual[key]!.selected;
      }
    });
    
    newMarkedVisual[dateString] = {
      ...newMarkedVisual[dateString],
      selected: true,
      selectedColor: '#007AFF'
    };
    setMarkedDates(newMarkedVisual);
  };

  const handleSchedule = () => {
    if (!user) {
      Alert.alert('Login Necessário', 'Você precisa estar logado para agendar uma consulta.');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Seleção Necessária', 'Por favor, selecione uma data disponível.');
      return;
    }
    
    const specialtiesString = JSON.stringify(specialtiesArray);
    const placesString = JSON.stringify(placesArray);

    const href = `/(user)/selectTime?date=${encodeURIComponent(selectedDate)}&professionalUID=${encodeURIComponent(professionalUID)}&fullName=${encodeURIComponent(fullName)}&emailContact=${encodeURIComponent(emailContact)}&phone=${encodeURIComponent(phone || '')}&specialties=${encodeURIComponent(specialtiesString)}&placesOfService=${encodeURIComponent(placesString)}`;

    router.push(href as Href);
  };
  
  if (isLoadingAvailability) {
    return (
      <View style={localStyles.loadingContainer}>
        <LinearGradient colors={gradientColors} style={localStyles.backgroundGradientFull} />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={localStyles.loadingText}>Carregando disponibilidade...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{fullName?.trim()?.[0]?.toUpperCase() || '?'}</Text>
        </View>
        <Text style={styles.name}>{fullName || "Nome do Profissional"}</Text>
        
        {specialtiesArray.length > 0 && (
          <>
            <Text style={styles.label}>Especialidades:</Text>
            <Text style={styles.infoText}>{specialtiesArray.join(', ')}</Text>
          </>
        )}
        {placesArray.length > 0 && (
          <>
            <Text style={styles.label}>Locais de Atendimento:</Text>
            <Text style={styles.infoText}>{placesArray.join(' | ')}</Text>
          </>
        )}
        <Text style={styles.label}>E-mail:</Text>
        <Text style={styles.infoText}>{emailContact}</Text>
        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.infoText}>{phone}</Text>

        <Text style={styles.label}>Escolha uma data disponível (dias com ponto verde):</Text>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: '#007AFF',
            todayTextColor: '#007AFF',
            arrowColor: '#007AFF',
            calendarBackground: '#FFFFFF',
            textSectionTitleColor: '#3167AF',
            monthTextColor: '#222',
            textDayFontWeight: '400',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
          }}
          minDate={new Date().toISOString().split('T')[0]}
        />

        <TouchableOpacity
          style={[
            styles.scheduleButton,
            (!selectedDate || !(availabilityData[selectedDate]?.length > 0)) && localStyles.disabledButton
          ]}
          onPress={handleSchedule}
          disabled={!selectedDate || !(availabilityData[selectedDate]?.length > 0)}
        >
          <Text style={styles.scheduleButtonText}>Avançar para Horário</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}