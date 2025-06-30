import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Href, useNavigation } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import styles, { gradientColors } from '@/styles/searchStyles';
import { Professional, filterProfessionals } from '@/utils/searchLogic';

export default function SearchScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { results, initialQuery } = useLocalSearchParams();
  
  const initialResultsArray: Professional[] = results && typeof results === 'string' ? JSON.parse(results) : [];

  const [searchQuery, setSearchQuery] = useState(typeof initialQuery === 'string' ? initialQuery : '');
  const [allProfessionals, setAllProfessionals] = useState<Professional[]>([]);
  const [searchResults, setSearchResults] = useState<Professional[]>(initialResultsArray);
  const [isLoading, setIsLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filterState, setFilterState] = useState({ name: '', specialty: '', place: '', insurance: '' });
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [debouncedFilters, setDebouncedFilters] = useState(filterState);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedQuery(searchQuery); }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);
  
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedFilters(filterState); }, 300);
    return () => clearTimeout(handler);
  }, [filterState]);

  useEffect(() => {
    const fetchAllProfessionals = async () => {
      setIsLoading(true);
      try {
        const professionalsRef = collection(db, 'healthcareProfessionals');
        const allSnapshot = await getDocs(professionalsRef);
        const allDataFetched = allSnapshot.docs.map(docData => ({ id: docData.id, ...docData.data() } as Professional));
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

  useEffect(() => {
    const filtered = filterProfessionals(allProfessionals, debouncedQuery, debouncedFilters);
    setSearchResults(filtered);
  }, [debouncedQuery, debouncedFilters, allProfessionals]);
  
  const handleClearAndCloseFilters = () => {
    setFilterState({ name: '', specialty: '', place: '', insurance: '' });
    setFilterVisible(false);
  }

  const navigateToSchedule = (professional: Professional) => {
    if (!professional.authUid) {
      Alert.alert("Informação Incompleta", "Este profissional não pode ser agendado.");
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