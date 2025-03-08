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
    def __init__(self, interaction: discord.Interaction["Freudy"]) -> None:

        if not interaction.data:
            raise ValueError("interaction.data is None")

        self.__interaction : discord.Interaction["Freudy"] = interaction
        self.__name : str = str(interaction.data.get("name"))
        # self.__message : Optional[discord.Message]= interaction.message
        # self.__user : Union[discord.Member , discord.User] = interaction.user
        self.__data  = interaction.data
        self.__client : Freudy = interaction.client
        self.__guild  : Optional[discord.Guild] = interaction.guild
        self.__channel : Optional[InteractionChannel] = interaction.channel

    @property
    def interaction(self) -> discord.Interaction["Freudy"]:
        return self.__interaction

    @property
    def name(self) -> str | None:
        name = str(self.__interaction.data.get("name"))
        return name


    @property
    def message(self) -> Optional[discord.Message]:
        return self.interaction.message

    @property
    def user(self) -> Union[discord.Member, discord.User]:
        return self.interaction.user

    @property
    def data(self):
        return self.__interaction.data

    @property
    def client(self) -> 'Freudy':
        return self.__client

    @property
    def guild(self) -> Optional[discord.Guild]:
        return self.__guild

    @property
    def channel(self) -> 'InteractionChannel':
        if self.__channel:
            return self.__channel
        raise ValueError("interaction.channel is None")

    @property
    def options(self):
        return self.data.get("options")
