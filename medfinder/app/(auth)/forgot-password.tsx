import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { forgotPasswordStyles as styles, gradientColors } from '@/styles/forgot-passwordstyles'; // <-- MUDANÇA: Alias
import { LinearGradient } from 'expo-linear-gradient';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebaseConfig'; 

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert('Atenção', 'Por favor, digite seu endereço de e-mail.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      Alert.alert('E-mail Inválido', 'Por favor, insira um endereço de e-mail válido.');
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        'Verifique seu E-mail',
        'Se uma conta com este e-mail existir, um link de recuperação foi enviado.'
      );
      router.back(); 

    } catch (error: any) {
    
      console.error("Erro na recuperação de senha:", error.code);
      if (error.code !== 'auth/user-not-found') {
         Alert.alert('Erro', 'Ocorreu um problema ao tentar enviar o e-mail. Verifique sua conexão e tente novamente.');
      } else {
        Alert.alert(
          'Verifique seu E-mail',
          'Se uma conta com este e-mail existir, um link de recuperação foi enviado.'
        );
        router.back();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        style={styles.backgroundGradient}
      />

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo3.png')}
          style={styles.logoImage}
        />
      </View>

      <Text style={styles.title}>
        Esqueceu sua senha? <Text style={styles.strong}>Recupere o acesso</Text>
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email cadastrado"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handlePasswordReset}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Enviar link de recuperação</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
        <Text style={styles.registerText}>Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
}