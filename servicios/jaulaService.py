from models.mongo.jaula import Jaula
from servicios.fuenteExperimentalService import FuenteExperimentalService
from servicios.blogService import BlogService
from exceptions.exception import ErrorJaulaInexistente,ErrorBlogInexistente
from schemas.jaulaSchema import  NuevaJaulaSchema, ActualizarProyectoJaulaSchema, ActualizarJaulaSchema,NuevoBlogJaulaSchema

class JaulaService:
    @classmethod
    def find_by_id(cls, idJaula):
        jaula =  Jaula.objects(id_jaula = idJaula).first()
        if not jaula: raise ErrorJaulaInexistente(idJaula)
        return jaula
    
    @classmethod
    def jaulasSinAsignar(cls):
        return Jaula.objects(id_proyecto = 0).all()
    
    @classmethod
    def jaulasDelProyecto(cls, idProyecto):
        return Jaula.objects(id_proyecto = idProyecto).all()

    @classmethod
    def crearJaula(cls, datos):
        jaula = NuevaJaulaSchema().load(datos)
        jaula.save()
    
    @classmethod
    def actualizarProyectoDeLaJaula(cls, datos):
        jaula = ActualizarProyectoJaulaSchema().load(datos)
        Jaula.objects(id_jaula = jaula.id_jaula).update(
            id_proyecto = jaula.id_proyecto,
            nombre_proyecto = jaula.nombre_proyecto
        )

    @classmethod
    def actualizarJaula(cls, datos):
        jaula = ActualizarJaulaSchema().dump(datos)
        Jaula.objects(id_jaula = jaula.id_jaula).update(
            codigo = jaula.codigo,
            rack = jaula.rack,
            estante = jaula.estante,
            capacidad = jaula.capacidad,
            tipo = jaula.tipo
        )
    
    @classmethod
    def bajarJaula(cls, idJaula):
        jaula = Jaula.objects(id_jaula = idJaula).first()
        if jaula:
            if not cls.laJualaTieneAnimales(cls, idJaula):
                Jaula.objects(id_jaula = idJaula).update(habilitado = False)
                return {'Status':'Ok'}, 200
            else:
                return {'Status':'La jaula debe estar vacía para poder darla de baja'}, 400
        return {'Status': f'No se encontró una jaula con el id {idJaula}.'}, 200

    def laJualaTieneAnimales(self, idJaula):
        animales = FuenteExperimentalService.animalesDeLaJaula(idJaula)
        return  len(animales) > 0

    @classmethod
    def nuevoBlogJaula(cls, datos):
            NuevoBlogJaulaSchema().load(datos)
            jaula = cls.find_by_id(datos['id_jaula'])
            blog = BlogService.nuevoBlog(datos['blogs'])
            jaula.blogs.append(blog)
            jaula.save()
            return {'Status':'Ok'}, 200
    @classmethod
    def borrarBlogJaula(cls,_id_jaula,_id_blog):
        if(Jaula.objects.filter(id_jaula = _id_jaula).first()):
            if (Jaula.objects.filter(id_jaula = _id_jaula, blogs__id_blog= _id_blog).first()):
                return Jaula.objects.filter(id_jaula = _id_jaula).first().modify(pull__blogs__id_blog =_id_blog)
            raise ErrorBlogInexistente(_id_blog)
        raise ErrorJaulaInexistente(_id_jaula)