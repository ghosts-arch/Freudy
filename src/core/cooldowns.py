import threading
from time import time


class CooldownsManager:
    def __init__(self) -> None:
        self.cooldowns = {}

    def add_user(self, user_id):
        self.cooldowns[user_id] = {"last_usage": time()}
        threading.Timer(14400, self.delete_user, [user_id]).start()

    def find_user(self, user_id):
        return self.cooldowns.get(user_id)

    def delete_user(self, user_id):
        user = self.find_user(user_id=user_id)
        if user:
            del self.cooldowns[user_id]
            return
        raise Exception("error, no user deleted")
