import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function HelpScreen() {
  return (
    <LinearGradient colors={['#004766', '#bfecff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Central de Ajuda</Text>
        <Text style={styles.paragraph}>
          • Use a busca para encontrar médicos por especialidade ou nome.
        </Text>
        <Text style={styles.paragraph}>
          • Clique em um profissional para ver detalhes e marcar uma consulta.
        </Text>
        <Text style={styles.paragraph}>
          • Na tela inicial, use os cartões para ver seu histórico, agendamentos pendentes ou resultados de exames.
        </Text>
        <Text style={styles.paragraph}>
          • Em caso de dúvidas, entre em contato com nosso suporte através do e-mail: contato@medfinder.com.
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
    paddingTop: 80, 
    padding: 24,
  },
  title: {
    fontSize: 32, 
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#fff',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 18,
    marginBottom: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 26, 
  },
});