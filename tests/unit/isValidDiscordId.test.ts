import { describe, expect, expectTypeOf, test } from "bun:test";
import { isValidDiscordId } from "@/utils/checkDiscordId";

describe("isValidDiscordId", () => {
	test("function signature", () => {
		expectTypeOf(isValidDiscordId).toBeFunction();
		expectTypeOf(isValidDiscordId).parameters.toEqualTypeOf<[string]>();
		expectTypeOf(isValidDiscordId).returns.toEqualTypeOf<boolean>();
	});
	test("should return true if valid userId format", () => {
		expect(isValidDiscordId("467818337599225866")).toBeTrue();
	});
	test.each([
		["empty string", ""],
		["too short (16 digits)", "6666666666666666"],
		["no digits", "randomId"],
		["with no digits characters", "a77777777f777777k"],
		["too long (21 digits)", "999999999999999999999"],
	])(
		"should raise error if invalid userId format (%s=%s)",
		(_, invalidUserId) => {
			expect(isValidDiscordId(invalidUserId)).toBeFalse();
		},
	);
});
