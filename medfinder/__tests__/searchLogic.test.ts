
import { filterProfessionals, normalizeText, Professional } from '../utils/searchLogic';

const mockProfessionals: Professional[] = [
  { 
    id: '1', 
    fullName: 'Dr. João da Silva', 
    specialties: ['Cardiologia'], 
    placesOfService: ['São Paulo'], 
    acceptedInsurances: ['Amil'],
    authUid: 'uid-joao',
    emailContact: 'joao.silva@email.com',
    phone: '11999990001',
  },
  { 
    id: '2', 
    fullName: 'Dra. Ana Costa', 
    specialties: ['Dermatologia', 'Estética'], 
    placesOfService: ['Rio de Janeiro'], 
    acceptedInsurances: ['Bradesco'],
    authUid: 'uid-ana',
    emailContact: 'ana.costa@email.com',
    phone: '21999990002',
  },
  { 
    id: '3', 
    fullName: 'Dr. Carlos de Souza', 
    specialties: ['Cardiologia', 'Clínica Geral'], 
    placesOfService: ['São Paulo'], 
    acceptedInsurances: ['SulAmérica', 'Amil'],
    authUid: 'uid-carlos',
    emailContact: 'carlos.souza@email.com',
    phone: '11999990003',
  },
];

describe('Lógica de Busca (searchLogic)', () => {

  // Teste para a função normalizeText
  describe('normalizeText', () => {
    it('deve remover acentos e converter para minúsculas', () => {
      expect(normalizeText('Cardiología')).toBe('cardiologia');
      expect(normalizeText('SÃO PAULO')).toBe('sao paulo');
    });
  });

  // Testes para a função filterProfessionals
  describe('filterProfessionals', () => {
    const emptyFilters = { name: '', specialty: '', place: '', insurance: '' };

    it('deve retornar todos os profissionais se a busca e os filtros estiverem vazios', () => {
      const result = filterProfessionals(mockProfessionals, '', emptyFilters);
      expect(result.length).toBe(3);
    });

    it('deve filtrar pela busca principal de especialidade (com acento)', () => {
      const result = filterProfessionals(mockProfessionals, 'Cardiología', emptyFilters);
      expect(result.length).toBe(2);
      expect(result.map(p => p.fullName)).toContain('Dr. João da Silva');
      expect(result.map(p => p.fullName)).toContain('Dr. Carlos de Souza');
    });

    it('deve filtrar pelo nome no modal de filtro', () => {
      const filters = { ...emptyFilters, name: 'Ana Costa' };
      const result = filterProfessionals(mockProfessionals, '', filters);
      expect(result.length).toBe(1);
      expect(result[0].fullName).toBe('Dra. Ana Costa');
    });

    it('deve filtrar pelo local de atendimento no modal de filtro', () => {
      const filters = { ...emptyFilters, place: 'sao paulo' };
      const result = filterProfessionals(mockProfessionals, '', filters);
      expect(result.length).toBe(2);
    });
    
    it('deve filtrar pelo convênio no modal de filtro', () => {
      const filters = { ...emptyFilters, insurance: 'bradesco' };
      const result = filterProfessionals(mockProfessionals, '', filters);
      expect(result.length).toBe(1);
      expect(result[0].fullName).toBe('Dra. Ana Costa');
    });

    it('deve combinar a busca principal com os filtros do modal', () => {
      const filters = { ...emptyFilters, insurance: 'amil' };
      // Busca por 'cardiologia' E que aceite 'Amil'
      const result = filterProfessionals(mockProfessionals, 'cardiologia', filters);
      expect(result.length).toBe(2);
    });

    it('deve retornar um array vazio se nenhum profissional corresponder', () => {
      const filters = { ...emptyFilters, specialty: 'Ortopedia' };
      const result = filterProfessionals(mockProfessionals, '', filters);
      expect(result.length).toBe(0);
    });
  });
});
