// import { AbstractMigration, Info, ClientCockroachDB } from "../../../../../github/deno-nessie/mod.ts";
import { AbstractMigration, Info, ClientCockroachDB } from "https://raw.githubusercontent.com/jcs224/deno-nessie/cockroachdb/mod.ts";

export default class extends AbstractMigration<ClientCockroachDB> {
    /** Runs on migrate */
    async up(info: Info): Promise<void> {
        await this.client.queryArray(`create table if not exists podcasts (
            id uuid default uuid_v4()::UUID primary key,
            title string,
            slug string,
            description string,
            cover_image_url string,
            categories jsonb,
            owner jsonb,
            links jsonb,
            author string,
            copyright string
          )`);
    }

    /** Runs on rollback */
    async down(info: Info): Promise<void> {
        await this.client.queryArray(`drop table podcasts`)
    }
}
