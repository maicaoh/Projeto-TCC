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
import { Falta } from "../entities/Falta";
import { faltaCreateSchema, faltaUpdateSchema } from "../validations/faltaSchema";
import { faltaRepository } from "../repositories/faltaRepository";
import { equipePartidaRepository } from "../repositories/equipePartidaRepository";
import { equipeJogadorRepository } from "../repositories/equipeJogadorRepository";
import { jogadorRepository } from "../repositories/jogadorRepository";
import { arbitroRepository } from "../repositories/arbitroRepository";
import { IsNull } from "typeorm";
import { equipeRepository } from "../repositories/equipeRepository";

export const criarFalta = async (idPartida: string, idJogadoraAutor: string, idJogadorSofreu: string, idEquipeAutor: string, idEquipeSofreu: string, idArbitro:string,falta: Partial<Falta>) => {
    try {
        await faltaCreateSchema.validate(falta, { abortEarly: false });

        falta.createAt = new Date();
        falta.isDeleted = false;
        falta.updateAt = new Date();

        const partida = await partidaRepository.findOneBy({ id: idPartida, isDeleted: false })

        if (!partida) {
            return { erro: "Partida não encontrada", status: 404 }; // 404 Not Found
        }



        const equipePartida = await equipePartidaRepository.findOne({ where: [{ partidaId: idPartida, casaId: idEquipeAutor, visitanteId: idEquipeSofreu }, { partidaId: idPartida, casaId: idEquipeSofreu, visitanteId: idEquipeAutor }] })
        if (!equipePartida) {
            return { erro: "Dados inváidos", status: 404 };
        }


        const equipeJogadorAutor = await equipeJogadorRepository.findOne({ where: [{ equipeId: idEquipeAutor, jogadorId: idJogadoraAutor,data_desligamento: IsNull() }] })

        if (!equipeJogadorAutor) {
            return { erro: "Dados inváidos1", status: 404 };

        }

        const equipeJogadorSofreu = await equipeJogadorRepository.findOne({ where: { equipeId: idEquipeSofreu, jogadorId: idJogadorSofreu, data_desligamento: IsNull() } })

        if (!equipeJogadorSofreu) {
            return { erro: "Dados inváidos2", status: 404 };

        }

      
        const arbitroPartida = await partidaRepository.findOne({ where: {id:idPartida,arbitro: {id : idArbitro}, isDeleted:false},relations:['arbitro'] })
        if (!arbitroPartida) {
            return { erro: "Dados inváidos3", status: 404 };
        }



        const jogadorAutorFalta = await jogadorRepository.findOne({ where: { id: idJogadoraAutor, isDeleted: false } })
        const jogadorSofreuFalta = await jogadorRepository.findOne({ where: { id: idJogadorSofreu, isDeleted: false } })
        const arbitroFalta = await arbitroRepository.findOne({ where: { id: idArbitro, isDeleted: false } })

        if (!jogadorAutorFalta || !jogadorSofreuFalta || !arbitroFalta) {
            return { erro: "O(s) jogadore(s) e/ou árbitro estão desligado(s)", status: 404 };
        }

        const equipeAutorFalta = await equipeRepository.findOne({ where: { id: idEquipeAutor, isDeleted: false } })

        if(!equipeAutorFalta){
            return { erro: "Equipe não encontrada!", status: 404 };

        }

        falta.partida = partida
        falta.arbitro = arbitroFalta
        falta.equipe = equipeAutorFalta
        falta.jogadorSofreu = jogadorSofreuFalta
        falta.jogadorAutor = jogadorAutorFalta
        



        const newFalta = faltaRepository.create(falta);
        await faltaRepository.save(newFalta);

        return { mensagem: "Falta cadastrada com sucesso!", falta: newFalta };
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

export const atualizarFalta = async (
  id: string,
  idPartida: string,
  idJogadoraAutor: string,
  idJogadorSofreu: string,
  idEquipeAutor: string,
  idEquipeSofreu: string,
  idArbitro: string,
  faltaData: Partial<Falta>
) => {
  try {
    // 1. Valida o payload de atualização
    await faltaUpdateSchema.validate(faltaData, { abortEarly: false });

    // 2. Busca a falta existente com todas as relações necessárias
    const faltaEntity = await faltaRepository.findOne({
      where: { id, isDeleted: false },
      relations: [
        "partida",
        "arbitro",
        "jogadorAutor",
        "jogadorSofreu",
        "equipe",
      ],
    });
    if (!faltaEntity) {
      return { erro: "Falta não encontrada", status: 404 };
    }

    // 3. Verifica se a partida existe e está vinculada ao árbitro
    const partida = await partidaRepository.findOne({
      where: { id: idPartida, isDeleted: false },
      relations: ["arbitro"],
    });
    if (!partida) {
      return { erro: "Partida não encontrada", status: 404 };
    }
    const arbitroNaPartida = partida.arbitro.find(a => a.id === idArbitro);
    if (!arbitroNaPartida) {
      return { erro: "Árbitro não escalado para esta partida", status: 404 };
    }

    // 4. Valida configuração de equipes na partida
    const equipePartida = await equipePartidaRepository.findOne({
      where: [
        { partidaId: idPartida, casaId: idEquipeAutor, visitanteId: idEquipeSofreu },
        { partidaId: idPartida, casaId: idEquipeSofreu, visitanteId: idEquipeAutor },
      ],
    });
    if (!equipePartida) {
      return { erro: "Dados de equipe da partida inválidos", status: 404 };
    }

    // 5. Verifica jogadores autor e sofrido ativos
    const equipeJogadorAutor = await equipeJogadorRepository.findOne({
      where: {
        equipeId: idEquipeAutor,
        jogadorId: idJogadoraAutor,
        data_desligamento: IsNull(),
      },
    });
    if (!equipeJogadorAutor) {
      return { erro: "Autor da falta inválido", status: 404 };
    }

    const equipeJogadorSofreu = await equipeJogadorRepository.findOne({
      where: {
        equipeId: idEquipeSofreu,
        jogadorId: idJogadorSofreu,
        data_desligamento: IsNull(),
      },
    });
    if (!equipeJogadorSofreu) {
      return { erro: "Jogador sofrendo falta inválido", status: 404 };
    }

    // 6. Verifica existência de jogadores e árbitro não deletados
    const jogadorAutorFalta = await jogadorRepository.findOne({
      where: { id: idJogadoraAutor, isDeleted: false },
    });
    const jogadorSofreuFalta = await jogadorRepository.findOne({
      where: { id: idJogadorSofreu, isDeleted: false },
    });
    const arbitroFalta = await arbitroRepository.findOne({
      where: { id: idArbitro, isDeleted: false },
    });
    if (!jogadorAutorFalta || !jogadorSofreuFalta || !arbitroFalta) {
      return {
        erro: "Jogadores e/ou árbitro inválidos ou removidos",
        status: 404,
      };
    }

    // 7. Verifica equipe autora da falta
    const equipeAutorFalta = await equipeRepository.findOne({
      where: { id: idEquipeAutor, isDeleted: false },
    });
    if (!equipeAutorFalta) {
      return { erro: "Equipe autora da falta não encontrada", status: 404 };
    }

    // 8. Atualiza campos relacionais
    faltaEntity.partida = partida;
    faltaEntity.arbitro = arbitroFalta;
    faltaEntity.equipe = equipeAutorFalta;
    faltaEntity.jogadorAutor = jogadorAutorFalta;
    faltaEntity.jogadorSofreu = jogadorSofreuFalta;

    // 9. Atualiza campos de dados da falta
    faltaEntity.posicaoCampo =
      faltaData.posicaoCampo ?? faltaEntity.posicaoCampo;
    faltaEntity.tempo = faltaData.tempo ?? faltaEntity.tempo;
    faltaEntity.tipo = faltaData.tipo ?? faltaEntity.tipo;
    faltaEntity.updateAt = new Date();

    // 10. Persiste alterações
    await faltaRepository.save(faltaEntity);

    // 11. Retorna a falta atualizada
    return {
      mensagem: "Falta atualizada com sucesso!",
      falta: faltaEntity,
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


export const listarFaltas = async (id:string) => {
    try {
        const allFaltas = await faltaRepository.find({
            where: { isDeleted: false,partida:{id:id} },
            relations: [
              "jogadorAutor",
              "jogadorSofreu",
              "arbitro",
              "partida",
              "equipe"
            ],
          });
        return { mensagem: "Falta(s) listada(s) com sucesso!", falta: allFaltas };
    } catch (erro: unknown) {
        return { erro: "Erro ao listar faltas", status: 500 }; // 500 Internal Server Error
    }
};

export const buscarFaltaPorId = async (id: string) => {
    try {
        const falta = await faltaRepository.find({ where: { id: id, isDeleted: false } });
        return { mensagem: "Falta encontrada com sucesso!", falta: falta };
    } catch (erro: unknown) {
        return { erro: "Erro ao buscar falta", status: 500 }; // 500 Internal Server Error
    }
};


export const deletarFalta = async (id: string) => {
    try {

        const faltaEncontrada = await faltaRepository.findOneBy({ id, isDeleted: false })
        if (!faltaEncontrada) {
            return { erro: "falta não encontrada", status: 404 }; // 404 Not Found
        }

        await faltaRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        })


        const faltaDeletada = await faltaRepository.findOneBy({ id });


        return { mensagem: "Falta deletada com sucesso!", falta: faltaDeletada };

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