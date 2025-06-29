import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import styles, { gradientColors } from '@/styles/pendingStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '@/hooks/AuthContext';

interface Appointment {
  id: string;
  patientName?: string; 
  userId: string;
  professionalUID: string; 
  date: string;
  hour: string;
  status: 'confirmada' | 'cancelada' | 'pendente' | 'realizada';
}

export default function HistoryProfissionalScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  const fetchHistory = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, 'appointments'),
        where('professionalUID', '==', user.uid),
        where('status', 'in', ['realizada', 'cancelada']) 
      );

      const querySnapshot = await getDocs(q);
      const appointmentsData = querySnapshot.docs.map(docData => {
        const data = docData.data();
        const date = typeof data.date === 'string' ? data.date : '';
        const hour = typeof data.hour === 'string' ? data.hour : '';

        if (!data.userId || !data.professionalUID || !data.status) {
          console.warn('Documento de agendamento incompleto encontrado:', docData.id, data);
          return null; 
        }

        return {
          id: docData.id,
          ...data,
          date: date,
          hour: hour,
        } as Appointment; 
      }).filter(Boolean) as Appointment[]; 

      const enrichedAppointments = await Promise.all(
        appointmentsData.map(async (app) => {
          let patientName = 'Paciente Removido';
          if (typeof app.userId === 'string' && app.userId) { 
            const userDocRef = doc(db, 'users', app.userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              patientName = userDocSnap.data().fullName;
            }
          }
          return {
            ...app,
            patientName,
          };
        })
      );

      const validAppointments = enrichedAppointments.filter(app => app.date && app.hour);

      validAppointments.sort((a, b) => {
        try {
          const dateA = new Date(`${a.date}T${a.hour}`);
          const dateB = new Date(`${b.date}T${b.hour}`);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.warn('Data ou hora inválida encontrada durante a ordenação (Profissional):', a.id, { dateA: a.date, hourA: a.hour }, { dateB: b.date, hourB: b.hour });
            return 0; 
          }
          return dateB.getTime() - dateA.getTime();
        } catch (e) {
          console.error('Erro ao comparar datas para ordenação (Profissional):', e, a, b);
          return 0;
        }
      });

      setAppointments(validAppointments);
    } catch (error) {
      console.error('Erro ao buscar histórico de consultas (Profissional):', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico do profissional.');
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
            Nenhum histórico de consultas disponível.
          </Text>
        ) : (
          appointments.map((app) => (
            <View key={app.id} style={[styles.appointmentCard, app.status === 'cancelada' && styles.cancelledCard]}>
              <Text style={styles.patientName}>Paciente: {app.patientName}</Text>
              <Text style={styles.info}>
                Data: {app.date && app.hour ? 
                  new Date(app.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
                  : 'Data Indisponível'} às {app.hour || 'Hora Indisponível'}
              </Text>
              <View style={styles.statusContainer}>
                <Feather name={app.status === 'realizada' ? "check-circle" : "x-circle"} size={16} color={app.status === 'realizada' ? 'green' : 'red'} />
                <Text style={[styles.status, { color: app.status === 'realizada' ? 'green' : 'red' }]}>
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