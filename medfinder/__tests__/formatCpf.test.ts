import { formatCpf } from '../utils/formatters'; 

describe('Função formatCpf', () => {

  it('deve formatar uma string de CPF completa corretamente', () => {
    const input = '12345678900';
    const expectedOutput = '123.456.789-00';
    expect(formatCpf(input)).toBe(expectedOutput);
  });

  it('deve formatar uma string de CPF incompleta', () => {
    const input = '123456';
    const expectedOutput = '123.456';
    expect(formatCpf(input)).toBe(expectedOutput);
  });

  it('deve lidar com caracteres não numéricos, removendo-os', () => {
    const input = '123.abc.456';
    const expectedOutput = '123.456';
    expect(formatCpf(input)).toBe(expectedOutput);
  });

  it('deve retornar uma string vazia se a entrada for vazia', () => {
    const input = '';
    const expectedOutput = '';
    expect(formatCpf(input)).toBe(expectedOutput);
  });
});