import { View, Text, TouchableOpacity, TextInput, Alert, Image, ActivityIndicator } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { loginStyles as styles, gradientColors } from '@/styles/loginstyles'; // <-- MUDANÇA: Usando alias
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { auth } from '@/firebaseConfig'; // <-- MUDANÇA: Importando 'auth' diretamente e com alias
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true); 
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error: any) {
    
      console.error("Erro no login:", error.code);
      Alert.alert('Erro no Login', 'Verifique seu e-mail e senha e tente novamente.');
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

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password' as Href)} disabled={loading}>
          <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/(auth)/register' as Href)} disabled={loading}>
        <Text style={styles.registerText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}