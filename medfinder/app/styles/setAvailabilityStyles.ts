// app/styles/setAvailabilityStyles.ts
import { StyleSheet } from 'react-native';

export const gradientColors = ['#004766', '#bfecff'] as const;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#FF8C00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 50, 
    paddingBottom: 15,
    backgroundColor: 'transparent',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentScroll: {
    padding: 20,
    paddingBottom: 40,
  },
  infoText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  timeSlotsContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  hoursGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', 
  },
  hourButton: {
    backgroundColor: '#e9ecef',
    paddingVertical: 10,
    paddingHorizontal: 0, 
    borderRadius: 8,
    margin: 4, 
    minWidth: '22%', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  selectedHourButton: {
    backgroundColor: '#00BFA5', 
    borderColor: '#009688',
  },
  hourText: {
    fontSize: 14,
    color: '#212529',
  },
  selectedHourText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#004766',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#98fb98', 
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;