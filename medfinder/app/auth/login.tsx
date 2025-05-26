import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { loginStyles as styles, gradientColors } from '../styles/loginstyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();

        if (userData.role === 'admin') {
          Alert.alert('Sucesso', 'Bem-vindo, administrador!');
          router.replace('/auth/admin-dashboard');
        } else if (userData.role === 'profissional') {
          Alert.alert('Sucesso', 'Bem-vindo, profissional!');
          router.replace('/home-profissional');
        } else {
          Alert.alert('Sucesso', 'Login realizado com sucesso!');
          router.replace('/home');
        }
      } else {
        Alert.alert('Erro', 'Usuário não encontrado no Firestore.');
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erro', 'Email ou senha incorretos.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />

      <View style={styles.logo}>
        <Text style={styles.logoText}>MedFinder</Text>
      </View>

      <Text style={styles.title}>
        Saúde ao seu alcance: encontre, agende e cuide-se!
      </Text>

      <Text style={styles.title}>
        Faça login no <Text style={styles.strong}>MedFinder</Text>
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
          <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/auth/register')}>
        <Text style={styles.registerText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}
