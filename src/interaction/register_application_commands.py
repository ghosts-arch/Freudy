"""
This module provides functionality to register and update application commands to Discord.
Functions:
    update_command_to_discord(application_command_name: str, application_command: Interaction):
    register_application_commands(application_commands: Dict[str, Interaction]) -> None:
Modules:
    logging: For logging errors and warnings.
    asyncio: For handling asynchronous operations.
    typing: For type hinting.
    requests: For making HTTP requests.
    src.utils.get_credentials: For retrieving application credentials.
    .interaction: For the Interaction class used in application commands.

"""

import logging
import asyncio
from typing import Dict

import requests

from src.utils.get_credentials import get_credentials
from .command import Command

logger = logging.getLogger()

application_id, bot_token = get_credentials()

URL = f"https://discord.com/api/v10/applications/{application_id}/commands"
headers = {
    "Authorization": f"Bot {bot_token}",
}


def update_command_to_discord(
    application_command_name: str, application_command: Command
):
    """
    Updates a command to Discord with the given application command name and interaction.
    Args:
        application_command_name (str): The name of the application command to update.
        application_command (Interaction): The interaction object containing command details.
    Raises:
        requests.exceptions.RequestException: If there is an issue with the HTTP request.
        asyncio.CancelledError: If the asyncio task is cancelled.
        Exception: For any other unexpected errors.
    Logs:
        Logs errors and warnings related to the request and response status.
    """
    payload = {
        "name": application_command_name,
        "type": 1,
        "description": application_command.get_description(),
    }

    if hasattr(application_command, "options"):
        payload["options"] = application_command.get_options()

    try:
        response = requests.post(URL, headers=headers, json=payload, timeout=5)
    except requests.exceptions.RequestException as e:
        logger.error("Request exception: %s", e)
    except asyncio.CancelledError:
        logger.error("Asyncio task was cancelled")

    if response.status_code != response.ok:
        logger.warning("/!\\ %s not updated.", application_command_name)


async def register_application_commands(
    application_commands: Dict[str, Command]
) -> None:
    """
    Registers application commands by updating them to Discord.

    Args:
        application_commands (Dict[str, Interaction]): A dictionary where the key is the
        command name and the value is the Interaction object.

    Raises:
        requests.exceptions.RequestException: If there is an issue with the request to Discord.
        asyncio.CancelledError: If the asyncio task is cancelled.
        Exception: For any other unexpected errors.
    """
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
