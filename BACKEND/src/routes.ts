import { Router } from "express";
import { SubjectController } from "./controllers/SubjectController";
import { RoomController } from "./controllers/RoomController";
import { CoachController } from "./controllers/CoachContoller";
import { JogadorController } from "./controllers/JogadorController";
import { EquipeController } from "./controllers/EquipeController";
import { EquipeJogadorController } from "./controllers/EquipeJogadorController";
import { EquipeTreinadorController } from "./controllers/EquipeCoachController";
import { TorneioController } from "./controllers/TorneioController";
import { PartidaController } from "./controllers/PatidaController";
import { EquipeTorneioController } from "./controllers/EquipeTorneioController";
import { ArbitroController } from "./controllers/ArbitroController";
import { QuadraController } from "./controllers/QuadraController";
import { PartidaArbitroController } from "./controllers/PartidaArbitroController";
import { GolController } from "./controllers/GolController";
import { FinalizacaoController } from "./controllers/FinalizacaoController";
import { DribleController } from "./controllers/DribleController";
import { DesarmeController } from "./controllers/DesarmeController";
import { FaltaController } from "./controllers/FaltaController";
import { Cartao } from "./entities/Cartao";
import { CartaoController } from "./controllers/cartaoController";
import { EquipePartidaController } from "./controllers/EquipePartidaController";
import { EstatiscaController } from "./controllers/EstatisticaTorneioController";
import { EstatiscaGeralController } from "./controllers/EstatisticaGeralController";


const routes = Router();
const subjectController = new SubjectController();
const roomController = new RoomController();
const coachController = new CoachController();
const jogadorController = new JogadorController();
const equipeController = new EquipeController();
const equipeJogadorController = new EquipeJogadorController();
const equipeTreinadorController = new EquipeTreinadorController();
const torneioController = new TorneioController();
const partidaController = new PartidaController();
const equipeTorneioController = new EquipeTorneioController()
const arbitroController = new ArbitroController()
const quadraController = new QuadraController();
const partidaArbitroController = new PartidaArbitroController()
const golController = new GolController();
const finalizacaoController = new FinalizacaoController()
const dribleController = new DribleController()
const desarmeController = new DesarmeController()
const faltaController = new FaltaController();
const cartaoController = new CartaoController();
const equipePartidaController = new EquipePartidaController();
const estatisticasController = new EstatiscaController()
const estatisticaGeralController = new EstatiscaGeralController()


routes.post('/subject', async (req, res) => {
    await subjectController.create(req, res);
});

routes.post('/room', async (req, res) => {
    await roomController.create(req,res)
});

routes.post('/video/:idRoom/create', async (req, res) => {
    await roomController.createVideo(req, res)
});

routes.post('/room/:idRoom/subject', async (req,res)=>{
    await roomController.roomSubject(req, res)
})

routes.post('/treinador', async (req,res)=>{
    await coachController.create(req,res)
})

routes.get('/treinador', async (req,res)=>{
    await coachController.listarCoaches(req,res)
})

routes.get('/treinador/:id', async (req,res)=>{
    await coachController.buscarCoachPorId(req,res)
})

routes.put('/treinador/:id', async (req,res)=>{
    await coachController.atualizarCoach(req,res)
})

routes.delete('/treinador/:id', async (req,res)=>{
    await coachController.deletarCoach(req,res)
})

//Rotas de jogadores

routes.post('/jogador', async (req,res)=>{
    await jogadorController.create(req,res)
})

routes.get('/jogador', async (req,res)=>{
    await jogadorController.listarJogadores(req,res)
})

routes.get('/jogador/:id', async (req,res)=>{
    await jogadorController.buscarJogadorPorId(req,res)
})

routes.put('/jogador/:id', async (req,res)=>{
    await jogadorController.atualizarJogador(req,res)
})

routes.delete('/jogador/:id', async (req,res)=>{
    await jogadorController.deletarJogador(req,res)
})

routes.get('/jogadores/disponiveis', async (req,res)=>{
    await jogadorController.listarJogadoresDisponiveis(req,res)
})


