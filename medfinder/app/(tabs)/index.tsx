import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao MedFinder</Text>
      <Text style={styles.subtitle}>Seu app para encontrar clínicas e agendar consultas online.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#E0F2F1',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#00796B',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#004D40',
    textAlign: 'center',
  },
});
