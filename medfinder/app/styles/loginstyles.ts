import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#4facfe',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  // Estilos para a logo (copiados ou adaptados do indexstyles)
  logo: {
    backgroundColor: '#F28B50',
    paddingVertical: 32,
    paddingHorizontal: 38,
    borderRadius: 16,
    marginBottom: 20, // ajuste de margem para separar da área superior
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '300',
    marginBottom: 20,
  },
  strong: {
    fontWeight: 'bold',
    color: '#fff',
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 24,
    marginVertical: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#F28B50',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },

    forgotPasswordText: {
    marginTop: 12,
    textAlign: 'center',
    color: '#fff',
    textDecorationLine: 'underline',
  },

  registerText: {
    color: '#fff',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
  version: {
    fontSize: 12,
    color: '#fff',
    position: 'absolute',
    bottom: 10,
  },
});

export const gradientColors: string[] = ['#64C1FF', '#3C7499'];
