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
exports.atualizarTorneioSchema = exports.torneioCreateSchema = void 0;
const yup = __importStar(require("yup"));
// Schema para criação (todos obrigatórios conforme o seu original)
exports.torneioCreateSchema = yup.object().shape({
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
});
// Schema para atualização (campos opcionais, mas se enviados, são validados)
exports.atualizarTorneioSchema = yup.object().shape({
    name: yup.string().max(100, 'Nome deve ter no máximo 100 caracteres'),
    status: yup.string()
        .oneOf(['0', '1', '2'], 'Valor inválido para o campo status'),
    foto: yup.string()
        .matches(/^data:image\/(png|jpeg|jpg);base64,/, "A foto deve estar em formato Base64")
        .nullable(),
    edicao: yup.string().max(100, 'O campo edição deve ter no máximo 100 caracteres'),
}).noUnknown();
