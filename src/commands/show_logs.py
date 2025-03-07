"""
This module defines the `ApplicationCommand` class which is responsible for displaying
the bot's logs. It includes functionality to check for the existence of the log file
and send the last few lines of the log to a specified context.
Classes:
    ApplicationCommand: A class that inherits from `Interaction` and provides a command
    to show the bot's logs.
Functions:
    run(context: Context): Asynchronously runs the command to display the bot's logs in
    the specified context.
"""

import logging
import os

from src.core.embeds import ErrorEmbed
from src.core.interaction import Context, Interaction

logger = logging.getLogger()


class ApplicationCommand(Interaction):
    """
    A command to show the logs of the bot.
    Attributes:
        name (str): The name of the command.
        description (str): The description of the command.
        administration_channel_only (bool): Whether the command can only be used in
        administration channels.
    Methods:
        run(context: Context):
            Executes the command to show the last logs of the bot.
            Sends an error message if the log file does not exist.
            Sends the last 20 lines of the log file, or the last 10 lines if the
            content exceeds 2000 characters.
    """

    def __init__(self) -> None:
        self.name = "show_logs"
        self.description = "affiche les logs du bot"
        self.administration_channel_only = True

    async def run(self, context: Context):
        logs_file_path = os.path.join("logs", "bot.log")

        if not os.path.exists(logs_file_path):
            await context.send(
                embed=ErrorEmbed(
                    description="Le fichier de logs n'existe pas",
                )
            )
            return

        with open(logs_file_path, "r", encoding="utf-8") as f:
            logs = f.readlines()

        last_logs = "".join(logs[-20:])

        if len(last_logs) > 2000:
            last_logs = "".join(logs[-10:])

        await context.send(content=f"```{last_logs}```")
