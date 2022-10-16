import { AbstractMigration, Info, ClientPostgreSQL } from "https://deno.land/x/nessie@2.0.5/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
    /** Runs on migrate */
    async up(info: Info): Promise<void> {
        await this.client.queryArray(`alter table users add column password_salt string`)
    }

    /** Runs on rollback */
    async down(info: Info): Promise<void> {
        await this.client.queryArray(`alter table users drop column password_salt`)
    }
}
