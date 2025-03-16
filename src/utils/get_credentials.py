import os
from typing import Tuple

def get_credentials() -> Tuple[str | None, str | None]:
    return os.getenv("APPLICATION_ID"), os.getenv("CLIENT_TOKEN")
