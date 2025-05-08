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
exports.arbitroUpdateSchema = exports.arbitroCreateSchema = void 0;
const yup = __importStar(require("yup"));
const functions_1 = require("../Utils/functions/functions");
// Schema para criação (todos obrigatórios conforme o seu original)
exports.arbitroCreateSchema = yup.object().shape({
    name: yup.string().max(100).required("Nome é obrigatório"),
    apelido: yup.string().max(50).nullable(),
    cpf: yup.string().nullable()
        .transform((value) => value.replace(/\D/g, "")) // Remove pontos e traços
        .test("cpf-valido", "CPF inválido", (value) => (0, functions_1.validarCPF)(value || "")), // Valida CPF
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
});
// Schema para atualização (campos opcionais, mas se enviados, são validados)
exports.arbitroUpdateSchema = yup.object().shape({
    name: yup.string().max(100).nullable().when('$isUpdate', {
        is: true,
        then: schema => schema.notOneOf([null], 'Nome não pode ser nulo')
    }),
    apelido: yup.string().max(50).nullable(),
    cpf: yup.string()
        .nullable()
        .transform((value) => value ? value.replace(/\D/g, "") : value)
        .test("cpf-valido", "CPF inválido", (value) => !value || (0, functions_1.validarCPF)(value)), // Valida CPF se informado
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
});
