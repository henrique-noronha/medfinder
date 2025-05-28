// pending.tsx (Tela de Pendências do Usuário)
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image, Alert } from 'react-native';
import { getAuth, User as FirebaseUser } from 'firebase/auth';
import { collection, query, where, getDocs, doc, DocumentData } from 'firebase/firestore'; // Removido getDoc se não precisar da role aqui
import { db } from '../firebaseConfig'; // Verifique o caminho
import styles, { gradientColors } from './styles/pendingStyles'; // Verifique o caminho
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

// Definição do tipo Appointment
type Appointment = {
  id: string;
  professionalName: string;
  professionalEmail: string;
  date: string;
  hour: string;
  status: string;
};

export default function PendingScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const router = useRouter();

  const fetchPendingAppointments = useCallback(async () => {
    if (!currentUser) {
      setAppointments([]);
      setLoading(false);
      // Alert.alert("Atenção", "Você precisa estar logado para ver seus agendamentos.");
      // router.replace('/auth/login'); // Considerar redirecionar para login
      return;
    }

    setLoading(true);
    try {
      // Não precisamos buscar a role do usuário aqui se a rota de volta é sempre '/home'
      // e esta tela é apenas para usuários comuns.

      const appointmentsRef = collection(db, 'appointments');
      const q = query(
        appointmentsRef,
        where('userId', '==', currentUser.uid), // Busca agendamentos do usuário logado
        where('status', '==', 'pendente')      // Filtra por status pendente
      );
      const querySnapshot = await getDocs(q);

      const list: Appointment[] = querySnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data() as DocumentData;
        return {
          id: docSnapshot.id,
          professionalName: String(data.professionalName || 'Profissional não informado'),
          professionalEmail: String(data.professionalEmail || 'E-mail não informado'),
          date: String(data.date || 'Data indefinida'),
          hour: String(data.hour || 'Hora indefinida'),
          status: String(data.status || 'Status indefinido'),
        };
      });

      setAppointments(list);
    } catch (error) {
      console.error('Erro ao buscar consultas pendentes do usuário:', error);
      Alert.alert('Erro', 'Não foi possível carregar suas consultas pendentes.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

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

  if (!currentUser) {
    return (
        <View style={styles.container}>
            <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
            <Text style={styles.noAppointmentsText}>
                Por favor, faça login para ver seus agendamentos.
            </Text>
            <TouchableOpacity onPress={() => router.replace('/auth/login')} style={styles.loginButton}>
                <Text style={styles.loginButtonText}>Ir para Login</Text>
            </TouchableOpacity>
        </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
      <View style={styles.headerContainer}>
        {/* Botão voltar agora leva diretamente para '/home' */}
        <TouchableOpacity onPress={() => router.replace('/home')}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Consultas Pendentes</Text>
        <TouchableOpacity onPress={() => router.push('/profile/edit')}>
          <Image
            source={{ uri: currentUser?.photoURL || 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {appointments.length === 0 ? (
          <Text style={styles.noAppointmentsText}>
            Você não possui consultas pendentes.
          </Text>
        ) : (
          appointments.map((app: Appointment) => (
            <View key={app.id} style={styles.appointmentCard}>
              <Text style={styles.patientName}>{app.professionalName}</Text>
              <Text style={styles.info}>E-mail: {app.professionalEmail}</Text>
              <Text style={styles.info}>
                Data: {app.date} às {app.hour}
              </Text>
              <Text style={styles.status}>Status: {app.status}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}