import { DataTypes, Sequelize, Model } from "sequelize";

export class DailyFact extends Model {
  declare fact: string;
  declare createdAt: Date;
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
    }
  );
};
