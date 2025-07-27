from abc import ABC, abstractmethod
import asyncio
import datetime
import logging

logger = logging.getLogger(__name__)


class Manager(ABC):
    _task = None

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

    def start(self):
        if not self._task or self._task.done():
            logger.info("Start %s manager.", self.__class__.__name__)
            self._task = self.__client.loop.create_task(self.run())
        else:
            logger.warning("%s manager is already running.", self.__class__.__name__)
