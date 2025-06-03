// styles/notificationsStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// Cores do gradiente (consistentes com seus outros estilos)
export const gradientColors: [string, string] = ['#004766', '#bfecff']; // Exemplo, ajuste se necessário

export const notificationsStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: 'transparent', // O gradiente fará o fundo
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)', // Linha sutil abaixo do header
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  backButton: {
    padding: 5, // Área de toque maior
  },
  // Estilos para o item de notificação individual
  notificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fundo levemente translúcido ou sólido
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  notificationCardUnread: { // Estilo adicional para não lidas (ex: borda ou fundo diferente)
    // backgroundColor: 'rgba(230, 240, 255, 0.95)',
    borderLeftWidth: 4,
    borderLeftColor: '#007bff', // Cor para indicar não lida
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  notificationDate: {
    fontSize: 12,
    color: '#777',
    marginTop: 8,
    textAlign: 'right',
  },
  // Estados de loading e vazio
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  noNotificationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noNotificationsText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  markAllReadButton: {
    marginHorizontal: 15,
    marginBottom: 10,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
    alignItems: 'center',
  },
  markAllReadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
});