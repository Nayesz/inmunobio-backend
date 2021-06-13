from models.mongo.herramienta import Herramienta
from servicios.fuenteExperimentalService import FuenteExperimentalService
from servicios.blogService import BlogService
from exceptions.exception import ErrorHerramientaInexistente,ErrorBlogInexistente
from schemas.herramientaSchema import NuevaHerramientaSchema,HerramientaSchema,NuevoBlogHerramientaSchema

class HerramientaService:
    @classmethod
    def find_by_id(cls, _id_herramienta):
        herramienta =  Herramienta.objects(id_herramienta = _id_herramienta).first()
        if not herramienta : raise ErrorHerramientaInexistente(_id_herramienta)
        return herramienta

    @classmethod
    def nuevaHerramienta(cls,datos):
        herramienta = NuevaHerramientaSchema().load(datos)
        herramienta.save()

    @classmethod
    def modificarHerramienta(cls,datos):
        HerramientaSchema.load(datos)
        herramienta =  cls.find_by_id(datos['id_herramienta'])
        herramienta.update(
            nombre = datos['nombre'],
            detalle = datos['detalle'],
            id_espacioFisico =datos['id_espacioFisico']
        )
        herramienta.save()

    @classmethod
    def eliminarHerramienta(cls,id_herramienta):
        herramienta =  cls.find_by_id(id_herramienta)
        herramienta.delete()
    @classmethod
    def obtenerHerramientas(cls):
        return Herramienta.objects.all()
    
    @classmethod
    def nuevoBlogHerramienta(cls,datos):
        blogNuevo = NuevoBlogHerramientaSchema().load(datos)
        herramienta =   cls.find_by_id(datos['id_herramienta'])
        herramienta.blogs.append(blogNuevo['blogs'])
        herramienta.save()
    
    @classmethod
    def blogHerramienta(cls,_id_herramienta):
        herramienta =  cls.find_by_id(_id_herramienta)
        return herramienta.blogs

    @classmethod
    def borrarlogHerramienta(cls,_id_herramienta,_id_blog):
        if(Herramienta.objects.filter(id_herramienta = _id_herramienta)):
            if (Herramienta.objects.filter(id_herramienta = _id_herramienta, blogs__id_blog= _id_blog).first()):
                return Herramienta.objects.filter(id_herramienta = _id_herramienta).first().modify(pull__blogs__id_blog =_id_blog)
            raise ErrorBlogInexistente(_id_blog)
        raise ErrorHerramientaInexistente(_id_herramienta)



        








    