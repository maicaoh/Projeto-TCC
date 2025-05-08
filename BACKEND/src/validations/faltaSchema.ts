import * as yup from 'yup'


export const faltaCreateSchema = yup.object().shape({
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
    tipo: yup.string()
        .oneOf(['0','1','2'], 'Valor inválido para o campo pe')
        .required('o campo pe é obrigatório'),
});

export const faltaUpdateSchema = yup.object().shape({
    tempo:  yup
            .string()
            .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Formato de tempo inválido (HH:MM:SS)')
            .notRequired(),
     posicaoCampo: yup
          .object({
            x: yup.number().required("Posição X é obrigatória"),
            y: yup.number().required("Posição Y é obrigatória"),
          })
          .nullable(),
    tipo: yup.string()
        .oneOf(['0','1','2'], 'Valor inválido para o campo pe')
        .nullable(),
});
