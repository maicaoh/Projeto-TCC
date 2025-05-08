import { ValidationError } from "yup";
import { Coach } from "../entities/Coach";
import { coachRepository } from "../repositories/coachRepository";
import { coachCreateSchema, coachUpdateSchema } from "../validations/coachSchema";
import { golCreateSchema, golUpdateSchema } from "../validations/golSchema";
import { Gol } from "../entities/Gol";
import { golRepository } from "../repositories/golRepository";
import { partidaRepository } from "../repositories/partidaRepository";
import { Finalizacao } from "../entities/Finalizacao";
import { finalizacaoRepository } from "../repositories/finalizacaoRepository";
import { Drible } from "../entities/Drible";
import { dribleCreateSchema, dribleUpdateSchema } from "../validations/dribleSchema";
import { dribleRepository } from "../repositories/dribleRepository";
import { Cartao } from "../entities/Cartao";
import { cartaoCreateSchema, cartaoUpdateSchema } from "../validations/cartaoSchema";
import { cartaoRepository } from "../repositories/cartaoRepository";
import { equipePartidaRepository } from "../repositories/equipePartidaRepository";
import { jogadorRepository } from "../repositories/jogadorRepository";
import { arbitroRepository } from "../repositories/arbitroRepository";
import { equipeRepository } from "../repositories/equipeRepository";
import { equipeJogadorRepository } from "../repositories/equipeJogadorRepository";
import { IsNull } from "typeorm";

