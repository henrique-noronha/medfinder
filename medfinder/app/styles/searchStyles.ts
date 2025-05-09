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
  searchContainer: {
    marginTop: 5,
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
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#FF8C00',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    filterButton: {
    marginLeft: 10,
    backgroundColor: '#4682B4',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModal: {
    flex: 1,
    backgroundColor: '#000000cc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  filterTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterInput: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  applyFilterButton: {
    backgroundColor: '#32CD32',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyFilterText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default searchStyles;
