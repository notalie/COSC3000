import json
import requests
from datetime import datetime as dt
import copy

import test

headers = {'Content-Type': 'application/json',
           'X-ApiKey': '6PG3OWV9UCVFZNTXQJKR'}

CHARACTERS = {352: 'Banjo & Kazooie', 273: 'Bayonetta', 274: 'Bowser', 275: 'Bowser Jr.', 354: 'Byleth', 276: 'Captain Falcon', 277: 'Chrom', 278: 'Cloud', 279: 'Corrin', 280: 'Daisy', 281: 'Dark Pit', 282: 'Dark Samus', 283: 'Diddy Kong', 284: 'Donkey Kong', 285: 'Dr. Mario', 286: 'Duck Hunt Duo', 287: 'Falco', 288: 'Fox', 289: 'Ganondorf', 290: 'Greninja', 351: 'Hero', 291: 'Ice Climbers', 292: 'Ike', 293: 'Incineroar', 294: 'Inkling', 295: 'Isabelle', 296: 'Jigglypuff', 350: 'Joker', 297: 'Ken', 298: 'King Dedede', 299: 'King K. Rool', 300: 'Kirby', 301: 'Link', 302: 'Little Mac', 303: 'Lucario', 304: 'Lucas', 305: 'Lucina', 306: 'Luigi', 307: 'Mario', 308: 'Marth', 309: 'Mega Man', 310: 'Metaknight', 311: 'Mewtwo', 312: 'Mii Brawler', 313: 'Mii Gunner', 314: 'Mii Swordfighter', 315: 'Mr. Game and Watch', 316: 'Ness', 317: 'Pac-Man', 318: 'Palutena', 319: 'Peach', 320: 'Pichu', 321: 'Pikachu', 322: 'Pikmin & Olimar', 349: 'Piranha Plant', 323: 'Pit', 324: 'Pokémon Trainer', 325: 'Random', 326: 'Richter', 327: 'Ridley', 328: 'ROB', 329: 'Robin', 330: 'Rosalina & Luma', 331: 'Roy', 332: 'Ryu', 333: 'Samus', 334: 'Sheik', 335: 'Shulk', 336: 'Simon', 337: 'Snake', 338: 'Sonic', 353: 'Terry', 339: 'Toon Link', 340: 'Villager', 341: 'Wario', 342: 'Wii Fit Trainer', 343: 'Wolf', 344: 'Yoshi', 345: 'Young Link', 346: 'Zelda', 347: 'Zero Suit Samus'}

STATES = {"QLD":{}, "NSW":{}, "SA":{}, "ACT":{}, "WA":{}, "NT":{}, "NZ":{}, "VIC":{}, "TAS":{}, "INT":{}}
DATA = {"Q1":copy.deepcopy(STATES), "Q2":copy.deepcopy(STATES), "Q3":copy.deepcopy(STATES), "Q4":copy.deepcopy(STATES)}

'''
    Get all character matches ever played
'''
def character_matches(id):
    url = 'https://api.ausmash.com.au/characters/{}/matches'.format(id)
    response = requests.get(url, headers=headers)
    
    content = json.loads(response.content)
    return content

'''
    Returns the quarter that the match was played in
'''
def get_data_quarter(data):
    # Compare date gotten to sorted quarters
    date = dt.strptime(data['Tourney']['TourneyDate'][:10], "%Y-%m-%d")
    q1start = dt.strptime("01-01-2019", "%d-%m-%Y")
    q1end = dt.strptime("31-03-2019", "%d-%m-%Y")

    q2start = dt.strptime("01-04-2019", "%d-%m-%Y")
    q2end = dt.strptime("30-06-2019", "%d-%m-%Y")

    q3start = dt.strptime("01-07-2019", "%d-%m-%Y")
    q3end = dt.strptime("30-09-2019", "%d-%m-%Y")

    q4start = dt.strptime("01-10-2019", "%d-%m-%Y")
    q4end = dt.strptime("31-12-2019", "%d-%m-%Y")

    dates = [(q1start, q1end), (q2start, q2end), (q3start, q3end), (q4start, q4end)]
    results = ["Q1", "Q2", "Q3", "Q4"]
    counter = 0

    for i in dates:
        if i[0] <= date and date <= i[1]:
            return results[counter]
        else:
            counter += 1
    return None

# Helper Function for finding a character
def contains_character(data, character_name):
    for characters in data:
        if characters['Name'] == character_name:
            return True
    return False

# Helper Function for finding a player's name
def contains_player(data, player_name):
    for players in data:
        if players == player_name:
            return True
    return False

NAMES = 0
ELO_GAIN = 1
GAMES_PLAYED = 2

def initialise_data(data, char_num):
    quarter = get_data_quarter(data)
    
    if quarter != None and data["Loser"] != None and data["Winner"] != None:
        char_name = CHARACTERS[char_num]
        winner_state = data["Winner"]["RegionShort"]
        loser_state = data["Loser"]["RegionShort"]
        winner_data = None
        loser_data = None
        try:
            if DATA[quarter][winner_state][char_name] != []:
                winner_data = DATA[quarter][winner_state][char_name]
        except KeyError:
            DATA[quarter][winner_state][char_name] = []
            winner_data = DATA[quarter][winner_state][char_name]
            winner_data.append([])
            winner_data.append(0)
            winner_data.append(0)
            
        try:
            if DATA[quarter][loser_state][char_name] != []:
                loser_data = DATA[quarter][loser_state][char_name]
        except KeyError:
            DATA[quarter][loser_state][char_name] = []
            loser_data = DATA[quarter][loser_state][char_name]
            loser_data.append([])
            loser_data.append(0)
            loser_data.append(0)

        # Winner Stats
        if contains_character(data["WinnerCharacters"], char_name):
            if not contains_player(winner_data[NAMES], data["WinnerName"]):
                winner_data[NAMES].append(data["WinnerName"])
            winner_data[GAMES_PLAYED] += 1

            if data["EloMovement"] != None:
                winner_data[ELO_GAIN] += int(data["EloMovement"])

        # Loser Stats
        elif contains_character(data["LoserCharacters"], char_name):
            if not contains_player(loser_data[NAMES], data["LoserName"]):
                loser_data[NAMES].append(data["LoserName"])
            loser_data[GAMES_PLAYED] += 1

'''
    Get all matches per character played
'''
for character in CHARACTERS:
    CHAR_RES = character_matches(character)
    for data in CHAR_RES:
        initialise_data(data, character)

print(DATA)