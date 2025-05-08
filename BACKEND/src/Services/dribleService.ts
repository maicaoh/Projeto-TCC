import { ValidationError } from "yup";
import { Coach } from "../entities/Coach";
import { coachRepository } from "../repositories/coachRepository";
import { coachCreateSchema, coachUpdateSchema } from "../validations/coachSchema";
import { golCreateSchema, golUpdateSchema } from "../validations/golSchema";
import { Gol } from "../entities/Gol";
import { golRepository } from "../repositories/golRepository";
import { partidaRepository } from "../repositories/partidaRepository";
import { Finalizacao } from "../entities/Finalizacao";
import { finalizacaoCreateSchema } from "../validations/finalizacaoSchema";
import { finalizacaoRepository } from "../repositories/finalizacaoRepository";
import { Drible } from "../entities/Drible";
import { dribleCreateSchema, dribleUpdateSchema } from "../validations/dribleSchema";
import { dribleRepository } from "../repositories/dribleRepository";
import { equipePartidaRepository } from "../repositories/equipePartidaRepository";
import { equipeJogadorRepository } from "../repositories/equipeJogadorRepository";
import { jogadorRepository } from "../repositories/jogadorRepository";
import { IsNull } from "typeorm";
import { equipeRepository } from "../repositories/equipeRepository";

export const criarDrible = async (idPartida: string, idJogador: string, idDefensor: string, idEquipe: string, idEquipeDefensor: string, drible: Partial<Drible>) => {
    
    try {
        await dribleCreateSchema.validate(drible, { abortEarly: false });

        drible.createAt = new Date();
        drible.isDeleted = false;
        drible.updateAt = new Date();
        drible.desarme = !drible.sucesso

        const partida = await partidaRepository.findOneBy({ id: idPartida, isDeleted: false })

        if (!partida) {
            return { erro: "Partida não encontrada", status: 404 }; // 404 Not Found
        }

        const equipePartida = await equipePartidaRepository.findOne({ where: [{ partidaId: idPartida, casaId: idEquipe, visitanteId: idEquipeDefensor }, { partidaId: idPartida, casaId: idEquipeDefensor, visitanteId: idEquipe }] })
        if (!equipePartida) {
            return { erro: "Dados inváidos1", status: 404 };
        }

        console.log(idEquipe)
        console.log(idJogador)
        const equipeJogadorAutor = await equipeJogadorRepository.findOne({ where: [{ equipeId: idEquipe, jogadorId: idJogador,data_desligamento: IsNull() }] })
        console.log(equipeJogadorAutor)
        if (!equipeJogadorAutor) {
            return { erro: "Dados inváidos2", status: 404 };

        }

        const equipeJogadorDefensor = await equipeJogadorRepository.findOne({ where: { equipeId: idEquipeDefensor, jogadorId: idDefensor,data_desligamento: IsNull()  } })

        if (!equipeJogadorDefensor) {
            return { erro: "Dados inváidos3", status: 404 };

        }


        const jogadorAtacante = await jogadorRepository.findOne({ where: { id: idJogador, isDeleted: false } })
        const jogadorDefensor = await jogadorRepository.findOne({ where: { id: idDefensor, isDeleted: false } })

        if (!jogadorAtacante || !jogadorDefensor) {
            return { erro: "O(s) jogadore(s) estão desligado(s)", status: 404 };
        }

        const equipeJogador = await equipeRepository.findOne({where:[{id: idEquipe,isDeleted:false}]})

        if (!equipeJogador) {
            return { erro: "Equipe não encontrada", status: 404 };
        }

        drible.partida = partida
        drible.jogadorAtacante = jogadorAtacante
        drible.jogadorDefensor = jogadorDefensor
        drible.equipe =  equipeJogador


        const newDrible = dribleRepository.create(drible);
        await dribleRepository.save(newDrible);

        return { mensagem: "Drible cadastrado com sucesso!", drible: newDrible };
    } catch (erro: unknown) {
        if (erro instanceof ValidationError) {
            return { erro: erro.errors, status: 400 }; // 400 Bad Request
        }

        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }

        return { erro: "Erro interno no servidor", status: 500 }; // 500 Internal Server Error
    }
};

