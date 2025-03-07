"""
This module contains the implementation of the Freudy discord bot client.
It handles the initialization, configuration, and event handling for the bot.
"""

import asyncio
import json
import logging
import pathlib
import sys
import traceback

import discord

from src.embeds import ErrorEmbed
from .config import load_config, validate_config
from .cooldowns import CooldownsManager
from .database.database import Database
from .interaction import (
    Context,
    load_application_commands,
    register_application_commands,
)
from .managers.daily_fact_manager import DailyFactManager


logger = logging.getLogger()

config_path = pathlib.Path("config.json")


class Freudy(discord.Client):
    """
    A custom Discord client for the Freudy bot.
    Attributes:
        database (Database): The database instance for the bot.
        application_commands (dict): A dictionary of application commands.
        config (dict): The configuration settings for the bot.
        cooldowns (CooldownsManager): The cooldown manager for the bot.
        loop (asyncio.AbstractEventLoop): The event loop for asynchronous operations.
    Methods:
        __init__(): Initializes the Freudy bot client.
        on_ready(): Event handler for when the bot is ready.
        on_interaction(interaction: discord.Interaction["Freudy"]): Event handler for interactions.
    """

    def __init__(self):

        super().__init__(intents=discord.Intents.all())
        self.database = Database()
        self.database.init()
        self.application_commands = load_application_commands()
        try:
            self.config = load_config(path=config_path)
            validate_config(self.config)
        except (KeyError, ValueError, FileNotFoundError, json.decoder.JSONDecodeError) as error:
            logger.error("%s", error)
            sys.exit(1)
        self.cooldowns = CooldownsManager()
        self.loop = asyncio.get_event_loop()

    async def on_ready(self) -> None:
        """
        Event handler for when the bot is ready.
        This function is called when the bot has successfully connected to Discord
        and is ready to start interacting with the API. It performs the following tasks:
        - Registers application commands.
        - Starts the DailyFactManager.
        - Logs the bot's username.
        - Sends a message to the test channel indicating that the bot is ready.
        Raises:
            Exception: If there is an error during the registration of application commands.
        """

        await register_application_commands(
                application_commands=self.application_commands
        )
        DailyFactManager(self).start()
        logger.info("Logged as %s", self.user)
        test_channel_id: int = self.config["test_channel_id"]
        test_channel = self.get_channel(test_channel_id)

        if isinstance(test_channel, discord.TextChannel):
            await test_channel.send(f"{self.user} ready.")

    async def on_interaction(self, interaction: discord.Interaction["Freudy"]):
        """
        Handles interactions received from Discord.
        This method is triggered when an interaction is received. It processes
        application command interactions, checks for command permissions, and
        executes the command if all checks pass.
        Parameters:
        -----------
        interaction : discord.Interaction["Freudy"]
            The interaction received from Discord.
        Returns:
        --------
        None
        """

        if interaction.type == discord.InteractionType.application_command:
            context = Context(interaction)
            command = self.application_commands.get(context.name)

            if not command:
                return

            if (
                command.in_adminstration_channel_only()
                and not context.channel.id
                == self.config.get("ADMINSTRATION_CHANNEL_ID")
            ):
                await context.send(
                    embed=ErrorEmbed(
                        description=(
                            "This command can only be used"
                            + " in the administration channel."
                        )
                    )
                )
                return
            if not isinstance(context.user, discord.Member):
                return
            if (
                command.run_by_moderator_only()
                and not context.user.guild_permissions.administrator
            ):
                await context.send(
                    embed=ErrorEmbed(
                        description="This command can only be used by adminstrator."
                    )
                )
                return

            try:
                await command.run(context=context)
                logger.info(
                    "Command %s executed by %s in #%s", context.name, context.user, context.channel
                )
            except Exception:
                logger.error(traceback.format_exc())
