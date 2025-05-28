import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Calendar, LocaleConfig, CalendarProps } from 'react-native-calendars';
import styles, { gradientColors, localStyles } from './styles/scheduleStyles';
import { getAuth, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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

  // Log crucial para verificar o professionalUID recebido
  useEffect(() => {
    console.log("--- SCHEDULE_USER_SCREEN ---");
    console.log("Parâmetro professionalUID recebido:", professionalUID);
    console.log("Parâmetro fullName recebido:", fullName);
    console.log("---------------------------");
  }, [professionalUID, fullName]);

  const specialtiesArray = specialties ? JSON.parse(specialties) : [];
  const placesArray = placesOfService ? JSON.parse(placesOfService) : [];

  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState<CalendarProps['markedDates']>({});
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true); // Inicia true
  const [professionalAvailableDatesData, setProfessionalAvailableDatesData] = useState<{ [date: string]: string[] }>({});

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const fetchProfessionalAvailability = useCallback(async () => {
    if (!professionalUID || professionalUID.trim() === "") {
      // Este Alert e console.error são importantes se o useEffect abaixo falhar na verificação
      Alert.alert("Erro de Configuração", "ID do profissional não fornecido para buscar agenda.");
      console.error("FETCH_AVAILABILITY_ERROR: Tentativa de busca com professionalUID inválido ou não fornecido.");
      setIsLoadingAvailability(false);
      setMarkedDates({});
      setProfessionalAvailableDatesData({});
      return;
    }

    setIsLoadingAvailability(true);
    try {
        const availabilityDocRef = doc(db, 'professionalAvailability', professionalUID);
        const docSnap = await getDoc(availabilityDocRef);

        let currentMarkedDatesLogic: CalendarProps['markedDates'] = {};
        let availableDataFromFirestore: { [date: string]: string[] } = {};

        if (docSnap.exists()) {
            const rawData = docSnap.data();
            if (rawData && rawData.availableSlotsByDate && typeof rawData.availableSlotsByDate === 'object') {
                availableDataFromFirestore = rawData.availableSlotsByDate;
                Object.keys(availableDataFromFirestore).forEach(dateStr => {
                    if (Array.isArray(availableDataFromFirestore[dateStr]) && availableDataFromFirestore[dateStr].length > 0) {
                        currentMarkedDatesLogic[dateStr] = { marked: true, dotColor: '#00BFA5' };
                    }
                });
            } else {
                console.warn(`SCHEDULE_USER: Documento para ${professionalUID} existe mas falta 'availableSlotsByDate' ou não é objeto.`);
                availableDataFromFirestore = {};
            }
        } else {
            console.warn(`SCHEDULE_USER: Documento de disponibilidade NÃO ENCONTRADO para professionalUID: '${professionalUID}'.`);
            availableDataFromFirestore = {};
        }

        setProfessionalAvailableDatesData(availableDataFromFirestore);

        if (selectedDate && availableDataFromFirestore[selectedDate] && availableDataFromFirestore[selectedDate].length > 0) {
            currentMarkedDatesLogic[selectedDate] = {
                ...(currentMarkedDatesLogic[selectedDate] || { marked: true, dotColor: '#00BFA5' }),
                selected: true,
                selectedColor: '#88E788'
            };
        } else if (selectedDate) {
           
        }
        setMarkedDates(currentMarkedDatesLogic);
    } catch (error: any) {
        console.error("SCHEDULE_USER_ERROR: Erro CRÍTICO ao buscar disponibilidade:", error.message, error.stack);
        Alert.alert("Erro de Sistema", "Não foi possível carregar a disponibilidade do profissional.");
        setMarkedDates({});
        setProfessionalAvailableDatesData({});
    }
    setIsLoadingAvailability(false);
  }, [professionalUID, selectedDate]);

  useEffect(() => {
    if (professionalUID && professionalUID.trim() !== "") {
        fetchProfessionalAvailability();
    } else {
        console.warn("SCHEDULE_USER_EFFECT: professionalUID não disponível ou inválido no useEffect. Não vai buscar disponibilidade.");
        setIsLoadingAvailability(false); // Garante que não fique em loading infinito
    }
  }, [professionalUID, fetchProfessionalAvailability]); 

  const handleDayPress: CalendarProps['onDayPress'] = (day) => {
    const dateString = day.dateString;
    const dayHasAvailableSlots = professionalAvailableDatesData[dateString] && professionalAvailableDatesData[dateString].length > 0;

    if (!dayHasAvailableSlots) {
      Alert.alert("Dia Indisponível", "Este profissional não possui horários para esta data.");
      const newMarked = { ...markedDates };
      if (selectedDate && newMarked[selectedDate]) {
        delete newMarked[selectedDate]!.selected;
        if (!newMarked[selectedDate]?.marked) {
            delete newMarked[selectedDate];
        }
      }
      setMarkedDates(newMarked);
      setSelectedDate('');
      return;
    }

    setSelectedDate(dateString);
    const newMarkedVisual = { ...markedDates };
    Object.keys(newMarkedVisual).forEach(key => {
      if (newMarkedVisual[key]) {
        delete newMarkedVisual[key]!.selected;
        if (!newMarkedVisual[key]?.marked && Object.keys(newMarkedVisual[key]!).length === 0) {
            delete newMarkedVisual[key];
        }
      }
    });
    
    let dayBaseMarking: MyDateMarking = {}; 
    if (professionalAvailableDatesData[dateString] && professionalAvailableDatesData[dateString].length > 0) {
        dayBaseMarking = { marked: true, dotColor: '#00BFA5' };
    }
    
    newMarkedVisual[dateString] = {
        ...dayBaseMarking,
        selected: true,
        selectedColor: '#FF8C00'
    };
    setMarkedDates(newMarkedVisual);
  };

  const handleSchedule = () => {
    if (!currentUser) {
      Alert.alert('Login Necessário', 'Você precisa estar logado para agendar uma consulta.');
      router.push('/auth/login');
      return;
    }
    if (!selectedDate) {
      Alert.alert('Seleção Necessária', 'Por favor, selecione uma data disponível no calendário.');
      return;
    }
    if (!professionalAvailableDatesData[selectedDate] || professionalAvailableDatesData[selectedDate].length === 0) {
      Alert.alert('Data Inválida', 'A data selecionada não possui horários disponíveis.');
      return;
    }

    router.replace({
      pathname: '/selectTime',
      params: {
        date: selectedDate,
        professionalUID,
        fullName,
        emailContact,
        phone,
        specialties: JSON.stringify(specialtiesArray),
        placesOfService: JSON.stringify(placesArray),
      },
    });
  };
  if (isLoadingAvailability && (!professionalUID || professionalUID.trim() === "")) {
     
  }
  if (isLoadingAvailability && professionalUID && professionalUID.trim() !== "") {
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
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.push('/search')}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Agendar com {fullName || "Profissional"}</Text>
        <TouchableOpacity onPress={() => router.push('/profile/edit')}>
          <Image
            source={{ uri: currentUser?.photoURL || 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {fullName?.trim()?.[0]?.toUpperCase() || '?'}
          </Text>
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
                <Text style={styles.infoText}>{placesArray.join(', ')}</Text>
            </>
        )}
         <Text style={styles.label}>E-mail:</Text>
        <Text style={styles.infoText}>{emailContact}</Text>
        <Text style={styles.label}>Telefone:</Text>
        <Text style={styles.infoText}>{phone}</Text>

        <Text style={styles.label}>Escolha uma data disponível (dias com ponto verde):</Text>
        {(!professionalUID || professionalUID.trim() === "") && !isLoadingAvailability && (
            <View style={{alignItems: 'center', marginVertical: 20}}>
                <Text style={{color: '#88E788', fontSize: 16, textAlign: 'center'}}>
                    Não foi possível carregar a agenda. Verifique se o profissional foi selecionado corretamente.
                </Text>
            </View>
        )}
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: '#88E788',
            todayTextColor: '#FF8C0A',
            arrowColor: '#FF8C00',
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
            (!selectedDate || isLoadingAvailability || !(professionalAvailableDatesData[selectedDate] && professionalAvailableDatesData[selectedDate].length > 0))
             && localStyles.disabledButton
          ]}
          onPress={handleSchedule}
          disabled={!selectedDate || isLoadingAvailability || !(professionalAvailableDatesData[selectedDate] && professionalAvailableDatesData[selectedDate].length > 0)}
        >
          <Text style={styles.scheduleButtonText}>Avançar para Horário</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}