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
import { forgotPasswordStyles as styles, gradientColors } from '../styles/forgot-passwordstyles';
import { LinearGradient } from 'expo-linear-gradient';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; 

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const handlePasswordReset = async () => {
    if (!email.trim()) {
      Alert.alert('Erro', 'Por favor, preencha seu email.');
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
        Alert.alert('Email Inválido', 'Por favor, insira um endereço de email válido.');
        return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Sucesso', 'Link de recuperação enviado para o seu email, caso ele esteja cadastrado.');
      router.replace('/auth/login'); 
    } catch (error: any) {
      let errorMessage = 'Erro ao enviar o link de recuperação. Tente novamente.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Nenhuma conta encontrada com este endereço de e-mail.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'O endereço de e-mail fornecido é inválido.';
      }
      Alert.alert('Erro', errorMessage);
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

      <TouchableOpacity onPress={() => router.replace('/auth/login')}>
        <Text style={styles.registerText}>Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
}