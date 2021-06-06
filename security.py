from werkzeug.security import safe_str_cmp
from models.mysql.usuario import Usuario

#TO-DO: probar authenticate con email
def authenticate(email, password):
    user = Usuario.find_by_email(email)
    if user and safe_str_cmp(user.password, password):
        return user

def identity(payload):
    user_id = payload['identity']
    return Usuario.find_by_id(user_id) 