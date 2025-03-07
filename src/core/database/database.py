"""
This module provides functionality for managing a database of questions and answers,
as well as daily facts. It includes a Database class with methods for initializing,
populating, and interacting with the database, and a utility function for loading
JSON files.
Classes:
    Database: A class for managing database operations, including creating questions
              and answers, retrieving random questions and daily facts, and managing
              database sessions.
Functions:
    load_json_file(path: str): Load and return the contents of a JSON file.
    logger (logging.Logger): A logger instance for logging messages.
Usage:
    db = Database()
    db.init()
    random_question = db.get_random_question()
    random_fact = db.get_random_daily_fact()
"""

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
    """
    Load and return the contents of a JSON file.

    Args:
        path (str): The file path to the JSON file.

    Returns:
        dict: The contents of the JSON file as a dictionary.

    Raises:
        FileNotFoundError: If the file does not exist.
        json.JSONDecodeError: If the file is not a valid JSON.
    """
    with open(path, mode="r", encoding="utf-8") as f:
        content = json.load(f)
    return content


class Database:
    """
    Database class for managing database operations.
    This class provides methods to initialize, populate, and interact with the database.
    It includes methods for creating questions and answers, retrieving random questions
    and daily facts, and managing database sessions.
    Attributes:
        engine (sqlalchemy.engine.Engine): The SQLAlchemy engine for database connection.
        Session (sqlalchemy.orm.session.sessionmaker): The session factory for creating sessions.
    Methods:
        __init__(): Initializes the Database instance and sets up the engine and session.
        init(): Initializes the database by populating facts and questions.
        close(): Closes the database connection by disposing of the engine.
        session_scope(): Provides a transactional scope around a series of operations.
        get_random_question(): Retrieves a random question from the database.
        validate_answer(text: str): Validates the provided answer text.
        create_answer(text: str, explanation: str, is_correct_answer: bool, question: Question) 
        -> Answer:
        create_question(question: str) -> Question: Creates a new Question instance with the given
        question text.
        populate_questions(): Populates the database with questions from a JSON file.
        get_daily_facts(): Retrieves daily facts from the database.
        get_random_daily_fact(): Retrieves a random daily fact from the database.
        populate_facts(): Populates the database with new facts from a JSON file.
    """

    def __init__(self):
        echo = bool(os.getenv("DEV_MODE"))
        self.engine = sqlalchemy.create_engine(
            "sqlite:///src/core/database/database.db",
            echo=echo,
        )
        Base.metadata.create_all(self.engine)
        Base.set_database(self)
        self.Session = sessionmaker(self.engine, expire_on_commit=False)

    def init(self):
        """
        Initializes the database by populating facts and questions.

        This method attempts to populate the database with facts and questions
        by calling the `populate_facts` and `populate_questions` methods. If an
        exception occurs during this process, it logs the error.

        Raises:
            Exception: If an error occurs during the population of facts or questions.
        """
        try:
            self.populate_facts()
            self.populate_questions()
        except Exception as error:
            logger.error(error)

    def close(self):
        """
        Closes the database connection by disposing of the engine.
        """
        self.engine.dispose()

    @contextmanager
    def session_scope(self):
        """
    Provide a transactional scope around a series of operations.

    This context manager yields a SQLAlchemy session and ensures that the session is committed
    if no exceptions occur, or rolled back if an exception is raised. The session is always
    closed at the end of the context.

    Yields:
        session (Session): A SQLAlchemy session object.

    Raises:
        Exception: If an error occurs during the session, the session is rolled back.
    """
        session = self.Session()
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
        finally:
            session.close()

    def get_random_question(self):
        """
        Retrieve a random question from the database.

        This method selects a random question from the Question table, including
        its associated answers, and returns it.

        Returns:
            Question: A randomly selected question with its associated answers.
        """
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
        """
        Validates the provided answer text.

        Args:
            text (str): The answer text to validate.

        Raises:
            ValueError: If the length of the answer text exceeds 80 characters.
        """
        if len(text) > 80:
            raise ValueError(
                f"Answer text exceeds max length: {text} ({len(text)} characters)"
            )

    def create_answer(
        self, text: str, explanation: str, is_correct_answer: bool, question: Question
    ) -> Answer:
        """
        Creates an Answer object with the given parameters.

        Args:
            text (str): The text of the answer.
            explanation (str): The explanation for the answer.
            is_correct_answer (bool): Indicates if the answer is correct.
            question (Question): The question to which this answer belongs.

        Returns:
            Answer: The created Answer object.

        Raises:
            ValueError: If the answer text is invalid.
        """
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
        """
        Creates a new Question instance with the given question text.

        Args:
            question (str): The text of the question to be created.

        Returns:
            Question: A new Question instance with the provided question text.
        """
        return Question(question=question)

    def populate_questions(self):
        """
        Populates the database with questions from a JSON file.

        This method loads questions from a JSON file named "data.json" and inserts
        them into the database if they do not already exist. Each question can have
        multiple answers, which are also inserted into the database.

        The method measures the time taken to populate the questions and logs the
        number of new questions added along with the time taken.

        Raises:
            FileNotFoundError: If the "data.json" file is not found.
            JSONDecodeError: If the "data.json" file contains invalid JSON.

        Notes:
            - The method uses a session scope to handle database transactions.
            - Existing questions are identified by their text to avoid duplicates.

        """
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
        """
        Retrieve daily facts from the database.

        This method opens a new session, executes a SQL SELECT statement to fetch
        all daily facts from the database, and returns them as a set.

        Returns:
            set: A set of daily facts retrieved from the database.
        """
        with self.session_scope() as session:
            statement = select(DailyFact.fact)
            fact = session.scalars(statement=statement).all()
        return set(fact)

    def get_random_daily_fact(self):
        """
        Retrieve a random daily fact from the database.

        This method selects a random entry from the DailyFact table
        and returns it. It uses a session scope to interact with the
        database and ensures that only one random fact is retrieved.

        Returns:
            DailyFact: A randomly selected DailyFact object from the database.
        """
        with self.session_scope() as session:
            statement = select(DailyFact).order_by(sqlalchemy.func.random()).limit(1)
            result = session.scalars(statement=statement).first()
        return result

    def populate_facts(self) -> None:
        """
        Populate the database with new facts from a JSON file.

        This method loads facts from a JSON file, checks for any new facts that are not
        already in the database, and inserts the new facts into the database. It also logs
        the time taken to perform this operation.

        Raises:
            FileNotFoundError: If the JSON file containing facts is not found.
            JSONDecodeError: If the JSON file is not properly formatted.
        """
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