//Rotas de equipe

routes.post('/equipe', async (req,res)=>{
    await equipeController.create(req,res)
})

routes.get('/equipe', async (req,res)=>{
    await equipeController.listarEquipes(req,res)
})

routes.get('/equipe/:id', async (req,res)=>{
    await equipeController.buscarEquipePorId(req,res)
})

routes.put('/equipe/:id', async (req,res)=>{
    await equipeController.atualizarEquipe(req,res)
})

routes.delete('/equipe/:id', async (req,res)=>{
    await equipeController.deletarEquipe(req,res)
})




//Rotas de equipe jogador

routes.post('/equipe/:idEquipe/jogadores', async (req,res)=>{
    await equipeJogadorController.vincularEquipeJogador(req,res)
})

routes.put('/equipe/:idEquipe/jogadores', async (req,res)=>{
    await equipeJogadorController.desvincularEquipeJogador(req,res)
})


routes.put('/equipe/:idEquipe/jogadores/dorsal', async (req,res)=>{
    await equipeJogadorController.dorsalEquipeJogador(req,res)
})

routes.get('/equipe/:idEquipe/jogadores', async (req,res)=>{
    await equipeJogadorController.listarJogadoresEquipe(req,res)
})


routes.post('/equipe/gerenciar', async (req,res)=>{
    console.log('aaaaaaaaaaaaaa')
    await equipeJogadorController.gerenciarEquipe(req,res)
})





//Rotas de equipe treinador

routes.post('/equipe/:idEquipe/treinadores', async (req,res)=>{
    await equipeTreinadorController.vincularEquipeTreinado(req,res)
})

routes.put('/equipe/:idEquipe/treinadores', async (req,res)=>{
    await equipeTreinadorController.desvincularEquipeTreiandor(req,res)
})


routes.get('/equipe/:idEquipe/treinadores', async (req,res)=>{
    await equipeTreinadorController.listarTreinadoresEquipe(req,res)
})

//Rotas de torneio

routes.post('/torneio', async (req,res)=>{
    await torneioController.create(req,res)
})

routes.get('/torneio', async (req,res)=>{
    await torneioController.listarTorneio(req,res)
})

routes.get('/torneio/:id', async (req,res)=>{
    await torneioController.buscarTorneioPorId(req,res)
})

routes.put('/torneio/:id', async (req,res)=>{
    await torneioController.atualizarTorneio(req,res)
})

routes.delete('/torneio/:id', async (req,res)=>{
    await torneioController.deletarTorneio(req,res)
})

//Partida

routes.post('/partida/:idTorneio', async (req,res)=>{
    await partidaController.create(req,res)
})

routes.get('/partida', async (req,res)=>{
    await partidaController.listarPartida(req,res)
})

routes.get('/partida/:id', async (req,res)=>{
    await partidaController.buscarPartidaPorId(req,res)
})

routes.put('/partida/:id', async (req,res)=>{
    await partidaController.atualizarPartida(req,res)
})

routes.delete('/partida/:id', async (req,res)=>{
    await partidaController.deletarPartida(req,res)
})


routes.get('/paridaformatado/:id', async (req,res)=>{
    await partidaController.buscarPartidaFormatadaPorId(req,res)
})


//Equipe torneio

routes.post('/torneio/:idTorneio/equipes', async (req,res)=>{
    await equipeTorneioController.create(req,res)
})


//Arbitro



routes.post('/arbitro', async (req,res)=>{
    await arbitroController.create(req,res)
})

routes.get('/arbitro', async (req,res)=>{
    await arbitroController.listarArbitro(req,res)
})

routes.get('/arbitro/:id', async (req,res)=>{
    await arbitroController.buscarArbitroPorId(req,res)
})

routes.put('/arbitro/:id', async (req,res)=>{
    await arbitroController.atualizarArbitro(req,res)
})

routes.delete('/arbitro/:id', async (req,res)=>{
    await arbitroController.deletarArbitro(req,res)
})


//Quadra



routes.post('/quadra', async (req,res)=>{
    await quadraController.create(req,res)
})

