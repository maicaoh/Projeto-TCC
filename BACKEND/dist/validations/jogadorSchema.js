"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.jogadorUpdateSchema = exports.jogadorCreateSchema = void 0;
const yup = __importStar(require("yup"));
const functions_1 = require("../Utils/functions/functions");
// Validação comum para altura (reutilizável)
const alturaSchema = yup
    .number()
    .typeError('Altura deve ser um número')
    .test('is-decimal', 'Altura deve ter no máximo 1 dígito antes e 2 depois do ponto', (value) => {
    if (value === undefined || value === null)
        return true; // no update pode ser omitido
    const regex = /^\d{1}\.\d{2}$/;
    return regex.test(value.toFixed(2));
});
// Schema de criação (tudo obrigatório conforme sua regra atual)
exports.jogadorCreateSchema = yup.object().shape({
    name: yup.string().max(100).required("Nome é obrigatório"),
    apelido: yup.string().max(50).nullable(),
    peDominante: yup.string()
        .oneOf(['0', 'E', 'A'], 'Valor inválido para o campo pe dominante')
        .required('Pé dominante é obrigatório'),
    posicao: yup.string().max(20).required("A posição do jogador é obrigatória"),
    cpf: yup.string()
        .transform(value => value ? value.replace(/\D/g, "") : value)
        .test("cpf-valido", "CPF inválido", (value) => (0, functions_1.validarCPF)(value || ""))
        .nullable(),
    altura: alturaSchema.required('Altura é obrigatória'),
    dataNascimento: yup.date().max(new Date(), "A data de nascimento não pode ser no futuro").required("Data de nascimento é obrigatória"),
    foto: yup.string().matches(/^data:image\/(png|jpeg|jpg);base64,/, "A foto deve estar em formato Base64").nullable(),
    telefone: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido, use (XX) XXXXX-XXXX").nullable(),
    cidadeNatal: yup.string().max(50).nullable(),
});
// Schema de atualização (tudo opcional, mas validado se for informado)
exports.jogadorUpdateSchema = yup.object().shape({
    name: yup.string().max(100).nullable().when('$isUpdate', {
        is: true,
        then: schema => schema.notOneOf([null], 'Nome não pode ser nulo')
    }),
    apelido: yup.string().max(50).nullable(),
    peDominante: yup.string()
        .oneOf(['D', 'E', 'A'], 'Valor inválido para o campo pe dominante')
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
        .test("cpf-valido", "CPF inválido", (value) => !value || (0, functions_1.validarCPF)(value))
        .nullable(),
    altura: alturaSchema.nullable(), // Altura pode ser omitida no update
    dataNascimento: yup.date()
        .max(new Date(), "A data de nascimento não pode ser no futuro")
        .nullable(),
    foto: yup.string().matches(/^data:image\/(png|jpeg|jpg);base64,/, "A foto deve estar em formato Base64").nullable(),
    telefone: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido, use (XX) XXXXX-XXXX").nullable(),
    cidadeNatal: yup.string().max(50).nullable(),
});
