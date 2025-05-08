import * as yup from 'yup'
import { validarCPF } from '../Utils/functions/functions'

// Schema para criação (todos obrigatórios conforme o seu original)
export const torneioCreateSchema = yup.object().shape({
    name: yup.string().max(100).required("Nome é obrigatório"),
    status: yup.string()
        .oneOf(['0', '1', '2'], 'Valor inválido para o campo status')
        .required('o campo status é obrigatório'),
    tipo: yup.string()
        .oneOf(['0', '1', '2'], 'Valor inválido para o campo tipo')
        .required('o campo tipo é obrigatório'),
    foto: yup.string()
        .matches(/^data:image\/(png|jpeg|jpg);base64,/, "A foto deve estar em formato Base64")
        .nullable(),
    edicao: yup.string().max(100).required('o campo edicao é obrigatório!'),

})

// Schema para atualização (campos opcionais, mas se enviados, são validados)

export const atualizarTorneioSchema = yup.object().shape({
    name: yup.string().max(100, 'Nome deve ter no máximo 100 caracteres'),
    status: yup.string()
        .oneOf(['0', '1', '2'], 'Valor inválido para o campo status'),
    foto: yup.string()
        .matches(/^data:image\/(png|jpeg|jpg);base64,/, "A foto deve estar em formato Base64")
        .nullable(),
    edicao: yup.string().max(100, 'O campo edição deve ter no máximo 100 caracteres'),
}).noUnknown();