routes.get('/quadra', async (req,res)=>{
    await quadraController.listarQuadra(req,res)
})

routes.get('/quadra/:id', async (req,res)=>{
    await quadraController.buscarQuadraPorId(req,res)
})

routes.put('/quadra/:id', async (req,res)=>{
    await quadraController.atualizarQuadra(req,res)
})

routes.delete('/quadra/:id', async (req,res)=>{
    await quadraController.deletarQuadra(req,res)
})



//PartidaArbitro



routes.post('/partida/:idPartida/arbitro', async (req,res)=>{
    await partidaArbitroController.create(req,res)
})

routes.get('/partida/:idPartida/arbitro', async (req,res)=>{
    await partidaArbitroController.listarArbditros(req,res)
})

routes.delete('/partida/:idPartida/arbitro', async (req,res)=>{
    await partidaArbitroController.delete(req,res)
})



//Gol

routes.post('/gol/:idPartida', async (req,res)=>{
    await golController.create(req,res)
})

routes.get('/gol/partida/:idPartida', async (req,res)=>{
    console.log(req.params)
    await golController.listarGol(req,res)
})

routes.get('/gol/:id', async (req,res)=>{
    await golController.buscaGolPorId(req,res)
})

routes.put('/gol/:id', async (req,res)=>{
    await golController.atualizarGol(req,res)
})

routes.delete('/gol/:id', async (req,res)=>{
    await golController.deletarGol(req,res)
})


//Finalizacao

routes.post('/finalizacao/:idPartida', async (req,res)=>{
    await finalizacaoController.create(req,res)
})

routes.get('/finalizacao/partida/:idPartida', async (req,res)=>{
    await finalizacaoController.listarFinalizacoes(req,res)
})

routes.get('/finalizacao/:id', async (req,res)=>{
    await finalizacaoController.buscaFinalizacaoPorId(req,res)
})

routes.put('/finalizacao/:id', async (req,res)=>{
    await finalizacaoController.atualizarFinalizacao(req,res)
})

routes.delete('/finalizacao/:id', async (req,res)=>{
    await finalizacaoController.deletarFinalizacao(req,res)
})



//drible

routes.post('/drible/:idPartida', async (req,res)=>{
    await dribleController.create(req,res)
})

routes.get('/drible/partida/:idPartida', async (req,res)=>{
    await dribleController.listarDribles(req,res)
})

routes.get('/drible/:id', async (req,res)=>{
    await dribleController.buscaDriblePorId(req,res)
})

routes.put('/drible/:id', async (req,res)=>{
    await dribleController.atualizarDrible(req,res)
})

routes.delete('/drible/:id', async (req,res)=>{
    await dribleController.deletarDrible(req,res)
})


//desarme

routes.post('/desarme/:idPartida', async (req,res)=>{
    await desarmeController.create(req,res)
})

routes.get('/desarme/partida/:idPartida', async (req,res)=>{
    await desarmeController.listarDesarme(req,res)
})

routes.get('/desarme/:id', async (req,res)=>{
    await desarmeController.buscaDesarmePorId(req,res)
})

routes.put('/desarme/:id', async (req,res)=>{
    await desarmeController.atualizarDesarme(req,res)
})

routes.delete('/desarme/:id', async (req,res)=>{
    await desarmeController.deletarDesarme(req,res)
})



//falta

routes.post('/falta/:idPartida', async (req,res)=>{
    await faltaController.create(req,res)
})

routes.get('/falta/partida/:idPartida', async (req,res)=>{
    await faltaController.listarFalta(req,res)
})

routes.get('/falta/:id', async (req,res)=>{
    await faltaController.buscaFaltaPorId(req,res)
})

routes.put('/falta/:id', async (req,res)=>{
    await faltaController.atualizarFalta(req,res)
})

routes.delete('/falta/:id', async (req,res)=>{
    await faltaController.deletarFalta(req,res)
})


//cartao

routes.post('/cartao/:idPartida', async (req,res)=>{
    await cartaoController.create(req,res)
})

