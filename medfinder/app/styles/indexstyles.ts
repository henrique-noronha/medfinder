import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
  title: {
    fontSize: 22,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '300',
  },
  strong: {
    fontWeight: 'bold',
    color: '#fff',
  },
  logo: {
    backgroundColor: '#F28B50',
    paddingVertical: 32,
    paddingHorizontal: 38,
    borderRadius: 16,
    marginTop: 20,
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#F28B50',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  version: {
    fontSize: 12,
    color: '#fff',
    position: 'absolute',
    bottom: 10,
  },
});
