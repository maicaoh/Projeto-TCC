import * as yup from 'yup';

export const finalizacaoCreateSchema = yup.object().shape({
  tempo: yup
    .string()
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
      'Formato de tempo inválido (HH:MM:SS)'
    )
    .required("Tempo da finalização é obrigatório"),

  pe: yup
    .string()
    .oneOf(['D', 'E'], "Valor de pé inválido")
    .required("Pé da finalização é obrigatório"),

  defesa: yup
    .boolean()
    .required("Campo defesa é obrigatório"),

  bloqueio: yup
    .boolean()
    .required("Campo bloqueio é obrigatório"),

  falta: yup
    .boolean()
    .required("Campo falta é obrigatório"),

  seteMetros: yup
    .boolean()
    .required("Campo seteMetros é obrigatório"),

  penalti: yup
    .boolean()
    .required("Campo penalti é obrigatório"),

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
    .nullable(), // opcional

  gol: yup
    .boolean()
    .notRequired(), // não obrigatório — indica se deve criar um Gol relacionado

  golContra: yup
    .boolean()
    .nullable(), // só será usado se 'gol' for true

  periodo: yup
    .number()
    .nullable(), // só obrigatório se 'gol' for true

  assistente: yup
    .object({
      id: yup.string().uuid("ID do assistente inválido"),
    })
    .nullable(),
});
