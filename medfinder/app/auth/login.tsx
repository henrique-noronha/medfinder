import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { loginStyles as styles, gradientColors } from '../styles/loginstyles';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const router = useRouter();

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
        Saúde ao seu alcance:
        encontre, agende e cuide-se! <Text style={styles.strong}></Text>
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
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#ccc"
          secureTextEntry
        />
      

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // lógica de login 
        }}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { /* lógica para recuperação de senha */ }}>
      <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
      </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/auth/register' as const)}>
        <Text style={styles.registerText}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>

    </View>
  );
}
