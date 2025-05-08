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
import { Desarme } from "../entities/Desarme";
import { desarmeCreateSchema, desarmeUpdateSchema } from "../validations/desarmeSchema";
import { desarmeRepository } from "../repositories/desarmeRepository";
import { equipePartidaRepository } from "../repositories/equipePartidaRepository";
import { equipeJogadorRepository } from "../repositories/equipeJogadorRepository";
import { jogadorRepository } from "../repositories/jogadorRepository";
import { IsNull } from "typeorm";
import { equipeRepository } from "../repositories/equipeRepository";

export const criarDesarme = async (idPartida: string, idJogador: string, idDefensor: string, idEquipe: string, idEquipeDefensor: string, desarme: Partial<Desarme>) => {
    try {
        await desarmeCreateSchema.validate(desarme, { abortEarly: false });

        desarme.createAt = new Date();
        desarme.isDeleted = false;
        desarme.updateAt = new Date();

        const partida = await partidaRepository.findOneBy({ id: idPartida, isDeleted: false })

        if (!partida) {
            return { erro: "Partida não encontrada", status: 404 }; // 404 Not Found
        }


        const equipePartida = await equipePartidaRepository.findOne({ where: [{ partidaId: idPartida, casaId: idEquipe, visitanteId: idEquipeDefensor }, { partidaId: idPartida, casaId: idEquipeDefensor, visitanteId: idEquipe }] })
        if (!equipePartida) {
            return { erro: "Dados inváidos1", status: 404 };
        }


        const equipeJogadorAutor = await equipeJogadorRepository.findOne({ where: [{ equipeId: idEquipe, jogadorId: idJogador, data_desligamento: IsNull() }] })

        if (!equipeJogadorAutor) {
            return { erro: "Dados inváidos2", status: 404 };

        }

        const equipeJogadorDefensor = await equipeJogadorRepository.findOne({ where: { equipeId: idEquipeDefensor, jogadorId: idDefensor, data_desligamento: IsNull()  } })

        if (!equipeJogadorDefensor) {
            return { erro: "Dados inváidos3", status: 404 };

        }


        const jogadorAtacante = await jogadorRepository.findOne({ where: { id: idJogador, isDeleted: false } })
        const jogadorDefensor = await jogadorRepository.findOne({ where: { id: idDefensor, isDeleted: false } })

        if (!jogadorAtacante || !jogadorDefensor) {
            return { erro: "O(s) jogadore(s) estão desligado(s)", status: 404 };
        }

        const equipeDesarmante = await equipeRepository.findOne({where:{id: equipeJogadorDefensor.equipeId, isDeleted: false }})

        if(!equipeDesarmante){
            return { erro: "Equipe do denfensor inválida!", status: 404 };

        }

        desarme.partida = partida
        desarme.jogadorDesarmado = jogadorAtacante
        desarme.jogadorDesarme = jogadorDefensor
        desarme.equipe = equipeDesarmante
        


        const newDesarme = desarmeRepository.create(desarme);
        await desarmeRepository.save(newDesarme);

        return { mensagem: "Desarme cadastrado com sucesso!", desarme: newDesarme };
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



export const atualizarDesarme = async (
  id: string,
  idJogador: string,
  idDefensor: string,
  idEquipe: string,
  idEquipeDefensor: string,
  desarme: Partial<Desarme>
) => {
  try {
    // 1. Fetch existing record
    const desarmeEncontrado = await desarmeRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['partida']
    });
    if (!desarmeEncontrado) {
      return { erro: 'Desarme não encontrado', status: 404 };
    }

    // 2. Validate payload
    await desarmeUpdateSchema.validate(desarme, { abortEarly: false });

    const partida = desarmeEncontrado.partida;

    // 3. Verify that the equipes belong to the same partida
    const equipePartida = await equipePartidaRepository.findOne({
      where: [
        { partidaId: partida.id, casaId: idEquipe, visitanteId: idEquipeDefensor },
        { partidaId: partida.id, casaId: idEquipeDefensor, visitanteId: idEquipe }
      ]
    });
    if (!equipePartida) {
      return { erro: 'Dados inválidos para as equipes na partida', status: 404 };
    }

    // 4. Verify that the autor jogador still belongs to their equipe
    const equipeJogadorAutor = await equipeJogadorRepository.findOne({
      where: {
        equipeId: idEquipe,
        jogadorId: idJogador,
        data_desligamento: IsNull()
      }
    });
    if (!equipeJogadorAutor) {
      return { erro: 'Dados inválidos para o jogador autor', status: 404 };
    }

    // 5. Verify that the defensor jogador still belongs to their equipe
    const equipeJogadorDefensor = await equipeJogadorRepository.findOne({
      where: {
        equipeId: idEquipeDefensor,
        jogadorId: idDefensor,
        data_desligamento: IsNull()
      }
    });
    if (!equipeJogadorDefensor) {
      return { erro: 'Dados inválidos para o jogador defensor', status: 404 };
    }

    // 6. Fetch the actual player entities
    const jogadorAtacante = await jogadorRepository.findOne({
      where: { id: idJogador, isDeleted: false }
    });
    const jogadorDefensor = await jogadorRepository.findOne({
      where: { id: idDefensor, isDeleted: false }
    });
    if (!jogadorAtacante || !jogadorDefensor) {
      return { erro: 'O(s) jogadore(s) estão desligado(s)', status: 404 };
    }

    // 7. Fetch defending team entity
    const equipeDesarmante = await equipeRepository.findOne({
      where: { id: equipeJogadorDefensor.equipeId, isDeleted: false }
    });
    if (!equipeDesarmante) {
      return { erro: 'Equipe do defensor inválida!', status: 404 };
    }

    // 8. Apply relationship updates
    desarmeEncontrado.jogadorDesarmado = jogadorAtacante;
    desarmeEncontrado.jogadorDesarme = jogadorDefensor;
    desarmeEncontrado.equipe = equipeDesarmante;

    // 9. Apply field updates (using null/undefined checks)
    if (desarme.periodo !== undefined) {
      desarmeEncontrado.periodo = desarme.periodo;
    }
    if (desarme.posicaoCampo !== undefined) {
      desarmeEncontrado.posicaoCampo = desarme.posicaoCampo;
    }
    if (desarme.pe !== undefined) {
      desarmeEncontrado.pe = desarme.pe;
    }
    if (desarme.sucesso !== undefined) {
      desarmeEncontrado.sucesso = desarme.sucesso;
    }
    if (desarme.tempo !== undefined) {
      desarmeEncontrado.tempo = desarme.tempo;
    }

    // 10. Update timestamp
    desarmeEncontrado.updateAt = new Date();

    // 11. Save and return
    const desarmeAtualizado = await desarmeRepository.save(desarmeEncontrado);
    return {
      mensagem: 'Desarme atualizado com sucesso!',
      desarme: desarmeAtualizado
    };
  } catch (erro: unknown) {
    if (erro instanceof ValidationError) {
      return { erro: erro.errors, status: 400 };
    }
    if (erro instanceof Error) {
      return { erro: erro.message, status: 500 };
    }
    return { erro: 'Erro interno no servidor', status: 500 };
  }
};


