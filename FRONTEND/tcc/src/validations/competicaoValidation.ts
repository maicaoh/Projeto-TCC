import * as yup from 'yup'

export const competicaoSchema = yup.object().shape({
  name: yup
    .string()
    .required('O nome da competição é obrigatório'),

  edicao: yup
    .string()
    .required('A edição é obrigatória'),

  tipo: yup
    .string()
    .oneOf(['0', '1', '2'], 'Formato inválido')
    .required('O formato da competição é obrigatório'),

  status: yup
    .string()
    .oneOf(['0', '1', '2'], 'Status inválido')
    .required('O status da competição é obrigatório'),

  foto: yup
    .string()
    .nullable(),

  temReturno: yup.boolean().default(false),

})
