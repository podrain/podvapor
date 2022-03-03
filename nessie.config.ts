
import {
    ClientMySQL,
    ClientCockroachDB,
    ClientSQLite,
    NessieConfig,
} from "https://raw.githubusercontent.com/jcs224/deno-nessie/cockroachdb/mod.ts";
// } from "../../../github/deno-nessie/mod.ts";
import 'https://deno.land/x/dotenv@v3.2.0/load.ts'

/** Select one of the supported clients */
const client = new ClientCockroachDB({
    database: Deno.env.get('DB_DATABASE'),
    hostname: Deno.env.get('DB_HOST'),
    port: Deno.env.get('DB_PORT'),
    user: Deno.env.get('DB_USER'),
    password: Deno.env.get('DB_PASS'),
});

// const client = new ClientMySQL({
//     hostname: "localhost",
//     port: 3306,
//     username: "root",
//     // password: "pwd", // uncomment this line for <8
//     db: "nessie",
// });

// const client = new ClientSQLite("./sqlite.db");

/** This is the final config object */
const config: NessieConfig = {
    client,
    migrationFolders: ["./db/migrations"],
    seedFolders: ["./db/seeds"],
};

export default config;
