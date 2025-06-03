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
import { db } from '../firebaseConfig'; // Confirme o caminho
import styles, { gradientColors } from './styles/searchStyles'; // Confirme o caminho

type Professional = {
  id: string;
  fullName: string;
  specialties: string[];
  emailContact: string;
  phone: string;
  placesOfService: string[];
  authUid: string;
  acceptedInsurances?: string[]; // CAMPO ADICIONADO
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
  const [isLoading, setIsLoading] = useState(true); // Inicia como true para buscar todos os profissionais

  const [filterVisible, setFilterVisible] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const [filterPlace, setFilterPlace] = useState('');
  const [filterInsurance, setFilterInsurance] = useState(''); // NOVO ESTADO PARA FILTRO DE CONVÊNIO

  const applyFilters = useCallback((
    professionalsToFilter: Professional[],
    currentSearchQuery: string,
    currentFilterName: string,
    currentFilterSpecialty: string,
    currentFilterPlace: string,
    currentFilterInsurance: string // NOVO PARÂMETRO
  ) => {
    const queryNormalized = normalizeText(currentSearchQuery);
    const nameNormalized = normalizeText(currentFilterName);
    const specialtyNormalized = normalizeText(currentFilterSpecialty);
    const placeNormalized = normalizeText(currentFilterPlace);
    const insuranceNormalized = normalizeText(currentFilterInsurance); // NORMALIZAR FILTRO DE CONVÊNIO

    if (!professionalsToFilter || professionalsToFilter.length === 0) {
        setSearchResults([]);
        return;
    }

    const filtered = professionalsToFilter.filter(prof => {
      // Verifica se o termo da busca principal (searchQuery) corresponde a algum dos campos
      const matchesSearchQuery = queryNormalized
        ? normalizeText(prof.fullName).includes(queryNormalized) ||
          (prof.specialties || []).some(spec => normalizeText(spec).includes(queryNormalized)) ||
          (prof.placesOfService || []).some(place => normalizeText(place).includes(queryNormalized)) ||
          (prof.acceptedInsurances || []).some(ins => normalizeText(ins).includes(queryNormalized)) // BUSCA POR CONVÊNIO NA QUERY PRINCIPAL
        : true;

      // Verifica os filtros específicos do modal
      const matchesName = nameNormalized ? normalizeText(prof.fullName).includes(nameNormalized) : true;
      const matchesSpecialty = specialtyNormalized ? (prof.specialties || []).some(spec => normalizeText(spec).includes(specialtyNormalized)) : true;
      const matchesPlace = placeNormalized ? (prof.placesOfService || []).some(place => normalizeText(place).includes(placeNormalized)) : true;
      const matchesInsurance = insuranceNormalized ? (prof.acceptedInsurances || []).some(ins => normalizeText(ins).includes(insuranceNormalized)) : true; // FILTRO ESPECÍFICO DE CONVÊNIO

      return matchesSearchQuery && matchesName && matchesSpecialty && matchesPlace && matchesInsurance;
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
          acceptedInsurances: data.acceptedInsurances || [], // OBTENDO CONVÊNIOS
        } as Professional;
      });
      setAllProfessionals(allDataFetched);
    } catch (error) {
      console.error("Erro ao buscar todos os profissionais:", error);
      Alert.alert("Erro", "Não foi possível carregar a lista de profissionais.");
      setAllProfessionals([]); // Define como array vazio em caso de erro
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Busca todos os profissionais na montagem inicial ou se a lista estiver vazia
    if (allProfessionals.length === 0) {
        doFetchAllProfessionals();
    }
  }, [doFetchAllProfessionals, allProfessionals.length]);

  useEffect(() => {
    // Aplica filtros sempre que houver mudança nos critérios ou nos dados base
    // Assegura que `allProfessionals` é a fonte se a busca principal for limpa ou se filtros modais forem aplicados.
    // `initialResultsArray` é usado para a primeira exibição se `initialQuery` existir.
    
    const sourceForFiltering = (searchQuery || filterName || filterSpecialty || filterPlace || filterInsurance) || !initialQuery
                               ? allProfessionals // Filtra todos se houver qualquer filtro ativo ou se não houve query inicial
                               : initialResultsArray; // Usa resultados iniciais se não houver filtros e houve query inicial

    if (!isLoading) { // Só aplica se não estiver carregando E houver dados base (allProfessionals ou initialResults)
        const effectiveSearchQuery = searchQuery || (typeof initialQuery === 'string' ? initialQuery : '');
        applyFilters(sourceForFiltering, effectiveSearchQuery, filterName, filterSpecialty, filterPlace, filterInsurance);
    }

  }, [allProfessionals, initialResultsArray, searchQuery, filterName, filterSpecialty, filterPlace, filterInsurance, applyFilters, isLoading, initialQuery]);


  const handleSearchButtonPress = () => {
    // Ao pressionar o botão de busca, força a filtragem sobre todos os profissionais
    applyFilters(allProfessionals, searchQuery, filterName, filterSpecialty, filterPlace, filterInsurance);
    if (filterVisible) {
      setFilterVisible(false); // Fecha o modal de filtro se estiver aberto
    }
  };
  
  const handleApplyModalFilters = () => {
    // Ao aplicar filtros do modal, força a filtragem sobre todos os profissionais
    applyFilters(allProfessionals, searchQuery, filterName, filterSpecialty, filterPlace, filterInsurance);
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
        <View style={{width: 24}} /> {/* Espaçador para centralizar o título */}
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Nome, especialidade, local, convênio..." // PLACEHOLDER ATUALIZADO
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchButtonPress} // Busca ao pressionar Enter
            returnKeyType="search"
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
            <TextInput style={styles.filterInput} placeholder="Convênio" placeholderTextColor="#A0A0A0" value={filterInsurance} onChangeText={setFilterInsurance} /> {/* INPUT DE CONVÊNIO ADICIONADO */}
            
            <TouchableOpacity style={styles.applyFilterButton} onPress={handleApplyModalFilters}>
              <Text style={styles.applyFilterText}>Aplicar Filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelFilterButton} onPress={() => {
                setFilterName('');
                setFilterSpecialty('');
                setFilterPlace('');
                setFilterInsurance('');
                setFilterVisible(false);
                // Reaplicar com filtros limpos, baseado na query principal atual
                applyFilters(allProfessionals, searchQuery, '', '', '', ''); 
            }}>
              <Text style={styles.cancelFilterText}>Limpar e Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {isLoading && searchResults.length === 0 ? ( // Mostra loading apenas se os resultados ainda não chegaram ou não há resultados iniciais
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
                    pathname: '/scheduleUser', // Confirme o caminho
                    params: {
                      professionalUID: professional.authUid,
                      fullName: professional.fullName,
                      emailContact: professional.emailContact,
                      phone: professional.phone,
                      specialties: JSON.stringify(professional.specialties || []),
                      placesOfService: JSON.stringify(professional.placesOfService || []),
                      acceptedInsurances: JSON.stringify(professional.acceptedInsurances || []), // ENVIANDO CONVÊNIOS
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
                  {/* Você pode adicionar a exibição dos convênios aqui se desejar */}
                  {/* <Text style={styles.professionalDetail}>
                    Convênios: {(professional.acceptedInsurances || []).join(', ') || 'Não informado'}
                  </Text> */}
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

// Seus inlineStyles permanecem os mesmos
const inlineStyles = StyleSheet.create({
  loadingView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20, // Adicionado para dar espaço ao texto de "nenhum resultado"
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  }
});