// Função para validar CPF
export const validarCPF = (cpf: string): boolean => {
    cpf = cpf.replace(/\D/g, ""); // Remove tudo que não for número
  
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false; // Verifica se tem 11 dígitos e se não é uma sequência repetida
    }
  
    let soma = 0, resto;
  
    // Validação do primeiro dígito verificador
    for (let i = 0; i < 9; i++) soma += Number(cpf[i]) * (10 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== Number(cpf[9])) return false;
  
    soma = 0;
  
    // Validação do segundo dígito verificador
    for (let i = 0; i < 10; i++) soma += Number(cpf[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== Number(cpf[10])) return false;
  
    return true;
  };