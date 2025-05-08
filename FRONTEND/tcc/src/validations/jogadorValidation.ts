import * as yup from 'yup'

export const jogadorSchema = yup.object().shape({
  nome: yup.string().required('O nome é obrigatório'),
  peDominante: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === ''
        ? undefined
        : Number(originalValue)
    })
    .typeError('Selecione o pé dominante')
    .required('O pé dominante é obrigatório'),
  apelido: yup.string().nullable(),
  dataNasc: yup
    .string()
    .required('A data de nascimento é obrigatória')
    .matches(/^\d{2}\/\d{2}\/\d{4}$/, 'Formato inválido. Use DD/MM/AAAA'),
  posicao: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === ''
        ? undefined
        : Number(originalValue)
    })
    .typeError('Selecione a posição')
    .required('A posição é obrigatória'),

  foto: yup.string().nullable(),
  altura: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue
        ? parseFloat(originalValue.toString().replace(',', '.'))
        : undefined
    })
    .typeError('A altura deve ser um número válido')
    .positive('A altura deve ser um número positivo')
    .required('A altura é obrigatória'),

  cpf: yup
    .string()
    .nullable()
    .matches(/^(\d{3}\.\d{3}\.\d{3}-\d{2})?$/, 'CPF inválido'),
  telefone: yup
    .string()
    .nullable()
    .matches(/^(\(\d{2}\) \d{4,5}-\d{4})?$/, 'Telefone inválido'),
  cidadeNatal: yup.string().nullable(),
})
