from models.mongo.herramienta import Herramienta
from servicios.blogService import BlogService
from schemas.herramientaSchema import BusquedaBlogHerramienta,NuevaHerramientaSchema,HerramientaSchema,NuevoBlogHerramientaSchema

class HerramientaService:
    @classmethod
    def find_by_id(cls, _id_herramienta):
        herramienta =  Herramienta.objects(id_herramienta = _id_herramienta).first()
        if not herramienta : raise Exception(f"No se encontró ninguna herramienta con el id: {_id_herramienta}")
        return herramienta

    @classmethod
    def nuevaHerramienta(cls,datos):
        herramienta = NuevaHerramientaSchema().load(datos)
        cls.espacioFisValidacion(herramienta.id_espacioFisico)
        herramienta.save()
        
    @classmethod
    def espacioFisValidacion(cls,id_espacio):
        from servicios.espacioFisicoService import EspacioFisicoService
        EspacioFisicoService.find_by_id(id_espacio)
    
    @classmethod
    def modificarHerramienta(cls,datos):
        HerramientaSchema().load(datos)
        herramienta =  cls.find_by_id(datos['id_herramienta'])
        cls.espacioFisValidacion(herramienta.id_espacioFisico)
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
        herramienta = cls.find_by_id(datos['id_herramienta'])
        herramienta.blogs.append(BlogService.nuevoBlog(datos['blogs']))
        herramienta.save()

    @classmethod    
    def formateoFecha(cls,fecha_str):
        import datetime
        fecha = datetime.datetime.strptime(fecha_str, '%Y-%m-%dT%H:%M:%S.%f')
        return fecha.strftime('%Y-%m-%d %H:%M')

    @classmethod    
    def formateoFechaEnBlogs(cls,blogs):
        from schemas.blogSchema import BlogSchemaExtendido
        dictBlogs = []
        for blog in blogs:
            dictBlog =  BlogSchemaExtendido().dump(blog)
            dictBlog['fecha'] = cls.formateoFecha(dictBlog['fecha'])
            dictBlogs.append(dictBlog)
        return dictBlogs 
       
    @classmethod
    def blogHerramienta(cls,datos):
        BusquedaBlogHerramienta().load(datos)
        herramienta =  cls.find_by_id(datos['id_herramienta'])
        sorted_json_list = sorted(BlogService.busquedaPorFecha(herramienta.blogs,datos['fechaDesde'],datos['fechaHasta']), key=lambda item: item['fecha'], reverse=True)
        return cls.formateoFechaEnBlogs(sorted_json_list) 

    @classmethod
    def borrarlogHerramienta(cls,_id_herramienta,_id_blog):
        if(Herramienta.objects.filter(id_herramienta = _id_herramienta)):
            if (Herramienta.objects.filter(id_herramienta = _id_herramienta, blogs__id_blog= _id_blog).first()):
                return Herramienta.objects.filter(id_herramienta = _id_herramienta).first().modify(pull__blogs__id_blog =_id_blog)
            raise Exception(f"No existe blog con id:{_id_blog}")
        raise Exception(f"No existe herramienta con id:{_id_herramienta}")









    