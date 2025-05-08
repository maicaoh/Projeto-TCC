import * as yup from 'yup'


export const desarmeCreateSchema = yup.object().shape({
    tempo:  yup
        .string()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Formato de tempo inválido (HH:MM:SS)')
        .required("Tempo é obrigatório"),      
        posicaoCampo: yup
        .object({
          x: yup.number().required("Posição X é obrigatória"),
          y: yup.number().required("Posição Y é obrigatória"),
        })
        .nullable(),
    pe: yup.string()
        .oneOf(['D', 'E'], 'Valor inválido para o campo pe')
        .required('o campo pe é obrigatório'),
    sucesso: yup.boolean().required('campo sucesso é obrigatório'),
});

export const desarmeUpdateSchema = yup.object().shape({
    tempo: yup
    .string()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Formato de tempo inválido (HH:MM:SS)')
    .optional(),
         posicaoCampo: yup
           .object({
             x: yup.number().required("Posição X é obrigatória"),
             y: yup.number().required("Posição Y é obrigatória"),
           })
           .notRequired(),
    pe: yup.string()
        .oneOf(['D', 'E'], 'Valor inválido para o campo pe')
        .nullable(),
    sucesso: yup.boolean().nullable(),
});

