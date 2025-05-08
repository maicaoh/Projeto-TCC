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
exports.equipeUpdateSchema = exports.equipeCreateSchema = void 0;
const yup = __importStar(require("yup"));
// Schema de criação (tudo obrigatório conforme sua regra atual)
exports.equipeCreateSchema = yup.object().shape({
    name: yup.string().max(100).required("Nome é obrigatório"),
    telefone: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido, use (XX) XXXXX-XXXX").nullable(),
    endereco: yup.string().max(50).nullable(),
    logo: yup.string().matches(/^data:image\/(png|jpeg|jpg);base64,/, "A foto deve estar em formato Base64").nullable(),
});
// Schema de atualização (tudo opcional, mas validado se for informado)
exports.equipeUpdateSchema = yup.object().shape({
    name: yup.string().max(100).nullable().when('$isUpdate', {
        is: true,
        then: schema => schema.notOneOf([null], 'Nome não pode ser nulo')
    }),
    telefone: yup.string().matches(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido, use (XX) XXXXX-XXXX").nullable(),
    endereco: yup.string().max(50).nullable(),
    logo: yup.string().matches(/^data:image\/(png|jpeg|jpg);base64,/, "A foto deve estar em formato Base64").nullable(),
});
