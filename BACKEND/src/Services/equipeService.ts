import { ValidationError } from "yup";
import { Equipe } from "../entities/Equipe";
import { equipeRepository } from "../repositories/equipeRepository";
import { equipeCreateSchema, equipeUpdateSchema } from "../validations/equipeSchema";
import { Equipe_Jogador } from "../entities/Equipe_Jogador";
import { equipeJogadorRepository } from "../repositories/equipeJogadorRepository";


interface criarEquipeParams {
    equipe: Partial<Equipe>,
    idsJogadores: string[]
}
export const criarEquipe = async (data: criarEquipeParams) => {
    let { equipe, idsJogadores } = data;

    try {
        await equipeCreateSchema.validate(equipe, { abortEarly: false });

        equipe.createAt = new Date();
        equipe.isDeleted = false;
        equipe.updateAt = new Date();
        

        // Criar os relacionamentos diretamente no objeto equipe
        if (idsJogadores?.length > 0) {
            equipe.equipeJogador = idsJogadores.map(jogadorId => ({
                jogadorId,
                data_contratacao: new Date(),
                data_desligamento: null,
                dorsal: null,
            })) as Equipe_Jogador[];
        }

        // Agora, ao salvar a equipe, ele salva automaticamente os jogadores associados!
        const newEquipe = await equipeRepository.save(equipe);

        return { mensagem: "Equipe cadastrada com sucesso!", equipe: newEquipe };
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

export const atualizarEquipe = async (id: string, data: criarEquipeParams) => {
    try {
        const { equipe, idsJogadores } = data;


        const equipeExistente = await equipeRepository.findOneBy({ id, isDeleted: false });

        if (!equipeExistente) {
            return { erro: "Equipe não encontrada", status: 404 };
        }

        await equipeUpdateSchema.validate(equipe, { abortEarly: false });

        // Atualiza os dados da equipe
        await equipeRepository.update(id, {
            ...equipe,
            updateAt: new Date()
        });

        // Coletar todos os vínculos ativos existentes para essa equipe
        const relacionamentosAtivos = await equipeJogadorRepository.findBy({
            equipeId: id,
            data_desligamento: undefined,
        });

        const novosRelacionamentos: Equipe_Jogador[] = [];

        if (idsJogadores?.length > 0) {
            for (const jogadorId of idsJogadores) {
                const jaExiste = relacionamentosAtivos.some(rel => rel.jogadorId === jogadorId);
                if (!jaExiste) {
                    const novoVinculo = equipeJogadorRepository.create({
                        jogadorId,
                        equipeId: id,
                        data_contratacao: new Date(),
                        data_desligamento: null,
                        dorsal: null
                    });
                    
                    novosRelacionamentos.push(novoVinculo);
                }
            }

            if (novosRelacionamentos.length > 0) {
                await equipeJogadorRepository.save(novosRelacionamentos); // ✅ Apenas um save
            }
        }

        const equipeAtualizada = await equipeRepository.findOne({
            where: { id },
            relations: ["equipeJogador"]
        });

        return {
            mensagem: "Equipe atualizada com sucesso!",
            equipe: equipeAtualizada
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



export const listarEquipes = async () => {
    try {
        const allEquipe = await equipeRepository.find({ where: { isDeleted: false }, relations: ["equipeJogador", "equipeJogador.jogador"] });

        return { mensagem: "equipes listadas com sucesso!", equipes: allEquipe };
    } catch (erro: unknown) {
        return { erro: "Erro ao listar equipes", status: 500 }; // 500 Internal Server Error
    }
};

export async function listarEquipesJogadoresAtivos(id: string) {
    try {
        const equipe = await equipeRepository.findOne({
            where: { id },
            relations: ['equipeJogador', 'equipeJogador.jogador'], // carrega equipe_jogador e os jogadores
        });

        if (!equipe) {
            return { erro: 'Equipe não encontrada', status: 404 };
        }

        // Filtra os registros com data_desligamento == null
        const jogadoresAtivos = equipe.equipeJogador
            .filter(ej => ej.data_desligamento === null)
            .map(ej => ej.jogador);

        return {
            ...equipe,
            jogadores: jogadoresAtivos, // adiciona só os jogadores ativos
        };
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


export const buscarEquipePorId = async (id: string) => {
    try {
        const equipe = await equipeRepository.findOne({
            where: { id, isDeleted: false },
            relations: ['equipeJogador', 'equipeJogador.jogador'],
        });

        if (!equipe) {
            return { erro: "equipe não encontrada", status: 404 }; // 404 Not Found
        }

        return { mensagem: "equipe encontrado com sucesso!", equipe };
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


export const deletarEquipe = async (id: string) => {
    try {

        const equipeUpdate = await equipeRepository.findOneBy({ id, isDeleted: false })
        if (!equipeUpdate) {

            return { erro: "equipe não encontrado", status: 404 }; // 404 Not Found
        }


        await equipeRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        })


        const equipeDeletado = await equipeRepository.findOneBy({ id });


        return { mensagem: "equipe deletado com sucesso!", equipe: equipeDeletado };

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
