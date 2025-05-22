import { StyleSheet } from 'react-native';

export const gradientColors: [string, string] = ['#64C1FF', '#3C7499'];

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  appointmentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  professionalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0',
    marginBottom: 6,
  },

  info: {
    fontSize: 16,
    color: '#0',
    marginBottom: 4,
  },

  status: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: 'darkorange',
    textTransform: 'capitalize',
  },
});
