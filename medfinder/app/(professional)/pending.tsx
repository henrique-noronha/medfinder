import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import styles, { gradientColors } from '@/styles/pendingStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/hooks/AuthContext';

interface Appointment {
  id: string;
  userId: string;
  userEmail: string;
  userName?: string;
  professionalUID: string;
  professionalName: string;
  date: string;
  hour: string;
  status: 'pendente' | 'confirmada' | 'cancelada' | 'realizada';
  createdAt: Timestamp;
}

export default function PendingProfessionalScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchAppointments = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      // Passo 1: Busca os agendamentos pendentes para este profissional
      const q = query(
        collection(db, 'appointments'),
        where('professionalUID', '==', user.uid),
        where('status', '==', 'pendente')
      );
      const querySnapshot = await getDocs(q);
      const pendingList: Appointment[] = querySnapshot.docs.map(docData => ({
        id: docData.id,
        ...(docData.data() as Omit<Appointment, 'id'>),
      }));

      // --- MUDANÇA PRINCIPAL AQUI: Enriquecendo os dados ---
      // Passo 2: Para cada agendamento, busca o nome atualizado do paciente
      const enrichedAppointments = await Promise.all(
        pendingList.map(async (app) => {
          const userDocRef = doc(db, 'users', app.userId);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            // Retorna o agendamento com o nome correto do paciente
            return { ...app, userName: userDocSnap.data().fullName };
          }
          // Se o documento do usuário não for encontrado, mantém o nome original ou um fallback
          return { ...app, userName: app.userName || 'Usuário Desconhecido' };
        })
      );
      // --- FIM DA MUDANÇA ---

      enrichedAppointments.sort((a, b) => new Date(`${a.date}T${a.hour}`).getTime() - new Date(`${b.date}T${b.hour}`).getTime());
      
      setAppointments(enrichedAppointments);

    } catch (error) {
      console.error('Erro ao buscar consultas pendentes:', error);
      Alert.alert('Erro', 'Não foi possível carregar as consultas pendentes.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  const updateAppointmentStatus = async (appointment: Appointment, newStatus: Appointment['status']) => {
    // Sua lógica de updateAppointmentStatus está ótima e foi mantida
    if (!user) return;
    try {
      const appointmentRef = doc(db, 'appointments', appointment.id);
      await updateDoc(appointmentRef, { status: newStatus });

      // ... (sua lógica de notificação)

      setAppointments(prev => prev.filter(app => app.id !== appointment.id));
      Alert.alert('Sucesso', `Consulta ${newStatus} com sucesso.`);
    } catch (error) {
      console.error('Erro ao atualizar consulta:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status da consulta.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{color: '#fff', textAlign: 'center', marginTop: 10}}>Carregando solicitações...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
      <ScrollView contentContainerStyle={styles.content}>
        {appointments.length === 0 ? (
          <Text style={styles.noAppointmentsText}>
            Nenhuma solicitação de consulta pendente no momento.
          </Text>
        ) : (
          appointments.map((app) => (
            <View key={app.id} style={styles.appointmentCard}>
              {/* Agora o app.userName terá o nome correto e atualizado */}
              <Text style={styles.patientName}>Paciente: {app.userName || app.userEmail}</Text>
              <Text style={styles.info}>Data: {new Date(app.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' })} às {app.hour}</Text>
              <Text style={styles.status}>Status: {app.status}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={() => updateAppointmentStatus(app, 'confirmada')}>
                  <Feather name="check-circle" size={16} color="#fff" />
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => updateAppointmentStatus(app, 'cancelada')}>
                  <Feather name="x-circle" size={16} color="#fff" />
                  <Text style={styles.buttonText}>Recusar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}