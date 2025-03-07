"""
Logger Utility Module

This module provides functionality to set up logging configuration from a YAML file.
It reads the logging configuration from a file named 'logger.yaml' located in the 
current directory, loads the configuration using the PyYAML library, and applies it 
using the logging.config.dictConfig method. It then returns the root logger instance.

Functions:
    setup_logging: Sets up logging configuration and returns a logger instance.
"""

import logging.config
import logging
import pathlib
import yaml


def setup_logging() -> logging.Logger:
    """
    Sets up logging configuration from a YAML file and returns a logger instance.

    This function reads the logging configuration from a file named 'logger.yaml' 
    located in the current directory, loads the configuration using the PyYAML 
    library, and applies it using the logging.config.dictConfig method. It then 
    returns the root logger instance.

    Returns:
        logging.Logger: The root logger instance configured according to the 
        settings in 'logger.yaml'.
    """
    logger_config_file = pathlib.Path("logger.yaml")
    with open(logger_config_file, "r", encoding="utf-8") as f:
        config = yaml.safe_load(f)
    logging.config.dictConfig(config=config)
    return logging.getLogger()
