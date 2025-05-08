import * as yup from 'yup'
import { validarCPF } from '../Utils/functions/functions'

// Validação comum para altura (reutilizável)
const alturaSchema = yup
    .number()
    .typeError('Altura deve ser um número')
    .test('is-decimal', 'Altura deve ter no máximo 2 dígito antes e 2 depois do ponto', (value) => {
        if (value === undefined || value === null) return true; // no update pode ser omitido
        const regex = /^\d{2}\.\d{2}$/;
        return regex.test(value.toFixed(2));
    })

// Schema de criação (tudo obrigatório conforme sua regra atual)
export const quadraCreateSchema = yup.object().shape({
    name: yup.string().max(100).required("Nome é obrigatório"),
    comprimento: alturaSchema.required('comprimento é obrigatória'),
    largura: alturaSchema.required('largura é obrigatória'),
    endereco: yup.string().max(100).nullable(),
    telefone: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido, use (XX) XXXXX-XXXX").nullable(),
    piso:  yup.string().nullable().max(10).nullable(),
    responsavel: yup.string().nullable().max(100).nullable(),
});

// Schema de atualização (tudo opcional, mas validado se for informado)
const alturaSchemaUpdate = yup
    .number()
    .typeError('Altura deve ser um número')
    .test('is-decimal', 'Altura deve ter no máximo 2 dígitos antes e 2 depois do ponto', (value) => {
        if (value === undefined || value === null) return true; // no update pode ser omitido
        const regex = /^\d{2}\.\d{2}$/;
        return regex.test(value.toFixed(2));
    });

export const quadraUpdateSchema = yup.object().shape({
    name: yup.string().max(100),
    comprimento: alturaSchemaUpdate,
    largura: alturaSchemaUpdate,
    endereco: yup.string().max(100).nullable(),
    telefone: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido, use (XX) XXXXX-XXXX").nullable(),
    piso: yup.string().max(10).nullable(),
    responsavel: yup.string().max(100).nullable(),
});
