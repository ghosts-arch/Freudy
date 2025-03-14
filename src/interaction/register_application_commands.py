import logging
import asyncio
from typing import Dict

import requests

from src.utils.get_credentials import get_credentials
from src.commands.command import Command

logger = logging.getLogger()

application_id, bot_token = get_credentials()

URL = f"https://discord.com/api/v10/applications/{application_id}/commands"
headers = {
    "Authorization": f"Bot {bot_token}",
}


def update_command_to_discord(
    application_command_name: str, application_command: Command
):
    payload = {
        "name": application_command_name,
        "type": 1,
        "description": application_command.get("description"),
    }

    """
    if hasattr(application_command, "options"):
        payload["options"] = application_command.get()
        """

    try:
        response = requests.post(URL, headers=headers, json=payload)
    except requests.exceptions.RequestException as e:
        logger.error("Request exception: %s", e)
    except asyncio.CancelledError:
        logger.error("Asyncio task was cancelled")
    if response.status_code != response.ok:
        logger.warning("/!\\ %s not updated.", application_command_name)


async def register_application_commands(
    application_commands: Dict[str, Command]
) -> None:
    for data in application_commands.items():
        try:
            update_command_to_discord(*data)
            await asyncio.sleep(5)
        except asyncio.CancelledError:
            logger.error("Asyncio task was cancelled")
        except requests.exceptions.Timeout as e:
            logger.error("Request timed out: %s", e)
        except requests.exceptions.HTTPError as e:
            logger.error("HTTP error occurred: %s", e)
        except requests.exceptions.ConnectionError as e:
            logger.error("Connection error occurred: %s", e)
        except requests.exceptions.RequestException as e:
            logger.error("Request exception: %s", e)
