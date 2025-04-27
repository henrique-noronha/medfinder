import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 50,            // ajustar pro notch
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitleContainer: {
    backgroundColor: '#FF8C00',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  appTitleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greetingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
    paddingHorizontal: 20,
  },
  searchContainer: {
    marginTop: 30,
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
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  card: {
    backgroundColor: '#F2F2F2',
    width: '47%',
    height: 140,            // altura fixa menor
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    },
  cardIcon: {
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
