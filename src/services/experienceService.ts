import type { BunSQLiteDatabase } from "drizzle-orm/bun-sqlite";
import { levels } from "../../data/titles";
import type * as schema from "../database/schema";
import type { users } from "../database/schema";
import { UserService } from "./userService";
export const calculateExperienceForLevelUp = (level: number): number => {
	return 50 * (level + 1) ** 2;
};

export const getTitle = (level: number): string | undefined => {
	return levels[level];
};

export const checkLevelUp = (experience: number, level: number): boolean => {
	return experience >= calculateExperienceForLevelUp(level);
};

export const processLevelProgression = async (
	database: BunSQLiteDatabase<typeof schema>,
	userId: string,
): Promise<[typeof users.$inferSelect, boolean]> => {
	const userService = new UserService(database);
	let updatedUser = await userService.setExperience(userId, 10);
	if (checkLevelUp(updatedUser.experience, updatedUser.level)) {
		updatedUser = await userService.addLevel(userId);
		return [updatedUser, true];
	}
	return [updatedUser, false];
};
