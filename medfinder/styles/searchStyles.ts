import { StyleSheet } from 'react-native';

export const gradientColors: [string, string] = ['#004766', '#bfecff'];

const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  searchPageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 34, // Compensa o espaço do botão de filtro
  },
  searchContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  searchLabel: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 10,
  },
  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 5, // Ajustado
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingLeft: 15,
  },
  searchButton: {
    padding: 8,
  },
  filterButton: {
    marginLeft: 5,
    backgroundColor: '#4682B4',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25, // Círculo perfeito
    backgroundColor: '#A9A9A9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  resultInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  professionalSpecialty: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
    marginBottom: 4,
  },
  professionalContact: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  professionalPhone: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  professionalPlace: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },

  // --- ESTILOS ADICIONADOS AQUI ---
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
  },
  // --- FIM DA ADIÇÃO ---

  noResultsText: {
    marginTop: 30,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
  },
  filterModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 20,
  },
  filterModalContent: {
    backgroundColor: '#333740',
    padding: 25,
    borderRadius: 10,
    width: '90%',
    alignItems: 'stretch',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  filterInput: {
    backgroundColor: '#4A505A',
    color: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  applyFilterButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  applyFilterText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelFilterButton: {
    marginTop: 15,
    paddingVertical: 10,
  },
  cancelFilterText: {
    color: '#FF8C00',
    fontSize: 15,
    textAlign: 'center',
  },
});

export default searchStyles;