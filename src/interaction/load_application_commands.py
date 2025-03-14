import importlib
import os
from types import ModuleType
from typing import Dict

from src.commands.command import Command


def load_application_commands() -> Dict[str, Command]:
    application_commands: Dict[str, Command] = {}
    files = [f for f in os.listdir("src/commands") if f.endswith(".py")]
    for f in files:
        module_name = os.path.splitext(f)[0]
        module = importlib.import_module(name=f".{module_name}", package="src.commands")
        if not hasattr(module, "command"):
            continue
        application_command : Command = getattr(module, "command")
        command_name = application_command.get("name")
        if not command_name:
            raise Exception("invalid name.")
        application_commands[command_name] = application_command
    return application_commands


def is_application_command(module: ModuleType) -> bool:
    return hasattr(module, "Command") 
