"""
This module provides functionality to load application commands from the 
'src/commands' directory. It scans for Python files in the directory, imports 
them as modules, and verifies if they are valid application commands. Valid 
commands are instantiated and stored in a dictionary with their names as keys.
Functions:
    load_application_commands() -> Dict[str, Interaction]:
        Loads and returns a dictionary of application commands.
    is_application_command(module: ModuleType) -> bool:
        Checks if a module contains a valid application command.

"""

import importlib
import os
from types import ModuleType
from typing import Dict

from .command import Command


def load_application_commands() -> Dict[str, Command]:
    """
    Loads application commands from the 'src/commands' directory.
    This function scans the 'src/commands' directory for Python files, imports
    them as modules, and checks if they are valid application commands. If a
    module is a valid application command, it is instantiated and added to a
    dictionary with the command's name as the key.
    Returns:
        Dict[str, Interaction]: A dictionary where the keys are command names
        and the values are instances of the Interaction class representing the
        application commands.
    Raises:
        ValueError: If a module is not a valid application command.
    """
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
    """
    Check if a module contains an application command.

    This function checks if the given module has an attribute named 
    'ApplicationCommand' and if this attribute is a subclass of the 
    'Interaction' class.

    Args:
        module (ModuleType): The module to check.

    Returns:
        bool: True if the module contains an application command, False otherwise.
    """
    return hasattr(module, "ApplicationCommand") and issubclass(
        module.ApplicationCommand, Command
    )
