import { StyleSheet, Dimensions } from 'react-native'; // Adicionado Dimensions

const { width: screenWidth, height: screenHeight } = Dimensions.get('window'); // Para tamanhos responsivos se precisar

export const gradientColors: [string, string] = ['#004766', '#bfecff'];

export const registerStyles = StyleSheet.create({
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
  inputText: {
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
  },
  registerText: {
    color: '#000',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  addressInput: {
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  specialtiesInput: {
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  listText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  removeButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});