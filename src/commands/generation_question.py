"""
This module defines the `ApplicationCommand` class, which handles the generation of random questions
for a Discord bot. The command checks for user cooldowns, retrieves a random question
from the database, and sends it to the user with appropriate formatting based on whether the user
is on a mobile device.

Classes:
    ApplicationCommand: Represents the command to generate a random question.
Functions:
    run(context: Context) -> None: Executes the command, checking cooldowns and
    sending a random question.
"""

import logging
import time

import discord
from src.embeds import Embed, ErrorEmbed
from src.interaction import Context, Interaction
from src.ui.views import ReponsesView

logger = logging.getLogger()


class ApplicationCommand(Interaction):
    """
    A command class to generate a random question for a Discord bot.
    Attributes:
        name (str): The name of the command.
        description (str): The description of the command.
    Methods:
        __init__(): Initializes the command with a name and description.
        run(context: Context): Executes the command, checks for cooldowns, retrieves a random
        question from the database, and sends it to the user.
        If the user is on mobile, the question is formatted differently.
    """

    def __init__(self) -> None:
        self.name = "generate_question"
        self.description = "generer une question aléatoire"

    async def run(self, context: Context):
        if not isinstance(context.guild, discord.Guild):
            return
        result = context.client.cooldowns.find_user(context.user.id)
        if result:
            current_time = time.time()
            time_since_last_usage = current_time - result["last_usage"]
            remaining_time = 14400 - time_since_last_usage
            return await context.send(
                embed=ErrorEmbed(
                    f"Vous pourrez à nouveau jouer dans {int(remaining_time // 3600)} heures "
                    f"{int((remaining_time % 3600) // 60)} minutes "
                    f"{int(remaining_time % 60)} secondes."
                ),
                ephemeral=True,
            )

        context.client.cooldowns.add_user(context.user.id, context)

        question = context.client.database.get_random_question()
        logger.info("%s triggered by %s", question, context.user)
        member = context.guild.get_member(context.user.id)
        if not isinstance(member, discord.Member):
            raise TypeError("Expected member to be of type discord.Member")
        if member.is_on_mobile():
            description = f"Question : {question.question}\n"
            for index, answer in enumerate(question.answers):
                description += f"{index + 1}. {answer.text}\n"
            view = ReponsesView(question=question, mobile_version=True)
        else:
            description = f"{question.question}"
            view = ReponsesView(question=question, mobile_version=False)
        embed = Embed().set_description(description=description)
        return await context.send(embed=embed, view=view)
