# coding : utf-8
# Python 3.10
# ----------------------------------------------------------------------------
# IN CASE OF EMERGENCY ONLY
# ----------------------------------------------------------------------------

import requests
import os

from src.utils.get_credentials import get_credentials

application_id, bot_token = get_credentials()

url = f"https://discord.com/api/v10/applications/{application_id}/commands"
headers = {
    "Authorization": f"Bot {bot_token}",
}

def unload_application_commands():

    response = requests.get(url, headers=headers)

    for data in response.json():
        result = requests.delete(
            url = (
                f"https://discord.com/api/v10/applications/{application_id}"
                + f"/commands/{data['id']}"
            ),
            headers = headers,
        )
