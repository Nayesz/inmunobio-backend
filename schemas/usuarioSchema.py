from models.mysql.usuario import Usuario
from marshmallow import Schema, fields, post_load,ValidationError
from schemas.permisosSchema import PermisoExistenteSchema


def validarPassword(password):
        if len(password) < 8:
                raise ValidationError("La contraseña debe tener como mínimo 8 caracteres.")

def must_not_be_blank(data):
    if not data:
        raise ValidationError('Deben asignarse permisos .')

class UsuarioSchema(Schema):
    id = fields.Integer()
    email = fields.Str()
    nombre = fields.Str()
    password = fields.Str()    
    habilitado = fields.Boolean(default=True)
    direccion = fields.Str()
    telefono = fields.Str()
    permisos = fields.Nested(PermisoExistenteSchema, many=True)
    id_grupoDeTrabajo =fields.Integer(allow=None)
    esJefeDe = fields.Integer(allow=None)


class UsuarioNuevoSchema(UsuarioSchema):
    email = fields.Str( required=True,error_messages={"required": {"message": "Se necesita ingresar el mail", "code": 400}})
    nombre = fields.Str( required=True,error_messages={"required": {"message": "Se necesita ingresar el nombre del usuario", "code": 400}})
    password = fields.Str(required=True,error_messages={"required": {"message": "Se necesita ingresar el password", "code": 400}},validate= validarPassword)
    permisos = fields.Nested(PermisoExistenteSchema, many=True, required=True,error_messages={"required": {"message": "Se necesita asignar permisos", "code": 400}},validate=must_not_be_blank)
    
    @post_load
    def make_Usuario(self, data, **kwargs):
        return Usuario(**data)

class UsuariosBase(UsuarioNuevoSchema):
    @post_load
    def make_Usuario(self, data, **kwargs):
        from db import db
        db.session.add(Usuario(**data))
        db.session.commit()

class UsuarioSchemaModificar(UsuarioNuevoSchema):
    id = fields.Integer(required=True,error_messages={"required": {"message": "Debe indicarse id Usuario", "code": 400}})
    

