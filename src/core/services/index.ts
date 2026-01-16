import type { ApplicationServices } from "../../types/services";
import { db } from "../database/database";
import { FactService } from "./factService";
import { GeminiService } from "./geminiService";
import { QuestionsService } from "./questionsService";
import { UserService } from "./userService";

export const services: ApplicationServices = {
	database: db,
	questions: new QuestionsService(db),
	users: new UserService(db),
	facts: new FactService(db),
	gemini: new GeminiService(),
};
