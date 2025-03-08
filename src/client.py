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
                await context.interaction.response.send_message(
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
                await context.interaction.response.send_message(
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
