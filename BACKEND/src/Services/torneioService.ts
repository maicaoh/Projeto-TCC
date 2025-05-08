import { ValidationError } from "yup";
import { Jogador } from "../entities/Jogador";
import { jogadorRepository } from "../repositories/jogadorRepository";
import { jogadorCreateSchema,jogadorUpdateSchema } from "../validations/jogadorSchema";
import { Torneio } from "../entities/Torneio";
import { atualizarTorneioSchema, torneioCreateSchema } from "../validations/torneioSchema";
import { torneioRepository } from "../repositories/torneioRepository";
import { Equipe } from "../entities/Equipe";
import { StatusTorneio, TipoTorneio } from "../Utils/enums/enums";
import { Partida } from "../entities/Partida";
import { quadraRepository } from "../repositories/quadraRepository";
import { partidaRepository } from "../repositories/partidaRepository";
import { Equipe_Partida } from "../entities/Equipe_Partida";
import { equipePartidaRepository } from "../repositories/equipePartidaRepository";
import { golRepository } from "../repositories/golRepository";
import { In } from "typeorm";

interface TorneioSave{
    confrontos : {
        data?: Date | null,
        mandante: Equipe,
        quadra?: string | null,
        visitante: Equipe,
        rodada: number
    }[],
        name: string
        status: StatusTorneio;
        tipo: TipoTorneio;
        foto?: string;
        edicao: string;
        equipes: Equipe[]
}



