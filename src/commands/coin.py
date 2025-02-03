# encode : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

import random

from src.core.interaction import Interaction, Context
from src.core.embeds import Embed


class ApplicationCommand(Interaction):

    def __init__(self) -> None:
        self.name = "coin"
        self.description = "Pile ou face"

    async def run(self, client, context: Context) -> None:
        face = random.choice(["Pile !", "Face !"])
        embed = Embed().set_description(face)
        await context.send(embed=embed)
