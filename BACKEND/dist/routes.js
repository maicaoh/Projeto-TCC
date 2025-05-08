"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const SubjectController_1 = require("./controllers/SubjectController");
const RoomController_1 = require("./controllers/RoomController");
const CoachContoller_1 = require("./controllers/CoachContoller");
const JogadorController_1 = require("./controllers/JogadorController");
const EquipeController_1 = require("./controllers/EquipeController");
const EquipeJogadorController_1 = require("./controllers/EquipeJogadorController");
const EquipeCoachController_1 = require("./controllers/EquipeCoachController");
const TorneioController_1 = require("./controllers/TorneioController");
const PatidaController_1 = require("./controllers/PatidaController");
const EquipeTorneioController_1 = require("./controllers/EquipeTorneioController");
const ArbitroController_1 = require("./controllers/ArbitroController");
const routes = (0, express_1.Router)();
const subjectController = new SubjectController_1.SubjectController();
const roomController = new RoomController_1.RoomController();
const coachController = new CoachContoller_1.CoachController();
const jogadorController = new JogadorController_1.JogadorController();
const equipeController = new EquipeController_1.EquipeController();
const equipeJogadorController = new EquipeJogadorController_1.EquipeJogadorController();
const equipeTreinadorController = new EquipeCoachController_1.EquipeTreinadorController();
const torneioController = new TorneioController_1.TorneioController();
const partidaController = new PatidaController_1.PartidaController();
const equipeTorneioController = new EquipeTorneioController_1.EquipeTorneioController();
const arbitroController = new ArbitroController_1.ArbitroController();
routes.post('/subject', async (req, res) => {
    await subjectController.create(req, res);
});
routes.post('/room', async (req, res) => {
    await roomController.create(req, res);
});
routes.post('/video/:idRoom/create', async (req, res) => {
    await roomController.createVideo(req, res);
});
routes.post('/room/:idRoom/subject', async (req, res) => {
    await roomController.roomSubject(req, res);
});
routes.post('/treinador', async (req, res) => {
    await coachController.create(req, res);
});
routes.get('/treinador', async (req, res) => {
    await coachController.listarCoaches(req, res);
});
routes.get('/treinador/:id', async (req, res) => {
    await coachController.buscarCoachPorId(req, res);
});
routes.put('/treinador/:id', async (req, res) => {
    await coachController.atualizarCoach(req, res);
});
routes.delete('/treinador/:id', async (req, res) => {
    await coachController.deletarCoach(req, res);
});
//Rotas de jogadores
routes.post('/jogador', async (req, res) => {
    await jogadorController.create(req, res);
});
routes.get('/jogador', async (req, res) => {
    await jogadorController.listarJogadores(req, res);
});
routes.get('/jogador/:id', async (req, res) => {
    await jogadorController.buscarJogadorPorId(req, res);
});
routes.put('/jogador/:id', async (req, res) => {
    await jogadorController.atualizarJogador(req, res);
});
routes.delete('/jogador/:id', async (req, res) => {
    await jogadorController.deletarJogador(req, res);
});
//Rotas de equipe
routes.post('/equipe', async (req, res) => {
    await equipeController.create(req, res);
});
routes.get('/equipe', async (req, res) => {
    await equipeController.listarEquipes(req, res);
});
routes.get('/equipe/:id', async (req, res) => {
    await equipeController.buscarEquipePorId(req, res);
});
routes.put('/equipe/:id', async (req, res) => {
    await equipeController.atualizarEquipe(req, res);
});
routes.delete('/equipe/:id', async (req, res) => {
    await equipeController.deletarEquipe(req, res);
});
//Rotas de equipe jogador
routes.post('/equipe/:idEquipe/jogadores', async (req, res) => {
    await equipeJogadorController.vincularEquipeJogador(req, res);
});
routes.put('/equipe/:idEquipe/jogadores', async (req, res) => {
    await equipeJogadorController.desvincularEquipeJogador(req, res);
});
routes.put('/equipe/:idEquipe/jogadores/dorsal', async (req, res) => {
    await equipeJogadorController.dorsalEquipeJogador(req, res);
});
routes.get('/equipe/:idEquipe/jogadores', async (req, res) => {
    await equipeJogadorController.listarJogadoresEquipe(req, res);
});
//Rotas de equipe treinador
routes.post('/equipe/:idEquipe/treinadores', async (req, res) => {
    await equipeTreinadorController.vincularEquipeTreinado(req, res);
});
routes.put('/equipe/:idEquipe/treinadores', async (req, res) => {
    await equipeTreinadorController.desvincularEquipeTreiandor(req, res);
});
routes.get('/equipe/:idEquipe/treinadores', async (req, res) => {
    await equipeTreinadorController.listarTreinadoresEquipe(req, res);
});
//Rotas de torneio
routes.post('/torneio', async (req, res) => {
    await torneioController.create(req, res);
});
routes.get('/torneio', async (req, res) => {
    await torneioController.listarTorneio(req, res);
});
routes.get('/torneio/:id', async (req, res) => {
    await torneioController.buscarTorneioPorId(req, res);
});
routes.put('/torneio/:id', async (req, res) => {
    await torneioController.atualizarTorneio(req, res);
});
routes.delete('/torneio/:id', async (req, res) => {
    await torneioController.deletarTorneio(req, res);
});
//Partida
routes.post('/partida/:idTorneio', async (req, res) => {
    await partidaController.create(req, res);
});
routes.get('/partida', async (req, res) => {
    await partidaController.listarPartida(req, res);
});
routes.get('/partida/:id', async (req, res) => {
    await partidaController.buscarPartidaPorId(req, res);
});
routes.put('/partida/:id', async (req, res) => {
    await partidaController.atualizarPartida(req, res);
});
routes.delete('/partida/:id', async (req, res) => {
    await partidaController.deletarPartida(req, res);
});
//Equipe torneio
routes.post('/torneio/:idTorneio/equipes', async (req, res) => {
    await equipeTorneioController.create(req, res);
});
//Arbitro
routes.post('/arbitro', async (req, res) => {
    await arbitroController.create(req, res);
});
routes.get('/arbitro', async (req, res) => {
    await arbitroController.listarArbitro(req, res);
});
routes.get('/arbitro/:id', async (req, res) => {
    await arbitroController.buscarArbitroPorId(req, res);
});
routes.put('/treinador/:id', async (req, res) => {
    await arbitroController.atualizarArbitro(req, res);
});
routes.delete('/treinador/:id', async (req, res) => {
    await arbitroController.deletarArbitro(req, res);
});
exports.default = routes;
