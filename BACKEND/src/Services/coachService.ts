import { ValidationError } from "yup";
import { Coach } from "../entities/Coach";
import { coachRepository } from "../repositories/coachRepository";
import { coachCreateSchema, coachUpdateSchema } from "../validations/coachSchema";

export const criarCoach = async (coach: Partial<Coach>) => {
    try {
        await coachCreateSchema.validate(coach, { abortEarly: false });

        coach.createAt = new Date();
        coach.isDeleted = false;
        coach.updateAt = new Date();

        const newCoach = coachRepository.create(coach);
        await coachRepository.save(newCoach);

        return { mensagem: "Treinador cadastrado com sucesso!", coach: newCoach };
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

export const atualizarCoach = async (id: string, coach: Partial<Coach>) => {
    try {

        const coachUpdate = await coachRepository.findOneBy({id,isDeleted:false})
        if (!coachUpdate) {
          
            return { erro: "Treinador não encontrado", status: 404 }; // 404 Not Found
        }
        

        await coachUpdateSchema.validate(coach, { abortEarly: false });


        await coachRepository.update(id, {
            ...coach,
            updateAt: new Date()
        })


        const coachAtualizado = await coachRepository.findOneBy({ id });


        return { mensagem: "Treinador atualizado com sucesso!", coach: coachAtualizado };

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


export const listarCoaches = async () => {
    try {
        
        const allCoach = await coachRepository.find({where:{isDeleted:false}, relations: ["equipeTecnico","equipeTecnico.equipe"]});
        return { mensagem: "Treinadores listados com sucesso!", coaches: allCoach };
    } catch (erro: unknown) {
        console.log(erro)
        return { erro: "Erro ao listar treinadores", status: 500 }; // 500 Internal Server Error
    }
};

export const buscarCoachPorId = async (id: string) => {
    try {
        const coach = await coachRepository.findOne({
            where: { id, isDeleted: false },
            select: ["id", "name", "foto", "createAt", "updateAt", "email", "telefone", "cpf", "dataNascimento", "apelido"],
            relations: ["equipeTecnico", "equipeTecnico.equipe"]
        });     
           if (!coach) {
            return { erro: "Treinador não encontrado", status: 404 }; // 404 Not Found
        }

        return { mensagem: "Treinador encontrado com sucesso!", coach };
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


export const deletarCoach = async (id: string) => {
    try {

        const coachUpdate = await coachRepository.findOneBy({id,isDeleted:false})
        if (!coachUpdate) {
          
            return { erro: "Treinador não encontrado", status: 404 }; // 404 Not Found
        }
        

        await coachRepository.update(id, {
            isDeleted: true,
            updateAt: new Date()
        })


        const coachDeletado = await coachRepository.findOneBy({ id });


        return { mensagem: "Treinador deletado com sucesso!", coach: coachDeletado };

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
