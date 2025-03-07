""""
This module contains the DailyFactManager class, which manages the daily fact functionality
for the bot.
It interacts with the bot's client to fetch and send random daily facts to a specific Discord
channel.
Classes:
    DailyFactManager: Manages the daily fact functionality for the bot.
"""
import discord

from src.embeds import ErrorEmbed, Embed
from .manager import Manager


class DailyFactManager(Manager):
    """
    Manages the daily fact functionality for the bot.
    Attributes:
        client (Client): The client instance used to interact with the bot and its services.
    Methods:
        __init__(client):
            Initializes the DailyFactManager with the given client.
        callback(*args, **kwargs):
            Asynchronous method that fetches a random daily fact from the database and
            jsends it to a specific channel.
            Raises:
                ValueError: If the daily_fact_channel is None.
                TypeError: If the daily_fact_channel is not a discord.TextChannel.
    """

    def __init__(self, client):
        super().__init__(client)
        self.__client = client

    async def callback(self, *args, **kwargs):
        try:
            random_daily_fact = self.__client.database.get_random_daily_fact()
        except ValueError as err:
            return ErrorEmbed(description=f"{err}")
        # #selfcare (test) - a laisser pour l'instant
        daily_fact_channel = await self.__client.fetch_channel(1335777452013916202)

        if not daily_fact_channel:
            raise ValueError("daily_fact_channel is None")

        if not isinstance(daily_fact_channel, discord.TextChannel):
            raise TypeError("daily_fact_channel is not a TextChannel")

        await daily_fact_channel.send(
            embed=Embed(description=f"{random_daily_fact.fact}")
        )
