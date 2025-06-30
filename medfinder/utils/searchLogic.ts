export interface Professional {
  id: string;
  fullName: string;
  specialties: string[];
  placesOfService: string[];
  emailContact: string;
  phone: string;
  authUid: string;
  acceptedInsurances?: string[];
}

// Função de normalização
export const normalizeText = (text: string = ''): string => {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

// Função de filtro
export const filterProfessionals = (
  professionals: Professional[],
  query: string,
  filters: { name: string; specialty: string; place: string; insurance: string }
): Professional[] => {
  
  const queryNormalized = normalizeText(query);
  const nameNormalized = normalizeText(filters.name);
  const specialtyNormalized = normalizeText(filters.specialty);
  const placeNormalized = normalizeText(filters.place);
  const insuranceNormalized = normalizeText(filters.insurance);

  return professionals.filter(prof => {
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
};