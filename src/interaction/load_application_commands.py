import importlib
import os
from types import ModuleType
from typing import Dict

from .command import Command


def load_application_commands() -> Dict[str, Command]:
    application_commands: Dict[str, Command] = {}
    # files = filter(lambda f: f.endswith(".py"), os.listdir("src/commands"))
    files = [f for f in os.listdir("src/commands") if f.endswith(".py")]
    for f in files:
        module_name = os.path.splitext(f)[0]
        module = importlib.import_module(name=f".{module_name}", package="src.commands")

        if not is_application_command(module):
            raise ValueError(f"/!\\ '{module}' n'est pas une commande valide")

        application_command: Command = module.ApplicationCommand()
        application_commands[application_command.get_name()] = application_command

    return application_commands


def is_application_command(module: ModuleType) -> bool:
    return hasattr(module, "ApplicationCommand") and issubclass(
        module.ApplicationCommand, Command
    )
