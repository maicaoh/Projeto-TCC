"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default1741820141733 = void 0;
class Default1741820141733 {
    constructor() {
        this.name = 'Default1741820141733';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "equipe_partida" ADD "torneioId" uuid`);
        await queryRunner.query(`ALTER TABLE "partida" ADD "torneioId" uuid`);
        await queryRunner.query(`ALTER TYPE "public"."finalizacao_pe_enum" RENAME TO "finalizacao_pe_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."finalizacao_pe_enum" AS ENUM('D', 'E')`);
        await queryRunner.query(`ALTER TABLE "finalizacao" ALTER COLUMN "pe" TYPE "public"."finalizacao_pe_enum" USING "pe"::"text"::"public"."finalizacao_pe_enum"`);
        await queryRunner.query(`DROP TYPE "public"."finalizacao_pe_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."drible_pe_enum" RENAME TO "drible_pe_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."drible_pe_enum" AS ENUM('D', 'E')`);
        await queryRunner.query(`ALTER TABLE "drible" ALTER COLUMN "pe" TYPE "public"."drible_pe_enum" USING "pe"::"text"::"public"."drible_pe_enum"`);
        await queryRunner.query(`DROP TYPE "public"."drible_pe_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."desarme_pe_enum" RENAME TO "desarme_pe_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."desarme_pe_enum" AS ENUM('D', 'E')`);
        await queryRunner.query(`ALTER TABLE "desarme" ALTER COLUMN "pe" TYPE "public"."desarme_pe_enum" USING "pe"::"text"::"public"."desarme_pe_enum"`);
        await queryRunner.query(`DROP TYPE "public"."desarme_pe_enum_old"`);
        await queryRunner.query(`ALTER TABLE "equipe_jogador" ALTER COLUMN "dorsal" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "equipe_jogador" DROP CONSTRAINT "UQ_00b9c49b41c290c7284f1b5c9a2"`);
        await queryRunner.query(`ALTER TABLE "equipe_partida" ADD CONSTRAINT "FK_9790e307b23dc34513304741c2e" FOREIGN KEY ("torneioId") REFERENCES "equipe"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partida" ADD CONSTRAINT "FK_3a4b1d7566461d2f962fc7351e1" FOREIGN KEY ("torneioId") REFERENCES "torneio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "partida" DROP CONSTRAINT "FK_3a4b1d7566461d2f962fc7351e1"`);
        await queryRunner.query(`ALTER TABLE "equipe_partida" DROP CONSTRAINT "FK_9790e307b23dc34513304741c2e"`);
        await queryRunner.query(`ALTER TABLE "equipe_jogador" ADD CONSTRAINT "UQ_00b9c49b41c290c7284f1b5c9a2" UNIQUE ("dorsal")`);
        await queryRunner.query(`ALTER TABLE "equipe_jogador" ALTER COLUMN "dorsal" SET NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."desarme_pe_enum_old" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "desarme" ALTER COLUMN "pe" TYPE "public"."desarme_pe_enum_old" USING "pe"::"text"::"public"."desarme_pe_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."desarme_pe_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."desarme_pe_enum_old" RENAME TO "desarme_pe_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."drible_pe_enum_old" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "drible" ALTER COLUMN "pe" TYPE "public"."drible_pe_enum_old" USING "pe"::"text"::"public"."drible_pe_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."drible_pe_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."drible_pe_enum_old" RENAME TO "drible_pe_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."finalizacao_pe_enum_old" AS ENUM('0', '1')`);
        await queryRunner.query(`ALTER TABLE "finalizacao" ALTER COLUMN "pe" TYPE "public"."finalizacao_pe_enum_old" USING "pe"::"text"::"public"."finalizacao_pe_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."finalizacao_pe_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."finalizacao_pe_enum_old" RENAME TO "finalizacao_pe_enum"`);
        await queryRunner.query(`ALTER TABLE "partida" DROP COLUMN "torneioId"`);
        await queryRunner.query(`ALTER TABLE "equipe_partida" DROP COLUMN "torneioId"`);
    }
}
exports.Default1741820141733 = Default1741820141733;
