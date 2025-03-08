import json
import logging
import os
import time
from contextlib import contextmanager

import sqlalchemy
from sqlalchemy import select
from sqlalchemy.orm import joinedload, sessionmaker

from .models import Answer, Base, DailyFact, Question


logger = logging.getLogger()


def load_json_file(path: str):
    with open(path, mode="r", encoding="utf-8") as f:
        content = json.load(f)
    return content


class Database:

    def __init__(self) -> None:
        echo = bool(os.getenv("DEV_MODE"))
        self.engine = sqlalchemy.create_engine(
            "sqlite:///./database.db",
            echo=echo,
        )
        Base.metadata.create_all(self.engine)
        Base.set_database(self)
        self.session = sessionmaker(self.engine, expire_on_commit=False)

    def init(self):
        try:
            self.populate_facts()
            self.populate_questions()
        except Exception as error:
            logger.error(error)

    def close(self):
        self.engine.dispose()

    @contextmanager
    def session_scope(self):
        session = self.session()
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
        finally:
            session.close()

    def get_random_question(self):
        with self.session_scope() as session:
            statement = (
                select(Question)
                .options(joinedload(Question.answers))
                .order_by(sqlalchemy.func.random())
                .limit(1)
            )
            result = session.scalars(statement=statement).first()
        return result

    def validate_answer(self, text: str):
        if len(text) > 80:
            raise ValueError(
                f"Answer text exceeds max length: {text} ({len(text)} characters)"
            )

    def create_answer(
        self, text: str, explanation: str, is_correct_answer: bool, question: Question
    ) -> Answer:
        try:
            self.validate_answer(text=text)
        except ValueError as error:
            raise ValueError(error)
        return Answer(
            text=text,
            explanation=explanation,
            is_correct_answer=is_correct_answer,
            question=question,
        )

    def create_question(self, question: str) -> Question:
        return Question(question=question)

    def populate_questions(self) -> None:
        start_time = time.perf_counter()
        questions = load_json_file("data.json")
        with self.session_scope() as session:
            select_questions_statement = select(Question.question)
            existing_questions = set(
                session.scalars(statement=select_questions_statement).all()
            )
            new_questions = [
                question
                for question in questions
                if question["question"] not in existing_questions
            ]
            for question_data in new_questions:
                question: Question = self.create_question(
                    question=question_data["question"]
                )
                for answer in question_data["answers"]:
                    answer = self.create_answer(
                        text=answer["text"],
                        explanation=answer["explanation"],
                        is_correct_answer=answer["correct_answer"],
                        question=question,
                    )
                    question.answers.append(answer)
                session.add(question)
        end_time = time.perf_counter()
        logger.info(
            "Populated %d questions in %f:.2f seconds.",
            len(new_questions),
            (end_time - start_time) * 1000
        )

    def get_daily_facts(self):
        with self.session_scope() as session:
            statement = select(DailyFact.fact)
            fact = session.scalars(statement=statement).all()
        return set(fact)

    def get_random_daily_fact(self):
        with self.session_scope() as session:
            statement = select(DailyFact).order_by(sqlalchemy.func.random()).limit(1)
            result = session.scalars(statement=statement).first()
        return result

    def populate_facts(self) -> None:
        start_time = time.perf_counter()
        facts = load_json_file("facts.json")
        existing_facts: set[str] = self.get_daily_facts()
        created_facts: list[DailyFact] = [
            DailyFact(fact=fact) for fact in facts if fact not in existing_facts
        ]
        with self.session_scope() as session:
            session.bulk_insert_mappings(
                DailyFact, [fact.__dict__ for fact in created_facts]
            )
        end_time = time.perf_counter()
        logger.info(
            "Populated %d facts in %f:.2f seconds.",
            len(created_facts),
            (end_time - start_time) * 1000
        )
