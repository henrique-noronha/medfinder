import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const gradientColors = ['#004766', '#bfecff'] as const;

export default StyleSheet.create({
  
  container: {
    flex: 1,
  },
  
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingTop: 20,
    paddingHorizontal: 15, 
    width: '100%',
    minHeight: 60, 
    
  },
  headerLeftGroup: { 
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    paddingRight: 10, 
    paddingVertical: 5, 
  },
  logoContainer: {
   
  },
  logoImage: {
    width: 240,
    height: 100,
    resizeMode: 'contain',
    marginLeft: -75, // Exatamente como na sua home
  },
  iconsContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#fff',
    marginLeft: 12, 
  },
  
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centeredMessageText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FFFFFF', 
    textAlign: 'center',
  },
 
  formScrollView: {
    flex: 1,
  },
  formScrollViewContent: {
    paddingBottom: 30,
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 20, 
  },
  formContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 20,
    paddingTop: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputOuterContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#4A5568', 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E0', 
    paddingHorizontal: 12,
  },
  inputDisabled: {
    backgroundColor: '#E9EEF2', 
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#2D3748', 
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: '#004766', 
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});