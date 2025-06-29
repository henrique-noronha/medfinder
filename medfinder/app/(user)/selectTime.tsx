import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Href } from 'expo-router';
import { addDoc, collection, getDoc, doc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import styles, { gradientColors, localStyles as localSelectTimeStyles } from '@/styles/selectTimeStyles';
import { useAuth } from '@/hooks/AuthContext';

export default function SelectTimeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    date: string;
    professionalUID: string;
    fullName: string;
  }>();

  const { date, professionalUID, fullName } = params;
  const { user, loading: authLoading } = useAuth();

  const [selectedHour, setSelectedHour] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);

  const fetchTimeSlots = useCallback(async () => {
    if (!professionalUID || !date) {
        setIsProcessing(false);
        return;
    };
    setIsProcessing(true);
    try {
      const availabilityDocRef = doc(db, 'professionalAvailability', professionalUID);
      const availDocSnap = await getDoc(availabilityDocRef);
      const professionalSlots = availDocSnap.data()?.availableSlotsByDate?.[date]?.sort() || [];

      const q = query(
        collection(db, 'appointments'),
        where('professionalUID', '==', professionalUID),
        where('date', '==', date),
        where('status', 'in', ['pendente', 'confirmada'])
      );
      const querySnapshot = await getDocs(q);
      const currentBookedSlots = querySnapshot.docs.map(d => d.data().hour as string);
      
      setBookedSlots(currentBookedSlots);
      setAvailableSlots(professionalSlots);

    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      Alert.alert('Erro', 'Não foi possível carregar os horários disponíveis.');
    } finally {
      setIsProcessing(false);
    }
  }, [professionalUID, date]);

  useEffect(() => {
    fetchTimeSlots();
  }, [fetchTimeSlots]);

  const handleConfirm = async () => {
    if (!user) {
      Alert.alert('Acesso Negado', 'Você precisa estar logado para agendar.');
      return;
    }
    if (!selectedHour) {
      Alert.alert('Atenção', 'Por favor, selecione um horário.');
      return;
    }

    if (bookedSlots.includes(selectedHour)) {
        Alert.alert('Horário Indisponível', 'Este horário foi agendado por outra pessoa. A lista será atualizada.');
        fetchTimeSlots();
        setSelectedHour('');
        return;
    }

    setIsProcessing(true);
    try {
      await addDoc(collection(db, 'appointments'), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || 'Usuário MedFinder',
        professionalUID: professionalUID,
        professionalName: fullName,
        date,
        hour: selectedHour,
        status: 'pendente',
        createdAt: Timestamp.now(),
      });

      Alert.alert('Sucesso', 'Agendamento solicitado! Aguarde a confirmação do profissional.');
      router.replace('/(user)/pending' as Href);

    } catch (error) {
      console.error('Erro ao agendar:', error);
      Alert.alert('Erro', 'Não foi possível concluir o agendamento.');
    } finally {
      setIsProcessing(false);
    }
  };

  const displayableSlots = availableSlots.filter(slot => !bookedSlots.includes(slot));

  if (authLoading || isProcessing) {
    return (
      <View style={localSelectTimeStyles.loadingContainer}>
        <LinearGradient colors={gradientColors} style={localSelectTimeStyles.backgroundGradientFull} />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={localSelectTimeStyles.loadingText}>
          {authLoading ? "Verificando usuário..." : "Carregando horários..."}
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
        <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
        <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{fullName?.trim()?.[0]?.toUpperCase()}</Text>
            </View>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.label}>Data Selecionada:</Text>
            <Text style={styles.info}>{new Date(date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</Text>

            <Text style={styles.label}>Horários disponíveis:</Text>
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
                    Nenhum horário disponível para esta data.
                </Text>
            )}
            
            <TouchableOpacity 
                style={[
                    styles.confirmButton, 
                    (!selectedHour || displayableSlots.length === 0) && localSelectTimeStyles.disabledButton
                ]} 
                onPress={handleConfirm}
                disabled={!selectedHour || displayableSlots.length === 0 || isProcessing}
            >
              {isProcessing && selectedHour ? (
                <ActivityIndicator color="#fff" size="small"/>
              ) : (
                <Text style={styles.confirmButtonText}>Solicitar Agendamento</Text>
              )}
            </TouchableOpacity>
        </ScrollView>
    </View>
  );
}