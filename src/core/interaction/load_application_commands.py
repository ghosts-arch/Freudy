# coding : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

import os
import importlib

import time
from types import ModuleType
from typing import Dict

from .interaction import Interaction


def load_application_commands() -> Dict[str, Interaction]:
    start_time = time.perf_counter()
    application_commands: Dict[str, Interaction] = {}
    # files = filter(lambda f: f.endswith(".py"), os.listdir("src/commands"))
    files = [f for f in os.listdir("src/commands") if f.endswith(".py")]
    end_time = time.perf_counter()
    print(f"temps d'excution : {end_time - start_time} secondes")
    for f in files:
        module_name = os.path.splitext(f)[0]
        module = importlib.import_module(name=f".{module_name}", package="src.commands")

        if not is_application_command(module):
            raise Exception(f"/!\\ '{module}' n'est pas une commande valide")

        application_command: Interaction = module.ApplicationCommand()
        application_commands[application_command.get_name()] = application_command

    return application_commands


def is_application_command(module: ModuleType) -> bool:
    return hasattr(module, "ApplicationCommand") and issubclass(
        module.ApplicationCommand, Interaction
    )
