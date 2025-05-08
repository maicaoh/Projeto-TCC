import * as yup from 'yup'

export const FaltaSchema = yup.object().shape({
  equipeAutor: yup.string().required('Selecione a equipe'),
  jogadorAutor: yup.string().required('Selecione o jogador'),
  jogadorSofreu: yup.string().required('Selecione o jogador'),
  // arbitro: yup.string().required('Selecione o árbitro'),
  periodo: yup.number().required('Selecione o período').oneOf([1, 2], 'Período inválido'),
  tempo: yup
    .string()
    .required('Informe o tempo')
    .matches(/^(?:0?\d|1\d|20):[0-5]\d$/, 'Tempo deve estar entre 00:00 e 20:59')
    .test('limite-max', 'O tempo máximo é 20:00', value => {
      if (!value) return false
      const [minuto, segundo] = value.split(':').map(Number)
      return !(minuto === 20 && segundo > 0)
    }),
  tipo: yup.string().required('Selecione o tipo'),
  posicaoCampo: yup
    .object({
      x: yup.number().required('Posição X obrigatória'),
      y: yup.number().required('Posição Y obrigatória'),
    })
    .nullable()
    .required('Marque a posição no Campo'),
})
