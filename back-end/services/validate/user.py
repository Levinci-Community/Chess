import re

def validate(username = None, password = None, email = None, name = None):
    validations = []
    if username != None:
        validations.append(validate_username(username))
    if password != None:
        validations.append(validate_password(password))
    if email != None:
        validations.append(validate_email(email))
    if name != None:
        validations.append(validate_name(name))
    

    ok, msg = True, ''
    for validation in validations:
        ok &= validation[0]
        msg += validation[1]
    
    return ok, msg

def validate_short(username, password):
    validations = [validate_username(username), validate_password(password)]

    ok, msg = True, ''
    for validation in validations:
        ok &= validation[0]
        msg += validation[1]
    
    return ok, msg

def validate_username(username):
    if not (username and isinstance(username, str) and len(username) >= 8):
        return False, 'Invalid username. It must be at least 8 characters long.\n'
    return True, ''

def validate_password(password):
    if not (password and isinstance(password, str) and len(password) >= 8):
        return False, 'Invalid password. It must be at least 8 characters long.\n'
    return True, ''

def validate_email(email):
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not (email and isinstance(email, str) and re.match(email_regex, email)):
        return False, 'Invalid email address.\n'
    return True, ''

def validate_name(name):
    if not (name and isinstance(name, str) and len(name) >= 4):
        return False, 'Invalid name. It must be at least 4 characters long.\n'
    return True, ''
