import logging
import os
import discord
from typing import TYPE_CHECKING, Coroutine, Any

if TYPE_CHECKING:
     from src.client import Freudy

from src.embeds import ErrorEmbed
from .command import Command

logger = logging.getLogger()


async def run(interaction : discord.Interaction["Freudy"]) -> None:
        logs_file_path = os.path.join("logs", "bot.log")

        if not os.path.exists(logs_file_path):
            await interaction.response.send_message(
                embed=ErrorEmbed(
                    description="Le fichier de logs n'existe pas",
                )
            )
            return None

        with open(logs_file_path, "r", encoding="utf-8") as f:
            logs = f.readlines()

        last_logs = "".join(logs[-20:])

        if len(last_logs) > 2000:
            last_logs = "".join(logs[-10:])

        await interaction.response.send_message(content=f"```{last_logs}```")
        return None

command : Command = {
    "name" : "logs",
    "description" : "Renvoie les logs du bot.",
    "in_administration_channel_only" : True,
    "moderation_only" : True,
    "run" : run
}