export const atualizarDrible = async (
    idDrible: string,
    idPartida: string,
    idJogador: string,
    idDefensor: string,
    idEquipe: string,
    idEquipeDefensor: string,
    dribleUpdates: Partial<Drible>
  ) => {
    try {
        await dribleUpdateSchema.validate(dribleUpdates, { abortEarly: false });

      // 1. Verifica existência do drible
      const dribleEncontrado = await dribleRepository.findOne({
        where: { id: idDrible, isDeleted: false },
      });
      if (!dribleEncontrado) {
        return { erro: "Drible não encontrado", status: 404 };
      }
  
      // 2. Valida payload de atualização
      await dribleUpdateSchema.validate(dribleUpdates, { abortEarly: false });
  
      // 3. Busca entidades relacionadas (mesmo fluxo de criar)
      const partida = await partidaRepository.findOneBy({
        id: idPartida,
        isDeleted: false,
      });
      if (!partida) {
        return { erro: "Partida não encontrada", status: 404 };
      }
  
      const equipePartida = await equipePartidaRepository.findOne({
        where: [
          { partidaId: idPartida, casaId: idEquipe, visitanteId: idEquipeDefensor },
          { partidaId: idPartida, casaId: idEquipeDefensor, visitanteId: idEquipe },
        ],
      });
      if (!equipePartida) {
        return { erro: "Dados inválidos (equipe na partida)", status: 404 };
      }
  
      const equipeJogadorAutor = await equipeJogadorRepository.findOne({
        where: {
          equipeId: idEquipe,
          jogadorId: idJogador,
          data_desligamento: IsNull(),
        },
      });
      if (!equipeJogadorAutor) {
        return { erro: "Jogador autor inválido para a equipe", status: 404 };
      }
  
      const equipeJogadorDefensor = await equipeJogadorRepository.findOne({
        where: {
          equipeId: idEquipeDefensor,
          jogadorId: idDefensor,
          data_desligamento: IsNull(),
        },
      });
      if (!equipeJogadorDefensor) {
        return { erro: "Jogador defensor inválido para a equipe", status: 404 };
      }
  
      const jogadorAtacante = await jogadorRepository.findOne({
        where: { id: idJogador, isDeleted: false },
      });
      const jogadorDefensor = await jogadorRepository.findOne({
        where: { id: idDefensor, isDeleted: false },
      });
      if (!jogadorAtacante || !jogadorDefensor) {
        return { erro: "O(s) jogadore(s) estão desligado(s)", status: 404 };
      }
  
      const equipe = await equipeRepository.findOne({
        where: { id: idEquipe, isDeleted: false },
      });
      if (!equipe) {
        return { erro: "Equipe não encontrada", status: 404 };
      }
  
      // 4. Aplica as atualizações no objeto encontrado
      dribleEncontrado.posicaoCampo = dribleUpdates.posicaoCampo ?? dribleEncontrado.posicaoCampo;
      dribleEncontrado.pe = dribleUpdates.pe ?? dribleEncontrado.pe;
      dribleEncontrado.sucesso = dribleUpdates.sucesso ?? dribleEncontrado.sucesso;
      dribleEncontrado.desarme = !dribleEncontrado.sucesso;
      dribleEncontrado.tempo = dribleUpdates.tempo ?? dribleEncontrado.tempo;
      dribleEncontrado.updateAt = new Date();
  
      // 5. Reatribui relacionamentos (caso tenham mudado)
      dribleEncontrado.partida = partida;
      dribleEncontrado.jogadorAtacante = jogadorAtacante;
      dribleEncontrado.jogadorDefensor = jogadorDefensor;
      dribleEncontrado.equipe = equipe;
  
      // 6. Salva entidade atualizada
      await dribleRepository.save(dribleEncontrado);
  
      return { mensagem: "Drible atualizado com sucesso!", drible: dribleEncontrado };
    } catch (erro: unknown) {
      if (erro instanceof ValidationError) {
        return { erro: erro.errors, status: 400 };
      }
      if (erro instanceof Error) {
        return { erro: erro.message, status: 500 };
      }
      return { erro: "Erro interno no servidor", status: 500 };
    }
  };
  

export const listarDrible = async (idPartida:string) => {
    try {
        const allDrible = await dribleRepository.find({
            where: { isDeleted: false,partida:{id:idPartida} },
            relations: [
              "jogadorAtacante",
              "jogadorDefensor",
              "partida",
              "equipe"
            ],
          });
        return { mensagem: "Drible listados com sucesso!", drible: allDrible };
    } catch (erro: unknown) {
        return { erro: "Erro ao listar dribles", status: 500 }; // 500 Internal Server Error
    }
};

export const buscarDriblePorId = async (id: string) => {
    try {
        const drible = await dribleRepository.find({ where: { id: id, isDeleted: false } });
        return { mensagem: "Drible encontrado com sucesso!", drible: drible };
    } catch (erro: unknown) {
        return { erro: "Erro ao buscar drible", status: 500 }; // 500 Internal Server Error
    }
};


export const deletarDrible = async (id: string) => {
    try {

        const dribleEncontrada = await dribleRepository.findOneBy({ id, isDeleted: false })
        if (!dribleEncontrada) {
            return { erro: "drible não encontrado", status: 404 }; // 404 Not Found
        }

        await dribleRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        })


        const dribleDeletada = await dribleRepository.findOneBy({ id });


        return { mensagem: "Drible deletado com sucesso!", drible: dribleDeletada };

    } catch (erro: unknown) {
        if (erro instanceof ValidationError) {
            return { erro: erro.errors, status: 400 }; // 400 Bad Request
        }

        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }

        return { erro: "Erro interno no servidor", status: 500 }; // 500 Internal Server Error
    }
};