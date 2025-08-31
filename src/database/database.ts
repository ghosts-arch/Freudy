import { json, Sequelize } from "sequelize";
import {
  DailyFact,
  initModel as initDailyFactModel,
} from "./models/daily_fact";
import { Answer, initModel as initAnswerModel } from "./models/answer";
import { Question, initModel as initQuestionModel } from "./models/question";
import { readFile, readSync } from "fs";
import { error } from "../utils/logging";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.db",
});

initQuestionModel(sequelize);
initAnswerModel(sequelize);

Question.hasMany(Answer, { foreignKey: "questionId", as: "answers" });
Answer.belongsTo(Question, { foreignKey: "questionId", as: "question" });

/*
sequelize.sync({ force: true }).then(async () => {
  readFile("data.json", async (error, data) => {
    const questions = JSON.parse(data.toString());
    for (const question of questions) {
      // console.log(question);
      const insertedQuestion = await Question.upsert({
        question: question.question,
      });
      for (const answer of question.answers) {
        // console.log(answer);
        await Answer.upsert({
          text: answer.text,
          explanation: answer.explanation,
          isCorrectAnswer: answer.correct_answer,
          questionId: insertedQuestion[0].id,
        });
      }
    }
  });
  readFile("facts.json", async (err, data) => {
    if (err) {
      error(err.message);
    }
    const facts = JSON.parse(data.toString());
    // console.log(facts);
    for (const fact of facts) {
      // console.log(fact);
      await DailyFact.upsert({ fact: fact });
    }
  });
});
*/

initDailyFactModel(sequelize);

export { DailyFact, Answer, Question };
