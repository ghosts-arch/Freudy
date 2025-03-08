import os

def get_credentials():
    application_id = os.getenv("APPLICATION_ID")
    bot_token = os.getenv("BOT_TOKEN")
    return application_id, bot_token