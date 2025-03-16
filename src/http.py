import requests
import logging
from src.commands.command import Command
from .utils.get_credentials import get_credentials

logger = logging.getLogger()

application_id, bot_token = get_credentials()

url = f"https://discord.com/api/v10/applications/{application_id}/commands"
headers = {
    "Authorization": f"Bot {bot_token}",
}

def register_command(command : Command) -> None:
    payload = {
        "name": command["name"],
        "type": 1,
        "description": command["description"],
    }
    response = requests.post(url, headers=headers, json=payload)
    if response.ok:
        logger.info("Command register successfully : %s", command["name"])
    else:
        logger.error(
            "Failed to register command %s. Status : %d. Response : %s",
            command["name"],
            response.status_code,
            response.text
        )

