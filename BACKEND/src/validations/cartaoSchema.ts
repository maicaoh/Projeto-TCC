import * as yup from 'yup'


export const cartaoCreateSchema = yup.object().shape({
    tipo: yup.string()
    .oneOf(['0', '1'], 'Valor inválido para o tipo')
    .required('o campo tipo é obrigatório'),
    tempo: yup
    .string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Formato de tempo inválido (HH:MM:SS)')
    .required("Tempo é obrigatório"),
});


export const cartaoUpdateSchema = yup.object().shape({
    tipo: yup.string()
    .oneOf(['0', '1'], 'Valor inválido para o tipo')
    .nullable(),
    tempo:  yup
    .string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Formato de tempo inválido (HH:MM:SS)')
    .optional(),
});