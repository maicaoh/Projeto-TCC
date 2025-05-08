import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1745526912512 implements MigrationInterface {
    name = 'Default1745526912512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drible" ADD "periodo" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "drible" DROP COLUMN "periodo"`);
    }

}
