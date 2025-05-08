import * as yup from 'yup'

export const quadraSchema = yup.object().shape({
  name: yup.string().required('O nome da quadra é obrigatório.'),

  comprimento: yup
    .string()
    .required('O comprimento da quadra é obrigatório.')
    .matches(/^\d{1,2}(\.\d{1,2})?$/, 'O comprimento deve ter no máximo 2 dígitos antes e 2 depois do ponto.'),

  largura: yup
    .string()
    .required('A largura da quadra é obrigatória.')
    .matches(/^\d{1,2}(\.\d{1,2})?$/, 'A largura deve ter no máximo 2 dígitos antes e 2 depois do ponto.'),

  endereco: yup.string().optional(),

  telefone: yup
    .string()
    .nullable() // Permite valores nulos
    .transform((value) => (value === ''
      ? null
      : value)) // Converte string vazia para null
    .matches(/^(\(\d{2}\)\s\d{4,5}-\d{4})$/, 'O telefone deve estar no formato (99) 99999-9999.')
    .optional(),

  piso: yup.string().optional(),

  responsavel: yup.string().optional(),
})
