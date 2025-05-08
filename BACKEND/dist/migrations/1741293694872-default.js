"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default1741293694872 = void 0;
class Default1741293694872 {
    constructor() {
        this.name = 'Default1741293694872';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "falta" ADD "equipeId" uuid`);
        await queryRunner.query(`ALTER TABLE "finalizacao" ADD "equipeId" uuid`);
        await queryRunner.query(`ALTER TABLE "drible" ADD "equipeId" uuid`);
        await queryRunner.query(`ALTER TABLE "desarme" ADD "equipeId" uuid`);
        await queryRunner.query(`ALTER TABLE "cartao" ADD "equipeId" uuid`);
        await queryRunner.query(`ALTER TABLE "gol" ADD "equipeId" uuid`);
        await queryRunner.query(`ALTER TABLE "falta" ADD CONSTRAINT "FK_b33687c9c23d42a84ffb723f5c1" FOREIGN KEY ("equipeId") REFERENCES "equipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finalizacao" ADD CONSTRAINT "FK_876b21e886d72097f9d65248e32" FOREIGN KEY ("equipeId") REFERENCES "equipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "drible" ADD CONSTRAINT "FK_9ff028a977993304d688d16550c" FOREIGN KEY ("equipeId") REFERENCES "equipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "desarme" ADD CONSTRAINT "FK_fbdf2808583532e121c58b5e91d" FOREIGN KEY ("equipeId") REFERENCES "equipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cartao" ADD CONSTRAINT "FK_952702b2d01e6407994d10ba8e9" FOREIGN KEY ("equipeId") REFERENCES "equipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gol" ADD CONSTRAINT "FK_4483ead6789a853299f9e554396" FOREIGN KEY ("equipeId") REFERENCES "equipe"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "gol" DROP CONSTRAINT "FK_4483ead6789a853299f9e554396"`);
        await queryRunner.query(`ALTER TABLE "cartao" DROP CONSTRAINT "FK_952702b2d01e6407994d10ba8e9"`);
        await queryRunner.query(`ALTER TABLE "desarme" DROP CONSTRAINT "FK_fbdf2808583532e121c58b5e91d"`);
        await queryRunner.query(`ALTER TABLE "drible" DROP CONSTRAINT "FK_9ff028a977993304d688d16550c"`);
        await queryRunner.query(`ALTER TABLE "finalizacao" DROP CONSTRAINT "FK_876b21e886d72097f9d65248e32"`);
        await queryRunner.query(`ALTER TABLE "falta" DROP CONSTRAINT "FK_b33687c9c23d42a84ffb723f5c1"`);
        await queryRunner.query(`ALTER TABLE "gol" DROP COLUMN "equipeId"`);
        await queryRunner.query(`ALTER TABLE "cartao" DROP COLUMN "equipeId"`);
        await queryRunner.query(`ALTER TABLE "desarme" DROP COLUMN "equipeId"`);
        await queryRunner.query(`ALTER TABLE "drible" DROP COLUMN "equipeId"`);
        await queryRunner.query(`ALTER TABLE "finalizacao" DROP COLUMN "equipeId"`);
        await queryRunner.query(`ALTER TABLE "falta" DROP COLUMN "equipeId"`);
    }
}
exports.Default1741293694872 = Default1741293694872;
