import { Sequelize } from "sequelize";
import { DailyFact, initModel as initDailyFactModel } from "./models/dailyFact";
import { Answer, initModel as initAnswerModel } from "./models/answer";
import { Question, initModel as initQuestionModel } from "./models/question";
import { User, initModel as initUserModel } from "./models/User";
import { readFile } from "fs";
import { error } from "../utils/logging";
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.db",
});

initUserModel(sequelize);
initQuestionModel(sequelize);
initAnswerModel(sequelize);

Question.hasMany(Answer, { foreignKey: "questionId", as: "answers" });
Answer.belongsTo(Question, { foreignKey: "questionId", as: "question" });

sequelize.sync({ force: true }).then(async () => {
  readFile("data3.json", async (error, data) => {
    const questions = JSON.parse(data.toString());
    for (const question of questions) {
      const validAnswer =
        question.answers[
          question.answers.findIndex(
            (answer: { text: string; isValidAnswer: boolean }) =>
              answer.isValidAnswer === true
          )
        ];
      const insertedQuestion = await Question.upsert({
        question: question.question,
        explanation: question.explanation,
      });
      for (const answer of question.answers) {
        await Answer.upsert({
          text: answer.text,
          isValidAnswer: answer.isValidAnswer,
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

initDailyFactModel(sequelize);

export { DailyFact, Answer, Question, User };
