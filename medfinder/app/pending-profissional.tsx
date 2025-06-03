// app/pending-profissional.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import { getAuth, User as FirebaseUser } from 'firebase/auth';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore'; // ADICIONADO addDoc e serverTimestamp
import { db } from '../firebaseConfig';
import styles, { gradientColors } from './styles/pendingStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

interface Appointment {
  id: string;
  userId: string; // UID do paciente
  userEmail: string;
  userName?: string;
  professionalUID: string;
  professionalName: string;
  date: string;
  hour: string;
  status: 'pendente' | 'confirmada' | 'cancelada' | 'realizada';
  createdAt: Timestamp;
}

export default function PendingProfissionalScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const professionalUser = auth.currentUser;
  const router = useRouter();

  const fetchAppointments = useCallback(async () => {
    if (!professionalUser) {
      setAppointments([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('professionalUID', '==', professionalUser.uid),
        where('status', '==', 'pendente')
      );
      const querySnapshot = await getDocs(q);
      const list: Appointment[] = querySnapshot.docs.map(docData => ({
        id: docData.id,
        ...(docData.data() as Omit<Appointment, 'id'>),
      }));

      list.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.hour}`);
        const dateB = new Date(`${b.date}T${b.hour}`);
        return dateA.getTime() - dateB.getTime();
      });

      setAppointments(list);
    } catch (error) {
      console.error('Erro ao buscar consultas pendentes:', error);
      Alert.alert('Erro', 'Não foi possível carregar as consultas pendentes.');
    }
    setLoading(false);
  }, [professionalUser]);

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  // Modificada para aceitar o objeto 'appointment' completo
  const updateAppointmentStatus = async (appointment: Appointment, newStatus: Appointment['status']) => {
    if (!professionalUser) {
        Alert.alert("Erro", "Usuário profissional não autenticado.");
        return;
    }
    try {
      const appointmentRef = doc(db, 'appointments', appointment.id);
      await updateDoc(appointmentRef, { status: newStatus });

      // Criar notificação para o usuário (paciente)
      const notificationTitle = newStatus === 'confirmada' ? 'Consulta Confirmada' : 'Consulta Recusada';
      const notificationMessage = newStatus === 'confirmada'
        ? `Sua consulta com Dr(a). ${appointment.professionalName} para ${new Date(appointment.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' })} às ${appointment.hour} foi confirmada.`
        : `Sua consulta com Dr(a). ${appointment.professionalName} para ${new Date(appointment.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' })} às ${appointment.hour} foi recusada. Por favor, entre em contato ou tente agendar novamente.`;

      await addDoc(collection(db, 'userNotifications'), {
        userId: appointment.userId, // UID do paciente
        title: notificationTitle,
        message: notificationMessage,
        createdAt: serverTimestamp(),
        read: false,
        type: 'appointment_status',
        relatedAppointmentId: appointment.id,
        professionalName: appointment.professionalName, // Nome do profissional que atualizou
        professionalUid: professionalUser.uid, // UID do profissional que atualizou
      });

      setAppointments(prev => prev.filter(app => app.id !== appointment.id));
      Alert.alert('Sucesso', `Consulta ${newStatus === 'confirmada' ? 'confirmada' : 'recusada'} com sucesso. O paciente será notificado.`);

    } catch (error) {
      console.error('Erro ao atualizar consulta e notificar:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status da consulta ou notificar o paciente.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 100 }} />
        <Text style={{color: '#fff', textAlign: 'center', marginTop: 10}}>Carregando solicitações...</Text>
      </View>
    );
  }
  if (!professionalUser) {
      return (
          <View style={styles.container}>
              <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
              <Text style={styles.noAppointmentsText}>
                  Por favor, faça login para ver seus agendamentos pendentes.
              </Text>
              <TouchableOpacity onPress={() => router.replace('/auth/login')} style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Ir para Login</Text>
              </TouchableOpacity>
          </View>
      )
  }


  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace('/home-profissional')}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Solicitações Pendentes</Text>
        <TouchableOpacity onPress={() => router.push('/profile/edit')}>
          <Image
            source={{ uri: professionalUser?.photoURL || 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {appointments.length === 0 ? (
          <Text style={styles.noAppointmentsText}>
            Nenhuma solicitação de consulta pendente no momento.
          </Text>
        ) : (
          appointments.map((app) => (
            <View key={app.id} style={styles.appointmentCard}>
              <Text style={styles.patientName}>Paciente: {app.userName || app.userEmail}</Text>
              <Text style={styles.info}>Data: {new Date(app.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' })} às {app.hour}</Text>
              <Text style={styles.status}>Status: {app.status}</Text>

              {app.status === 'pendente' && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={() => updateAppointmentStatus(app, 'confirmada')} // Passando o objeto 'app' completo
                  >
                    <Feather name="check-circle" size={16} color="#fff" />
                    <Text style={styles.buttonText}>Confirmar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => updateAppointmentStatus(app, 'cancelada')} // Passando o objeto 'app' completo
                  >
                    <Feather name="x-circle" size={16} color="#fff" />
                    <Text style={styles.buttonText}>Recusar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}