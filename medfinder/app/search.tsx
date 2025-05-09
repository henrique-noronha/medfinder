import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles, { gradientColors } from './styles/searchStyles';

type Professional = {
  fullName: string;
  specialties: string[];
  emailContact: string;
  phone: string;
  placesOfService: string[];
};

export default function SearchResultsScreen() {
  const router = useRouter();
  const { results } = useLocalSearchParams();
  const parsedResults: Professional[] = results ? JSON.parse(results as string) : [];

  return (
    <View style={styles.container}>
      {/* Fundo gradiente */}
      <LinearGradient
        colors={gradientColors}
        style={styles.backgroundGradient}
      />

      {/* Header com botão de voltar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity onPress={() => router.push('/home')} style={{ paddingRight: 12 }}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
          Resultados da Busca
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.resultsContainer}>
        {parsedResults.length > 0 ? (
          parsedResults.map((professional, index) => (
            <View key={index} style={styles.resultCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {professional.fullName.trim()[0].toUpperCase()}
                </Text>
              </View>
              <View style={styles.resultInfo}>
                <Text style={styles.professionalName}>{professional.fullName}</Text>
                <Text style={styles.professionalSpecialty}>
                  Especialidade: {professional.specialties.join(', ')}
                </Text>
                <Text style={styles.professionalContact}>
                  Contato: {professional.emailContact}
                </Text>
                <Text style={styles.professionalPhone}>
                  Telefone: {professional.phone}
                </Text>
                <Text style={styles.professionalPlace}>
                  Atende em: {professional.placesOfService.join(', ')}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noResultsText}>Nenhum profissional encontrado.</Text>
        )}
      </ScrollView>
    </View>
  );
}
