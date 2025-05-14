import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';
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
  const initialResults: Professional[] = results ? JSON.parse(results as string) : [];

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Professional[]>(initialResults);

  // Filtro
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterPlace, setFilterPlace] = useState('');

  const handleSearch = async () => {
    const professionalsRef = collection(db, 'healthcareProfessionals');
    const allSnapshot = await getDocs(professionalsRef);
    const allData = allSnapshot.docs.map(doc => doc.data() as Professional);

    const filtered = allData.filter(prof => {
      const matchesQuery = searchQuery
        ? prof.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prof.specialties.some(spec =>
            spec.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : true;

      const matchesName = filterName
        ? prof.fullName.toLowerCase().includes(filterName.toLowerCase())
        : true;

      const matchesSpecialty = filterSpecialty
        ? prof.specialties.some(spec =>
            spec.toLowerCase().includes(filterSpecialty.toLowerCase())
          )
        : true;

      const matchesPlace = filterPlace
        ? prof.placesOfService.some(place =>
            place.toLowerCase().includes(filterPlace.toLowerCase())
          )
        : true;

      return matchesQuery && matchesName && matchesSpecialty && matchesPlace;
    });

    setSearchResults(filtered);
    setFilterVisible(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity onPress={() => router.push('/home')} style={{ paddingRight: 12 }}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>
          Resultados da Busca
        </Text>
      </View>

      {/* Search bar + filtro */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Feather name="search" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
            <Feather name="filter" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de Filtro */}
      <Modal visible={filterVisible} transparent animationType="slide">
        <View style={styles.filterModal}>
          <Text style={styles.filterTitle}>Filtrar por:</Text>

          <TextInput
            style={styles.filterInput}
            placeholder="Nome"
            placeholderTextColor="#666"
            value={filterName}
            onChangeText={setFilterName}
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Especialidade"
            placeholderTextColor="#666"
            value={filterSpecialty}
            onChangeText={setFilterSpecialty}
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Local de atendimento"
            placeholderTextColor="#666"
            value={filterPlace}
            onChangeText={setFilterPlace}
          />

          <TouchableOpacity style={styles.applyFilterButton} onPress={handleSearch}>
            <Text style={styles.applyFilterText}>Aplicar Filtros</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setFilterVisible(false)}>
            <Text style={{ color: '#fff', marginTop: 10 }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Resultados */}
      <ScrollView contentContainerStyle={styles.resultsContainer}>
        {searchResults.length > 0 ? (
          searchResults.map((professional, index) => (
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
