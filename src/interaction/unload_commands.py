"""
This module provides functionality to unload all application commands from a Discord bot.
Functions:
    unload_application_commands: Unloads all application commands by sending GET and DELETE
    requests to the Discord API.
Dependencies:
    - requests: To send HTTP requests.
    - get_credentials: To retrieve the application ID and bot token.
    Ensure that the `get_credentials` function is correctly implemented and returns valid 
    credentials.
"""

import requests

from src.utils.get_credentials import get_credentials

application_id, bot_token = get_credentials()

URL : str = f"https://discord.com/api/v10/applications/{application_id}/commands"
headers = {
    "Authorization": f"Bot {bot_token}",
}

def unload_application_commands() -> None:
    """
    Unloads all application commands from a Discord bot.
    This function sends a GET request to retrieve all current application commands
    and then sends DELETE requests to remove each command individually.
    Raises:
        requests.exceptions.RequestException: If there is an issue with the GET or DELETE requests.
    Note:
        Ensure that the `url`, `headers`, and `application_id` variables are defined and valid
        before calling this function.
    """

    response = requests.get(URL, headers=headers, timeout=5)

    for data in response.json():
        requests.delete(
            url = (
                f"https://discord.com/api/v10/applications/{application_id}"
                + f"/commands/{data['id']}"
            ),
            headers = headers,
            timeout=5
        )
