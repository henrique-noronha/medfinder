import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, Href } from 'expo-router'; 
import { indexStyles as styles } from '@/styles/indexstyles'; 
import { LinearGradient } from 'expo-linear-gradient';
import Constants from 'expo-constants'; 

export default function WelcomeScreen() {
  const router = useRouter();

  const appVersion = Constants.expoConfig?.version;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#004766', '#bfecff']}
        style={styles.backgroundGradient}
      />

      <Text style={styles.title}>
        Boas-vindas ao <Text style={styles.strong}>MedFinder</Text>! A maneira
        mais fácil e rápida de encontrar profissionais de saúde, agendar consultas
        e cuidar do seu bem-estar. Conectamos você ao atendimento ideal, sem complicação
      </Text>

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo3.png')} // require com caminho relativo ainda é o padrão para imagens
          style={styles.logoImage}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
      // Usando o caminho canônico da rota de grupo
        onPress={() => router.replace('/(auth)/login' as Href)}
      >
        <Text style={styles.buttonText}>Entrar no aplicativo</Text>
      </TouchableOpacity>

      {/*Exibindo a versão dinâmica */}
      {appVersion && <Text style={styles.version}>v {appVersion}</Text>}
    </View>
  );
}