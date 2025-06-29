// styles/upload-resultsStyles.ts
import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Cores do gradiente consistentes com registerStyles
export const gradientColors: [string, string] = ['#004766', '#bfecff'];

export const uploadResultsStyles = StyleSheet.create({
  // Container principal que preenche a tela (usado com LinearGradient no componente)
  screenContainer: {
    flex: 1,
  },
  // Container para o conteúdo dentro do ScrollView, se necessário, ou direto no contentContainerStyle
  contentContainer: {
    flexGrow: 1, // Permite que o ScrollView cresça
    justifyContent: 'center', // Centraliza o conteúdo verticalmente
    alignItems: 'center', // Centraliza o conteúdo horizontalmente
    padding: 24, // Mesmo padding do registerStyles
  },
  title: {
    fontSize: 22, // Consistente com registerStyles.title
    textAlign: 'center',
    color: '#fff', // Cor branca para contraste com o gradiente
    fontWeight: 'bold', // Um pouco mais de destaque para o título da página
    marginBottom: 30, // Espaçamento abaixo do título
  },
  input: {
    backgroundColor: '#fff', // Fundo branco como em registerStyles.input
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 20, // Espaçamento entre inputs/elementos
    fontSize: 16,
    color: '#333', // Cor do texto digitado
    width: screenWidth * 0.85, // Largura dos inputs
    elevation: 1, // Sombra sutil para inputs
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  // Estilo base para botões (forma, espaçamento, texto)
  button: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 15, 
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    width: screenWidth * 0.85, 
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  primaryButton: {
    backgroundColor: '#004766', 
  },
  successButton: {
    backgroundColor: '#28a745', 
  },
  secondaryButton: {
    backgroundColor: '#6c757d', 
  },
  
  fileNameText: {
    textAlign: 'center',
    marginVertical: 15,
    fontSize: 16,
    color: '#fff', 
    width: screenWidth * 0.85,
  },
 
  uploadProgressContainer: {
    alignItems: 'center',
    marginVertical: 20,
    width: screenWidth * 0.85,
  },

  uploadProgressText: {
    fontSize: 14,
    color: '#fff', // Cor branca
    marginTop: 8,
  },
 
  disabledButton: {
    opacity: 0.6,
  },
});

