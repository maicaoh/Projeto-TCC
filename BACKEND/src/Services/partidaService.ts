import { ValidationError } from "yup";
import { Coach } from "../entities/Coach";
import { coachRepository } from "../repositories/coachRepository";
import { coachCreateSchema, coachUpdateSchema } from "../validations/coachSchema";
import { Partida } from "../entities/Partida";
import { partidaCreateSchema, partidaUpdateSchema } from "../validations/partidaSchema";
import { partidaRepository } from "../repositories/partidaRepository";
import { torneioRepository } from "../repositories/torneioRepository";
import { quadraRepository } from "../repositories/quadraRepository";
import { equipeJogadorRepository } from "../repositories/equipeJogadorRepository";
import { Equipe_Jogador } from "../entities/Equipe_Jogador";
import { In, IsNull } from "typeorm";
import { golRepository } from "../repositories/golRepository";
import { arbitroRepository } from "../repositories/arbitroRepository";
import { Arbitro } from "../entities/Arbitro";


interface partidaType {
    idQuadra: string,
    publicoPresente: number,
    data: Date, 
    status: number,
    arbitroIds: string[]
}

export const criarPartida = async (idTorneio:string,data: partidaType) => {
    try {

        const {idQuadra,publicoPresente} = data
        await partidaCreateSchema.validate(data, { abortEarly: false });

        const torneio = await torneioRepository.findOneBy({id:idTorneio,isDeleted:false})
        
        const quadra = idQuadra ?  await quadraRepository.findOneBy({id:idQuadra,isDeleted:false}) : null


        if(!torneio){
            return { erro: "Torneio não encontrado", status: 404 }; // 404 Not Found 
        }

        if(!quadra && idQuadra){
            return { erro: "Quadra não encontrada", status: 404 }; // 404 Not Found 

        }


        const newPartida = partidaRepository.create(data);
        newPartida.createAt = new Date();
        newPartida.isDeleted = false;
        newPartida.updateAt = new Date();
        newPartida.torneio = torneio;
        newPartida.publicoPresente = publicoPresente

        if(quadra){
            newPartida.quadra = quadra
        }
        await partidaRepository.save(newPartida);

        return { mensagem: "Partida cadastrada com sucesso!", partida: newPartida };
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


export const atualizarPartida = async (
    id: string,
    partida: Partial<partidaType>
  ) => {
    try {
      await partidaUpdateSchema.validate(partida, { abortEarly: false });
  
      const { idQuadra, publicoPresente, data, status, arbitroIds } = partida;
  
      // 1. Carrega a Partida com árbitros atuais
      const partidaEntity = await partidaRepository.findOne({
        where: { id, isDeleted: false },
        relations: ["arbitro"],
      });
      if (!partidaEntity) {
        return { erro: "Partida não encontrada", status: 404 };
      }
  
      // 2. Atualiza quadra
      if (idQuadra) {
        const quadraEncontrada = await quadraRepository.findOneBy({
          id: idQuadra,
          isDeleted: false,
        });
        if (!quadraEncontrada) {
          return { erro: "Quadra não encontrada", status: 404 };
        }
        partidaEntity.quadra = quadraEncontrada;
      }
  
      // 3. Campos simples
      if (publicoPresente !== undefined) {
        partidaEntity.publicoPresente = publicoPresente;
      }
      if (data) {
        partidaEntity.data = data;
      }
      if (status || status == 0) {
        partidaEntity.status = status;
      }
      partidaEntity.updateAt = new Date();
  
      // 4. Substitui completamente os árbitros via atribuição + save()
      if (Array.isArray(arbitroIds)) {
        const novosArbitros: Arbitro[] = arbitroIds.length
          ? await arbitroRepository.find({
              where: { id: In(arbitroIds), isDeleted: false },
            })
          : [];
        // ao atribuir esse array, o TypeORM vai: 
        //  - remover as entradas antigas na join table 
        //  - inserir apenas as novas
        partidaEntity.arbitro = novosArbitros;
      }
  
      // 5. Salva tudo de uma vez (campos + relação M2M)
      await partidaRepository.save(partidaEntity);
  
      // 6. Retorna a partida atualizada
      const partidaAtualizada = await partidaRepository.findOne({
        where: { id },
        relations: ["quadra", "arbitro"],
      });
  
      return {
        mensagem: "Partida atualizada com sucesso!",
        partida: partidaAtualizada,
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


export const listarPartidas = async () => {
    try {
        const allPartidas = await partidaRepository.find({where:{isDeleted:false}});
        return { mensagem: "Partidas listadas com sucesso!", partidas: allPartidas };
    } catch (erro: unknown) {
        console.log(erro)
        return { erro: "Erro ao listar partidas", status: 500 }; // 500 Internal Server Error
    }
};

export const buscarPartidaPorId = async (id: string) => {
    try {
        const partida = await partidaRepository.findOne({ where:{id:id,isDeleted:false}, relations:["torneio"] });

        if (!partida) {
            return { erro: "Partida não encontrada", status: 404 }; // 404 Not Found
        }

        return { mensagem: "Partida encontrada com sucesso!", partida };
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


export const deletarPartida = async (id: string) => {
    try {

        const partidaUpdate = await partidaRepository.findOneBy({id,isDeleted:false})
        if (!partidaUpdate) {
          
            return { erro: "Partida não encontrada", status: 404 }; // 404 Not Found
        }
        

        await partidaRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        })


        const partidaDeletada = await partidaRepository.findOneBy({ id });


        return { mensagem: "Partida deletada com sucesso!", partida: partidaDeletada };

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

export const buscarPartidaFormatadaPorId = async (id: string) => {
    try {
      const partida = await partidaRepository.findOne({
        where: { id },
        relations: [
          'quadra',
          'equipePartida',
          'equipePartida.casa',
          'equipePartida.visitante',
          'arbitro',                      // adiciona relação de árbitros
        ],
      });
  
      if (!partida) {
        return { erro: "Partida não encontrada", status: 404 };
      }
  
      const equipeCasa = partida.equipePartida?.find(ep => ep.partidaId === partida.id)?.casa;
      const equipeVisitante = partida.equipePartida?.find(ep => ep.partidaId === partida.id)?.visitante;
  
      // Buscar jogadores ativos de cada equipe
      const jogadoresCasa = equipeCasa
        ? await equipeJogadorRepository.find({
            where: {
              equipe: { id: equipeCasa.id },
              data_desligamento: IsNull(),
              jogador: { isDeleted: false },
            },
            relations: ['jogador'],
          })
        : [];
  
      const jogadoresVisitante = equipeVisitante
        ? await equipeJogadorRepository.find({
            where: {
              equipe: { id: equipeVisitante.id },
              data_desligamento: IsNull(),
              jogador: { isDeleted: false },
            },
            relations: ['jogador'],
          })
        : [];
  
      const formatarJogador = (ej: any) => ({
        id: ej.jogador.id,
        name: ej.jogador.name,
        apelido: ej.jogador.apelido,
        foto: ej.jogador.foto,
        posicao: ej.jogador.posicao,
        peDominante: ej.jogador.peDominante,
        altura: ej.jogador.altura,
        dorsal: ej.dorsal,
        capitao: ej.capitao,
      });
  
      // Buscar e contar gols da partida
      const gols = await golRepository.find({
        where: { partida: { id }, isDeleted: false },
        relations: ['equipe'],
      });
  
      let golsCasa = 0;
      let golsVisitante = 0;
      gols.forEach(gol => {
        if (!equipeCasa || !equipeVisitante) return;
  
        if (!gol.golContra) {
          if (gol.equipe.id === equipeCasa.id) golsCasa++;
          if (gol.equipe.id === equipeVisitante.id) golsVisitante++;
        } else {
          if (gol.equipe.id === equipeCasa.id) golsVisitante++;
          if (gol.equipe.id === equipeVisitante.id) golsCasa++;
        }
      });
  
      // Formata árbitros
      const arbitrosFormatados = partida.arbitro?.map(a => ({
        id: a.id,
        name: a.name,
        apelido: a.apelido,
        foto: a.foto,
        email: a.email,
        telefone: a.telefone,
      })) ?? [];
  
      const partidaFormatada = {
        id: partida.id,
        data: partida.data,
        rodada: partida.rodada,
        status: partida.status,
        publicoPresente: partida.publicoPresente,
        quadra: partida.quadra
          ? {
              id: partida.quadra.id,
              name: partida.quadra.name,
              endereco: partida.quadra.endereco,
              telefone: partida.quadra.telefone,
              piso: partida.quadra.piso,
              comprimento: partida.quadra.comprimento,
              largura: partida.quadra.largura,
              responsavel: partida.quadra.responsavel,
            }
          : null,
  
        equipeCasa: equipeCasa
          ? {
              id: equipeCasa.id,
              name: equipeCasa.name,
              logo: equipeCasa.logo,
              telefone: equipeCasa.telefone,
              endereco: equipeCasa.endereco,
              jogadores: jogadoresCasa.map(formatarJogador),
              golsMarcados: golsCasa,
            }
          : null,
  
        equipeVisitante: equipeVisitante
          ? {
              id: equipeVisitante.id,
              name: equipeVisitante.name,
              logo: equipeVisitante.logo,
              telefone: equipeVisitante.telefone,
              endereco: equipeVisitante.endereco,
              jogadores: jogadoresVisitante.map(formatarJogador),
              golsMarcados: golsVisitante,
            }
          : null,
  
        arbitros: arbitrosFormatados,  // <-- inclui árbitros aqui
      };
  
      return { mensagem: "Partida encontrada com sucesso!", partida: partidaFormatada };
    } catch (erro: unknown) {
      if (erro instanceof Error) {
        return { erro: erro.message, status: 500 };
      }
      return { erro: "Erro interno no servidor", status: 500 };
    }
  }





