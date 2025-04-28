
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { indexStyles as styles } from './styles/indexstyles';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#64C1FF', '#3C7499']}
        style={styles.backgroundGradient}
      />

      <Text style={styles.title}>
        Boas-vindas ao <Text style={styles.strong}>MedFinder</Text>! A maneira
        mais fácil e rápida de encontrar profissionais de saúde, agendar consultas
        e cuidar do seu bem-estar. Conectamos você ao atendimento ideal, sem complicação
      </Text>

      <View style={styles.logo}>
        <Text style={styles.logoText}>MedFinder</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/auth/login' as const)}>
        <Text style={styles.buttonText}>Entrar no aplicativo</Text>
      </TouchableOpacity>

      <Text style={styles.version}>v 1.0.0</Text>
    </View>
  );
}
