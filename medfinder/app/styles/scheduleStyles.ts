import { StyleSheet } from 'react-native';

export const gradientColors: [string, string] = ['#64C1FF', '#3C7499'];

export const localStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundGradientFull: { 
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  }
});

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  pageTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center', 
    flex: 1, 
  },
  headerContainer: {
    paddingTop: 50, 
    paddingHorizontal: 15, 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10, 
  },
 
  appTitleContainer: {
    backgroundColor: '#88E788',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  appTitleText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 40, 
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40, 
    paddingTop: 20, 
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
    marginBottom: 6, 
  },
  infoText: {
    color: '#fff',
    fontSize: 15,
    marginTop: 4,
    lineHeight: 22, 
    marginBottom: 8,
  },
  scheduleButton: {
    backgroundColor: '#88E788', 
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
  scheduleButtonText: {
    color: '#fff', 
    fontSize: 16,
    fontWeight: 'bold',
  },
});