"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default1741288433875 = void 0;
class Default1741288433875 {
    constructor() {
        this.name = 'Default1741288433875';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "gol" ADD "jogadorDefensorId" uuid`);
        await queryRunner.query(`ALTER TABLE "gol" ADD CONSTRAINT "FK_c1f88dc7b5af91cb5213faaad33" FOREIGN KEY ("jogadorDefensorId") REFERENCES "jogador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "gol" DROP CONSTRAINT "FK_c1f88dc7b5af91cb5213faaad33"`);
        await queryRunner.query(`ALTER TABLE "gol" DROP COLUMN "jogadorDefensorId"`);
    }
}
exports.Default1741288433875 = Default1741288433875;
