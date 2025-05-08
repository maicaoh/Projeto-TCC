import * as yup from 'yup'
import { validarCPF } from '../Utils/functions/functions'

// Schema para criação (todos obrigatórios conforme o seu original)
export const arbitroCreateSchema = yup.object().shape({
    name: yup.string().max(100).required("Nome é obrigatório"),
    apelido: yup.string().max(50).nullable(),
    cpf: yup.string()
    .transform((value) => value ? value.replace(/\D/g, "") : "") // Remove pontos e traços apenas se existir
    .test("cpf-valido", "CPF inválido", (value) => !value || validarCPF(value)) // Valida CPF apenas se informado
    .notRequired(), // Torna o campo opcional
    dataNascimento: yup.date()
        .max(new Date(), "A data de nascimento não pode ser no futuro")
        .required("Data de nascimento é obrigatória"),
    foto: yup.string()
        .matches(/^data:image\/(png|jpeg|jpg);base64,/, "A foto deve estar em formato Base64")
        .nullable(),
    email: yup.string()
        .email("E-mail inválido")
        .nullable(),
    telefone: yup.string()
        .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido, use (XX) XXXXX-XXXX")
        .nullable()
})

// Schema para atualização (campos opcionais, mas se enviados, são validados)
export const arbitroUpdateSchema = yup.object().shape({
    name: yup.string().max(100).nullable().when('$isUpdate', {
        is: true,
        then: schema => schema.notOneOf([null], 'Nome não pode ser nulo')
    }),
    apelido: yup.string().max(50).nullable(),
    cpf: yup.string()
        .nullable()
        .transform((value) => value ? value.replace(/\D/g, "") : value)
        .test("cpf-valido", "CPF inválido", (value) => !value || validarCPF(value)), // Valida CPF se informado
    dataNascimento: yup.date()
        .max(new Date(), "A data de nascimento não pode ser no futuro")
        .nullable(),
    foto: yup.string()
        .matches(/^data:image\/(png|jpeg|jpg);base64,/, "A foto deve estar em formato Base64")
        .nullable(),
    email: yup.string()
        .email("E-mail inválido")
        .nullable(),
    telefone: yup.string()
        .matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido, use (XX) XXXXX-XXXX")
        .nullable(),
})
