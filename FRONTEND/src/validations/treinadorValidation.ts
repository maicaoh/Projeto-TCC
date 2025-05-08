import * as yup from 'yup'

export const treinadorSchema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),

  email: yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),

  cpf: yup.string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00')
    .required('CPF é obrigatório'),

  telefone: yup.string()
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone deve estar no formato (00) 00000-0000')
    .required('Telefone é obrigatório'),

  apelido: yup.string().notRequired(),

  dataNasc: yup.string()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Data de nascimento deve estar no formato DD/MM/AAAA')
    .test('dataNasc', 'Data de nascimento não pode ser no futuro', (value) => {
      if (!value) return false
      const [dia, mes, ano] = value.split('/').map(Number)
      const dataNascimento = new Date(ano, mes - 1, dia) // Ajusta para base 0 do JS
      return dataNascimento <= new Date()
    })
    .required('Data de nascimento é obrigatória'),
})
