from db import dbMongo
from models.mongo.productosEnStock import ProductosEnStock

class Stock(dbMongo.Document):
    id_productoEnStock =  dbMongo.SequenceField()
    nombre = dbMongo.StringField() #se toma de producto
    id_producto = dbMongo.IntField()  #se toma de producto
    id_espacioFisico = dbMongo.IntField()
    id_grupoDeTrabajo = dbMongo.IntField()
    producto = dbMongo.ListField(dbMongo.EmbeddedDocumentField('ProductosEnStock'))
    seguimiento = dbMongo.BooleanField()

    def __str__(self):
        return f"""
        id_productoEnStock = {self.id_productoEnStock}
        nombre = {self.nombre}
        id_producto = {self.id_producto}
        id_espacioFisico = {self.id_espacioFisico}
        id_grupoDeTrabajo = {self.id_grupoDeTrabajo}
        producto = {self.producto}
        seguimiento = {self.seguimiento}
        """


  

