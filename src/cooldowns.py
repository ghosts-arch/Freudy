import asyncio
from time import time
from typing import  Dict, Optional, Coroutine, Any
from discord import TextChannel, Message
from src.interaction.context import Context

class CooldownsManager:

    def __init__(self) -> None:
        self.cooldowns: dict[int, dict[str, float]] = {}

    def add_user(self, user_id: int, context : Context) -> None:
        self.cooldowns[user_id] = {"last_usage": time()}
        asyncio.create_task(self.schedule_delete_user(user_id, context))

    def find_user(self, user_id: int) -> Optional[Dict[str, float]]:
        return self.cooldowns.get(user_id, None)

    async def delete_user(
        self, user_id: int, context: Context
    ) -> Coroutine[Any, Any, Message] | Any:
        if not isinstance(context.channel, TextChannel):
            raise TypeError("This function can be executed only in a guild channel.")
        user = self.find_user(user_id=user_id)
        if not user:
            raise KeyError("User not found")
        del self.cooldowns[user_id]
        return await context.channel.send(
                content=f"{context.user.mention}, vous pouvez à nouveau jouer !",
            )

    async def schedule_delete_user(self, user_id : int, context : Context) -> None:
        await asyncio.sleep(14400)
        await self.delete_user(user_id, context)
