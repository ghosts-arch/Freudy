import { levels } from "../../data/titles";
import type { User } from "../database/models/User";
import { addLevel, setExperience } from "./userService";

export const calculateExperienceForLevelUp = (level: number): number => {
	return 50 * (level + 1) ** 2;
};

export const getTitle = (level: number): string | undefined => {
	return levels[level];
};

export const checkLevelUp = (experience: number, level: number): boolean => {
	return experience >= calculateExperienceForLevelUp(level);
};

export const processLevelProgression = async (user: User) => {
	await setExperience(user, 10);
	if (checkLevelUp(user.experience, user.level)) {
		addLevel(user);
	}
};
