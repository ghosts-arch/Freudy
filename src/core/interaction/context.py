# coding : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

import logging
from typing import TYPE_CHECKING, Union, Optional

import discord
from discord.ui import View

if TYPE_CHECKING:
    from discord.interactions import InteractionChannel
    # import discord.types
    from src.core.client import Freudy
from src.core.embeds import Embed


logger = logging.getLogger()


class Context:

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
        return self.__interaction

    @property
    def name(self) -> str:
        return self.__name

    @property
    def message(self) -> Optional[discord.Message]:
        return self.__message

    @property
    def user(self) -> Union[discord.Member, discord.User]:
        return self.__user

    @property
    def data(self):
        return self.__data

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

    async def send(
        self,
        content: str | None = None,
        embed: Embed | None = None,
        file=None,
        view: View | None = None,
        ephemeral: bool = False,
    ):
        """Envoie la reponse dans le salon du message."""

        response: dict[str, str | Embed | View | None] = {}

        if content:
            response["content"] = content
        if embed:
            response["embed"] = embed
        if file:
            response["file"] = file
        if view:
            response["view"] = view

        if self.guild and self.channel:
            channel = self.guild.get_channel(self.channel.id)
            if not channel:
                logger.error("Channel not found")
                return
            if not (self.channel.permissions_for(self.guild.me).send_messages):
                logger.error("Bot not have permission to send message")
                return

        if not isinstance(embed, discord.Embed):
            return
        try:
            if view:

                await self.interaction.response.send_message(
                content=content, file=file, view=view,
                embed=embed, ephemeral=ephemeral
            )
            else:
                await self.interaction.response.send_message(
                content=content, file=file, 
                embed=embed, ephemeral=ephemeral)
        except Exception as error:
            logger.error(error)
