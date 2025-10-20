import type { InferSelectModel } from "drizzle-orm";
import type { questions, users } from "./schema";

export type User = InferSelectModel<typeof users>;
export type Question = InferSelectModel<typeof questions>;
