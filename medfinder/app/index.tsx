import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { indexStyles as styles } from './styles/indexstyles'; // Verifique se este caminho está correto
import { LinearGradient } from 'expo-linear-gradient';

// Se você estiver usando TypeScript e exportou gradientColors de indexStyles.ts,
// você pode importá-lo assim, caso precise aqui:
// import { gradientColors } from './styles/indexstyles';

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

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo3.png')}
          style={styles.logoImage}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/auth/login' as const)} 
      >
        <Text style={styles.buttonText}>Entrar no aplicativo</Text>
      </TouchableOpacity>

      <Text style={styles.version}>v 1.0.0</Text>
    </View>
  );
}