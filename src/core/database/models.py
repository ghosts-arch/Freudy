# coding : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

from typing import List
from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):

    _database = None

    __abstract__ = True

    @classmethod
    def set_database(cls, database):
        cls._database = database

    def save(self):
        if not self._database:
            raise Exception("set_database must be called before save")
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
    text: Mapped[str] = mapped_column(nullable=False)
    explanation: Mapped[str] = mapped_column(nullable=False)
    is_correct_answer: Mapped[bool] = mapped_column()
    question: Mapped["Question"] = relationship(back_populates="answers")


class DailyFact(Base):

    __tablename__ = "daily_facts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    fact: Mapped[str] = mapped_column(nullable=False)

    def __repr__(self):
        return f"<{self.__class__.__name__}(id={self.id},fact={repr(self.fact)})>"
