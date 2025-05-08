"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Default1741316406972 = void 0;
class Default1741316406972 {
    constructor() {
        this.name = 'Default1741316406972';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "coach" ALTER COLUMN "apelido" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "coach" ALTER COLUMN "apelido" SET NOT NULL`);
    }
}
exports.Default1741316406972 = Default1741316406972;
