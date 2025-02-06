import discord
from src.core.ui.buttons import QuestionAnswerButton
from src.core.embeds import SuccessEmbed, ErrorEmbed
from src.core.interaction import Interaction


class ReponsesView(discord.ui.View):
    def __init__(self, question):
        super().__init__()
        self.question = question
        for index, answer in enumerate(question.answers):

            button = QuestionAnswerButton(
                label=answer.response,
                custom_id=f"answer_{index}",
                callback=self.on_click,
            )
            self.add_item(button)

    async def on_click(self, interaction: discord.Interaction):
        await interaction.response.defer()
        await interaction.edit_original_response(view=None)
        valid_answer_id = None
        for index, answer in enumerate(self.question.answers):
            if answer.is_correct_answer == True:
                valid_answer_id = index
                break
        if valid_answer_id == None:
            return
        custom_id = interaction.data.get("custom_id")
        user_answer_id = int(custom_id.split("_")[-1])

        if valid_answer_id == user_answer_id:

            await interaction.channel.send(
                embed=SuccessEmbed(
                    description=f"Bonne réponse !\n\n {self.question.answers[valid_answer_id].explanation}"
                ),
            )

            return
        else:
            await interaction.channel.send(
                embed=ErrorEmbed(
                    f'mauvaise reponse, la réponse était "{self.question.answers[valid_answer_id].response}". \n\n {self.question.answers[valid_answer_id].explanation}'
                ),
            )

            return
