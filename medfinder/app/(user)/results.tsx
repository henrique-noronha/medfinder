import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ResultsScreen() {
  return (
    <LinearGradient colors={['#004766', '#bfecff']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Resultados de Exames</Text>
        <Text style={styles.message}>
          Aqui você poderá visualizar os resultados dos exames enviados por seus profissionais.
        </Text>
        <Text style={styles.message}>
          Aguarde a liberação de resultados no sistema ou entre em contato com seu médico.
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  message: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
});