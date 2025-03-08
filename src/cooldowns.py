import asyncio
from time import time
from typing import  Dict, Optional, Coroutine, Any
from discord import TextChannel, Message
import discord


class CooldownsManager:

    def __init__(self) -> None:
        self.cooldowns: dict[int, dict[str, float]] = {}

    def add_user(self, user_id: int, interaction : discord.Interaction) -> None:
        self.cooldowns[user_id] = {"last_usage": time()}
        asyncio.create_task(self.schedule_delete_user(user_id, interaction))

    def find_user(self, user_id: int) -> Optional[Dict[str, float]]:
        return self.cooldowns.get(user_id, None)

    async def delete_user(
        self, user_id: int, interaction : discord.Interaction
    ) -> Coroutine[Any, Any, Message] | Any:
        if not isinstance(interaction.channel, TextChannel):
            raise TypeError("This function can be executed only in a guild channel.")
        user = self.find_user(user_id=user_id)
        if not user:
            raise KeyError("User not found")
        del self.cooldowns[user_id]
        return await interaction.channel.send(
                content=f"{interaction.user.mention}, vous pouvez à nouveau jouer !",
            )

    async def schedule_delete_user(self, user_id : int, interaction : discord.Interaction) -> None:
        await asyncio.sleep(14400)
        await self.delete_user(user_id, interaction=interaction)
