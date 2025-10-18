import { DataTypes, Model, type Sequelize } from "sequelize";

export class User extends Model {
	declare userId: string;
	declare experience: number;
	declare level: number;
}

export const initModel = (sequelize: Sequelize) => {
	User.init(
		{
			userId: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			experience: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			level: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
		},
		{ sequelize, tableName: "user" },
	);
};
