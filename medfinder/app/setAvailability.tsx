// app/setAvailability.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Calendar, LocaleConfig, CalendarProps } from 'react-native-calendars';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 
import styles, { gradientColors } from './styles/setAvailabilityStyles';  

LocaleConfig.locales['pt-br'] = {
  monthNames: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
  monthNamesShort: ['Jan.','Fev.','Mar.','Abr.','Mai.','Jun.','Jul.','Ago.','Set.','Out.','Nov.','Dez.'],
  dayNames: ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],
  dayNamesShort: ['Dom.','Seg.','Ter.','Qua.','Qui.','Sex.','Sáb.'],
  today: "Hoje"
};
LocaleConfig.defaultLocale = 'pt-br';

const DEFAULT_AVAILABLE_HOURS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00',
];

export default function SetAvailabilityScreen() {
  const router = useRouter();
  const auth = getAuth();
  const professionalUser = auth.currentUser;

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [availableSlotsForDate, setAvailableSlotsForDate] = useState<string[]>([]);
  const [allMyAvailableSlots, setAllMyAvailableSlots] = useState<{ [date: string]: string[] }>({});
  const [markedDates, setMarkedDates] = useState<CalendarProps['markedDates']>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const updateLocalMarkedDates = useCallback((slots: { [date: string]: string[] }, currentSelectedDate?: string) => {
    const newMarkedDates: CalendarProps['markedDates'] = {};
    Object.keys(slots).forEach(date => {
      if (slots[date] && slots[date].length > 0) {
        newMarkedDates[date] = { marked: true, dotColor: '#00BFA5', activeOpacity: 0 };
      }
    });
    const dateToSelect = currentSelectedDate || selectedDate;
    if (dateToSelect) {
        newMarkedDates[dateToSelect] = {
            ...newMarkedDates[dateToSelect],
            selected: true,
            selectedColor: '#88E788'
        };
    }
    setMarkedDates(newMarkedDates);
  }, [selectedDate]);


  const fetchAvailability = useCallback(async () => {
    if (!professionalUser) {
        setIsFetchingData(false);
        return;
    }
    setIsFetchingData(true);
    try {
      const availabilityDocRef = doc(db, 'professionalAvailability', professionalUser.uid);
      const docSnap = await getDoc(availabilityDocRef);
      let fetchedSlots = {};
      if (docSnap.exists()) {
        fetchedSlots = docSnap.data()?.availableSlotsByDate || {};
        setAllMyAvailableSlots(fetchedSlots);
      } else {
        setAllMyAvailableSlots({});
      }
      updateLocalMarkedDates(fetchedSlots, selectedDate); // Pass selectedDate to ensure it stays marked if already selected
    } catch (error) {
      console.error("Erro ao buscar disponibilidade:", error);
      Alert.alert("Erro", "Não foi possível carregar sua disponibilidade.");
      setAllMyAvailableSlots({});
      updateLocalMarkedDates({}, selectedDate);
    }
    setIsFetchingData(false);
  }, [professionalUser, updateLocalMarkedDates, selectedDate]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  const handleDayPress: CalendarProps['onDayPress'] = (day) => {
    const dateString = day.dateString;
    setSelectedDate(dateString);
    setAvailableSlotsForDate(allMyAvailableSlots[dateString] || []);
    updateLocalMarkedDates(allMyAvailableSlots, dateString);
  };

  const toggleHour = (hour: string) => {
    setAvailableSlotsForDate(prev =>
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour].sort()
    );
  };

  const handleSaveChanges = async () => {
    if (!professionalUser) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }
    if (!selectedDate) {
      Alert.alert("Atenção", "Selecione uma data para definir os horários.");
      return;
    }

    setIsLoading(true);
    const newAllMyAvailableSlots = { ...allMyAvailableSlots };
    if (availableSlotsForDate.length > 0) {
      newAllMyAvailableSlots[selectedDate] = [...availableSlotsForDate].sort();
    } else {
      delete newAllMyAvailableSlots[selectedDate];
    }

    try {
      const availabilityDocRef = doc(db, 'professionalAvailability', professionalUser.uid);
      await setDoc(availabilityDocRef, { availableSlotsByDate: newAllMyAvailableSlots }, { merge: true });

      setAllMyAvailableSlots(newAllMyAvailableSlots);
      updateLocalMarkedDates(newAllMyAvailableSlots, selectedDate);

      Alert.alert("Sucesso", "Disponibilidade atualizada!");
    } catch (error) {
      console.error("Erro ao salvar disponibilidade:", error);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    }
    setIsLoading(false);
  };

  if (isFetchingData && !professionalUser) { 
    return (
      <View style={[styles.container, styles.centered]}>
        <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
        <Text style={{ color: '#fff', marginTop: 10, fontSize: 16 }}>Por favor, faça login para gerenciar sua disponibilidade.</Text>
        <TouchableOpacity onPress={() => router.replace('/auth/login')} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Ir para Login</Text>
        </TouchableOpacity>
      </View>
    );
  }


  if (isFetchingData) {
    return (
      <View style={[styles.container, styles.centered]}>
        <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Carregando sua agenda...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/home-profissional')}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Definir Disponibilidade</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentScroll}>
        <Text style={styles.infoText}>Selecione uma data para definir ou editar seus horários. Dias com horários definidos terão um ponto verde.</Text>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#3167AF',
            selectedDayBackgroundColor: '#88E788',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#FF8C0A',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d9e1e8',
            arrowColor: '#88E788',
            monthTextColor: '#3167AF',
            textDayFontWeight: '300',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '300',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
          current={new Date().toISOString().split('T')[0]}
        />

        {selectedDate && (
          <View style={styles.timeSlotsContainer}>
            <Text style={styles.selectedDateText}>Horários para: {selectedDate.split('-').reverse().join('/')}</Text>
            <View style={styles.hoursGrid}>
              {DEFAULT_AVAILABLE_HOURS.map(hour => (
                <TouchableOpacity
                  key={hour}
                  style={[
                    styles.hourButton,
                    availableSlotsForDate.includes(hour) && styles.selectedHourButton,
                  ]}
                  onPress={() => toggleHour(hour)}
                >
                  <Text
                    style={[
                      styles.hourText,
                      availableSlotsForDate.includes(hour) && styles.selectedHourText,
                    ]}
                  >
                    {hour}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
              onPress={handleSaveChanges}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.saveButtonText}>Salvar para {selectedDate.split('-').reverse().join('/')}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}