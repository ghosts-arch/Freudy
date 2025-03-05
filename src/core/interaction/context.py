# coding : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

import logging
import discord

from src.core.embeds import Embed, ErrorEmbed
from discord.ui.view import View


logger = logging.getLogger()


class Context:

    def __init__(self, interaction: discord.Interaction):

        super().__init__()

        if not interaction.data:
            raise ValueError("interaction.data is None")

        self.__interaction = interaction
        self.__name = str(interaction.data.get("name"))
        self.__message = interaction.message
        self.__user = interaction.user
        self.__data = interaction.data

    @property
    def message(self):
        return self.__message

    @property
    def user(self):
        return self.__user

    @property
    def guild(self) -> discord.Guild | None:
        return self.interaction.guild

    @property
    def channel(self):
        if self.interaction.channel:
            return self.interaction.channel
        raise ValueError("interaction.channel is None")

    @property
    def name(self):
        return self.__name

    @property
    def data(self):
        return self.__data

    @property
    def options(self):
        return self.data.get("options")

    @property
    def interaction(self):
        return self.__interaction

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

        try:
            await self.interaction.response.send_message(
                **response, ephemeral=ephemeral
            )
        except Exception as error:
            logger.error(error)
