# coding : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

import logging
from typing import TYPE_CHECKING, Union, Optional

import discord

if TYPE_CHECKING:
    from discord.interactions import InteractionChannel
    # import discord.types
    from src.client import Freudy


logger = logging.getLogger()


class Context:
    """
    Classe qui represente le contexte lié à une commande.
    """
    def __init__(self, interaction: discord.Interaction["Freudy"]) -> None:

        if not interaction.data:
            raise ValueError("interaction.data is None")

        self.__interaction : discord.Interaction["Freudy"] = interaction
        self.__name : str = str(interaction.data.get("name"))
        self.__message : Optional[discord.Message]= interaction.message
        self.__user : Union[discord.Member , discord.User] = interaction.user
        self.__data  = interaction.data
        self.__client : Freudy = interaction.client
        self.__guild  : Optional[discord.Guild] = interaction.guild
        self.__channel : Optional[InteractionChannel] = interaction.channel

    @property
    def interaction(self) -> discord.Interaction["Freudy"]:
        """
        This Python function returns a Discord interaction object of type "Freudy".
        :return: An interaction object of type "Freudy" from the discord module.
        """
        return self.__interaction

    @property
    def name(self) -> str:
        return self.__name

    @property
    def message(self) -> Optional[discord.Message]:
        """
        This function returns a discord message or None.
        :return: The method `message` is returning the attribute `__message`, which is of type
        `discord.Message` or `None` if it is not set.
        """
        return self.__message

    @property
    def user(self) -> Union[discord.Member, discord.User]:
        """
        This Python function returns a discord Member or User object.
        :return: The method `user` is returning either a `discord.Member`
        or a `discord.User` object.
        """
        return self.__user

    @property
    def data(self):
        """
        The function `data` returns the private attribute `__data` of the class.
        :return: The `data` method is returning the private attribute `__data` of the class.
        """
        return self.__data

    @property
    def client(self) -> 'Freudy':
        """
        The function `client` returns the value of the private attribute `__client`.
        :return: An instance of the class 'Freudy' is being returned.
        """
        return self.__client

    @property
    def guild(self) -> Optional[discord.Guild]:
        """
        This function returns the guild associated with the object, or None if there is no guild.
        :return: The method `guild` is returning the `__guild` attribute, which is of type
        `discord.Guild` or `None` if it is not set.
        """
        return self.__guild

    @property
    def channel(self) -> 'InteractionChannel':
        """
        The function `channel` returns the interaction channel if it exists, otherwise raises a
        ValueError.
        :return: The `channel` method is returning the `__channel` attribute if it is not None. If
        `__channel` is None, it raises a ValueError with the message "interaction.channel is None".
        """
        if self.__channel:
            return self.__channel
        raise ValueError("interaction.channel is None")

    @property
    def options(self):
        """
        The `options` function returns the options stored in the `data` attribute of the object.
        :return: The `options` value from the `data` dictionary is being returned.
        """
        return self.data.get("options")
