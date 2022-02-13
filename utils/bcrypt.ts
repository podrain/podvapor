import * as bcrypt from "https://deno.land/x/bcrypt@v0.3.0/mod.ts";

const result = await bcrypt.hash(Deno.args[0])

console.log(result)