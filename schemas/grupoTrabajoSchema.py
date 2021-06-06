from models.mongo.grupoDeTrabajo import GrupoDeTrabajo
from marshmallow import Schema, fields, post_load

#schemas
class GrupoDeTrabajoIDSchema(Schema):
    id_grupoDeTrabajo = fields.Integer(required=True,
    error_messages={"required": {"message": "Debe indicarse id de grupo", "code": 400}}
    ) 

class ModificarGrupoDeTrabajoSchema(GrupoDeTrabajoIDSchema):
    integrantes = fields.List(fields.Int())
    jefeDeGrupo =  fields.Integer()
    nombre = fields.Str()

class jefeDeGrupoSchema(GrupoDeTrabajoIDSchema):
    jefeDeGrupo = fields.Integer(required=True,error_messages={"required": {"message": "Debe indicarse id jefe de grupo", "code": 400}}) 
  
class GrupoDeTrabajoSchema(Schema):
    id_grupoDeTrabajo = fields.Integer()
    nombre = fields.Str()
    jefeDeGrupo = fields.Integer()
    integrantes = fields.List(fields.Int())
    grupoGral = fields.Boolean()
  
class NuevoGrupoDeTrabajoSchema(Schema):
    nombre = fields.Str(required=True,error_messages={"required": {"message": "Debe indicarse nombre de grupo", "code": 400}}) 
    jefeDeGrupo = fields.Integer(required=True,error_messages={"required": {"message": "Debe indicarse Jefe de Grupo", "code": 400}}) 
    grupoGral = fields.Boolean(default=False)
    integrantes = fields.List(fields.Int())

    @post_load
    def make_Grupo(self, data, **kwargs):
        return GrupoDeTrabajo(**data)

""" class NuevoStockGrupoSchema(GrupoDeTrabajoIDSchema):
    stock = fields.Nested(NuevoStockSchema) """

""" class NuevoProductoEnStockGrupoSchema(GrupoDeTrabajoIDSchema):
    stock = fields.Nested(NuevoStockSchema) 
  
class busquedaStocksSchema(GrupoDeTrabajoIDSchema):
    id_espacioFisico = fields.Integer(required=True, error_messages={"required": {"message" : "Debe indicarse id_stock", "code": 400}})
    id_productoEnStock = fields.Integer(required=True, error_messages={"required": {"message" : "Debe indicarse id_productoEnStock", "code": 400}})
    id_productos = fields.Integer(required=True, error_messages={"required": {"message" : "Debe indicarse id_productos", "code": 400}})

class ModificarProducto(busquedaStocksSchema):
    codigoContenedor = fields.Integer()
    detalleUbicacion = fields.String(default="")
    unidad =fields.Integer()
    lote = fields.String(default="")
    fechaVencimiento = fields.DateTime() """