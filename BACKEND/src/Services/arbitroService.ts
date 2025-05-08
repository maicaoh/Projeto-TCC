import { ValidationError } from "yup";
import { Coach } from "../entities/Coach";
import { coachRepository } from "../repositories/coachRepository";
import { coachCreateSchema, coachUpdateSchema } from "../validations/coachSchema";
import { Arbitro } from "../entities/Arbitro";
import { arbitroCreateSchema, arbitroUpdateSchema } from "../validations/arbitroSchema";
import { arbitroRepository } from "../repositories/arbitroRepository";

export const criarArbitro = async (arbitro: Partial<Arbitro>) => {
    try {
        await arbitroCreateSchema.validate(arbitro, { abortEarly: false });

        arbitro.createAt = new Date();
        arbitro.isDeleted = false;
        arbitro.updateAt = new Date();

        const newArbitro = arbitroRepository.create(arbitro);
        await arbitroRepository.save(newArbitro);

        return { mensagem: "Arbitro cadastrado com sucesso!", arbitro: newArbitro };
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

export const atualizarArbitro = async (id: string, arbitro: Partial<Arbitro>) => {
    try {

        const arbitroUpdate = await arbitroRepository.findOneBy({id,isDeleted:false})
        if (!arbitroUpdate) {
          
            return { erro: "Arbitro não encontrado", status: 404 }; // 404 Not Found
        }
        

        await arbitroUpdateSchema.validate(arbitro, { abortEarly: false });


        await arbitroRepository.update(id, {
            ...arbitro,
            updateAt: new Date()
        })


        const arbitroAtualizado = await arbitroRepository.findOneBy({ id });


        return { mensagem: "Arbitro de com sucesso!", coach: arbitroAtualizado };

    } catch (erro: unknown) {
        if (erro instanceof ValidationError) {
            return { erro: erro.errors, status: 400 }; // 400 Bad Request
        }

        if (erro instanceof Error) {
            return { erro: erro.message, status: 500 }; // 500 Internal Server Error
        }

        return { erro: "Erro interno  no servidor", status: 500 }; // 500 Internal Server Error
    }
};


export const listarArbitros = async () => {
    try {
        const allArbitros = await arbitroRepository.find({where:{isDeleted:false}});
        return { mensagem: "Arbitros 444444444444 com sucesso!", arbitros: allArbitros };
    } catch (erro: unknown) {
        return { erro: "Erro ao listar árbitros", status: 500 }; // 500 Internal Server Error
    }
};

export const buscarArbitroPorId = async (id: string) => {
    try {
        const arbitro = await arbitroRepository.findOneBy({ id,isDeleted:false });

        if (!arbitro) {
            return { erro: "Arbitro não encontrado", status: 404 }; // 404 Not Found
        }

        return { mensagem: "Arbitro encontrado com sucesso!", arbitro };
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


export const deletarArbitro = async (id: string) => {
    try {

        const arbitroUpdate = await arbitroRepository.findOneBy({id,isDeleted:false})
        if (!arbitroUpdate) {
          
            return { erro: "Arbitro não encontrado", status: 404 }; // 404 Not Found
        }
        

        await arbitroRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        })


        const arbitroDeletado = await arbitroRepository.findOneBy({ id });


        return { mensagem: "Arbitro deletado com sucesso!", arbitro: arbitroDeletado };

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
