import { User } from "../database/models/User";

export const getUser = async (userId: string): Promise<User | null> => {
	const user = await User.findOne({ where: { userId: userId } });
	return user;
};

export const createUser = async (userId: string): Promise<User> => {
	const user = await User.create({ userId: userId });
	return user;
};

export const setExperience = async (
	user: User,
	amount: number,
): Promise<User> => {
	user.experience += amount;
	await user.save();
	return user;
};

export const addLevel = async (user: User) => {
	user.level += 1;
	await user.save();
	return user;
};
