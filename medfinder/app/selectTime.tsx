// app/selectTime.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { addDoc, collection, getDoc, doc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import styles, { gradientColors, localStyles as localSelectTimeStyles } from './styles/selectTimeStyles'; // Seus estilos

export default function SelectTimeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    date: string;
    professionalUID: string; // **** UID de autenticação do profissional ****
    fullName: string;
    emailContact: string; // Pode ser usado para notificações, mas UID é primário
    phone: string;
    specialties: string;
    placesOfService: string;
  }>();

  const { date, professionalUID, fullName, emailContact, phone, specialties, placesOfService } = params;

  const specialtiesArray = JSON.parse(specialties || '[]');
  const placesArray = JSON.parse(placesOfService || '[]');

  const [selectedHour, setSelectedHour] = useState('');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [availableProfessionalSlots, setAvailableProfessionalSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingUser(false);
    });
    return unsubscribe;
  }, []);

  const fetchTimeSlots = useCallback(async () => {
    if (!professionalUID || !date) {
        setIsLoadingSlots(false);
        return;
    }
    setIsLoadingSlots(true);
    try {
      const availabilityDocRef = doc(db, 'professionalAvailability', professionalUID);
      const docSnap = await getDoc(availabilityDocRef);
      let professionalSlotsForDate: string[] = [];
      if (docSnap.exists()) {
        const availabilityData = docSnap.data()?.availableSlotsByDate;
        if (availabilityData && availabilityData[date]) {
          professionalSlotsForDate = availabilityData[date].sort();
        }
      }
      
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('professionalUID', '==', professionalUID),
        where('date', '==', date),
        where('status', 'in', ['pendente', 'confirmada'])
      );
      const querySnapshot = await getDocs(q);
      const currentBookedSlots = querySnapshot.docs.map(d => d.data().hour as string);
      
      setBookedSlots(currentBookedSlots);
      setAvailableProfessionalSlots(professionalSlotsForDate);

    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      Alert.alert('Erro', 'Não foi possível carregar os horários disponíveis.');
      setAvailableProfessionalSlots([]);
      setBookedSlots([]);
    }
    setIsLoadingSlots(false);
  }, [professionalUID, date]);

  useEffect(() => {
    if (!loadingUser) {
        fetchTimeSlots();
    }
  }, [loadingUser, fetchTimeSlots]);

  const handleConfirm = async () => {
    if (!currentUser) {
      Alert.alert('Erro', 'Você precisa estar logado para agendar.');
      router.push('/auth/login');
      return;
    }
    if (!selectedHour) {
      Alert.alert('Erro', 'Por favor, selecione um horário.');
      return;
    }

    // Revalidação rápida
    if (bookedSlots.includes(selectedHour) || !availableProfessionalSlots.includes(selectedHour)) {
        Alert.alert('Horário Indisponível', 'Este horário foi agendado por outra pessoa ou não está mais disponível. Por favor, atualize e tente outro.');
        fetchTimeSlots(); // Atualiza a lista de horários
        setSelectedHour(''); // Limpa a seleção
        return;
    }

    try {
      setIsLoadingSlots(true); // Reutilizar para feedback de carregamento
      await addDoc(collection(db, 'appointments'), {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName || 'Usuário MedFinder', // Adicionar nome do usuário se disponível
        professionalUID: professionalUID,
        professionalName: fullName,
        professionalEmail: emailContact,
        date,
        hour: selectedHour,
        status: 'pendente', // Status inicial
        createdAt: Timestamp.now(), // Usar Timestamp do Firestore
      });

      Alert.alert('Sucesso', 'Agendamento solicitado! Aguarde a confirmação do profissional.');
      router.replace('/pending'); // Ou tela de 'meus agendamentos'
    } catch (error) {
      console.error('Erro ao agendar:', error);
      Alert.alert('Erro', 'Não foi possível concluir o agendamento. Tente novamente.');
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const displayableSlots = availableProfessionalSlots.filter(slot => !bookedSlots.includes(slot));

  if (loadingUser || isLoadingSlots) {
    return (
      <View style={localSelectTimeStyles.loadingContainer}>
        <LinearGradient colors={gradientColors} style={localSelectTimeStyles.backgroundGradientFull} />
        <ActivityIndicator size="large" color="#fff" />
         <Text style={localSelectTimeStyles.loadingText}>
            {loadingUser ? "Verificando usuário..." : "Carregando horários..."}
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Selecionar Horário</Text>
        <TouchableOpacity onPress={() => router.push('/profile/edit')}>
          <Image
            source={{ uri: currentUser?.photoURL || 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{fullName?.trim()[0].toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.label}>Data Selecionada:</Text>
        <Text style={styles.info}>{new Date(date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Text>

        <Text style={styles.label}>Horários disponíveis para {fullName}:</Text>
        {displayableSlots.length > 0 ? (
            <View style={styles.hoursContainer}>
            {displayableSlots.map((hour) => (
                <TouchableOpacity
                key={hour}
                style={[
                    styles.hourButton,
                    selectedHour === hour && styles.selectedHourButton,
                ]}
                onPress={() => setSelectedHour(hour)}
                >
                <Text style={[ styles.hourText, selectedHour === hour && styles.selectedHourText ]}>
                    {hour}
                </Text>
                </TouchableOpacity>
            ))}
            </View>
        ) : (
            <Text style={localSelectTimeStyles.noSlotsText}>
                Nenhum horário disponível para {fullName} nesta data.
            </Text>
        )}
        
        <TouchableOpacity 
            style={[
                styles.confirmButton, 
                (!selectedHour || displayableSlots.length === 0 || isLoadingSlots) && localSelectTimeStyles.disabledButton
            ]} 
            onPress={handleConfirm}
            disabled={!selectedHour || displayableSlots.length === 0 || isLoadingSlots}
        >
          {isLoadingSlots && selectedHour ? (
            <ActivityIndicator color="#fff" size="small"/>
          ) : (
            <Text style={styles.confirmButtonText}>Solicitar Agendamento</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}