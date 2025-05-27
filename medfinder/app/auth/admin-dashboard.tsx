import { View, Text, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { auth, db } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { loginStyles as styles, gradientColors } from '../styles/loginstyles';

export default function AdminDashboard() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    const fetchAdmin = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setAdminName(data.fullName || 'Admin');
        } else {
          Alert.alert('Erro', 'Usuário não encontrado');
        }
      }
    };

    fetchAdmin();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/'); 
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
      <Text style={styles.title}>Bem-vindo, <Text style={styles.strong}>{adminName}</Text>!</Text>

      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/admin/register-professional')}
        >
          <Text style={styles.buttonText}>Cadastrar Profissional</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/admin/appointments')}
        >
          <Text style={styles.buttonText}>Ver Agendamentos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ff4444', marginTop: 20 }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
