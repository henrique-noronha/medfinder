import { StyleSheet, Dimensions } from 'react-native';

export const gradientColors: [string, string] = ['#004766', '#bfecff'];

export const forgotPasswordStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 24,
    position: 'relative',
    backgroundColor: 'transparent', 
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20, 
  },
  logoImage: {
    width: 360, 
    height: 218, 
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '300',
    marginBottom: 20,
    paddingHorizontal: 10,
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
    color: '#333',
  },
  button: {
    backgroundColor: '#004766',
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
    fontWeight: 'bold',
  },
  registerText: {
    color: '#000',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});