import * as yup from 'yup'

// Schema de criação (tudo obrigatório conforme sua regra atual)
export const equipeCreateSchema = yup.object().shape({
    name: yup.string().max(100).required("Nome é obrigatório"),
   // responsavel: yup.string().required('O responsável é um campo obrigatório!'),
    telefone: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido, use (XX) XXXXX-XXXX").nullable(),
    endereco: yup.string().max(50).nullable(),
    logo: yup.string().matches(/^data:image\/(png|jpeg|jpg);base64,/, "A foto deve estar em formato Base64").nullable(),

    
});

// Schema de atualização (tudo opcional, mas validado se for informado)
export const equipeUpdateSchema = yup.object().shape({
    name: yup.string().max(100).nullable().when('$isUpdate', {
        is: true,
        then: schema => schema.notOneOf([null], 'Nome não pode ser nulo')
    }),
    telefone: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido, use (XX) XXXXX-XXXX").nullable(),
    endereco: yup.string().max(50).nullable(),
    logo: yup.string().matches(/^data:image\/(png|jpeg|jpg);base64,/, "A foto deve estar em formato Base64").nullable(),

});

