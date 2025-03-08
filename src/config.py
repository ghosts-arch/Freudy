import json
import logging
from pathlib import Path
from typing import Dict, Union


logger = logging.getLogger()

def load_config(path : Path) -> Dict[str, Union[int, bool]]:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.decoder.JSONDecodeError:
        logger.error("Fail to decode %s", path)
        raise
    except FileNotFoundError:
        logger.error("%s does not exist.", path)
        raise

def validate_config(config : Dict[str, Union[int, bool]]) -> None:
    config_keys: list[str] = [
        "guild_id", 
        "test_channel_id", 
        "dev_mode", 
        "administration_channel_id"
    ]

    for key in config_keys:
        if key not in config:
            raise KeyError(f'{key} is missing in config file.')
    if not isinstance(config["guild_id"], int):
        raise ValueError("guild_id must be an int")
    if not isinstance(config["test_channel_id"], int):
        raise ValueError('test_channel_id must be an int.')
    if not isinstance(config["dev_mode"], bool):
        raise ValueError("dev_mode must an bool.")
    if not isinstance(config["administration_channel_id"], int):
        raise ValueError("administration_channel_id must an int")
