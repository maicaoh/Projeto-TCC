import * as yup from 'yup'

export const arbitroSchema = yup.object().shape({
  id: yup.string().optional(),

  name: yup.string()
    .required('O nome é obrigatório'),

  apelido: yup.string().optional(),

  cpf: yup.string()
    .nullable()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00')
    .transform(value => value?.trim() || null)
    .optional(),

  dataNascimento: yup.string()
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Data de nascimento deve estar no formato DD/MM/AAAA')
    .test('dataNascimento', 'Data de nascimento não pode ser no futuro', (value) => {
      if (!value) return false
      const [dia, mes, ano] = value.split('/').map(Number)
      const dataNascimento = new Date(ano, mes - 1, dia)
      return dataNascimento <= new Date()
    })
    .required('A data de nascimento é obrigatória'),

  foto: yup.string().optional(),

  email: yup.string()
    .email('E-mail inválido')
    .optional(),

  telefone: yup.string()
    .nullable()
    .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone deve estar no formato (00) 00000-0000')
    .optional(),
})
