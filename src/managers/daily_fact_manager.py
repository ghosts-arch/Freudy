import discord

from src.embeds import ErrorEmbed, Embed
from .manager import Manager


class DailyFactManager(Manager):

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
