import logging
import time
from typing import TYPE_CHECKING, Coroutine, Any, Awaitable

if TYPE_CHECKING:
    from src.client import Freudy

import discord
from src.embeds import Embed, ErrorEmbed

from src.ui.views import ReponsesView

from .command import Command

logger = logging.getLogger()

async def run(interaction : discord.Interaction["Freudy"]) -> None:
        result = interaction.client.cooldowns.find_user(interaction.user.id)
        if result:
            current_time = time.time()
            time_since_last_usage = current_time - result["last_usage"]
            remaining_time = 14400 - time_since_last_usage
            return await interaction.response.send_message(
                embed=ErrorEmbed(
                    f"Vous pourrez à nouveau jouer dans {int(remaining_time // 3600)} heures "
                    f"{int((remaining_time % 3600) // 60)} minutes "
                    f"{int(remaining_time % 60)} secondes."
                ),
                ephemeral=True,
            )

        interaction.client.cooldowns.add_user(interaction.user.id, interaction)

        question = interaction.client.database.get_random_question()
        logger.info("%s triggered by %s", question, interaction.user)
        member = interaction.guild.get_member(interaction.user.id)
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
        await interaction.response.send_message(embed=embed, view=view)

command : Command = {
    "name" : "question",
    "description" : "Envoie une question aléatoire.",
    "run" : run,
    "in_administration_channel_only" : False
}