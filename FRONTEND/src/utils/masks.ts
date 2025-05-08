export function formatCPF(cpf: string): string {
  const cleaned = cpf
    ? cpf?.replace(/\D/g, '')
    : '' // Remove qualquer caractere não numérico
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}
