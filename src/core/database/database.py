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
import time
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
            self.populate_questions()
            self.populate_facts()
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

    def populate_questions(self):
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
                question = Question(
                    question=question_data["question"],
                )
                for key, value in question_data["answers"].items():
                    if len(value["text"]) > 80:
                        print(
                            f"error : {value['text']} ({len(value['text'])} characters)"
                        )
                        raise ValueError(
                            f"Answer text exceeds max length: {value['text']} ({len(value['text'])} characters)"
                        )
                    answer = Answer(
                        response=value["text"],
                        explanation=value["explanation"],
                        is_correct_answer=(
                            True
                            if int(key) == question_data["correct_answer"]
                            else False
                        ),
                        question=question,
                    )
                    question.answers.append(answer)
                session.add(question)
                logger.info("%s added to database.", question)

    def get_daily_facts(self):
        with self.session_scope() as session:
            statement = select(DailyFact.fact)
            fact = session.scalars(statement=statement).all()
        return set(fact)

    def populate_facts(self):
        start_time = time.perf_counter()
        facts = load_json_file("facts.json")
        existing_facts = self.get_daily_facts()
        created_facts = [
            DailyFact(fact=fact) for fact in facts if fact not in existing_facts
        ]
        with self.session_scope() as session:
            session.add_all(created_facts)
        for fact in created_facts:
            logger.info("%s added to database.", fact)
        end_time = time.perf_counter()
        logger.info(
            f"Populated {len(created_facts)} facts in {(end_time - start_time) * 1000:.2f} seconds."
        )
