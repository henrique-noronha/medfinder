import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const unstable_settings = {
  navigationBar: {
    visible: false,
  },
};

export const navigationOptions = {
  headerShown: false,
};

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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  message: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
});