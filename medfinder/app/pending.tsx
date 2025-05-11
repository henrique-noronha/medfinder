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

export default function PendingScreen() {
  return (
    <LinearGradient colors={['#71C9F8', '#3167AF']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Pendências</Text>
        <Text style={styles.message}>
          Você possui consultas agendadas que ainda não foram realizadas.
        </Text>
        <Text style={styles.message}>
          Consulte o histórico para visualizar detalhes ou reagendar.
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
