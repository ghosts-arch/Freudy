# Filename: cooldowns.py
# Description: This module manages cooldowns for users in a Discord bot context.

import asyncio
from time import time
from discord import TextChannel
from typing import TYPE_CHECKING, Dict, Optional, Coroutine, Any
from src.core.interaction import Context
from discord import Message
# if TYPE_CHECKING:
    # from discord import Message
    # from src.core.interaction import Context

class CooldownsManager:
    def __init__(self) -> None:
        """
        Initializes the cooldowns dictionary.

        The cooldowns dictionary maps an integer key to another dictionary,
        which maps a string key to a float value.
        """
        self.cooldowns: dict[int, dict[str, float]] = {}

    def add_user(self, user_id: int, context : Context) -> None:
        """
        Adds a user to the cooldowns dictionary and schedules their removal.

        Args:
            user_id (int): The ID of the user to add.
            context (Context): The context in which the user is being added.

        Returns:
            None
        """
        self.cooldowns[user_id] = {"last_usage": time()}
        asyncio.create_task(self.schedule_delete_user(user_id, context))

    def find_user(self, user_id: int) -> Optional[Dict[str, float]]:
        """
        Finds a user in the cooldowns dictionary.

        Args:
            user_id (int): The ID of the user to find.

        Returns:
            Optional[Dict[str, float]]: The cooldown information for the user if found, otherwise None.
        """
        return self.cooldowns.get(user_id, None)

    async def delete_user(self, user_id : int, context : Context) -> Coroutine[Any, Any, Message] | Any:
        """
        Deletes a user from the cooldowns list and sends a message in the context channel.

        Args:
            user_id (int): The ID of the user to delete.
            context (Context): The context in which the command was invoked.

        Returns:
            Coroutine[Any, Any, Message] | Any: A coroutine that sends a message in the context channel.

        Raises:
            Exception: If the context channel is not a TextChannel.
            Exception: If the user is not found in the cooldowns list.
        """
        if not isinstance(context.channel, TextChannel):
            raise Exception("This function can be executed only in a guild channel.")
        user = self.find_user(user_id=user_id)
        if not user:
            raise Exception("User not found")
        del self.cooldowns[user_id]
        return await context.channel.send(
                content=f"{context.user.mention}, vous pouvez à nouveau jouer !",
            )
        

    async def schedule_delete_user(self, user_id : int, context : Context) -> None:
        """
        Schedules the deletion of a user after a delay of 4 hours (14400 seconds).

        Args:
            user_id (int): The ID of the user to be deleted.
            context (Context): The context in which the deletion is to be performed.

        Returns:
            None
        """
        await asyncio.sleep(14400)
        await self.delete_user(user_id, context)
