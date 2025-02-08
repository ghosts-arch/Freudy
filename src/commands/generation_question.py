# encode : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

import random

import threading
import time
from src.core.interaction import Interaction, Context
from src.core.embeds import Embed, ErrorEmbed
from src.core.ui.views import ReponsesView
import logging

logger = logging.getLogger()


class ApplicationCommand(Interaction):

    def __init__(self) -> None:
        self.name = "generate_question"
        self.description = "generer une question aléatoire"

    async def run(self, client, context: Context) -> None:
        result = client.cooldowns.find_user(context.user.id)

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

        client.cooldowns.add_user(context.user.id, context)

        question = client.database.get_random_question()
        logger.info(f"{question} triggered by {context.user}")
        on_mobile = context.guild.get_member(context.user.id).is_on_mobile()
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
