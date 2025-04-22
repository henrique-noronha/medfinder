import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { forgotPasswordStyles as styles } from '../styles/forgot-passwordstyles';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotPasswordScreen() {
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
        Esqueceu sua senha? <Text style={styles.strong}>Recupere o acesso</Text>
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // lógica para envio de recuperação
          }}
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
