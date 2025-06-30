import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import styles, { gradientColors } from '@/styles/pendingStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/hooks/AuthContext';
import { Feather } from '@expo/vector-icons';

// Interface de Appointment mais precisa
type Appointment = {
  id: string;
  professionalName?: string;
  professionalUID: string;
  date: string; // Esperamos uma string no formato 'YYYY-MM-DD'
  hour: string; // Esperamos uma string no formato 'HH:mm'
  status: 'pendente';
};

export default function PendingScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

      // Mapeamento defensivo: validamos cada documento
      const appointmentsData = querySnapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        
        // Valida se os campos essenciais existem e são do tipo correto
        if (!data.date || typeof data.date !== 'string' || !data.hour || typeof data.hour !== 'string' || !data.professionalUID) {
          console.warn('Documento de agendamento com dados inválidos ou incompletos, ignorando:', docSnapshot.id);
          return null; // Retorna null para ser filtrado depois
        }

        return {
          id: docSnapshot.id,
          date: data.date,
          hour: data.hour,
          professionalUID: data.professionalUID,
          professionalName: data.professionalName, // O nome pode ser undefined inicialmente
          status: 'pendente',
        } as Appointment;
      }).filter(Boolean) as Appointment[]; // O .filter(Boolean) remove todos os itens nulos do array

      // Enriquecimento: busca o nome do profissional apenas se necessário
      const enrichedAppointments = await Promise.all(
        appointmentsData.map(async (app) => {
          if (app.professionalName) return app; // Se o nome já veio, não busca de novo
          
          const profDocRef = doc(db, 'users', app.professionalUID);
          const profDocSnap = await getDoc(profDocRef);
          return {
            ...app,
            professionalName: profDocSnap.exists() ? profDocSnap.data().fullName : 'Profissional Removido',
          };
        })
      );
      
      // Ordenação segura
      enrichedAppointments.sort((a, b) => {
        try {
          const dateA = new Date(`${a.date}T${a.hour}`);
          const dateB = new Date(`${b.date}T${b.hour}`);
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) return 0; // Evita crash com datas inválidas
          return dateA.getTime() - dateB.getTime();
        } catch {
          return 0;
        }
      });

      setAppointments(enrichedAppointments);
    } catch (error) {
      console.error('Erro ao buscar consultas pendentes:', error);
      Alert.alert('Erro', 'Não foi possível carregar suas consultas.');
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
              <Text style={styles.patientName}>{app.professionalName || 'Profissional Desconhecido'}</Text>
              
              {/* Renderização defensiva: só mostra a data se ela for válida */}
              <Text style={styles.info}>
                Data: {app.date && app.hour 
                  ? `${new Date(app.date + 'T00:00:00Z').toLocaleDateString('pt-BR', { timeZone: 'UTC' })} às ${app.hour}`
                  : 'Data não informada'
                }
              </Text>

              <View style={styles.statusContainer}>
                <Feather name="clock" size={16} color="#FFD700" />
                <Text style={[styles.status, { color: '#FFD700' }]}>
                  Status: Aguardando Confirmação
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
