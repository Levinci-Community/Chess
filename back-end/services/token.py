from secrets import token_urlsafe
from hashlib import sha256
from time import time

def generate_token(length=32):
    return token_urlsafe(length)

def is_valid_token(token, stored_token, expiration_time=3600):
    if token != stored_token:
        return False

    # timestamp = int(stored_token[-16:], 16)
    # current_time = time.time()
    # time_difference = current_time - timestamp

    # if time_difference > expiration_time:
    #     return False

    return True