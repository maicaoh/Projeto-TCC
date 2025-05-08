import * as yup from 'yup'

// Schema para criação (todos obrigatórios conforme o seu original)
export const partidaCreateSchema = yup.object().shape({
    publicoPresente: yup.number()
    .min(0, 'O número deve ser maior ou igual a zero')
    .required('O número é obrigatório')
})


export const partidaUpdateSchema = yup.object().shape({
    publicoPresente: yup.number()
    .min(0, 'O número deve ser maior ou igual a zero')
    .nullable()
})
