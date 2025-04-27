import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { forgotPasswordStyles as styles } from '../styles/forgot-passwordstyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebaseConfig'; 

export default function ForgotPasswordScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, preencha seu email.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Sucesso', 'Link de recuperação enviado para o seu email.');
      router.back(); // volta para o login
    } catch (error: any) {
      console.error(error);
      Alert.alert('Erro', 'Erro ao enviar o link de recuperação.');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#64C1FF', '#3C7499']}
        style={styles.backgroundGradient}
      />

      <View style={styles.logo}>
        <Text style={styles.logoText}>MedFinder</Text>
      </View>

      <Text style={styles.title}>
        Esqueceu sua senha? <Text style={styles.strong}>Recupere o acesso</Text>
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handlePasswordReset}
        >
          <Text style={styles.buttonText}>Enviar link de recuperação</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.registerText}>Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
}
