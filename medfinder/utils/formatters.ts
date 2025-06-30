/**
 * Formata uma string de dígitos em um formato de CPF (XXX.XXX.XXX-XX).
 * @param value A string a ser formatada.
 * @returns A string formatada como CPF.
 */
export const formatCpf = (value: string): string => {
  if (!value) return '';

  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
};

