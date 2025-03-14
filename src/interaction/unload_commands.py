import requests

from src.utils.get_credentials import get_credentials

application_id, bot_token = get_credentials()

URL : str = f"https://discord.com/api/v10/applications/{application_id}/commands"
headers = {
    "Authorization": f"Bot {bot_token}",
}

async def unload_application_commands():

    response = requests.get(URL, headers=headers)

    for data in response.json():
        requests.delete(
            url = (
                f"https://discord.com/api/v10/applications/{application_id}"
                + f"/commands/{data['id']}"
            ),
            headers = headers,
            
        )
