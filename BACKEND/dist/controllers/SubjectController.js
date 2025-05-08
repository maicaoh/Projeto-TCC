"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectController = void 0;
const subjectRepository_1 = require("../repositories/subjectRepository");
class SubjectController {
    async create(req, res) {
        const { name } = req.body;
        console.log(name);
        if (!name) {
            return res.status(400).json({ message: 'O nome é obrigatório!' });
        }
        try {
            const newSubject = subjectRepository_1.subjectRepository.create({ name });
            subjectRepository_1.subjectRepository.save(newSubject);
            return res.status(201).json(newSubject);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
exports.SubjectController = SubjectController;
