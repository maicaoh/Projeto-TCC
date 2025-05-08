import * as yup from 'yup'

export const FinalizacaoSchema = yup.object().shape({
  equipe: yup.string().required('Selecione a equipe'),
  jogador: yup.string().required('Selecione o jogador'),
  pe: yup.string().required('Selecione o pé utilizado'),
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
  posicaoCampo: yup
    .object({
      x: yup.number().required('Posição X obrigatória'),
      y: yup.number().required('Posição Y obrigatória'),
    })
    .nullable()
    .required('Marque a posição no Campo'),
  bloqueador: yup.string().required('Selecione o bloqueador'),
  posicaoGol: yup
    .object({
      x: yup.number(),
      y: yup.number(),
    })
    .nullable()
    .notRequired(),

  bloqueado: yup.boolean().notRequired(),
  gol: yup.boolean().notRequired(),
  falta: yup.boolean().notRequired(),
  penalti: yup.boolean().notRequired(),
})
