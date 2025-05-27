import { StyleSheet } from 'react-native';
export const gradientColors: [string, string] = ['#004766', '#bfecff'];

export const localStyles = StyleSheet.create({
    loadingContainer: { /* ...como em scheduleStyles... */ flex: 1, justifyContent: 'center', alignItems: 'center'},
    backgroundGradientFull: { /* ...como em scheduleStyles... */ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, },
    loadingText: { /* ...como em scheduleStyles... */ color: '#fff', marginTop: 10, fontSize: 16, },
    noSlotsText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    disabledButton: { /* ...como em scheduleStyles... */ backgroundColor: '#cccccc', opacity: 0.7, }
});

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  
  headerContainer: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  avatarCircle: {
    backgroundColor: '#fff',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#88E788',
  },
  avatarText: {
    fontSize: 32,
    color: '#88E788',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  info: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 12,
  },
  hoursContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  hourButton: {
    width: '22%',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedHourButton: {
    backgroundColor: '#00BFA5', 
    borderColor: '#009688',
  },
  hourText: {
    color: '#3C7499',
    fontWeight: '500',
  },
  selectedHourText: {
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#004766',
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});