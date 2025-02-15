# coding : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

from typing import Optional, List
from dataclasses import dataclass
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
    composite,
    object_session,
)


class Base(DeclarativeBase):

    __abstract__ = True

    @classmethod
    def set_database(cls, database):
        cls._database = database

    def save(self):
        with self._database.Session() as session:
            session.add(self)
            session.commit()


class Question(Base):

    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    question: Mapped[str] = mapped_column(nullable=False)

    answers: Mapped[List["Answer"]] = relationship(
        back_populates="question", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return (
            f"<{self.__class__.__name__}(id={self.id},question={repr(self.question)})>"
        )


class Answer(Base):

    __tablename__ = "answers"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    question_id: Mapped[int] = mapped_column(ForeignKey("questions.id"))
    response: Mapped[str] = mapped_column(nullable=False)
    explanation: Mapped[str] = mapped_column(nullable=False)
    is_correct_answer: Mapped[bool] = mapped_column()
    question: Mapped["Question"] = relationship(back_populates="answers")
