import os
import importlib

from typing import Dict
from .command import Command
from src.http import register_command

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
                # TODO : raise error , missing command interface is missing in this command
                return
            command : Command = getattr(module, 'command')
            self._load_command(command=command)
        # TODO : log 'all commands loaded & registered with success'

    def get_commands(self):
        return self.commands