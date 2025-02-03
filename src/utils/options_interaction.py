# coding : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

from typing import List, Tuple


class Option:

    def __init__(
            self,
            type__:int,
            /,
            name:str,
            description:str,
            *,
            required:bool = False,
            options:List[dict] = None
        ):

        self.__data = {
            "name": name,
            "description": description,
            "type": type__,
            "required": required,
            "options": options
        }

    def get(self):
        return self.__data


class Types:
    SUB_COMMAND = 1
    SUB_COMMAND_GROUP = 2
    STRING = 3
    INTEGER = 4
    BOOLEAN = 5
    USER = 6
    CHANNEL = 7
    ROLE = 8
    MENTIONABLE = 9
    FLOAT = 10
    ATTACHMENT = 11


def create_options(*args:Tuple[Option]) -> List[dict]:

    return [
        option.get()
        for option in args
    ]

