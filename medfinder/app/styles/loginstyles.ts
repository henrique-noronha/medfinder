import { StyleSheet } from 'react-native';

export const gradientColors: [string, string] = ['#64C1FF', '#3C7499'];

export const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  logoImage: {
    width: 360,
    height: 218,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '300',
    marginBottom: 60,
  },
  strong: {
    fontWeight: 'bold',
    color: '#fff',
  },
  inputContainer: {
    width: '100%',
    marginTop: 15,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#F28B50',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#fff',
    textDecorationLine: 'underline',
  },
  registerText: {
    color: '#fff',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});