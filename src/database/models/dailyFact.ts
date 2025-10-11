import { DataTypes, Model, Sequelize } from "sequelize";

export class DailyFact extends Model {
	declare fact: string;
	declare createdAt: Date;

	static async getRandomDailyFact(): Promise<DailyFact> {
		const dailyFact = await DailyFact.findOne({
			order: Sequelize.literal("random()"),
		});
		if (!dailyFact) {
			throw new Error();
		}
		return dailyFact;
	}
}
export const initModel = (sequelize: Sequelize): void => {
	DailyFact.init(
		{
			fact: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			createdAt: {
				type: DataTypes.DATE,
			},
		},
		{
			sequelize,
			tableName: "daily_facts",
		},
	);
};
