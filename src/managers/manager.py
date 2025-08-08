from abc import ABC, abstractmethod
import asyncio
import datetime
import logging


logger = logging.getLogger()


class Manager(ABC):

    def __init__(self, client):
        self.__client = client

    @abstractmethod
    async def callback(self, *args, **kwargs):
        pass

    async def run(self):
        date = datetime.datetime.now()
        if date.hour >= 6:  # 5h UTC => 7h TZ Paris
            date += datetime.timedelta(days=1)
        date = date.replace(hour=6, minute=0, second=0)

        delay = (date - datetime.datetime.now()).total_seconds()

        while True:
            await asyncio.sleep(delay=delay)
            delay = datetime.timedelta(days=1).total_seconds()
            await self.callback()

    async def start(self):
        logger.info("Start %s manager.", self.__class__.__name__)
        loop = asyncio.get_running_loop()
        self._task = loop.create_task(self.run())
