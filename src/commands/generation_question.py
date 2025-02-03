# encode : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

import random


from src.core.interaction import Interaction, Context
from src.core.embeds import Embed
from src.core.ui.views import ReponsesView


class ApplicationCommand(Interaction):

    def __init__(self) -> None:
        self.name = "generate_question"
        self.description = "generer une question aléatoire"

    async def run(self, client, context: Context) -> None:

        question = client.database.get_random_question()
        print(question)
        embed = Embed().set_description(question.question)
        view = ReponsesView(question=question)
        await context.send(embed=embed, view=view)
