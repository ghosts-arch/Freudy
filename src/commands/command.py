import discord

from typing import TypedDict, Callable, TYPE_CHECKING, Coroutine, Any, Optional

if TYPE_CHECKING:
    from src.client import Freudy

class Command(TypedDict):
    name : str
    description : str
    in_administration_channel_only : Optional[bool]
    run : Callable[[discord.Interaction["Freudy"]], Coroutine[Any, Any, None]]
    moderation_only : Optional[bool]