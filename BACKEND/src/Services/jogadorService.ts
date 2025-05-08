import { ValidationError } from "yup";
import { Jogador } from "../entities/Jogador";
import { jogadorRepository } from "../repositories/jogadorRepository";
import { jogadorCreateSchema,jogadorUpdateSchema } from "../validations/jogadorSchema";

export const criarJogador = async (jogador: Partial<Jogador>) => {
    try {
     
        await jogadorCreateSchema.validate(jogador, { abortEarly: false });

        jogador.createAt = new Date();
        jogador.isDeleted = false;
        jogador.updateAt = new Date();

        const newJogador = jogadorRepository.create(jogador);
        await jogadorRepository.save(newJogador);

        return { mensagem: "Jogador cadastrado com sucesso!", jogador: newJogador };
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

export const atualizarJogador = async (id: string, jogador: Partial<Jogador>) => {
    try {

        const jogadorUpdate = await jogadorRepository.findOneBy({id,isDeleted:false})
        if (!jogadorUpdate) {
          
            return { erro: "Jogador não encontrado", status: 404 }; // 404 Not Found
        }
        

        await jogadorUpdateSchema.validate(jogador, { abortEarly: false });


        await jogadorRepository.update(id, {
            ...jogador,
            updateAt: new Date()
        })


        const jogadorAtualizado = await jogadorRepository.findOneBy({ id });


        return { mensagem: "Jogador atualizado com sucesso!", jogador: jogadorAtualizado };

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


export const listarJogadores = async () => {
    try {
        const allJogador = await jogadorRepository.find({where:{isDeleted:false}, relations: ["equipeJogador","equipeJogador.equipe"]});
        return { mensagem: "Jogadores listados com sucesso!", jogadores: allJogador };
    } catch (erro: unknown) {
        return { erro: "Erro ao listar jogadores", status: 500 }; // 500 Internal Server Error
    }
};

export const listarJogadoresDisponiveis = async () => {
    try {
        const allJogador = await jogadorRepository.find({
            where: { isDeleted: false },
            relations: ["equipeJogador", "equipeJogador.equipe"]
        });

        const jogadoresDisponiveis = allJogador.filter(jogador => {
            // Se não tem nenhuma equipe associada, retorna
            if (!jogador.equipeJogador || jogador.equipeJogador.length === 0) {
                return true;
            }

            // Só retorna se TODOS os objetos em equipeJogador tiverem data_desligamento setado
            return jogador.equipeJogador.every(equipeJogador =>
                equipeJogador.data_desligamento !== null &&
                equipeJogador.data_desligamento !== undefined
            );
        });

        return { mensagem: "Jogadores listados com sucesso!", jogadores: jogadoresDisponiveis };
    } catch (erro: unknown) {
        return { erro: "Erro ao listar jogadores", status: 500 };
    }
};

export const buscarJogadorPorId = async (id: string) => {
    try {
        const jogador = await jogadorRepository.findOneBy({ id,isDeleted:false });

        if (!jogador) {
            return { erro: "Jogador não encontrado", status: 404 }; // 404 Not Found
        }

        return { mensagem: "Jogador encontrado com sucesso!", jogador };
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


export const deletarJogador = async (id: string) => {
    try {

        const jogadorUpdate = await jogadorRepository.findOneBy({id,isDeleted:false})
        if (!jogadorUpdate) {
          
            return { erro: "Jogador não encontrado", status: 404 }; // 404 Not Found
        }
        

        await jogadorRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        })


        const jogadorDeletado = await jogadorRepository.findOneBy({ id });


        return { mensagem: "Jogador deletado com sucesso!", jogador: jogadorDeletado };

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
