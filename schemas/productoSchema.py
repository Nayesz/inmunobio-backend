
from models.mongo.producto import Producto
from marshmallow import Schema, fields, post_load

class IdProductoSchema(Schema):
    id_producto = fields.Integer(required=True, error_messages={"required": {"message" : "Debe indicarse el id de producto", "code": 400}})

class ModificarProductoSchema(IdProductoSchema):
    url = fields.String()
    aka =  fields.String()
    tipo =  fields.String()
    unidadAgrupacion =  fields.Integer(default=1)
    detallesTecnicos =  fields.String()#Se sube archivo .txt
    protocolo = fields.String() #Se sube archivo
    id_distribuidora =  fields.Integer()
    
class ProductoSchema(ModificarProductoSchema):
    nombre = fields.String()
    marca =  fields.String()
    id_distribuidora =  fields.Integer()
    id_producto = fields.Integer(dump_only=True)

class NuevoProductoSchema(ProductoSchema):
    nombre = fields.String(required=True, error_messages={"required": {"message" : "Debe indicarse el nombre de producto", "code": 400}})
    marca =  fields.String(required=True, error_messages={"required": {"message" : "Debe indicarse la marca del producto", "code": 400}})

    @post_load
    def makeProducto(self, data, **kwargs):
        return Producto(**data)