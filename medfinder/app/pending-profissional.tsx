import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles, { gradientColors } from './styles/pendingStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PendingProfissionalScreen() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  useEffect(() => {
    async function fetchAppointments() {
      if (!user) {
        setAppointments([]);
        setLoading(false);
        return;
      }

      try {
        const appointmentsRef = collection(db, 'appointments');
        const q = query(
          appointmentsRef,
          where('professionalEmail', '==', user.email),
          where('status', '==', 'pendente')
        );
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAppointments(list);
      } catch (error) {
        console.error('Erro ao buscar consultas pendentes:', error);
        Alert.alert('Erro', 'Não foi possível carregar as consultas.');
      }

      setLoading(false);
    }

    fetchAppointments();
  }, [user]);

  const updateAppointmentStatus = async (id: string, newStatus: string) => {
  try {
    const ref = doc(db, 'appointments', id);
    await updateDoc(ref, { status: newStatus });

    // Atualiza o estado local com o novo status
    setAppointments(prev =>
      prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
    );

    Alert.alert('Sucesso', `Consulta ${newStatus === 'confirmada' ? 'confirmada' : 'cancelada'}.`);
  } catch (error) {
    console.error('Erro ao atualizar consulta:', error);
    Alert.alert('Erro', 'Não foi possível atualizar o status.');
  }
};

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
        <TouchableOpacity onPress={() => router.replace('/home-profissional')}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Solicitações de Consulta</Text>

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
            Nenhuma solicitação pendente.
          </Text>
        ) : (
          appointments.map((app) => (
            <View key={app.id} style={styles.appointmentCard}>
              <Text style={styles.professionalName}>Paciente: {app.userEmail}</Text>
              <Text style={styles.info}>Data: {app.date} às {app.hour}</Text>
              <Text style={styles.status}>Status: {app.status}</Text>

              {app.status === 'pendente' && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#4CAF50' }]}
                  onPress={() => updateAppointmentStatus(app.id, 'confirmada')}
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#F44336' }]}
                  onPress={() => updateAppointmentStatus(app.id, 'cancelada')}
                >
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
