import { DataTypes, Model, type Sequelize } from "sequelize";
import type { Answer } from "./answer";

export class Question extends Model {
	declare id: number;
	declare question: string;
	declare answers: Answer[];
	declare explanation?: string;
}

export const initModel = (sequelize: Sequelize) => {
	Question.init(
		{
			question: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			explanation: {
				type: DataTypes.STRING,
			},
		},
		{
			sequelize,
			tableName: "question",
		},
	);
};
