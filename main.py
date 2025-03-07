"""
Main module for the bot-psy-python project.

This module sets up the environment, initializes the Freudy client, and runs the bot.
"""

import os
import sys
import dotenv

from src.client import Freudy
from src.utils.logger import setup_logging


logger = setup_logging()


def setup_environment() -> None:
    """
    Sets up the environment by loading variables from a .env file.

    This function searches for a .env file in the current directory or parent directories.
    If the .env file is found, it loads the environment variables from the file.
    If the .env file is not found, it logs an error message and exits the program.

    Raises:
        SystemExit: If no .env file is found.
    """
    environment_file_path = dotenv.find_dotenv()
    if not environment_file_path:
        logger.error("No .env file found.")
        sys.exit(1)
    dotenv.load_dotenv(dotenv_path=environment_file_path)
    logger.info("%s loaded.", environment_file_path)


setup_environment()


def main() -> None:
    """
    Main function to initialize and run the Freudy client.

    This function performs the following steps:
    1. Creates an instance of the Freudy client.
    2. Retrieves the client token from the environment variables.
    3. Logs an error and exits if the client token is not found.
    4. Runs the Freudy client with the retrieved token.

    Raises:
        SystemExit: If the client token is not found in the environment variables.
    """
    client = Freudy()
    client_token = os.getenv("CLIENT_TOKEN")
    if not client_token:
        logger.error("CLIENT_TOKEN not found in environment variables or .env file")
        sys.exit(1)
    client.run(client_token)


if __name__ == "__main__":
    main()
