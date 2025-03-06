# Filename: config.py
# Description: This module contains functions to load and validate configuration
#             settings from a JSON file. It ensures that the required keys are
#            present and have the correct data types.



import json
import logging
from pathlib import Path
from typing import Dict, Union


logger = logging.getLogger()

def load_config(path : Path) -> Dict[str, Union[int, bool]]:
    """
        Load configuration from a JSON file.

        Args:
            path (Path): The path to the JSON configuration file.

        Returns:
            Dict[str, Union[int, bool]]: A dictionary containing configuration settings.

        Raises:
            json.decoder.JSONDecodeError: If the file contains invalid JSON.
            FileNotFoundError: If the file does not exist.

        Example:
            >>> config = load_config(Path('/path/to/config.json'))
    """
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.decoder.JSONDecodeError:
        logger.error(f"Fail to decode {path}")
        raise
    except FileNotFoundError:
        logger.error(f"{path} does not exist.")
        raise
  
def validate_config(config : Dict[str, Union[int, bool]]) -> None:
    """
    Validates the given configuration dictionary to ensure it contains the required keys 
    and that the values are of the correct types.
    Args:
        config (Dict[str, Union[int, bool]]): The configuration dictionary to validate. 
            It must contain the following keys:
            - "guild_id" (int): The ID of the guild.
            - "test_channel_id" (int): The ID of the test channel.
            - "dev_mode" (bool): A flag indicating whether the application is in development mode.
            - "administration_channel_id" (int): The ID of the administration channel.
    Raises:
        KeyError: If any of the required keys are missing from the config dictionary.
        ValueError: If any of the values in the config dictionary are not of the expected type.
    """
   
    config_keys : list[str] = ["guild_id", "test_channel_id", "dev_mode", "administration_channel_id"]

    for key in config_keys:
        if key not in config:
            raise KeyError(f'{key} is missing in config file.')
        
    if not isinstance(config["guild_id"], int):
        raise ValueError(f"guild_id must be an int")
    if not isinstance(config["test_channel_id"], int):
        raise ValueError(f'test_channel_id must be an int.')
    if not isinstance(config["dev_mode"], bool):
        raise ValueError(f"dev_mode must an bool.")
    if not isinstance(config["administration_channel_id"], int):
        raise ValueError("administration_channel_id must an int")