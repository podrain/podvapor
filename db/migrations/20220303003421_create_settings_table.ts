// import { AbstractMigration, Info, ClientCockroachDB } from "../../../../../github/deno-nessie/mod.ts";
import { AbstractMigration, Info, ClientCockroachDB } from "https://raw.githubusercontent.com/jcs224/deno-nessie/cockroachdb/mod.ts";

export default class extends AbstractMigration<ClientCockroachDB> {
    /** Runs on migrate */
    async up(info: Info): Promise<void> {
        await this.client.queryArray(`create table if not exists settings (
            key varchar(255) primary key,
            type varchar(255),
            value string
          )`);
    }

    /** Runs on rollback */
    async down(info: Info): Promise<void> {
        await this.client.queryArray(`drop table settings`)
    }
}


  

  
  
  
  
  
  
  