import { View, Text, TouchableOpacity, TextInput, Alert, Image } from 'react-native'; // Adicionado Image
import { useRouter } from 'expo-router';
import { registerStyles as styles, gradientColors } from '../styles/registerstyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { auth, db } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen() {
  const router = useRouter();

  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

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
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          fullName: fullName,
          cpf: cpf,
          email: email,
          role: 'paciente', // Definindo uma role padrão para novos usuários
        });
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
        router.replace('/auth/login'); 
      }
    } catch (error: any) {
      Alert.alert('Erro no cadastro', error.message);
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
        <TextInput
          style={styles.input}
          placeholder="Nome completo"
          placeholderTextColor="#ccc"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#ccc"
          keyboardType="numeric"
          value={cpf}
          onChangeText={(text) => setCpf(formatCpf(text))}
          maxLength={14}
        />
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
          placeholder="Senha (mínimo 6 caracteres)"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirmar senha"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.registerText}>Já tem conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}