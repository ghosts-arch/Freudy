import logging
import time

import discord
from src.embeds import Embed, ErrorEmbed
from src.interaction import Context, Command
from src.ui.views import ReponsesView

logger = logging.getLogger()


class QuestionCommand(Command):

    def __init__(self) -> None:
        self.name = "question"
        self.description = "generer une question aléatoire"

    async def run(self, context: Context):
        if not isinstance(context.guild, discord.Guild):
            return
        result = context.client.cooldowns.find_user(context.user.id)
        if result:
            current_time = time.time()
            time_since_last_usage = current_time - result["last_usage"]
            remaining_time = 14400 - time_since_last_usage
            return await context.interaction.response.send_message(
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
        return await context.interaction.response.send_message(embed=embed, view=view)
