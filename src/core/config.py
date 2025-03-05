# encode : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

import yaml

from typing import TypedDict
from pathlib import Path


class Config(TypedDict):
    GUILD_ID: int
    TEST_CHANNEL_ID: int
    DEV_MODE: bool
    ADMINISTRATION_CHANNEL_ID: int


def load_config(path: Path) -> Config:
    with open(path, "r") as file:
        config = yaml.safe_load(file)
    return validate_config(config)


def validate_config(config: Config) -> Config:
    for key in ("GUILD_ID", "TEST_CHANNEL_ID", "DEV_MODE", "ADMINISTRATION_CHANNEL_ID"):
        if config[key] is None or config[key] not in config:
            raise ValueError(f"{key} is null.")
        if config[key] not in config:
            raise ValueError(f"{key} is not in config.")
    return config
