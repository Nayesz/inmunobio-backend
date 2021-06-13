from re import I
from db import dbMongo
from marshmallow import Schema, fields, post_load, validate

from .validacion import Validacion
class FuenteExperimental(dbMongo.Document):
    id_fuenteExperimental = dbMongo.SequenceField()
    id_proyecto = dbMongo.IntField()
    codigo = dbMongo.StringField(default="")
    codigoGrupoExperimental = dbMongo.StringField(default="") #Se usa como flag para saber si está disponible
    especie = dbMongo.StringField()
    sexo = dbMongo.StringField()
    cepa = dbMongo.StringField()
    tipo = dbMongo.StringField()
    descripcion = dbMongo.StringField()
    id_jaula = dbMongo.IntField()
    baja = dbMongo.BooleanField(default=False)

    def json(self):
        return FuenteExperimentalSchema().dump(self)

class AnimalSchema(Schema):
    id_fuenteExperimental = fields.Int()
    id_proyecto = fields.Int()
    especie = fields.Str()
    sexo = fields.Str()
    cepa = fields.Str()
    tipo = fields.Str()
    id_jaula = fields.Int()
    baja = fields.Boolean()

    @post_load
    def make_Proyecto(self, data, **kwargs):
        return FuenteExperimental(**data)

class FuenteExperimentalSchema(AnimalSchema):
    codigo = fields.Str()
    
    codigoGrupoExperimental = fields.Str()
    descripcion = fields.Str()

class NuevoAnimalSchema(AnimalSchema):
    id_jaula = fields.Int(required=True, validate=Validacion.not_empty_int, error_messages={"required": {"message" : "Es necesario indicar el id de la jaula.", "code": 400}})
    especie = fields.Str(required=True, validate=Validacion.not_empty_string, error_messages={"required": {"message" : "Es necesario indicar la especie del animal", "code" : 400}})
    sexo = fields.Str(required=True, validate=Validacion.not_empty_string,  error_messages={"required": {"message" : "Es necesario indicar el sexo del animal", "code" : 400}})
    cepa = fields.Str(required=True, validate=Validacion.not_empty_string,  error_messages={"required": {"message" : "Es necesario indicar la cepa del animal", "code" : 400}})
class FuenteExperimentalAnimalSchema(FuenteExperimentalSchema):
    id_fuenteExperimental = fields.Int(required=True, validate=Validacion.not_empty_int, error_messages={"required": {"message" : "Es necesario indicar el id de la fuente experimental", "code": 400}})
    codigo = fields.Str(required=True, validate=Validacion.not_empty_string, error_messages={"required": {"message" : "Es necesario indicar el codigo de la fuente experimental", "code": 400}})
    codigoGrupoExperimental = fields.Str(required=True, validate=Validacion.not_empty_string,  error_messages={"required" : "Es necesario indicar el código para el grupo experimental", "code" : 400})
    
class FuenteExperimentalOtroSchema(FuenteExperimentalSchema):
    codigo = fields.Str(required=True, validate=Validacion.not_empty_string,  error_messages={"required": {"message" : "Es necesario indicar el codigo de la fuente experimental", "code": 400}})
    codigoGrupoExperimental = fields.Str(required=True, validate=Validacion.not_empty_string, error_messages={"required" : "Es necesario indicar el código para el grupo experimental", "code" : 400})
    tipo = fields.Str(required=True, validate=Validacion.not_empty_string,  error_messages={"required" : {"message" : "Es necesario indicar el tipo de la fuente experimental", "code": 400}})
    descripcion = fields.Str(required=True, validate=Validacion.not_empty_string,  error_messages={"required" : {"message" : "Es necesario indicar una descripcion cuando la fuente no es de tipo animal", "code": 400}})