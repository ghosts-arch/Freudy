import { Freudy } from "./client";
import { db } from "./core/database/database";

const client = new Freudy(db);
await client.init();
