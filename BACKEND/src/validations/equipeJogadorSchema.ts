import * as yup from 'yup'

export const equipeJogadorCreateSchema = yup.object().shape({
    dataContratacao: yup.date()
        .max(new Date(), "A data de contratacao não pode ser no futuro").nullable()
  
})