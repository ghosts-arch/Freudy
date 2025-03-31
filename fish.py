import json
import random
fish_answers = ["🐟", "🐠", "🐡", "🦐", "🦑", "🐙", "🦞", "🦀", "🐚", "🪸", "🪼", "🦈", "🐬", "🦭", "🐳", "🐋"]


with open("data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

    new_data = []
    for question in data:
        answers = []
        print(question["answers"])
        for k, answer in enumerate(question["answers"]):
            answers.append(
                {
                    "text": random.choice(fish_answers),
                    "explanation": answer["explanation"],
                    "correct_answer": (
                        True if int(k) == answer["correct_answer"] else False
                    ),
                }
            )

        new_data.append(
            {
                "question": question["question"],
                "answers": answers,
            }
        )

with open("fish_questions.json", "w", encoding="utf-8") as f:
    json.dump(new_data, f, ensure_ascii=False, indent=4)

