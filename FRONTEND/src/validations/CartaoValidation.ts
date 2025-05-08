import * as yup from 'yup'

export const CartaoSchema = yup.object().shape({
  equipe: yup.string().required('Selecione a equipe'),
  jogador: yup.string().required('Selecione o jogador'),
  tipo: yup.string().required('Selecione o tipo'),
  arbitro: yup.string().required('Selecione o árbitro'),
  periodo: yup
    .number()
    .typeError('Selecione o período')
    .required('Selecione o período')
    .oneOf([1, 2], 'Período inválido'),
  tempo: yup
    .string()
    .required('Informe o tempo')
    .matches(/^(?:0?\d|1\d|20):[0-5]\d$/, 'Tempo deve estar entre 00:00 e 20:59')
    .test('limite-max', 'O tempo máximo é 20:00', value => {
      if (!value) return false
      const [minuto, segundo] = value.split(':').map(Number)
      return !(minuto === 20 && segundo > 0)
    }),
  motivo: yup.string().nullable(),
})
