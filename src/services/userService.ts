import { User } from "../database/database";

export const getUser = async (userId: string): Promise<User | null> => {
	const user = await User.findOne({ where: { userId: userId } });
	return user;
};