export const criarTorneio = async (torneioSave: Partial<TorneioSave>) => {
    try {
      const torneio = new Torneio();
      torneio.name = torneioSave.name || '';
      torneio.createAt = new Date();
      torneio.updateAt = new Date();
      torneio.isDeleted = false;
      torneio.edicao = torneioSave.edicao || '';
      torneio.foto = torneioSave.foto || '';
      torneio.status = torneioSave.status || StatusTorneio.NAO_INICIADO;
      torneio.tipo = torneioSave.tipo || TipoTorneio.MATA_MATA;
      torneio.equipes = torneioSave.equipes || [];
  
      await torneioCreateSchema.validate(torneio, { abortEarly: false });
  
      const torneioSalvo = await torneioRepository.save(torneio);
  
      // Criar partidas
      const partidas = await Promise.all(
        (torneioSave.confrontos || []).map(async confronto => {
          const partida = new Partida();
          partida.isDeleted = false;
          partida.publicoPresente = 0;
          partida.rodada  = confronto.rodada;
          partida.torneio = torneioSalvo;
          partida.createAt = new Date();
          partida.updateAt = new Date();
          if(confronto.data)  partida.data = confronto.data
         
  
          if (confronto.quadra) {
            const quadra = await quadraRepository.findOneBy({ id: confronto.quadra });
            if (!quadra) throw new Error(`Quadra com id ${confronto.quadra} não encontrada.`);
            partida.quadra = quadra;
          }
  
          return partida;
        })
      );
  
      const partidasSalvas = await partidaRepository.save(partidas);
  
      // Criar relações Equipe_Partida
      const equipePartidaList = partidasSalvas.map((partida, index) => {
        const confronto = torneioSave.confrontos![index];
        const equipePartida = new Equipe_Partida();
  
        equipePartida.partida = partida;
        equipePartida.partidaId = partida.id;
        equipePartida.casa = confronto.mandante;
        equipePartida.casaId = confronto.mandante.id;
        equipePartida.visitante = confronto.visitante;
        equipePartida.visitanteId = confronto.visitante.id;
  
        return equipePartida;
      });
  
      await equipePartidaRepository.save(equipePartidaList);
  
      return {
        mensagem: "O torneio foi cadastrado com sucesso!",
        torneio: torneioSalvo,
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
  


export const atualizarTorneio = async (id: string, torneioSave: Partial<TorneioSave>) => {
    try {
      const torneio = await torneioRepository.findOne({
        where: { id },
        relations: ['partida', 'partida.quadra'],
      });
  
      if (!torneio) {
        return { erro: "Torneio não encontrado", status: 404 };
      }
  
      // Atualiza os dados do torneio
      torneio.name = torneioSave.name || torneio.name;
      torneio.status = torneioSave.status || torneio.status;
      torneio.tipo = torneioSave.tipo || torneio.tipo;
      torneio.edicao = torneioSave.edicao || torneio.edicao;
      torneio.foto = torneioSave.foto || torneio.foto;
      torneio.updateAt = new Date();
      await atualizarTorneioSchema.validate(torneio, { abortEarly: false });

      await torneioRepository.save(torneio);
  
      // Atualiza os confrontos (apenas data e quadra)
      const partidas = await partidaRepository.find({
        where: { torneio: { id }, isDeleted: false },
        relations: ['quadra'],
      });
  
      for (let i = 0; i < partidas.length; i++) {
        const partida = partidas[i];
        const confronto = torneioSave.confrontos?.[i];
        if (confronto) {
            if(confronto.data ){
                partida.data = confronto.data;
            }
          if (confronto.quadra) {
            const quadra = await quadraRepository.findOneBy({ id: confronto.quadra });
            if (!quadra) throw new Error(`Quadra com id ${confronto.quadra} não encontrada.`);
            partida.quadra = quadra;
          } 
          partida.updateAt = new Date();
          await partidaRepository.save(partida);
        }
      }
  
      return {
        mensagem: "Torneio atualizado com sucesso!",
        torneio,
      };
  
    } catch (erro: unknown) {
      if (erro instanceof Error) {
        return { erro: erro.message, status: 500 };
      }
      return { erro: "Erro interno no servidor", status: 500 };
    }
  };
  
  


export const listarTorneios = async () => {
    try {
        const allTorneio = await torneioRepository.find({where:{isDeleted:false}});
        return { mensagem: "Torneio listado com sucesso!", torneios: allTorneio };
    } catch (erro: unknown) {
        return { erro: "Erro ao listar torneio", status: 500 }; // 500 Internal Server Error
    }
};

export const buscarTorneioPorId = async (id: string) => {
  try {
    const torneio = await torneioRepository.findOne({
      where: { id, isDeleted: false },
      relations: [
        'equipes',
        'partida',
        'partida.quadra',
        'partida.equipePartida',
        'partida.equipePartida.casa',
        'partida.equipePartida.visitante',
        'partida.arbitro',             // <-- adiciona árbitros
      ],
    });

    if (!torneio) {
      return { erro: "Torneio não encontrado", status: 404 };
    }

    const partidasIds = torneio.partida?.map(p => p.id) ?? [];

    const gols = await golRepository.find({
      where: {
        partida: { id: In(partidasIds) },
        isDeleted: false,
      },
      relations: ['partida', 'equipe'],
    });

    const partidasFormatadas = torneio.partida?.map(partida => {
      const equipeCasa = partida.equipePartida?.find(ep => ep.partidaId === partida.id)?.casa;
      const equipeVisitante = partida.equipePartida?.find(ep => ep.partidaId === partida.id)?.visitante;

      const golsPartida = gols.filter(g => g.partida.id === partida.id);

      let golsCasa = 0;
      let golsVisitante = 0;
      golsPartida.forEach(gol => {
        const golParaEquipe = gol.golContra
          ? (gol.equipe.id === equipeCasa?.id ? 'visitante' : 'casa')
          : (gol.equipe.id === equipeCasa?.id ? 'casa'
             : gol.equipe.id === equipeVisitante?.id ? 'visitante' 
             : null);
        if (golParaEquipe === 'casa') golsCasa++;
        if (golParaEquipe === 'visitante') golsVisitante++;
      });

      // mapeia árbitros da partida
      const arbitrosFormatados = (partida.arbitro ?? []).map(a => ({
        id: a.id,
        name: a.name,
        apelido: a.apelido,
        cpf: a.cpf,
        dataNascimento: a.dataNascimento,
        foto: a.foto,
        email: a.email,
        telefone: a.telefone,
      }));

      return {
        id: partida.id,
        data: partida.data,
        rodada: partida.rodada,
        status: partida.status,
        publicoPresente: partida.publicoPresente,
        quadra: partida.quadra ? {
          id: partida.quadra.id,
          name: partida.quadra.name,
          endereco: partida.quadra.endereco,
          telefone: partida.quadra.telefone,
          piso: partida.quadra.piso,
          comprimento: partida.quadra.comprimento,
          largura: partida.quadra.largura,
          responsavel: partida.quadra.responsavel,
        } : null,
        equipeCasa: equipeCasa ? {
          id: equipeCasa.id,
          name: equipeCasa.name,
          logo: equipeCasa.logo,
          telefone: equipeCasa.telefone,
          endereco: equipeCasa.endereco,
        } : null,
        equipeVisitante: equipeVisitante ? {
          id: equipeVisitante.id,
          name: equipeVisitante.name,
          logo: equipeVisitante.logo,
          telefone: equipeVisitante.telefone,
          endereco: equipeVisitante.endereco,
        } : null,
        golsCasa,
        golsVisitante,
        arbitros: arbitrosFormatados,   // <-- inclui árbitros aqui
      };
    }) ?? [];

    const torneioFormatado = {
      id: torneio.id,
      nome: torneio.name,
      tipo: torneio.tipo,
      status: torneio.status,
      foto: torneio.foto,
      edicao: torneio.edicao,
      equipes: torneio.equipes.map(e => ({
        id: e.id,
        name: e.name,
        logo: e.logo,
        telefone: e.telefone,
        endereco: e.endereco,
      })),
      partidas: partidasFormatadas,
    };

    return { mensagem: "Torneio encontrado com sucesso!", torneio: torneioFormatado };
  } catch (erro: unknown) {
    if (erro instanceof Error) {
      return { erro: erro.message, status: 500 };
    }
    return { erro: "Erro interno no servidor", status: 500 };
  }
};




export const deletarTorneio = async (id: string) => {
    try {
        const torneio = await torneioRepository.findOne({
            where: { id, isDeleted: false },
            relations: ['partida', 'partida.equipePartida']
        });

        if (!torneio) {
            return { erro: "Torneio não encontrado", status: 404 };
        }

        // 1. Atualizar torneio
        torneio.isDeleted = true;
        torneio.updateAt = new Date();
        await torneioRepository.save(torneio);

        // 2. Atualizar partidas
        if (torneio.partida && torneio.partida.length > 0) {
            for (const partida of torneio.partida) {
                partida.isDeleted = true;
                partida.updateAt = new Date();
                await partidaRepository.save(partida);


            }
        }

        return {
            mensagem: "Torneio e relacionamentos deletados com sucesso!",
            torneio
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