routes.get('/cartao/partida/:idPartida', async (req,res)=>{
    await cartaoController.listarCartao(req,res)
})

routes.get('/cartao/:id', async (req,res)=>{
    await cartaoController.buscaCartaoPorId(req,res)
})

routes.put('/cartao/:id', async (req,res)=>{
    await cartaoController.atualizarCartao(req,res)
})

routes.delete('/cartao/:id', async (req,res)=>{
    await cartaoController.deletarCartao(req,res)
})


//Equipe partida 
routes.post('/partida/:idPartida/equipes', async (req,res)=>{
    await equipePartidaController.vincularEquipePartida(req,res)
})


//Torneio estatisticas
routes.get(`/estatisticas/torneio/:id`, async (req,res)=>{
    await estatisticasController.estatisticaTorneioGeral(req,res)
})

routes.get(`/estatisticas/torneio/finalizacao/:idTorneio/:idJogador`, async (req,res)=>{
    await estatisticasController.estatisticaTorneioFinalizacao(req,res)
})


routes.get(`/estatisticas/torneio/desarme/:idTorneio/:idJogador`, async (req,res)=>{
    await estatisticasController.estatisticaTorneioDesarme(req,res)
})
routes.get(`/estatisticas/torneio/drible/:idTorneio/:idJogador`, async (req,res)=>{
    await estatisticasController.estatisticaTorneioDrible(req,res)
})
routes.get(`/estatisticas/torneio/falta-cartao/:idTorneio/:idJogador`, async (req,res)=>{
    await estatisticasController.estatisticaTorneioFaltaCartao(req,res)
})

routes.get(`/estatisticas/torneio/gol/:idTorneio/:idJogador`, async (req,res)=>{
    await estatisticasController.estatisticaTorneioGol(req,res)
})

routes.get(`/estatisticas/torneio/assistencia/:idTorneio/:idJogador`, async (req,res)=>{
    await estatisticasController.estatisticaTorneioAssistencia(req,res)
})

routes.get(`/estatisticas/torneio/participacao-gol/:idTorneio/:idJogador`, async (req,res)=>{
    await estatisticasController.estatisticaTorneioParticipacaoEmGols(req,res)
})


routes.get(`/estatisticas/classificacao/:idTorneio`, async (req,res)=>{
    await estatisticasController.estatisticaTorneioClassificacao(req,res)
})

routes.get(`/estatisticas/artilharia/:idTorneio`, async (req,res)=>{
    await estatisticasController.estatisticaTorneioArtilharia(req,res)
})

routes.get(`/estatisticas/assistencia/:idTorneio`, async (req,res)=>{
    await estatisticasController.estatisticaTorneioAssistenciaAll(req,res)
})

//Estatística gerais
routes.get(`/estatisticas`, async (req,res)=>{
    await estatisticaGeralController.estatisticaGeral(req,res)
})

routes.get(`/estatisticas/finalizacao/:idJogador`, async (req,res)=>{
    await estatisticaGeralController.estatisticaGeralFinalizacao(req,res)
})


routes.get(`/estatisticas/desarme/:idJogador`, async (req,res)=>{
    await estatisticaGeralController.estatisticaGeralDesarme(req,res)
})


routes.get(`/estatisticas/drible/:idJogador`, async (req,res)=>{
    await estatisticaGeralController.estatisticaGeralDrible(req,res)
})

routes.get(`/estatisticas/falta-cartao/:idJogador`, async (req,res)=>{
    await estatisticaGeralController.estatisticaGeralFaltaCartao(req,res)
})


routes.get(`/estatisticas/gol/:idJogador`, async (req,res)=>{
    await estatisticaGeralController.estatisticaGeralGols(req,res)
})



routes.get(`/estatisticas/assistencia/:idJogador`, async (req,res)=>{
    await estatisticaGeralController.estatisticaGeralAssistencia(req,res)
})


routes.get(`/estatisticas/participacaogol/:idJogador`, async (req,res)=>{
    await estatisticaGeralController.estatisticaGeralParticipacaoGol(req,res)
})



export default routes