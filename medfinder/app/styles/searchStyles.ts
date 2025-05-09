import { StyleSheet } from 'react-native';

export const gradientColors: [string, string] = ['#64C1FF', '#3C7499'];

const searchStyles = StyleSheet.create({
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
  
  resultsContainer: {
    paddingBottom: 40,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DADADA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 18,
  },
  resultInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  professionalSpecialty: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  professionalContact: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  professionalPhone: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  professionalPlace: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  noResultsText: {
    marginTop: 30,
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
  },
});

export default searchStyles;
