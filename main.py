import os
import sys
import dotenv

from src.client import Freudy
from src.utils.logger import setup_logging


logger = setup_logging()


def setup_environment() -> None:
    environment_file_path = dotenv.find_dotenv()
    if not environment_file_path:
        logger.error("No .env file found.")
        sys.exit(1)
    dotenv.load_dotenv(dotenv_path=environment_file_path)
    logger.info("%s loaded.", environment_file_path)


setup_environment()


def main() -> None:
    client = Freudy()
    client_token = os.getenv("CLIENT_TOKEN")
    if not client_token:
        logger.error("CLIENT_TOKEN not found in environment variables or .env file")
        sys.exit(1)
    client.run(client_token)


if __name__ == "__main__":
    main()
