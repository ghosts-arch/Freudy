import { DataTypes, Model, Sequelize } from "sequelize";

export class Answer extends Model {
  declare text: string;
  declare isValidAnswer: boolean;
  declare id: number;
}

export const initModel = (sequelize: Sequelize): void => {
  Answer.init(
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isValidAnswer: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "answer",
    }
  );
};