export const criarCartao = async (idPartida: string, idJogador: string, idEquipe: string, idArbitro: string, cartao: Partial<Cartao>) => {
    try {
        await cartaoCreateSchema.validate(cartao, { abortEarly: false });

        cartao.createAt = new Date();
        cartao.isDeleted = false;
        cartao.updateAt = new Date();

        const partida = await partidaRepository.findOneBy({ id: idPartida, isDeleted: false })

        if (!partida) {
            return { erro: "Partida não encontrada", status: 404 }; // 404 Not Found
        }

        const equipePartida = await equipePartidaRepository.findOne({ where: [{ partidaId: idPartida, casaId: idEquipe }, { partidaId: idPartida, visitanteId: idEquipe }] })
        if (!equipePartida) {
            return { erro: "Dados inváidos1", status: 404 };
        }

        const arbitroPartida = await partidaRepository.findOne({ where: { id: idPartida, arbitro: { id: idArbitro } }, relations: ['arbitro'] })
        if (!arbitroPartida) {
            return { erro: "Dados inváidos2", status: 404 };
        }


           const equipeJogadorAutor = await equipeJogadorRepository.findOne({where:[{equipeId:idEquipe,jogadorId:idJogador, data_desligamento: IsNull()}]})
        
                if(!equipeJogadorAutor){
                    return { erro: "Dados inváidos3", status: 404 };
        
                }

        const arbitroFalta = await arbitroRepository.findOne({ where: { id: idArbitro, isDeleted: false } })
        const jogadorAutor = await jogadorRepository.findOne({ where: { id: idJogador, isDeleted: false } })

        if (!jogadorAutor || !arbitroFalta) {
            return { erro: "O(s) jogador e/ou árbitro estão desligado(s)", status: 404 };
        }

        const equipeJogador = await equipeRepository.findOne({ where: { id: idEquipe, isDeleted: false } })
        if (!equipeJogador) {
            return { erro: "Equipe não encontrada", status: 404 };
        }

        cartao.partida = partida
        cartao.arbitro = arbitroFalta
        cartao.equipe = equipeJogador
        cartao.jogador = jogadorAutor
        


        const newCartao = cartaoRepository.create(cartao);
        await cartaoRepository.save(newCartao);

        return { mensagem: "Cartão cadastrado com sucesso!", cartao: newCartao };
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

export const atualizarCartao = async (
    idCartao: string,
    idPartida: string,
    idJogador: string,
    idEquipe: string,
    idArbitro: string,
    cartao: Partial<Cartao>
  ) => {
    try {
      // 1) Verifica se o cartão existe
      const cartaoEncontrado = await cartaoRepository.findOne({
        where: { id: idCartao, isDeleted: false },
      });
      if (!cartaoEncontrado) {
        return { erro: "Cartão não encontrado", status: 404 };
      }
  
      // 2) Valida campos de atualização
      await cartaoUpdateSchema.validate(cartao, { abortEarly: false });
  
      // 3) Busca a partida
      const partida = await partidaRepository.findOneBy({
        id: idPartida,
        isDeleted: false,
      });
      if (!partida) {
        return { erro: "Partida não encontrada", status: 404 };
      }
  
      // 4) Confirma que a equipe participou da partida
      const equipePartida = await equipePartidaRepository.findOne({
        where: [
          { partidaId: idPartida, casaId: idEquipe },
          { partidaId: idPartida, visitanteId: idEquipe },
        ],
      });
      if (!equipePartida) {
        return { erro: "Dados inválidos (equipe na partida)", status: 404 };
      }
  
      // 5) Confirma que o árbitro está vinculado àquela partida
      const arbitroPartida = await partidaRepository.findOne({
        where: { id: idPartida, arbitro: { id: idArbitro } },
        relations: ["arbitro"],
      });
      if (!arbitroPartida) {
        return { erro: "Dados inválidos (árbitro na partida)", status: 404 };
      }
  
      // 6) Verifica vínculo ativo do jogador na equipe
      const equipeJogadorAutor = await equipeJogadorRepository.findOne({
        where: [
          {
            equipeId: idEquipe,
            jogadorId: idJogador,
            data_desligamento: IsNull(),
          },
        ],
      });
      if (!equipeJogadorAutor) {
        return { erro: "Dados inválidos (jogador na equipe)", status: 404 };
      }
  
      // 7) Busca registros de árbitro e jogador
      const arbitroRegistro = await arbitroRepository.findOne({
        where: { id: idArbitro, isDeleted: false },
      });
      const jogadorRegistro = await jogadorRepository.findOne({
        where: { id: idJogador, isDeleted: false },
      });
      if (!arbitroRegistro || !jogadorRegistro) {
        return {
          erro: "O(s) jogador e/ou árbitro estão desligado(s)",
          status: 404,
        };
      }
  
      // 8) Busca a equipe
      const equipeRegistro = await equipeRepository.findOne({
        where: { id: idEquipe, isDeleted: false },
      });
      if (!equipeRegistro) {
        return { erro: "Equipe não encontrada", status: 404 };
      }
  
      // 9) Aplica as novas relações e campos
      cartaoEncontrado.partida = partida;
      cartaoEncontrado.arbitro = arbitroRegistro;
      cartaoEncontrado.equipe = equipeRegistro;
      cartaoEncontrado.jogador = jogadorRegistro;
  
      cartaoEncontrado.descricao =
        cartao.descricao ?? cartaoEncontrado.descricao;
      cartaoEncontrado.tempo = cartao.tempo ?? cartaoEncontrado.tempo;
      cartaoEncontrado.tipo = cartao.tipo ?? cartaoEncontrado.tipo;
      cartaoEncontrado.updateAt = new Date();
  
      // 10) Persiste a atualização
      await cartaoRepository.save(cartaoEncontrado);
  
      return {
        mensagem: "Cartão atualizado com sucesso!",
        cartao: cartaoEncontrado,
      };
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

export const listarCartao = async (id: string) => {
    try {
        const allCartao = await cartaoRepository.find({
            where: { isDeleted: false,partida:{id:id} },
            relations: [
              "jogador",
              "partida",
              "arbitro",
              "equipe"
            ],
          });
        return { mensagem: "Cartões listados com sucesso!", cartao: allCartao };
    } catch (erro: unknown) {
        return { erro: "Erro ao listar cartões", status: 500 }; // 500 Internal Server Error
    }
};

export const buscarCartaoPorId = async (id: string) => {
    try {
        const cartao = await cartaoRepository.find({ where: { id: id, isDeleted: false } });
        return { mensagem: "Cartão encontrado com sucesso!", cartao: cartao };
    } catch (erro: unknown) {
        return { erro: "Erro ao buscar cartão", status: 500 }; // 500 Internal Server Error
    }
};


export const deletarCartao = async (id: string) => {
    try {

        const cartaoEncontrado = await cartaoRepository.findOneBy({ id, isDeleted: false })
        if (!cartaoEncontrado) {
            return { erro: "cartão não encontrado", status: 404 }; // 404 Not Found
        }

        await cartaoRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        })


        const cartaoDeletado = await cartaoRepository.findOneBy({ id });


        return { mensagem: "Cartão deletado com sucesso!", cartao: cartaoDeletado };

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