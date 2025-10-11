import { DataTypes, Model, type Sequelize } from "sequelize";

const levels: Record<number, string> = {
	0: "Apprenti Freudy",
	1: "Disciple de Freud",
	2: "Explorateur de l’inconscient",
	3: "Maître des pulsions",
	4: "Freud suprême",
};

export class User extends Model {
	declare userId: string;
	declare experience: number;
	declare level: number;

	private calculateExperienceForLevelUp() {
		return 50 * (this.level + 1) ** 2;
	}

	getTitle() {
		return levels[this.level];
	}
	setExperience(experience: number): boolean {
		this.experience += experience;
		console.log(this.level, this.calculateExperienceForLevelUp());
		const experienceNeededForLevelUp = this.calculateExperienceForLevelUp();
		if (this.experience >= experienceNeededForLevelUp) {
			this.level += 1;
			this.save();
			return true;
		}
		this.save();
		return false;
	}
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
