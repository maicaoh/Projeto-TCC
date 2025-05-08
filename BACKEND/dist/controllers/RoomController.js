"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const roomRepository_1 = require("../repositories/roomRepository");
const videoRepository_1 = require("../repositories/videoRepository");
const subjectRepository_1 = require("../repositories/subjectRepository");
class RoomController {
    async create(req, res) {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: 'O nome e a descrição são obrigatórios!' });
        }
        try {
            const newRoom = roomRepository_1.roomRepository.create({ name, description });
            await roomRepository_1.roomRepository.save(newRoom);
            res.status(201).json(newRoom);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    async createVideo(req, res) {
        const { title, url, description } = req.body;
        const { idRoom } = req.params;
        try {
            const room = await roomRepository_1.roomRepository.findOneBy({ id: Number(idRoom) });
            if (!room) {
                return res.status(404).json({ message: 'Aula não existe' });
            }
            const newVideo = videoRepository_1.videoRepository.create({ title, url, description, Room: room, });
            await videoRepository_1.videoRepository.save(newVideo);
            return res.status(201).json(newVideo);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async roomSubject(req, res) {
        const { subject_id } = req.body;
        const { idRoom } = req.params;
        try {
            const room = await roomRepository_1.roomRepository.findOne({ where: { id: Number(idRoom) }, relations: ["subjects"] // Garante que os subjects sejam carregados
            });
            if (!room) {
                return res.status(404).json({ message: 'Aula não existe' });
            }
            const subject = await subjectRepository_1.subjectRepository.findOneBy({
                id: Number(subject_id),
            });
            if (!subject) {
                return res.status(404).json({ message: 'Disciplina não existe' });
            }
            const roomUpdate = roomRepository_1.roomRepository.create({ ...room, subjects: [...room.subjects, subject] });
            await roomRepository_1.roomRepository.save(roomUpdate);
            return res.status(204).send();
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Sever Error' });
        }
    }
}
exports.RoomController = RoomController;
