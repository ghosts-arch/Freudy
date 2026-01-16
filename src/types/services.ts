import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import type * as schema from "@/core/database/schema";
import type { FactService } from "@/core/services/factService";
import type { GeminiService } from "@/core/services/geminiService";
import type { QuestionsService } from "@/core/services/questionsService";
import type { UserService } from "@/core/services/userService";
export interface ApplicationServices {
	database: BunSQLiteDatabase<typeof schema>;
	questions: QuestionsService;
	users: UserService;
	facts: FactService;
	gemini: GeminiService;
}
