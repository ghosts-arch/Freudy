import asyncio
from time import time


class CooldownsManager:
    def __init__(self) -> None:
        self.cooldowns: dict[int, dict[str, float]] = {}

    def add_user(self, user_id: int, context):
        self.cooldowns[user_id] = {"last_usage": time()}
        asyncio.create_task(self.schedule_delete_user(user_id, context))

    def find_user(self, user_id):
        return self.cooldowns.get(user_id)

    async def delete_user(self, user_id, context):
        user = self.find_user(user_id=user_id)
        if user:
            del self.cooldowns[user_id]

            return await context.channel.send(
                content=f"{context.user.mention}, vous pouvez à nouveau jouer !",
            )
        raise Exception("error, no user deleted")

    async def schedule_delete_user(self, user_id, context):
        await asyncio.sleep(14400)
        await self.delete_user(user_id, context)
