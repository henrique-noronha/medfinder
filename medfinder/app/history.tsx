import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles, { gradientColors } from './styles/pendingStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Appointment = {
  id: string;
  professionalName: string;
  professionalEmail: string;
  date: string;
  hour: string;
  status: string;
};

export default function HistoryScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    async function fetchHistory() {
      if (!user) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      try {
        const appointmentsRef = collection(db, 'appointments');
        const q = query(
          appointmentsRef,
          where('userId', '==', user.uid),
          where('status', 'in', ['confirmada', 'cancelada'])
        );
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Appointment[];

        setAppointments(list);
      } catch (error) {
        console.error('Erro ao buscar histórico de consultas:', error);
      }
      setLoading(false);
    }

    fetchHistory();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 100 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />

      {/* Cabeçalho */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace('/home')}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Histórico de Consultas</Text>

        <TouchableOpacity onPress={() => router.push('/profile/edit')}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {appointments.length === 0 ? (
          <Text style={{ color: '#fff', marginTop: 40, fontSize: 18, textAlign: 'center' }}>
            Você não possui histórico de consultas.
          </Text>
        ) : (
          appointments.map((app) => (
            <View key={app.id} style={styles.appointmentCard}>
              <Text style={styles.professionalName}>{app.professionalName}</Text>
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