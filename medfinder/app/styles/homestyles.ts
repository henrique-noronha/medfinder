import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  decorativeBackground: {
    position: 'absolute',
    top: 0,
    left: -130,
    right: -50,
    height: 310,
    backgroundColor: 'rgba(30, 90, 130, 0.88)',
    borderBottomLeftRadius: 450,
    borderBottomRightRadius: 250,
    zIndex: 0,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 15,
    width: '100%',
    minHeight: 100,
    zIndex: 1,
  },

  logoContainer: {},

  logoImage: {
    width: 240,
    height: 100,
    resizeMode: 'contain',
    marginLeft: -75,
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

  greetingText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
    zIndex: 1,
  },

  searchContainer: {
    marginTop: 15,
    paddingHorizontal: 20,
    marginBottom: 30,
    zIndex: 1,
  },

  searchLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    textAlign: 'left',
    marginBottom: 8,
    marginLeft: 5,
  },

  searchBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },

  searchButton: {
    marginLeft: 10,
    backgroundColor: '#fff',
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 40,
    zIndex: 1,
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#F2F2F2',
    width: '47%',
    aspectRatio: 1,
    minHeight: 130,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 15,
    padding: 10,
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
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});
