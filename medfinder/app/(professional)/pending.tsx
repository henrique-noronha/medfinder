import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { collection, query, where, getDocs, updateDoc, doc, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig'; // <-- MUDANÇA: Usando alias e import direto
import styles, { gradientColors } from '@/styles/pendingStyles'; // <-- MUDANÇA: Usando alias
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect, Href } from 'expo-router';
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
  const router = useRouter();

  const fetchAppointments = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const q = query(
        collection(db, 'appointments'),
        where('professionalUID', '==', user.uid), 
        where('status', '==', 'pendente')
      );
      const querySnapshot = await getDocs(q);
      const list: Appointment[] = querySnapshot.docs.map(docData => ({
        id: docData.id,
        ...(docData.data() as Omit<Appointment, 'id'>),
      }));

      list.sort((a, b) => new Date(`${a.date}T${a.hour}`).getTime() - new Date(`${b.date}T${b.hour}`).getTime());
      setAppointments(list);
    } catch (error) {
      console.error('Erro ao buscar consultas pendentes:', error);
      Alert.alert('Erro', 'Não foi possível carregar as consultas pendentes.');
    }
    setLoading(false);
  }, [user]); 

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  const updateAppointmentStatus = async (appointment: Appointment, newStatus: Appointment['status']) => {
    if (!user) return; 
    try {
      const appointmentRef = doc(db, 'appointments', appointment.id);
      await updateDoc(appointmentRef, { status: newStatus });

      const notificationTitle = newStatus === 'confirmada' ? 'Consulta Confirmada' : 'Consulta Recusada';
   
      const notificationMessage = `Sua consulta com Dr(a). ${appointment.professionalName} foi ${newStatus}.`;
      
      await addDoc(collection(db, 'userNotifications'), {
        userId: appointment.userId,
        title: notificationTitle,
        message: notificationMessage,
        createdAt: serverTimestamp(),
        read: false,
        professionalUid: user.uid,
      });

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