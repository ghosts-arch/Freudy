# coding : utf-8
# Python 3.10
# ----------------------------------------------------------------------------

import logging.config
import logging
import pathlib
import yaml


def setup_logging() -> logging.Logger:
    logger_config_file = pathlib.Path("logger.yaml")
    with open(logger_config_file, "r") as f:
        config = yaml.safe_load(f)
    logging.config.dictConfig(config=config)
    return logging.getLogger()
