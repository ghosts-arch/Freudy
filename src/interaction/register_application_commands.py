# coding : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

import logging
import traceback
import requests
import dotenv
import asyncio
import os
from typing import Dict

from .interaction import Interaction
from src.utils.get_credentials import get_credentials

logger = logging.getLogger()

application_id, bot_token = get_credentials()

url = f"https://discord.com/api/v10/applications/{application_id}/commands"
headers = {
    "Authorization": f"Bot {bot_token}",
}


def update_command_to_discord(
    application_command_name: str, application_command: Interaction
):
    payload = {
        "name": application_command_name,
        "type": 1,
        "description": application_command.get_description(),
    }

    if hasattr(application_command, "options"):
        payload["options"] = application_command.get_options()

    try:
        response = requests.post(url, headers=headers, json=payload)
    except Exception:
        logger.error(traceback.format_exc())

    if response.status_code != requests.codes.ok:
        logger.warn(f"/!\\ '{application_command_name}' not updated.")


async def register_application_commands(
    application_commands: Dict[str, Interaction]
) -> None:
    for data in application_commands.items():
        try:
            update_command_to_discord(*data)
            await asyncio.sleep(5)
        except Exception:
            logger.error(traceback.format_exc())
