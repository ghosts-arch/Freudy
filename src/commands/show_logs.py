import logging
import os

from src.core.embeds import ErrorEmbed
from src.core.interaction import Context, Interaction

logger = logging.getLogger()


class ApplicationCommand(Interaction):

    def __init__(self) -> None:
        self.name = "show_logs"
        self.description = "affiche les logs du bot"
        self.administration_channel_only = True

    async def run(self, context: Context) -> None:
        logs_file_path = os.path.join("logs", "bot.log")

        if not os.path.exists(logs_file_path):
            await context.send(
                embed=ErrorEmbed(
                    description="Le fichier de logs n'existe pas",
                )
            )
            return

        with open(logs_file_path, "r", encoding="utf-8") as f:
            logs = f.readlines()

        last_logs = "".join(logs[-20:])

        if len(last_logs) > 2000:
            last_logs = "".join(logs[-10:])

        await context.send(content=f"```{last_logs}```")
