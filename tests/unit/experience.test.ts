import { describe, expect, test } from "bun:test";
import {
	calculateExperienceForLevelUp,
	checkLevelUp,
	getTitle,
} from "../../src/core/services/experienceService";

describe("Testing experience related functions", () => {
	test("calculateExperienceNeededForLevelUp", async () => {
		expect(calculateExperienceForLevelUp(0)).toBe(50);
		expect(calculateExperienceForLevelUp(5)).toBe(1800);
	});

	test("getTitle", async () => {
		expect(getTitle(0)).toBe("Apprenti Freudy");
		expect(getTitle(4)).toBe("Freud suprême");
	});

	test("checkLevelUp when user does not have required xp for level up", async () => {
		expect(checkLevelUp(40, 1)).toBeFalse();
		expect(checkLevelUp(1500, 5)).toBeFalse();
	});

	test("checkLevelUp when user does  have required xp for level up", async () => {
		expect(checkLevelUp(60, 0)).toBeTrue();
		expect(checkLevelUp(2000, 5)).toBeTrue();
	});
});
