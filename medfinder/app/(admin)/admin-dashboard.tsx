import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { auth, db } from '@/firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
// --- MUDANÇA 1: Importando do novo arquivo de estilo ---
import { adminDashboardStyles as styles, gradientColors } from '@/styles/adminDashboardStyles';
import { useAuth } from '@/hooks/AuthContext';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const fetchAdminName = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAdminName(docSnap.data().fullName || 'Admin');
        }
      }
    };

    fetchAdminName();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao fazer logout: ", error);
      Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo3.png')}
          style={styles.logoImage}
        />
      </View>

      <Text style={styles.title}>Painel Administrativo</Text>
      <Text style={styles.title}>Bem-vindo(a), <Text style={styles.strong}>{adminName}</Text>!</Text>


      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(admin)/register-professional' as Href)}
        >
          <Text style={styles.buttonText}>Cadastrar Profissional</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#c70000', marginTop: 20 }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}