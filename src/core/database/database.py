# coding : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

import json
import io
import discord
import sqlalchemy
import os
from contextlib import contextmanager
import logging
from datetime import datetime
from sqlalchemy import (
    select,
    delete,
    update,
)
from sqlalchemy.orm import sessionmaker, joinedload

from .models import Base, Answer, Question, DailyFact

logger = logging.getLogger()


def load_json_file(path: str):
    with open(path, mode="r", encoding="utf-8") as f:
        content = json.load(f)
    return content


class Database:

    def __init__(self):
        echo = bool(os.getenv("DEV_MODE"))
        self.engine = sqlalchemy.create_engine(
            "sqlite:///src/core/database/database.db",
            echo=echo,
        )
        Base.metadata.create_all(self.engine)
        Base.set_database(self)
        self.Session = sessionmaker(self.engine, expire_on_commit=False)
        try:
            self.populate_database()
        except ValueError as error:
            logger.error(error)

    @contextmanager
    def session_scope(self):
        session = self.Session()
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

    def populate_database(self):
        questions = load_json_file("data.json")
        facts = load_json_file("facts.json")
        with self.session_scope() as session:
            select_questions_statement = select(Question.question)
            existing_questions = session.scalars(
                statement=select_questions_statement
            ).all()
            select_facts_statement = select(DailyFact.fact)
            existing_facts = session.scalars(statement=select_facts_statement).all()
        for question_data in questions:
            if question_data["question"] in existing_questions:
                print("question already in database...")
                continue

            question = Question(
                question=question_data["question"],
            )

            for key, value in question_data["answers"].items():
                if len(value["text"]) > 80:
                    print(f"error : {value['text']} ({len(value['text'])} characters)")
                    raise ValueError(
                        f"Answer text exceeds max length: {value['text']} ({len(value['text'])} characters)"
                    )
                answer = Answer(
                    response=value["text"],
                    explanation=value["explanation"],
                    is_correct_answer=(
                        True if int(key) == question_data["correct_answer"] else False
                    ),
                    question=question,
                )
                question.answers.append(answer)

            with self.session_scope() as session:
                session.add(question)
                print("question added to database")

        for fact in facts:
            if fact in existing_facts:
                print("fact already in database...")
                continue

            fact = DailyFact(fact=fact)
            with self.session_scope() as session:
                session.add(fact)
                print("fact added in database")
