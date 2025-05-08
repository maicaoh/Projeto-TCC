import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1745555994872 implements MigrationInterface {
    name = 'Default1745555994872'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "desarme" DROP COLUMN "local"`);
        await queryRunner.query(`ALTER TABLE "desarme" ADD "posicaoCampo" json`);
        await queryRunner.query(`ALTER TABLE "desarme" ADD "periodo" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "desarme" DROP COLUMN "periodo"`);
        await queryRunner.query(`ALTER TABLE "desarme" DROP COLUMN "posicaoCampo"`);
        await queryRunner.query(`ALTER TABLE "desarme" ADD "local" integer NOT NULL`);
    }

}
