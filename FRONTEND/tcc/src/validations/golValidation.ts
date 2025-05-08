import * as yup from 'yup'
export const GolSchema = yup.object().shape({
  equipe: yup.string().required('Selecione a equipe'),
  goleiro: yup.string().required('Selecione o goleiro'),
  jogador: yup.string().required('Selecione o jogador'),
  assistente: yup.string().required('Selecione o assistente'),
  periodo: yup.number().required('Selecione o período').oneOf([1, 2]),
  tempo: yup
    .string()
    .required('Informe o tempo')
    .matches(/^(?:0?\d|1\d|20):[0-5]\d$/,
      'Tempo deve estar entre 00:00 e 20:59')
    .test('limite-max', 'O tempo máximo é 20:00', value => {
      if (!value) return false
      const [minuto, segundo] = value.split(':').map(Number)
      return !(minuto === 20 && segundo > 0)
    }),
  posicaoGol: yup
    .object({
      x: yup.number().required(),
      y: yup.number().required(),
    })
    .nullable()
    .required('Marque a posição do Gol'),
  posicaoCampo: yup
    .object({
      x: yup.number().required(),
      y: yup.number().required(),
    })
    .nullable()
    .required('Marque a posição no Campo'),
})
