import logging
import discord

logger = logging.getLogger()


class QuestionAnswerButton(discord.ui.Button):
    def __init__(self, label: str, custom_id: str, on_click):
        if len(label) > 80:
            raise ValueError(
                f"Button label exceeds max length: {label} ({len(label)} characters)"
            )
        super().__init__(
            label=label, style=discord.ButtonStyle.green, custom_id=custom_id
        )
        self.callback = on_click
