"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipoTorneio = exports.StatusTorneio = exports.TipoCartao = exports.TipoFalta = exports.Pe = void 0;
var Pe;
(function (Pe) {
    Pe["DIREITA"] = "D";
    Pe["ESQUERDA"] = "E";
})(Pe || (exports.Pe = Pe = {}));
var TipoFalta;
(function (TipoFalta) {
    TipoFalta[TipoFalta["FALTA"] = 0] = "FALTA";
    TipoFalta[TipoFalta["PENALTI"] = 1] = "PENALTI";
    TipoFalta[TipoFalta["TIRO_LIVRE_INDIRETO"] = 2] = "TIRO_LIVRE_INDIRETO";
})(TipoFalta || (exports.TipoFalta = TipoFalta = {}));
var TipoCartao;
(function (TipoCartao) {
    TipoCartao[TipoCartao["AMARELO"] = 0] = "AMARELO";
    TipoCartao[TipoCartao["VERMELHO"] = 1] = "VERMELHO";
})(TipoCartao || (exports.TipoCartao = TipoCartao = {}));
var StatusTorneio;
(function (StatusTorneio) {
    StatusTorneio[StatusTorneio["NAO_INICIADO"] = 0] = "NAO_INICIADO";
    StatusTorneio[StatusTorneio["EM_ANDAMENTO"] = 1] = "EM_ANDAMENTO";
    StatusTorneio[StatusTorneio["ENCERRADO"] = 2] = "ENCERRADO";
})(StatusTorneio || (exports.StatusTorneio = StatusTorneio = {}));
var TipoTorneio;
(function (TipoTorneio) {
    TipoTorneio[TipoTorneio["LIGA"] = 0] = "LIGA";
    TipoTorneio[TipoTorneio["MATA_MATA"] = 1] = "MATA_MATA";
    TipoTorneio[TipoTorneio["FASE_DE_GRUPOS"] = 2] = "FASE_DE_GRUPOS";
})(TipoTorneio || (exports.TipoTorneio = TipoTorneio = {}));
