import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import styles from './styles/homestyles';

// Função para remover acentos e colocar tudo minúsculo
const normalizeText = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

// Interface para os dados de cada profissional de saúde
interface HealthcareProfessional {
  fullName: string;
  specialties: string[];
  placesOfService: string[];
  emailContact: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = async () => {
    const professionalsRef = collection(db, 'healthcareProfessionals');
    let combinedResults: HealthcareProfessional[] = []; // Definindo o tipo dos resultados

    const queryNormalized = normalizeText(searchQuery.trim());

    const snapshot = await getDocs(professionalsRef);
    const allProfessionals: HealthcareProfessional[] = snapshot.docs.map(doc => doc.data() as HealthcareProfessional); // Definindo o tipo explicitamente

    if (queryNormalized) {
      const results = allProfessionals.filter(prof => {
        const name = normalizeText(prof.fullName || '');  // Garante que 'name' sempre será uma string
        const specialties = (prof.specialties || []).map((s: string) => normalizeText(s));  // Garante que 'specialties' seja um array de strings
        const places = (prof.placesOfService || []).map((p: string) => normalizeText(p));  // Garante que 'places' seja um array de strings

        return (
          name.includes(queryNormalized) ||
          specialties.some(s => s.includes(queryNormalized)) ||
          places.some(p => p.includes(queryNormalized))
        );
      });

      // Remover duplicatas pelo email
      const uniqueMap = new Map();
      results.forEach(item => uniqueMap.set(item.emailContact, item));
      combinedResults = Array.from(uniqueMap.values());
    } else {
      combinedResults = allProfessionals;
    }

    router.push({
      pathname: '/search',
      params: {
        results: JSON.stringify(combinedResults),
      },
    });
  };

  return (
    <LinearGradient colors={['#71C9F8', '#3167AF']} style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.appTitleContainer}>
            <Text style={styles.appTitleText}>MedFinder</Text>
          </View>
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Feather name="bell" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Saudação */}
        <Text style={styles.greetingText}>Seja bem-vindo, Usuário!</Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchLabel}>O que você procura?</Text>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cardiologista"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Feather name="search" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Cards */}
        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card}>
            <FontAwesome5 name="book-open" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Histórico</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push('/pending')}>
            <Feather name="clock" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Pendentes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push('/help')}>
            <Feather name="help-circle" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Ajuda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => router.push('/results')}>
            <FontAwesome5 name="thermometer-half" size={28} color="#444" style={styles.cardIcon} />
            <Text style={styles.cardText}>Resultados</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
