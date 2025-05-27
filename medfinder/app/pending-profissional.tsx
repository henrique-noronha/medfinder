// app/pending-profissional.tsx
import React, { useEffect, useState, useCallback } from 'react'; // Adicionado useCallback
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import { getAuth, User as FirebaseUser } from 'firebase/auth'; // User as FirebaseUser
import { collection, query, where, getDocs, updateDoc, doc, Timestamp } from 'firebase/firestore'; // Timestamp
import { db } from '../firebaseConfig';
import styles, { gradientColors } from './styles/pendingStyles'; // Seus estilos
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router'; // Adicionado useFocusEffect

interface Appointment {
  id: string;
  userId: string;
  userEmail: string;
  userName?: string; // Nome do paciente
  professionalUID: string;
  professionalName: string;
  date: string;
  hour: string;
  status: 'pendente' | 'confirmada' | 'cancelada' | 'realizada';
  createdAt: Timestamp; // Usar Timestamp
}

export default function PendingProfissionalScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const professionalUser = auth.currentUser; // Usuário profissional logado
  const router = useRouter();

  const fetchAppointments = useCallback(async () => {
    if (!professionalUser) {
      setAppointments([]);
      setLoading(false);
      // Alert.alert("Atenção", "Você precisa estar logado para ver os agendamentos pendentes.");
      // router.replace('/auth/login'); // Opcional: redirecionar se não estiver logado
      return;
    }
    setLoading(true);
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('professionalUID', '==', professionalUser.uid), // Query pelo UID do profissional logado
        where('status', '==', 'pendente')
      );
      const querySnapshot = await getDocs(q);
      const list: Appointment[] = querySnapshot.docs.map(docData => ({
        id: docData.id,
        ...(docData.data() as Omit<Appointment, 'id'>),
      }));

      // Ordenar por data e hora mais próximos primeiro
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

  // useFocusEffect para recarregar os dados quando a tela recebe foco
  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [fetchAppointments])
  );

  const updateAppointmentStatus = async (id: string, newStatus: Appointment['status']) => {
    try {
      const appointmentRef = doc(db, 'appointments', id);
      await updateDoc(appointmentRef, { status: newStatus });

      setAppointments(prev => prev.filter(app => app.id !== id)); // Remove da lista de pendentes

      Alert.alert('Sucesso', `Consulta ${newStatus === 'confirmada' ? 'confirmada' : 'recusada'} com sucesso.`);
      // Poderia adicionar lógica para notificar o usuário aqui
    } catch (error) {
      console.error('Erro ao atualizar consulta:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o status da consulta.');
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
              {/* Adicionar mais detalhes se necessário, como email do paciente */}
              {/* <Text style={styles.info}>Contato: {app.userEmail}</Text> */}

              {app.status === 'pendente' && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.confirmButton]}
                    onPress={() => updateAppointmentStatus(app.id, 'confirmada')}
                  >
                    <Feather name="check-circle" size={16} color="#fff" />
                    <Text style={styles.buttonText}>Confirmar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => updateAppointmentStatus(app.id, 'cancelada')}
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