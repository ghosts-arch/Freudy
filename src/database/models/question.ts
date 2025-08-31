import { DataTypes, Model, Sequelize } from "sequelize";
import { Answer } from "./answer";

export class Question extends Model {
  declare question: string;
  declare id: number;
  declare answers: Answer[];

  static async getRandomQuestion(): Promise<Question> {
    const question = await Question.findOne({
      order: Sequelize.literal("random()"),
      include: [
        {
          model: Answer,
          as: "answers",
        },
      ],
    });
    if (!question) {
      throw new Error();
    }
    return question;
  }
}

export const initModel = (sequelize: Sequelize) => {
  Question.init(
    {
      question: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "question",
    }
  );
};
