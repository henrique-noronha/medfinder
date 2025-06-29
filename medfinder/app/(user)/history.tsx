import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import styles, { gradientColors } from '@/styles/pendingStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/hooks/AuthContext';

type Appointment = {
  id: string;
  professionalName?: string; // Pode ser undefined até ser enriquecido
  professionalUID: string;
  userId: string; // Adicionado para consistência, embora já seja o filtro
  date: string;
  hour: string;
  status: 'realizada' | 'cancelada' | 'confirmada'; // Status de histórico
};

export default function HistoryScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchHistory = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Passo 1: Buscar os agendamentos do usuário
      const q = query(
        collection(db, 'appointments'),
        where('userId', '==', user.uid),
        where('status', 'in', ['realizada', 'cancelada', 'confirmada']) // Status que compõem o histórico
      );
      const querySnapshot = await getDocs(q);
      const appointmentsData = querySnapshot.docs.map(docData => {
        const data = docData.data();
        // Garante que 'date' e 'hour' são strings, fornecendo fallback
        const date = typeof data.date === 'string' ? data.date : '';
        const hour = typeof data.hour === 'string' ? data.hour : '';

        // Valida se os campos essenciais estão presentes no documento antes de adicioná-lo
        if (!data.userId || !data.professionalUID || !data.status) {
          console.warn('Documento de agendamento incompleto encontrado:', docData.id, data);
          return null; // Retorna null para filtrar depois
        }

        return {
          id: docData.id,
          ...data,
          date: date,
          hour: hour,
        } as Appointment; // Cast para Appointment
      }).filter(Boolean) as Appointment[]; // Remove os 'null' e mantém apenas os válidos

      // Passo 2: Para cada agendamento, buscar o nome do profissional PELO UID
      const enrichedAppointments = await Promise.all(
        appointmentsData.map(async (app) => {
          let professionalName = 'Profissional Removido';
          // Garante que professionalUID é uma string válida antes de usá-lo
          if (typeof app.professionalUID === 'string' && app.professionalUID) {
            const profDocRef = doc(db, 'users', app.professionalUID);
            const profDocSnap = await getDoc(profDocRef);
            if (profDocSnap.exists()) {
              professionalName = profDocSnap.data().fullName;
            }
          }
          return {
            ...app,
            professionalName,
          };
        })
      );

      // Filtra agendamentos que ainda possam ter data ou hora vazias/inválidas após a recuperação
      const validAppointments = enrichedAppointments.filter(app => app.date && app.hour);

      // Ordena do mais recente para o mais antigo
      validAppointments.sort((a, b) => {
        try {
          const dateA = new Date(`${a.date}T${a.hour}`);
          const dateB = new Date(`${b.date}T${b.hour}`);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn('Data ou hora inválida encontrada durante a ordenação (Usuário):', a.id, { dateA: a.date, hourA: a.hour }, { dateB: b.date, hourB: b.hour });
            return 0; // Se inválido, não altera a ordem relativa
          }
          return dateB.getTime() - dateA.getTime();
        } catch (e) {
          console.error('Erro ao comparar datas para ordenação (Usuário):', e, a, b);
          return 0;
        }
      });

      setAppointments(validAppointments);
    } catch (error) {
      console.error('Erro ao buscar histórico de consultas (Usuário):', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [fetchHistory])
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 100 }} />
        ) : appointments.length === 0 ? (
          <Text style={styles.noAppointmentsText}>
            Você não possui histórico de consultas.
          </Text>
        ) : (
          appointments.map((app) => (
            <View key={app.id} style={[styles.appointmentCard, app.status === 'cancelada' && styles.cancelledCard]}>
              <Text style={styles.patientName}>{app.professionalName}</Text>
              <Text style={styles.info}>
                Data: {app.date && app.hour ?
                  new Date(app.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                  : 'Data Indisponível'} às {app.hour || 'Hora Indisponível'}
              </Text>
              <View style={styles.statusContainer}>
                <Feather name={app.status === 'realizada' || app.status === 'confirmada' ? "check-circle" : "x-circle"} size={16} color={app.status === 'cancelada' ? 'red' : 'green'} />
                <Text style={[styles.status, { color: app.status === 'cancelada' ? 'red' : 'green' }]}>
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