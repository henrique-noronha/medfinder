import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,

} from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import styles, { gradientColors } from '@/styles/pendingStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@/hooks/AuthContext';
import { Feather } from '@expo/vector-icons';

// Definição do tipo Appointment
type Appointment = {
  id: string;
  professionalName?: string;
  professionalUID: string;
  date: string;
  hour: string;
  status: 'pendente';
};

export default function PendingScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const fetchPendingAppointments = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, 'appointments'),
        where('userId', '==', user.uid),
        where('status', '==', 'pendente')
      );
      const querySnapshot = await getDocs(q);

      const appointmentsData = querySnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        
        // Garante que 'date', 'hour' e 'professionalUID' são strings, fornecendo fallback
        const date = typeof data.date === 'string' ? data.date : '';
        const hour = typeof data.hour === 'string' ? data.hour : '';
        const professionalUID = typeof data.professionalUID === 'string' ? data.professionalUID : '';
        // Verifique outros campos se estiver usando-os e eles puderem ser undefined
        const professionalName = typeof data.professionalName === 'string' ? data.professionalName : undefined;
        const status = (typeof data.status === 'string' && ['pendente', 'confirmada', 'cancelada', 'realizada'].includes(data.status)) ? data.status : 'pendente'; // Garante que é um status válido

        // Valida se os campos essenciais estão presentes no documento
        if (!data.userId || !professionalUID || !status) {
          console.warn('Documento de agendamento pendente incompleto encontrado, ignorando:', docSnapshot.id, data);
          return null; // Retorna null para filtrar depois
        }

        return {
          id: docSnapshot.id,
          date: date,
          hour: hour,
          professionalUID: professionalUID,
          professionalName: professionalName, // Atribui o nome do profissional (pode ser undefined aqui)
          status: status as 'pendente', 
        } as Appointment;
      }).filter(Boolean) as Appointment[]; // Remove os 'null' e mantém apenas os válidos

      // Para cada agendamento, buscar o nome do profissional PELO UID (se ainda não tiver)
      const enrichedAppointments = await Promise.all(
        appointmentsData.map(async (app) => {
          let currentProfessionalName = app.professionalName || 'Profissional Removido'; // Usa o nome existente ou fallback
          
          // Se o nome do profissional não veio do appointment ou está vazio, busca no 'users'
          if (!app.professionalName && typeof app.professionalUID === 'string' && app.professionalUID) {
            const profDocRef = doc(db, 'users', app.professionalUID);
            const profDocSnap = await getDoc(profDocRef);
            if (profDocSnap.exists()) {
              currentProfessionalName = profDocSnap.data().fullName;
            }
          }
          return {
            ...app,
            professionalName: currentProfessionalName,
          };
        })
      );

      // Filtra agendamentos que ainda possam ter data ou hora vazias/inválidas
      const validAppointments = enrichedAppointments.filter(app => app.date && app.hour);

      // Ordena por data, do mais próximo para o mais distante (para pendentes)
      validAppointments.sort((a, b) => {
        try {
          const dateA = new Date(`${a.date}T${a.hour}`);
          const dateB = new Date(`${b.date}T${b.hour}`);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn('Data ou hora inválida encontrada durante a ordenação (Pendentes):', a.id, { dateA: a.date, hourA: a.hour }, { dateB: b.date, hourB: b.hour });
            return 0;
          }
          return dateA.getTime() - dateB.getTime(); // Do mais antigo (próximo) para o mais recente (distante)
        } catch (e) {
          console.error('Erro ao comparar datas para ordenação (Pendentes):', e, a, b);
          return 0;
        }
      });

      setAppointments(validAppointments);
    } catch (error) {
      console.error('Erro geral ao buscar consultas pendentes do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar suas consultas pendentes. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchPendingAppointments();
    }, [fetchPendingAppointments])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 100 }} />
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 10 }}>Carregando suas consultas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
      <ScrollView contentContainerStyle={styles.content}>
        {appointments.length === 0 ? (
          <Text style={styles.noAppointmentsText}>
            Você não possui consultas pendentes.
          </Text>
        ) : (
          appointments.map((app) => (
            <View key={app.id} style={styles.appointmentCard}>
              <Text style={styles.patientName}>{app.professionalName || 'Profissional Desconhecido'}</Text> {/* Fallback para nome do profissional */}
              <Text style={styles.info}>
                Data: {app.date && app.hour ?
                  new Date(app.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                  : 'Data Indisponível'} às {app.hour || 'Hora Indisponível'}
              </Text>
              <View style={styles.statusContainer}>
                 <Feather name="clock" size={16} color="#FFD700" />
                 <Text style={[styles.status, { color: '#FFD700' }]}>
                   Status: {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Desconhecido'}
                 </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}