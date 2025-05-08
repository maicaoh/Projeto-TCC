import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1745639219496 implements MigrationInterface {
    name = 'Default1745639219496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cartao" RENAME COLUMN "local" TO "periodo"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cartao" RENAME COLUMN "periodo" TO "local"`);
    }

}
