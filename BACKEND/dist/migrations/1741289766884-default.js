"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default1741289766884 = void 0;
class Default1741289766884 {
    constructor() {
        this.name = 'Default1741289766884';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."falta_tipo_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "falta" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP, "updateAt" TIMESTAMP, "isDeleted" boolean NOT NULL, "tipo" "public"."falta_tipo_enum" NOT NULL, "tempo" TIME NOT NULL, "local" integer NOT NULL, "jogadorAutorId" uuid, "jogadorSofreuId" uuid, "partidaId" uuid, "arbitroId" uuid, CONSTRAINT "PK_cf7ea333a7fac042128cb9c9cf9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "falta" ADD CONSTRAINT "FK_417964689a57efbc395643dadce" FOREIGN KEY ("jogadorAutorId") REFERENCES "jogador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "falta" ADD CONSTRAINT "FK_73c4d7ab09d5623d143c945e339" FOREIGN KEY ("jogadorSofreuId") REFERENCES "jogador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "falta" ADD CONSTRAINT "FK_131678518f2af9abb37292e39a9" FOREIGN KEY ("partidaId") REFERENCES "partida"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "falta" ADD CONSTRAINT "FK_41e1e7e1f3d0592b9e7ca9671f5" FOREIGN KEY ("arbitroId") REFERENCES "arbitro"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "falta" DROP CONSTRAINT "FK_41e1e7e1f3d0592b9e7ca9671f5"`);
        await queryRunner.query(`ALTER TABLE "falta" DROP CONSTRAINT "FK_131678518f2af9abb37292e39a9"`);
        await queryRunner.query(`ALTER TABLE "falta" DROP CONSTRAINT "FK_73c4d7ab09d5623d143c945e339"`);
        await queryRunner.query(`ALTER TABLE "falta" DROP CONSTRAINT "FK_417964689a57efbc395643dadce"`);
        await queryRunner.query(`DROP TABLE "falta"`);
        await queryRunner.query(`DROP TYPE "public"."falta_tipo_enum"`);
    }
}
exports.Default1741289766884 = Default1741289766884;
