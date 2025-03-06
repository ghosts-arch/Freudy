# encode : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

import logging
import time

import discord
from src.core.embeds import Embed, ErrorEmbed
from src.core.interaction import Context, Interaction
from src.core.ui.views import ReponsesView

logger = logging.getLogger()


class ApplicationCommand(Interaction):

    def __init__(self) -> None:
        self.name = "generate_question"
        self.description = "generer une question aléatoire"

    async def run(self, context: Context) -> None:
        if not isinstance(context.guild, discord.Guild):
            return
        result = context.client.cooldowns.find_user(context.user.id)
        
        if result:
            current_time = time.time()
            time_since_last_usage = current_time - result["last_usage"]
            remaining_time = 14400 - time_since_last_usage
            hours = remaining_time // 3600
            minutes = (remaining_time % 3600) // 60
            seconds = remaining_time % 60
            return await context.send(
                embed=ErrorEmbed(
                    f"Vous pourrez à nouveau jouer dans {int(hours)} heures {int(minutes)} minutes {int(seconds)} secondes."
                ),
                ephemeral=True,
            )

        context.client.cooldowns.add_user(context.user.id, context)

        question = context.client.database.get_random_question()
        logger.info(f"{question} triggered by {context.user}")
        member = context.guild.get_member(context.user.id)
        if not isinstance(member, discord.Member):
            return
        on_mobile = member.is_on_mobile()
        if on_mobile:
            description = f"Question : {question.question}\n"
            for index, answer in enumerate(question.answers):
                description += f"{index + 1}. {answer.response}\n"
            view = ReponsesView(question=question, mobile_version=True)
        else:
            description = f"{question.question}"
            view = ReponsesView(question=question, mobile_version=False)
        embed = Embed().set_description(description=description)
        await context.send(embed=embed, view=view)
