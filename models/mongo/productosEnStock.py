from db import dbMongo

class ProductosEnStock(dbMongo.EmbeddedDocument):
    id_productos =  dbMongo.SequenceField()
    codigoContenedor = dbMongo.IntField() #opcional
    detalleUbicacion = dbMongo.StringField()
    unidad = dbMongo.IntField()
    lote = dbMongo.StringField()
    fechaVencimiento = dbMongo.DateTimeField()

    def __str__(self):
        return f"""
        id_productos = {self.id_productos}
        codigoContenedor = {self.codigoContenedor}
        detalleUbicacion = {self.detalleUbicacion}
        unidad = {self.unidad}
        lote = {self.lote}
        fechaVencimiento = {self.fechaVencimiento}
        """


