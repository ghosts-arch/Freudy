import { Sequelize } from "sequelize";
import { DailyFact, initModel as initDailyFactModel } from "./models/dailyFact";
import { Answer, initModel as initAnswerModel } from "./models/answer";
import { Question, initModel as initQuestionModel } from "./models/question";
import { User, initModel as initUserModel } from "./models/User";
import { readFile } from "fs";
import { error } from "../utils/logging";
import path from "path";

const STORAGE_PATH = path.resolve(process.cwd(), "database.db");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: STORAGE_PATH,
});

initUserModel(sequelize);
initQuestionModel(sequelize);
initAnswerModel(sequelize);

Question.hasMany(Answer, { foreignKey: "questionId", as: "answers" });
Answer.belongsTo(Question, { foreignKey: "questionId", as: "question" });

sequelize.sync({ force: false }).then(async () => {
  /* readFile("facts.json", async (err, data) => {
    if (err) {
      error(err.message);
    }
    const facts = JSON.parse(data.toString());
    for (const fact of facts) {
      await DailyFact.upsert({ fact: fact });
    }
  });
  */
});

initDailyFactModel(sequelize);

export { DailyFact, Answer, Question, User };
