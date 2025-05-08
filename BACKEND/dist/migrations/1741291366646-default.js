"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default1741291366646 = void 0;
class Default1741291366646 {
    constructor() {
        this.name = 'Default1741291366646';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."cartao_tipo_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "cartao" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP, "updateAt" TIMESTAMP, "isDeleted" boolean NOT NULL, "tipo" "public"."cartao_tipo_enum" NOT NULL, "tempo" TIME NOT NULL, "local" integer NOT NULL, "descricao" character varying, "jogadorId" uuid, "partidaId" uuid, "arbitroId" uuid, CONSTRAINT "PK_4e39f2f0b54a26014e575465719" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "cartao" ADD CONSTRAINT "FK_72c0cf3f1ef679e0d96530b3747" FOREIGN KEY ("jogadorId") REFERENCES "jogador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cartao" ADD CONSTRAINT "FK_89a2c53d696c550f89c58e278f3" FOREIGN KEY ("partidaId") REFERENCES "partida"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "cartao" ADD CONSTRAINT "FK_ce5aad07f73e9c1bbe16cf9456b" FOREIGN KEY ("arbitroId") REFERENCES "arbitro"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "cartao" DROP CONSTRAINT "FK_ce5aad07f73e9c1bbe16cf9456b"`);
        await queryRunner.query(`ALTER TABLE "cartao" DROP CONSTRAINT "FK_89a2c53d696c550f89c58e278f3"`);
        await queryRunner.query(`ALTER TABLE "cartao" DROP CONSTRAINT "FK_72c0cf3f1ef679e0d96530b3747"`);
        await queryRunner.query(`DROP TABLE "cartao"`);
        await queryRunner.query(`DROP TYPE "public"."cartao_tipo_enum"`);
    }
}
exports.Default1741291366646 = Default1741291366646;
