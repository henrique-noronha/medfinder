import { StyleSheet } from 'react-native';

export const gradientColors: [string, string] = ['#64C1FF', '#3C7499'];

export const indexStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '300',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  strong: {
    fontWeight: 'bold',
    color: '#fff',
  },
  logoContainer: {
    marginTop: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  logoImage: {
    width: 360,
    height: 218,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#88E788',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  version: {
    fontSize: 12,
    color: '#fff',
    position: 'absolute',
    bottom: 10,
  },
});