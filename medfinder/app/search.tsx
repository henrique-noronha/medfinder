import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import styles, { gradientColors } from './styles/searchStyles';

type Professional = {
  id: string;
  fullName: string;
  specialties: string[];
  emailContact: string;
  phone: string;
  placesOfService: string[];
  authUid: string;
};

const normalizeText = (text: string = '') =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function SearchResultsScreen() {
  const router = useRouter();
  const { results, initialQuery } = useLocalSearchParams();
  
  const initialResultsArray: Professional[] = results && typeof results === 'string' ? JSON.parse(results) : [];

  const [searchQuery, setSearchQuery] = useState(typeof initialQuery === 'string' ? initialQuery : '');
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
  const [searchResults, setSearchResults] = useState<Professional[]>(initialResultsArray);
  const [isLoading, setIsLoading] = useState(true);

  const [filterVisible, setFilterVisible] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterPlace, setFilterPlace] = useState('');

  const applyFilters = useCallback((
    professionalsToFilter: Professional[],
    currentSearchQuery: string,
    currentFilterName: string,
    currentFilterSpecialty: string,
    currentFilterPlace: string
  ) => {
    const queryNormalized = normalizeText(currentSearchQuery);
    const nameNormalized = normalizeText(currentFilterName);
    const specialtyNormalized = normalizeText(currentFilterSpecialty);
    const placeNormalized = normalizeText(currentFilterPlace);

    if (!professionalsToFilter || professionalsToFilter.length === 0) {
        setSearchResults([]);
        return;
    }

    const filtered = professionalsToFilter.filter(prof => {
      const matchesSearchQuery = queryNormalized
        ? normalizeText(prof.fullName).includes(queryNormalized) ||
          (prof.specialties || []).some(spec => normalizeText(spec).includes(queryNormalized)) ||
          (prof.placesOfService || []).some(place => normalizeText(place).includes(queryNormalized))
        : true;
      const matchesName = nameNormalized ? normalizeText(prof.fullName).includes(nameNormalized) : true;
      const matchesSpecialty = specialtyNormalized ? (prof.specialties || []).some(spec => normalizeText(spec).includes(specialtyNormalized)) : true;
      const matchesPlace = placeNormalized ? (prof.placesOfService || []).some(place => normalizeText(place).includes(placeNormalized)) : true;
      return matchesSearchQuery && matchesName && matchesSpecialty && matchesPlace;
    });
    setSearchResults(filtered);
  }, []);
  
  const doFetchAllProfessionals = useCallback(async () => {
    setIsLoading(true);
    try {
      const professionalsRef = collection(db, 'healthcareProfessionals');
      const allSnapshot = await getDocs(professionalsRef);
      const allDataFetched = allSnapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        return {
          id: doc.id,
          fullName: data.fullName || 'Nome Indisponível',
          specialties: data.specialties || [],
          emailContact: data.emailContact || 'N/A',
          phone: data.phone || 'N/A',
          placesOfService: data.placesOfService || [],
          authUid: data.authUid || '',
        } as Professional;
      });
      setAllProfessionals(allDataFetched);
    } catch (error) {
      console.error("Erro ao buscar todos os profissionais:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de profissionais.");
      setAllProfessionals([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    doFetchAllProfessionals();
  }, [doFetchAllProfessionals]);

  useEffect(() => {
    if (!isLoading) {
      const effectiveSearchQuery = searchQuery || (typeof initialQuery === 'string' ? initialQuery : '');
      applyFilters(allProfessionals, effectiveSearchQuery, filterName, filterSpecialty, filterPlace);
    } else if (initialResultsArray.length > 0 && !isLoading && !searchQuery && !filterName && !filterSpecialty && !filterPlace && !initialQuery) {
        setSearchResults(initialResultsArray);
    }
  }, [allProfessionals, searchQuery, filterName, filterSpecialty, filterPlace, applyFilters, isLoading, initialQuery, initialResultsArray]);

  const handleSearchButtonPress = () => {
    applyFilters(allProfessionals, searchQuery, filterName, filterSpecialty, filterPlace);
    if (filterVisible) {
      setFilterVisible(false);
    }
  };
  
  const handleApplyModalFilters = () => {
    applyFilters(allProfessionals, searchQuery, filterName, filterSpecialty, filterPlace);
    setFilterVisible(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
      <View style={styles.searchPageHeader}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.push('/home')} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Buscar Profissionais
        </Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Nome, especialidade, local..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchButtonPress}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchButtonPress}>
            <Feather name="search" size={25} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
            <Feather name="filter" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={filterVisible} transparent animationType="slide" onRequestClose={() => setFilterVisible(false)}>
        <View style={styles.filterModal}> 
          <View style={styles.filterModalContent}> 
            <Text style={styles.filterTitle}>Filtrar por:</Text>
            <TextInput style={styles.filterInput} placeholder="Nome do profissional" placeholderTextColor="#A0A0A0" value={filterName} onChangeText={setFilterName} />
            <TextInput style={styles.filterInput} placeholder="Especialidade" placeholderTextColor="#A0A0A0" value={filterSpecialty} onChangeText={setFilterSpecialty} />
            <TextInput style={styles.filterInput} placeholder="Local de atendimento" placeholderTextColor="#A0A0A0" value={filterPlace} onChangeText={setFilterPlace} />
            <TouchableOpacity style={styles.applyFilterButton} onPress={handleApplyModalFilters}>
              <Text style={styles.applyFilterText}>Aplicar Filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelFilterButton} onPress={() => setFilterVisible(false)}>
              <Text style={styles.cancelFilterText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isLoading ? (
        <View style={inlineStyles.loadingView}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={inlineStyles.loadingText}>Buscando...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          {searchResults.length > 0 ? (
            searchResults.map((professional) => (
              <TouchableOpacity
                key={professional.id}
                style={styles.resultCard}
                onPress={() => {
                  if (!professional.authUid || professional.authUid.trim() === "") {
                    Alert.alert("Informação Incompleta", "Este profissional não possui um ID de sistema configurado para agendamento. Por favor, contate o suporte.");
                    return;
                  }
                  router.push({
                    pathname: '/scheduleUser',
                    params: {
                      professionalUID: professional.authUid,
                      fullName: professional.fullName,
                      emailContact: professional.emailContact,
                      phone: professional.phone,
                      specialties: JSON.stringify(professional.specialties || []),
                      placesOfService: JSON.stringify(professional.placesOfService || []),
                    },
                  });
                }}
              >
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {professional.fullName?.trim()?.[0]?.toUpperCase() || '?'}
                  </Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.professionalName}>{professional.fullName}</Text>
                  <Text style={styles.professionalSpecialty}>
                    {(professional.specialties || []).join(', ')}
                  </Text>
                  <Text style={styles.professionalContact}>
                    Contato: {professional.emailContact || 'N/A'}
                  </Text>
                  <Text style={styles.professionalPhone}>
                    Telefone: {professional.phone || 'N/A'}
                  </Text>
                  <Text style={styles.professionalPlace}>
                    Atende em: {(professional.placesOfService || []).join('; ')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={inlineStyles.loadingView}>
                 <Text style={styles.noResultsText}>Nenhum profissional encontrado com os critérios atuais.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const inlineStyles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  }
});