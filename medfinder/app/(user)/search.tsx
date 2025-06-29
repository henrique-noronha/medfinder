import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Href, useNavigation } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, DocumentData } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import styles, { gradientColors } from '@/styles/searchStyles';

type Professional = {
  id: string;
  fullName: string;
  specialties: string[];
  emailContact: string;
  phone: string;
  placesOfService: string[];
  authUid: string;
  acceptedInsurances?: string[];
};
const normalizeText = (text: string = '') => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function SearchScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { results, initialQuery } = useLocalSearchParams();
  
  const initialResultsArray: Professional[] = results && typeof results === 'string' ? JSON.parse(results) : [];

  // Estados principais
  const [searchQuery, setSearchQuery] = useState(typeof initialQuery === 'string' ? initialQuery : '');
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
  const [searchResults, setSearchResults] = useState<Professional[]>(initialResultsArray);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para o modal de filtro
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterState, setFilterState] = useState({ name: '', specialty: '', place: '', insurance: '' });

  // Estados "debounceados" para otimização
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [debouncedFilters, setDebouncedFilters] = useState(filterState);

  // Esconde o cabeçalho do layout
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Efeito de Debounce para a busca principal
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms de espera
    return () => clearTimeout(handler);
  }, [searchQuery]);
  
  // Efeito de Debounce para os filtros do modal
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(filterState);
    }, 300);
    return () => clearTimeout(handler);
  }, [filterState]);

  // Busca todos os profissionais uma única vez
  useEffect(() => {
    const fetchAllProfessionals = async () => {
      setIsLoading(true);
      try {
        const professionalsRef = collection(db, 'healthcareProfessionals');
        const allSnapshot = await getDocs(professionalsRef);
        const allDataFetched = allSnapshot.docs.map(docData => {
          return { id: docData.id, ...docData.data() } as Professional;
        });
        setAllProfessionals(allDataFetched);
        if (initialResultsArray.length === 0) {
          setSearchResults(allDataFetched);
        }
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar a lista de profissionais.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllProfessionals();
  }, []);

  // Efeito que aplica o filtro reativamente baseado nos valores "debounceados"
  useEffect(() => {
    const queryNormalized = normalizeText(debouncedQuery);
    const nameNormalized = normalizeText(debouncedFilters.name);
    const specialtyNormalized = normalizeText(debouncedFilters.specialty);
    const placeNormalized = normalizeText(debouncedFilters.place);
    const insuranceNormalized = normalizeText(debouncedFilters.insurance);

    const filtered = allProfessionals.filter(prof => {
      const matchesMainQuery = queryNormalized
        ? normalizeText(prof.fullName).includes(queryNormalized) ||
          (prof.specialties || []).some(s => normalizeText(s).includes(queryNormalized)) ||
          (prof.placesOfService || []).some(p => normalizeText(p).includes(queryNormalized)) ||
          (prof.acceptedInsurances || []).some(i => normalizeText(i).includes(queryNormalized))
        : true;
      const matchesName = nameNormalized ? normalizeText(prof.fullName).includes(nameNormalized) : true;
      const matchesSpecialty = specialtyNormalized ? (prof.specialties || []).some(s => normalizeText(s).includes(specialtyNormalized)) : true;
      const matchesPlace = placeNormalized ? (prof.placesOfService || []).some(p => normalizeText(p).includes(placeNormalized)) : true;
      const matchesInsurance = insuranceNormalized ? (prof.acceptedInsurances || []).some(i => normalizeText(i).includes(insuranceNormalized)) : true;
      
      return matchesMainQuery && matchesName && matchesSpecialty && matchesPlace && matchesInsurance;
    });

    setSearchResults(filtered);
  }, [debouncedQuery, debouncedFilters, allProfessionals]);
  
  const handleClearAndCloseFilters = () => {
    setFilterState({ name: '', specialty: '', place: '', insurance: '' });
    setFilterVisible(false);
  }

  const navigateToSchedule = (professional: Professional) => {
    if (!professional.authUid) {
      Alert.alert("Informação Incompleta", "Este profissional não pode ser agendado no momento.");
      return;
    }
    const href = `/(user)/scheduleUser?professionalUID=${encodeURIComponent(professional.authUid)}&fullName=${encodeURIComponent(professional.fullName)}&emailContact=${encodeURIComponent(professional.emailContact)}&phone=${encodeURIComponent(professional.phone || '')}&specialties=${encodeURIComponent(JSON.stringify(professional.specialties || []))}&placesOfService=${encodeURIComponent(JSON.stringify(professional.placesOfService || []))}`;
    router.push(href as Href);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={gradientColors} style={styles.backgroundGradient} />
      <View style={styles.searchPageHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Buscar Profissionais</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
          <Feather name="filter" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput style={styles.searchInput} placeholder="Nome, especialidade, local..." value={searchQuery} onChangeText={setSearchQuery} returnKeyType="search" />
        </View>
      </View>

      <Modal visible={filterVisible} transparent animationType="slide" onRequestClose={() => setFilterVisible(false)}>
        <View style={styles.filterModal}>
          <View style={styles.filterModalContent}>
            <Text style={styles.filterTitle}>Filtrar por:</Text>
            <TextInput style={styles.filterInput} placeholder="Nome do profissional" value={filterState.name} onChangeText={text => setFilterState(s => ({...s, name: text}))} />
            <TextInput style={styles.filterInput} placeholder="Especialidade" value={filterState.specialty} onChangeText={text => setFilterState(s => ({...s, specialty: text}))} />
            <TextInput style={styles.filterInput} placeholder="Local de atendimento" value={filterState.place} onChangeText={text => setFilterState(s => ({...s, place: text}))} />
            <TextInput style={styles.filterInput} placeholder="Convênio" value={filterState.insurance} onChangeText={text => setFilterState(s => ({...s, insurance: text}))} />
            <TouchableOpacity style={styles.applyFilterButton} onPress={() => setFilterVisible(false)}>
              <Text style={styles.applyFilterText}>Aplicar Filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelFilterButton} onPress={handleClearAndCloseFilters}>
              <Text style={styles.cancelFilterText}>Limpar e Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isLoading ? (
        <View style={styles.loadingView}><ActivityIndicator size="large" color="#fff" /><Text style={styles.loadingText}>Buscando...</Text></View>
      ) : (
        <ScrollView contentContainerStyle={styles.resultsContainer}>
          {searchResults.length > 0 ? (
            searchResults.map((professional) => (
              <TouchableOpacity key={professional.id} style={styles.resultCard} onPress={() => navigateToSchedule(professional)}>
                <View style={styles.avatarCircle}><Text style={styles.avatarText}>{professional.fullName?.trim()?.[0]?.toUpperCase() || '?'}</Text></View>
                <View style={styles.resultInfo}>
                  <Text style={styles.professionalName}>{professional.fullName}</Text>
                  <Text style={styles.professionalSpecialty}>{(professional.specialties || []).join(', ')}</Text>
                  <Text style={styles.professionalPlace}>{(professional.placesOfService || []).join('; ')}</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.loadingView}><Text style={styles.noResultsText}>Nenhum profissional encontrado.</Text></View>
          )}
        </ScrollView>
      )}
    </View>
  );
}