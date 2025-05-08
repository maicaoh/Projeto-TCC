import * as yup from 'yup'



export const golCreateSchema = yup.object().shape({


  tempoGol: yup
    .string()
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
      'Formato de tempo inválido (HH:MM:SS)'
    )
    .required("Tempo do gol é obrigatório"),

  golContra: yup
    .boolean()
    .required('Campo golContra é obrigatório'),

  periodo: yup
    .number()
    .required("Período é obrigatório"),

  posicaoCampo: yup
    .object({
      x: yup.number().required("Posição X é obrigatória"),
      y: yup.number().required("Posição Y é obrigatória"),
    })
    .nullable(),

  posicaoGol: yup
    .object({
      x: yup.number().required("Posição X é obrigatória"),
      y: yup.number().required("Posição Y é obrigatória"),
    })
    .nullable(),

  assistente: yup
    .object({
      id: yup.string().uuid("ID do assistente inválido"),
    })
    .nullable(),
});



export const golUpdateSchema = yup.object().shape({
    tempoGol: yup
        .string()
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Formato de tempo inválido (HH:MM:SS)')
        .optional(),
    golContra: yup.boolean().optional(),
    
});