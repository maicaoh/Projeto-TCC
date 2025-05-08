"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default1741288939491 = void 0;
class Default1741288939491 {
    constructor() {
        this.name = 'Default1741288939491';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."desarme_pe_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "desarme" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createAt" TIMESTAMP, "updateAt" TIMESTAMP, "isDeleted" boolean NOT NULL, "sucesso" boolean NOT NULL, "pe" "public"."desarme_pe_enum" NOT NULL, "local" integer NOT NULL, "tempo" TIME NOT NULL, "jogadorDesarmeId" uuid, "jogadorDesarmadoId" uuid, "partidaId" uuid, CONSTRAINT "PK_53cdd42691a5bb6c69428e85d5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "gol" ADD "golContra" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "desarme" ADD CONSTRAINT "FK_febc8c621c4e8b79dbe5d79cbe9" FOREIGN KEY ("jogadorDesarmeId") REFERENCES "jogador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "desarme" ADD CONSTRAINT "FK_c514482c69ec464d9f814d62b64" FOREIGN KEY ("jogadorDesarmadoId") REFERENCES "jogador"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "desarme" ADD CONSTRAINT "FK_b2f277daf2f670814e39575ff05" FOREIGN KEY ("partidaId") REFERENCES "partida"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "desarme" DROP CONSTRAINT "FK_b2f277daf2f670814e39575ff05"`);
        await queryRunner.query(`ALTER TABLE "desarme" DROP CONSTRAINT "FK_c514482c69ec464d9f814d62b64"`);
        await queryRunner.query(`ALTER TABLE "desarme" DROP CONSTRAINT "FK_febc8c621c4e8b79dbe5d79cbe9"`);
        await queryRunner.query(`ALTER TABLE "gol" DROP COLUMN "golContra"`);
        await queryRunner.query(`DROP TABLE "desarme"`);
        await queryRunner.query(`DROP TYPE "public"."desarme_pe_enum"`);
    }
}
exports.Default1741288939491 = Default1741288939491;
