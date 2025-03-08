import logging
import os

from src.embeds import ErrorEmbed
from src.interaction import Context, Command

logger = logging.getLogger()


class ShowLogsCommand(Command):

    def __init__(self) -> None:
        self.name = "show_logs"
        self.description = "affiche les logs du bot"
        self.administration_channel_only = True

    async def run(self, context: Context):
        logs_file_path = os.path.join("logs", "bot.log")

        if not os.path.exists(logs_file_path):
            await context.interaction.response.send_message(
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

        await context.interaction.response.send_message(content=f"```{last_logs}```")
