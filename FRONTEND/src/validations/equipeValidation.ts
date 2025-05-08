import * as yup from 'yup'

export const equipeSchema = yup.object().shape({
  name: yup.string().required('O nome é obrigatório'),
  responsavel: yup.string().required('O responsável é obrigatório'),

  telefone: yup
    .string()
    .nullable()
    .matches(/^(\(\d{2}\) \d{4,5}-\d{4})?$/, 'Telefone inválido'),

  endereco: yup.string().nullable(),

  logo: yup.string().required('O logo é obrigatório'),
})
