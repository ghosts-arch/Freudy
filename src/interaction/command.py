"""
Classe abstraite représentant une commande.
"""

from abc import ABC, abstractmethod
from typing import Any, Coroutine, TypedDict
from typing_extensions import NotRequired

from .context import Context


class OptionChoice(TypedDict):
    """
    Represente un choix pour une option.
    """
    name: str
    value: str


class Option(TypedDict):
    """
    Represente une option d'une commande.
    """
    name: str
    description: str
    type: int
    required: NotRequired[bool]
    choices: NotRequired[list[OptionChoice]]
    options: NotRequired[list]


class Command(ABC):
    """
    Classe abstraite représentant une slash commande.
    """
    name: str
    description: str
    options: list[Option]
    adminstration_channel_only: bool = False
    moderator_only: bool = False

    def __init__(self) -> None:
        pass

    def get_name(self) -> str:
        """
        Retourne le nom de la commande.
        """
        return self.name

    def get_description(self) -> str:
        """
        Retourne la description de la commande.
        """
        return self.description

    def get_options(self) -> list[Option]:
        """
        Retourne les options de la commande.
        """
        return self.options

    @abstractmethod
    async def run(self, context: Context) -> Coroutine[Any, Any, None]:
        """
    Abstract method to be implemented by subclasses to define the interaction logic.

    Args:
        context (Context): The context in which the interaction is executed.

    Returns:
        Coroutine[Any, Any, None]: A coroutine that performs the interaction.
    """

    def in_adminstration_channel_only(self) -> bool:
        """
        Check if the interaction is restricted to the administration channel only.

        Returns:
            bool: True if the interaction is restricted to the administration channel,
            False otherwise.
        """
        return self.adminstration_channel_only

    def run_by_moderator_only(self) -> bool:
        """
        Checks if the interaction is restricted to moderators only.

        Returns:
            bool: True if the interaction is restricted to moderators, False otherwise.
        """
        return self.moderator_only
