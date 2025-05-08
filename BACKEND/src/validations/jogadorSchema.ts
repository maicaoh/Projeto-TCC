import * as yup from 'yup'
import { validarCPF } from '../Utils/functions/functions'

// Validação comum para altura (reutilizável)
const alturaSchema = yup
    .number()
    .typeError('Altura deve ser um número')
    .test('is-decimal', 'Altura deve ter no máximo 1 dígito antes e 2 depois do ponto', (value) => {
        if (value === undefined || value === null) return true; // no update pode ser omitido
        const regex = /^\d{1}\.\d{2}$/;
        return regex.test(value.toFixed(2));
    })

// Schema de criação (tudo obrigatório conforme sua regra atual)
export const jogadorCreateSchema = yup.object().shape({
    name: yup.string().max(100).required("Nome é obrigatório"),
    apelido: yup.string().max(50).nullable(),
    peDominante: yup.string()
        .oneOf(['0', '1'], 'Valor inválido para o campo pe dominante')
        .required('Pé dominante é obrigatório'),
    posicao: yup.string().max(20).required("A posição do jogador é obrigatória"),
    cpf: yup
    .string()
    .nullable()
    .transform(value => value ? value.replace(/\D/g, "") : value)
    .test("cpf-valido", "CPF inválido", (value) => {
      if (!value) return true; // Se o CPF não foi informado, ignora a validação
      return validarCPF(value);
    }),
  
    altura: alturaSchema.required('Altura é obrigatória'),
    dataNascimento: yup.date().max(new Date(), "A data de nascimento não pode ser no futuro").required("Data de nascimento é obrigatória"),
    foto: yup.string().matches(/^data:image\/(png|jpeg|jpg);base64,/, "A foto deve estar em formato Base64").nullable(),
    telefone: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido, use (XX) XXXXX-XXXX").nullable(),
    cidadeNatal: yup.string().max(50).nullable(),
});

// Schema de atualização (tudo opcional, mas validado se for informado)
export const jogadorUpdateSchema = yup.object().shape({
    name: yup.string().max(100).nullable().when('$isUpdate', {
        is: true,
        then: schema => schema.notOneOf([null], 'Nome não pode ser nulo')
    }),
    apelido: yup.string().max(50).nullable(),
    peDominante: yup.string()
        .oneOf(['0', '1'], 'Valor inválido para o campo pe dominante')
        .nullable()
        .when('$isUpdate', {
            is: true,
            then: schema => schema.notOneOf([null], 'Pé dominante não pode ser nulo')
        }),
    posicao: yup.string().max(20).nullable().when('$isUpdate', {
        is: true,
        then: schema => schema.notOneOf([null], 'Posição não pode ser nula')
    }),
    cpf: yup.string()
        .transform(value => value ? value.replace(/\D/g, "") : value)
        .test("cpf-valido", "CPF inválido", (value) => !value || validarCPF(value))
        .nullable(),
    altura: alturaSchema.nullable(),  // Altura pode ser omitida no update
    dataNascimento: yup.date()
        .max(new Date(), "A data de nascimento não pode ser no futuro")
        .nullable(),
    foto: yup.string().matches(/^data:image\/(png|jpeg|jpg);base64,/, "A foto deve estar em formato Base64").nullable(),
    telefone: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido, use (XX) XXXXX-XXXX").nullable(),
    cidadeNatal: yup.string().max(50).nullable(),
});

