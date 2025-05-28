import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const unstable_settings = {
  navigationBar: {
    visible: false,
  },
};

export const navigationOptions = {
  headerShown: false,
};

export default function HelpScreen() {
  return (
    <LinearGradient colors={['#004766', '#bfecff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ajuda</Text>
        <Text style={styles.paragraph}>
          • Use a busca para encontrar médicos por especialidade ou nome.
        </Text>
        <Text style={styles.paragraph}>
          • Clique em um profissional para ver detalhes e marcar consulta.
        </Text>
        <Text style={styles.paragraph}>
          • Use os botões da tela inicial para ver seu histórico, pendências ou resultados de exames.
        </Text>
        <Text style={styles.paragraph}>
          • Em caso de dúvidas, entre em contato com nosso suporte.
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  paragraph: {
    fontSize: 18,
    marginBottom: 12,
    color: '#fff',
  },
});
