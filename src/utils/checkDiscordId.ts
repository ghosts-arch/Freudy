export const isValidDiscordId = (discordId: string): boolean => {
	const discordIdRegex = /^\d{17,20}$/;
	return discordIdRegex.test(discordId);
};
