import { StyleSheet } from 'react-native';

// Exportando as cores para que o componente também possa usá-las
// >>>>>>> MUDANÇA AQUI: Adicione 'as const' ao final do array de cores <<<<<<<
export const gradientColors = ['#004766', '#bfecff'] as const;

export const adminDashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logoImage: {
    width: 220, 
    height: 220,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  strong: {
    fontWeight: 'bold',
  },
  actionsContainer: {
    width: '100%',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#004766',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});