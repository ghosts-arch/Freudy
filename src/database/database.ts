import path from "node:path";
import { Sequelize } from "sequelize";
import { Answer, initModel as initAnswerModel } from "./models/answer";
import { DailyFact, initModel as initDailyFactModel } from "./models/dailyFact";
import { initModel as initQuestionModel, Question } from "./models/question";
import { initModel as initUserModel, User } from "./models/User";

const STORAGE_PATH = path.resolve(process.cwd(), "database.db");
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: STORAGE_PATH,
});

initUserModel(sequelize);
initQuestionModel(sequelize);
initAnswerModel(sequelize);
initDailyFactModel(sequelize);

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



export { DailyFact, Answer, Question, User };
