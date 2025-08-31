import { DataTypes, Model, Sequelize } from "sequelize";

export class Answer extends Model {
  declare text: string;
  declare explanation: string;
  declare isCorrectAnswer: boolean;
  declare id: number;
}

export const initModel = (sequelize: Sequelize): void => {
  Answer.init(
    {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      explanation: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isCorrectAnswer: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      tableName: "answer",
    }
  );
};