export const listarDesarme = async (idPartida:string) => {
    try {
        const allDesarme = await desarmeRepository.find({
            where: { isDeleted: false,partida:{id:idPartida} },
            relations: [
              "jogadorDesarme",
              "jogadorDesarmado",
              "partida",
              "equipe"
            ],
          });
        return { mensagem: "Desarme listados com sucesso!", desarme: allDesarme };
    } catch (erro: unknown) {
        return { erro: "Erro ao listar desarmes", status: 500 }; // 500 Internal Server Error
    }
};

export const buscarDesarmePorId = async (id: string) => {
    try {
        const desarme = await desarmeRepository.find({ where: { id: id, isDeleted: false } });
        return { mensagem: "Desarme encontrado com sucesso!", desarme: desarme };
    } catch (erro: unknown) {
        return { erro: "Erro ao buscar drible", status: 500 }; // 500 Internal Server Error
    }
};


export const deletarDesarme = async (id: string) => {
    try {

        const desarmeEncontrada = await desarmeRepository.findOneBy({ id, isDeleted: false })
        if (!desarmeEncontrada) {
            return { erro: "desarme não encontrado", status: 404 }; // 404 Not Found
        }

        await desarmeRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        })


        const desarmeDeletado = await desarmeRepository.findOneBy({ id });


        return { mensagem: "Desarme deletado com sucesso!", desarme: desarmeDeletado };

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