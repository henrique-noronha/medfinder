import { StyleSheet } from 'react-native';

export const gradientColors: [string, string] = ['#64C1FF', '#3C7499'];


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
  logo: {
    backgroundColor: '#F28B50',
    paddingVertical: 32,
    paddingHorizontal: 38,
    borderRadius: 16,
    marginBottom: 20,
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
  registerText: {
    color: '#fff',
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
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
  },
  specialtiesInput: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
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
