// import { AbstractMigration, Info, ClientCockroachDB } from "../../../../../github/deno-nessie/mod.ts";
import { AbstractMigration, Info, ClientCockroachDB } from "https://raw.githubusercontent.com/jcs224/deno-nessie/cockroachdb/mod.ts";

export default class extends AbstractMigration<ClientCockroachDB> {
    /** Runs on migrate */
    async up(info: Info): Promise<void> {
        await this.client.queryArray(`create table if not exists episodes (
            id uuid default uuid_v4()::UUID primary key,
            podcast_id uuid references podcasts (id) on delete cascade,
            title string,
            description string,
            notes string,
            audio jsonb,
            duration int4,
            published string
          )`);
    }

    /** Runs on rollback */
    async down(info: Info): Promise<void> {
        await this.client.queryArray(`drop table episodes`)
    }
}
  
  
  
  
  
  
  