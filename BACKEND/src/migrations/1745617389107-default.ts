import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1745617389107 implements MigrationInterface {
    name = 'Default1745617389107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "falta" DROP COLUMN "local"`);
        await queryRunner.query(`ALTER TABLE "falta" ADD "posicaoCampo" json`);
        await queryRunner.query(`ALTER TABLE "falta" ADD "periodo" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "falta" DROP COLUMN "periodo"`);
        await queryRunner.query(`ALTER TABLE "falta" DROP COLUMN "posicaoCampo"`);
        await queryRunner.query(`ALTER TABLE "falta" ADD "local" integer NOT NULL`);
    }

}
