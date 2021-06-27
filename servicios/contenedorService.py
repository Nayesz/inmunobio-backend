from models.mongo.contenedor import ContenedorPrincipalSchema,Contenedor, ContenedorSchema, ContenedorNuevoSchema, ContenedorProyectoSchema, ContenedorParentSchema, ModificarContenedorSchema
from .validationService import Validacion
class ContenedorService:

    @classmethod
    def find_by_id(cls, id):
        return Contenedor.objects.filter(id_contenedor=id).first()

    @classmethod
    def find_all(cls):
        return  ContenedorSchema().dump(Contenedor.objects.all(), many=True)
    
    @classmethod
    def find_all_by_id_proyecto(cls, id):
        return  ContenedorSchema().dump(Contenedor.objects.filter(id_proyecto=id).all(), many=True)

    @classmethod
    def nuevoContenedor(cls, datos):
        contenedor = ContenedorNuevoSchema().load(datos)
        contenedor.save()
    
    @classmethod
    def modificarContenedor(cls, datos):
        contenedor = ModificarContenedorSchema().load(datos)
        cls.validarModificarContenedor(contenedor.id_contenedor)
        Contenedor.objects(id_contenedor = contenedor.id_contenedor).update(
            codigo = contenedor.codigo,
            nombre = contenedor.nombre,
            descripcion = contenedor.descripcion,
            temperatura = contenedor.temperatura,
            id_proyecto = contenedor.id_proyecto,
            capacidad = contenedor.capacidad,
            fichaTecnica = contenedor.fichaTecnica,
            disponible = contenedor.disponible,
            parent = contenedor.parent,
            id_espacioFisico = contenedor.id_espacioFisico
        )
    
    def validarModificarContenedor(idContenedor):
        if not Validacion.elContenedorExiste(idContenedor):
            raise Exception(f"El contenedor con id {idContenedor} no existe.")
    
    @classmethod
    def eliminarContenedor(cls, idContenedor):
        cls.verificarEliminarContenedor(idContenedor)
        Contenedor.objects(id_contenedor = idContenedor).delete()
    
    def verificarEliminarContenedor(idContenedor):
        if Validacion.elContenedorTieneContenedoresHijos(idContenedor):
            raise Exception("El contenedor no puede tener contenedores asociados.")
        if Validacion.elContenedorTieneMuestrasAsociadas(idContenedor):
            raise Exception("El contenedor no puede tener muestras asociadoas.")

    @classmethod
    def asignarProyectoAlContenedor(cls, datos):
        contenedor = ContenedorProyectoSchema().load(datos)
        cls.verificarAsignarProyectoAlContenedor(contenedor)
        Contenedor.objects(id_contenedor = contenedor.id_contenedor).update(id_proyecto= contenedor.id_proyecto)
    
    def verificarAsignarProyectoAlContenedor(contenedor):
        if not Validacion.elContenedorExiste(contenedor.id_contenedor):
            raise Exception(f"El contenedor con id {contenedor.id_contenedor} no existe.")
        if not Validacion.elProyectoExiste(contenedor.id_proyecto):
            raise Exception(f"El proyecto con id {contenedor.id_proyecto} no existe.")
        if not Validacion.elProyectoEstaActivo(contenedor.id_proyecto):
            raise Exception(f"El proyecto con id {contenedor.id_proyecto} se encuentra finalizado.")

    @classmethod
    def subContenedoresDelContenedor(cls, datos):
        contenedorPrincipal = ContenedorPrincipalSchema().load(datos)
        return ContenedorSchema().dump(Contenedor.objects(parent = contenedorPrincipal.id_contenedor).all(), many=True)
    
    @classmethod
    def asignarParents(cls, datos):
        contenedor = ContenedorParentSchema().load(datos)
        cls.validarAsignacionDeParent(contenedor)
        Contenedor.objects(id_contenedor = contenedor.id_contenedor).update(parent = contenedor.parent)

    def validarAsignacionDeParent(contenedor):
        if contenedor.id_contenedor == contenedor.parent:
            raise Exception("El contenedor no puede contenerse a si mismo.")
        if not Validacion.elContenedorExiste(contenedor.id_contenedor):
            raise Exception(f"El contenedor con id {contenedor.id_contenedor} no existe.")
        if not Validacion.elContenedorExiste(contenedor.parent):
            raise Exception(f"El contenedor padre con id {contenedor.parent} no existe.")
        if not Validacion.elContenedorPadreEstaDisponible(contenedor):
            raise Exception("El contenedor padre tiene que estar disponible.")