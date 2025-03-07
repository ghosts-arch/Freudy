"""
This module defines an abstract base class `Manager` for managing asynchronous tasks.
The `Manager` class provides a framework for running a specific task at a designated
time every day.
Subclasses should implement the `callback` method to define the task's behavior.
Classes:
    Manager: An abstract base class for managing asynchronous tasks.
Usage:
    Subclass the `Manager` class and implement the `callback` method to define the
    specific behavior when the task is triggered. Use the `start` method to initiate
    the task scheduling.
Example:
    class MyManager(Manager):
        async def callback(self):
            # Define the task behavior here
    client = SomeClient()
    manager = MyManager(client)
    manager.start()
"""

from abc import ABC, abstractmethod
import asyncio
import datetime
import logging

logger = logging.getLogger(__name__)


class Manager(ABC):
    """
    Manager is an abstract base class that provides a structure for managing asynchronous tasks.
    Attributes:
        __client: The client instance that the manager interacts with.
    Methods:
        __init__(client):
            Initializes the Manager with the given client.
        callback(*args, **kwargs):
        run():
        start():
    """

    def __init__(self, client):
        self.__client = client

    @abstractmethod
    async def callback(self, *args, **kwargs):
        """
    Abstract method to be implemented by subclasses to handle callbacks.

    This method should be overridden to define the specific behavior when a callback is triggered.

    Args:
        *args: Variable length argument list.
        **kwargs: Arbitrary keyword arguments.

    Returns:
        None
    """

    async def run(self):
        """
        Asynchronously runs a task at a specific time every day.
        This method calculates the delay until the next occurrence of 6:00 AM (Paris Time)
        and then waits for that duration before executing the callback function. After the
        initial execution, it continues to run the callback function every 24 hours.
        The method adjusts the initial delay if the current time is past 6:00 AM, setting
        the next execution to 6:00 AM the following day.
        """

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
        """
        Starts the manager by logging its initiation and creating an asynchronous task to run it.

        This method logs the start of the manager using the class name and schedules the `run`
        method sto be executed in the event loop of the client.

        Returns:
            None
        """
        logger.info("Start %s manager.", self.__class__.__name__)
        self.__client.loop.create_task(self.run())
