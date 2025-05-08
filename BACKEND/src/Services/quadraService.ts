import { ValidationError } from "yup";
import { Coach } from "../entities/Coach";
import { coachRepository } from "../repositories/coachRepository";
import { coachCreateSchema, coachUpdateSchema } from "../validations/coachSchema";
import { Quadra } from "../entities/Quadra";
import { quadraRepository } from "../repositories/quadraRepository";
import { quadraCreateSchema, quadraUpdateSchema } from "../validations/quadraSchema";
import { PisoQuadra } from "../Utils/enums/enums";

export const criarQuarta = async (quadra: Partial<Quadra>) => {
    try {
        await quadraCreateSchema.validate(quadra, { abortEarly: false });

        // Validando se o piso está presente e se é um valor válido do enum
        if (quadra.piso !== undefined && !(quadra.piso in PisoQuadra)) {
            return { erro: "Piso inválido", status: 400 };
        }

        quadra.createAt = new Date();
        quadra.isDeleted = false;
        quadra.updateAt = new Date();

        const newQuadra = quadraRepository.create(quadra);
        await quadraRepository.save(newQuadra);

        return { mensagem: "Quadra cadastrada com sucesso!", quadra: newQuadra };
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

export const atualizarQuadra = async (id: string, quadra: Partial<Quadra>) => {
    try {

        const quadraUpdate = await quadraRepository.findOneBy({ id, isDeleted: false })
        if (!quadraUpdate) {

            return { erro: "Quadra não encontrado", status: 404 }; // 404 Not Found
        }


        await quadraUpdateSchema.validate(quadra, { abortEarly: false });


        await quadraRepository.update(id, {
            ...quadra,
            updateAt: new Date()
        })


        const quadraAtualizado = await quadraRepository.findOneBy({ id });


        return { mensagem: "Quadra atualizada com sucesso!", coach: quadraAtualizado };

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


export const listarQuadras = async () => {
    try {
        const allQuadra = await quadraRepository.find({ where: { isDeleted: false } });
        return { mensagem: "Quadras listadas com sucesso!", quadra: allQuadra };
    } catch (erro: unknown) {
        return { erro: "Erro ao listar treinadores", status: 500 }; // 500 Internal Server Error
    }
};

export const buscarQuadraPorId = async (id: string) => {
    try {
        const quadra = await quadraRepository.findOneBy({ id, isDeleted: false });

        if (!quadra) {
            return { erro: "Quadra não encontrada", status: 404 }; // 404 Not Found
        }

        return { mensagem: "Quadra encontrada com sucesso!", quadra };
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


export const deletarQuadra = async (id: string) => {
    try {

        const quadraUpdate = await quadraRepository.findOneBy({ id, isDeleted: false })
        if (!quadraUpdate) {

            return { erro: "Quadra não encontrada", status: 404 }; // 404 Not Found
        }


        await quadraRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        })


        const quadraDeletado = await quadraRepository.findOneBy({ id });


        return { mensagem: "Quadra deletada com sucesso!", quadra: quadraDeletado };

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
