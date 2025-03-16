import asyncio
import json
import logging
import pathlib
import sys

import discord

from typing import TYPE_CHECKING, Any

from src.commands import Command, CommandsHandler

if TYPE_CHECKING:
    from src.commands import Command

from src.embeds import ErrorEmbed
from .config import load_config, validate_config
from .cooldowns import CooldownsManager
from .database.database import Database
from .managers.daily_fact_manager import DailyFactManager


logger = logging.getLogger()

config_path = pathlib.Path("config.json")


class Freudy(discord.Client):

    def __init__(self):

        super().__init__(intents=discord.Intents.all())
        self.database = Database()
        self.database.init()
        self.application_commands = CommandsHandler()
        try:
            self.config = load_config(path=config_path)
            validate_config(self.config)
        except (KeyError, ValueError, FileNotFoundError, json.decoder.JSONDecodeError) as error:
            logger.error("%s", error)
            sys.exit(1)
        

        
        self.loop = asyncio.get_event_loop()
        self.cooldowns = CooldownsManager()
        
        

    async def on_ready(self) -> None:
        DailyFactManager(self).start()
        logger.info("Logged as %s", self.user)
        test_channel_id: int = self.config["test_channel_id"]
        test_channel = self.get_channel(test_channel_id)

        if isinstance(test_channel, discord.TextChannel):
            await test_channel.send(f"{self.user} ready.")

   
    async def on_interaction(self, interaction: discord.Interaction["Freudy"]):

        if interaction.type == discord.InteractionType.application_command:
            if not interaction.data:
                return
            command_name = interaction.data.get("name")
            if not command_name or not isinstance(command_name, str) : 
                return
            command = self.application_commands.get(command_name)

            if not command:
                return

            if not interaction.channel:
                return 
            
            if not interaction.guild:
                return
            
            if (
                command.in_adminstration_channel_only()
                and not interaction.channel.id
                == self.config.get("ADMINSTRATION_CHANNEL_ID")
            ):
                await interaction.response.send_message(
                    embed=ErrorEmbed(
                        description=(
                            "This command can only be used"
                            + " in the administration channel."
                        )
                    )
                )
                return
            if not isinstance(interaction.user, discord.Member):
                return
            if (
                command.run_by_moderator_only()
                and not interaction.user.guild_permissions.administrator
            ):
                await interaction.response.send_message(
                    embed=ErrorEmbed(
                        description="This command can only be used by adminstrator."
                    )
                )
                return

            run = command.get["run"]
            await run(interaction)
            logger.info(
                    "Command %s executed by %s in #%s",
                    command_name,
                    interaction.user,
                    interaction.channel
                )
