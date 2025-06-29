import { View, Text, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { registerStyles as styles, gradientColors } from '@/styles/registerstyles'; 
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { auth, db } from '@/firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen() {
  const router = useRouter();

  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false); 

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    let formatted = '';
    if (digits.length <= 3) {
      formatted = digits;
    } else if (digits.length <= 6) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`;
    } else if (digits.length <= 9) {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
    } else {
      formatted = `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
    }
    return formatted;
  };

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim() || !cpf.trim()) {
      Alert.alert('Atenção', 'Todos os campos são obrigatórios.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Atenção', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          fullName: fullName.trim(),
          cpf: cpf,
          email: email.trim(),
          role: 'user', 
        });
        
      }
    } catch (error: any) {
      console.error("Erro no cadastro:", error.code);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erro', 'Este endereço de e-mail já está em uso.');
      } else {
        Alert.alert('Erro no cadastro', 'Ocorreu um erro inesperado. Tente novamente.');
      }
    } finally {
      setLoading(false);
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

      <Text style={styles.title}>
        Crie sua conta no <Text style={styles.strong}>MedFinder</Text>
      </Text>

      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Nome completo" value={fullName} onChangeText={setFullName} />
        <TextInput style={styles.input} placeholder="CPF" keyboardType="numeric" value={cpf} onChangeText={(text) => setCpf(formatCpf(text))} maxLength={14} />
        <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Senha (mínimo 6 caracteres)" secureTextEntry value={password} onChangeText={setPassword} />
        <TextInput style={styles.input} placeholder="Confirmar senha" secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
        
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.back()} disabled={loading}>
        <Text style={styles.registerText}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}