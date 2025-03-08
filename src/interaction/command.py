from abc import ABC, abstractmethod
from typing import Any, Coroutine, TypedDict, TYPE_CHECKING
from typing_extensions import NotRequired

import discord

if TYPE_CHECKING:
    from src.client import Freudy

class OptionChoice(TypedDict):
    name: str
    value: str


class Option(TypedDict):
    name: str
    description: str
    type: int
    required: NotRequired[bool]
    choices: NotRequired[list[OptionChoice]]
    options: NotRequired[list]


class Command(ABC):
    name: str
    description: str
    options: list[Option]
    adminstration_channel_only: bool = False
    moderator_only: bool = False

    def __init__(self) -> None:
        pass

    def get_name(self) -> str:
        return self.name

    def get_description(self) -> str:
        return self.description

    def get_options(self) -> list[Option]:
        return self.options

    @abstractmethod
    async def run(self, interaction : discord.Interaction['Freudy']) -> Coroutine[Any, Any, None]:
        pass

    def in_adminstration_channel_only(self) -> bool:
        return self.adminstration_channel_only

    def run_by_moderator_only(self) -> bool:
        return self.moderator_only
