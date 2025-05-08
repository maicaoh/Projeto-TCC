import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1745529122236 implements MigrationInterface {
    name = 'Default1745529122236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drible" RENAME COLUMN "local" TO "posicaoCampo"`);
        await queryRunner.query(`ALTER TABLE "drible" DROP COLUMN "posicaoCampo"`);
        await queryRunner.query(`ALTER TABLE "drible" ADD "posicaoCampo" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drible" DROP COLUMN "posicaoCampo"`);
        await queryRunner.query(`ALTER TABLE "drible" ADD "posicaoCampo" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "drible" RENAME COLUMN "posicaoCampo" TO "local"`);
    }

}
