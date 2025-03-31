import json
import random
cat_messages = [
    "miaou", 
    "meow",
    "mew", 
    "miaou miaou MIAOU"
    "mew mew mew",
    "mew mew mew mew",
    "meow meow meow",
    "meow meow meow meow",
    "mew meow miaou",
    "miaou meow mew",]
import requests

def get_random_cat():
    result = requests.get("https://api.thecatapi.com/v1/images/search")
    return result.json()[0]["url"]

with open("facts.json", "r", encoding="utf-8") as f:
    data = json.load(f)

    new_data : list = []
    for fact in data:
        cat_fact = f'{random.choice(cat_messages)} || {get_random_cat()} ||'
        new_data.append(cat_fact)

with open("cats_facts.json", "w", encoding="utf-8") as f:
    json.dump(new_data, f, ensure_ascii=False, indent=4)

