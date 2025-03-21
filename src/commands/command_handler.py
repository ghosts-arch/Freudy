import os
import importlib
import logging

from typing import Dict
from .command import Command
from src.http import register_command

logger = logging.getLogger()

class CommandsHandler:

    def __init__(self) -> None:
        self.commands : Dict[str, Command ]= {}
        self._load_commands()

    def _load_command(self, command : Command) -> None:
        self.commands[command['name']] = command
        register_command(command=command)

    def _load_commands(self) -> None:
        files = [f for f in os.listdir("src/commands") 
                 if f.endswith(".py") 
                 and f not in ['__init__.py', 'command.py', 'command_handler.py']
                ]
        for f in files:
            module_name = os.path.splitext(f)[0]
            module = importlib.import_module(name=f'.{module_name}', package="src.commands")
            if not hasattr(module, 'command'):
                logger.warning("Module %s is missing `Command` interface. Skipping.")
                continue
            command : Command = getattr(module, 'command')
            self._load_command(command=command)
        logger.info(f"{len(files)} commands loaded and registered with success.")

    def get_commands(self):
        return self.commands
    
    def get_command(self, command_name : str) -> Command | None :
        return self.commands.get(command_name)