from models.mongo.experimento import Experimento
from schemas.experimentoSchema import BusquedaBlogExp,NuevoBlogExpSchema, ExperimentoSchema, ModificarExperimentoSchema, AltaExperimentoSchema, CerrarExperimentoSchema, AgregarMuestrasAlExperimentoSchema
from servicios.commonService import CommonService
from .validationService import Validacion
from models.mongo.experimento import Experimento 
from servicios.muestraService import MuestraService
from servicios.blogService import BlogService
from dateutil import parser
import datetime

class ExperimentoService:    
    @classmethod
    def find_by_id(cls, idExperimento):
        return  Experimento.objects.filter(id_experimento=idExperimento,finalizado=False).first()
    @classmethod
    def find_by_id_all(cls, idExperimento):
        return  Experimento.objects.filter(id_experimento=idExperimento).first()
    
    @classmethod
    def experimentoPorId(cls,idExperimento):
        experimento = ExperimentoSchema().dump(cls.find_by_id_all(idExperimento))
        from servicios.muestraService import MuestraService
        MuestraService.muestrasDelExperimentoDatosExtra(experimento['muestrasExternas'])
        return experimento

    @classmethod
    def find_all_by_idProyecto(cls, idProyecto):
        return ExperimentoSchema().dump(Experimento.objects.filter(id_proyecto=idProyecto).all(), many=True)

    @classmethod
    def find_by_id_proyecto(cls, idProyecto):
        return Experimento.objects.filter(id_proyecto=idProyecto).all()

    @classmethod
    def nuevoExperimento(cls, datos):
        from servicios.proyectoService import ProyectoService
        experimento = AltaExperimentoSchema().load(datos)
        ProyectoService.find_by_id(experimento.id_proyecto)
        experimento.fechaInicio = CommonService.cambioUTC()
        experimento.save()

    @classmethod
    def find_by_proyecto(cls, _id_proyecto):
        return Experimento.objects(id_proyecto = _id_proyecto) 

    @classmethod
    def experimentoDisponible(cls, experimento):
        return not experimento.finalizado

    @classmethod
    def todosLosExperimentosFinalizados(cls,id_proyecto):
        return all(not cls.experimentoDisponible(experimento) for experimento in cls.find_by_proyecto(id_proyecto))

    @classmethod
    def cerrarExperimento(cls, datos):
        experimento = CerrarExperimentoSchema().load(datos)
        Experimento.objects(id_experimento=experimento.id_experimento).update(
            fechaFin =  CommonService.cambioUTC(),
            resultados = experimento.resultados,
            finalizado = True,
            conclusiones = experimento.conclusiones
        )

    @classmethod
    def modificarExperimento(cls, datos):
        experimento = ModificarExperimentoSchema().load(datos)
        Experimento.objects(id_experimento=experimento.id_experimento).update(
            resultados= experimento.resultados,
            metodologia = experimento.metodologia,
            objetivos = experimento.objetivos,
            muestrasExternas = experimento.muestrasExternas,
            codigo = experimento.codigo

        )

    def lasMuestrasSonDelMismoProyectoDelExperimento(self, experimento):
        return all(experimento.id_proyecto == muestraExterna.id_proyecto for muestraExterna in experimento.muestrasExternas)
        
    def lasMuestrasEstanHabilitadas(self, experimento):
        return all(MuestraService.validarMuestra(muestra.id_muestra) for muestra in experimento.muestrasExternas)

    def validarMuestrasExternas(self, experimento):
        if not self.lasMuestrasSonDelMismoProyectoDelExperimento(self, experimento):
            raise ValueError("Todas las muestras tienen que ser del mismo proyecto.")
        if self.lasMuestrasEstanHabilitadas(self, experimento):
            raise ValueError("Todas las muestras tienen que estar habilitadas.")

    @classmethod
    def agregarMuestrasExternasAlExperimento(cls, datos):
        AgregarMuestrasAlExperimentoSchema().load(datos)
        experimento = AgregarMuestrasAlExperimentoSchema().load(datos)
        cls.validarMuestrasExternas(cls, experimento)
        Experimento.objects(id_experimento = experimento.id_experimento).update(muestrasExternas=experimento.muestrasExternas)

    def nuevoBlogExperimento(cls, datos):
        NuevoBlogExpSchema().load(datos)
        cls.crearBlogExp(cls,datos['id_experimento'],datos['blogs'])

    @classmethod
    def crearBlogExp(cls,id_experimento,datosBlog):
        from servicios.blogService import BlogService
        experimento = cls.find_by_id(id_experimento)
        if not experimento : raise Exception(f"No existe experimento asociado con id {id_experimento}")
        experimento.blogs.append(BlogService.nuevoBlog(datosBlog))
        experimento.save()
        
    @classmethod
    def expPerteneceAlProyecto(cls,id_proyecto,id_experimento):
        exp = cls.find_by_id(id_experimento)
        if not exp : raise Exception(f"No existe experimento asociado con id {id_experimento}")
        if not exp.id_proyecto == id_proyecto: raise Exception("El experimento con id {id_experimento} no pertene al proeyecto")
  
    @classmethod
    def obtenerBlogsEXperimentoPorID(cls,datos):
        BusquedaBlogExp().load(datos)
        experimento = cls.find_by_id_all(datos['id_experimento'])
        print("NUESTRO EXP ES")
        print(experimento)
        sorted_json_list = sorted(cls.obtenerBlogs(experimento,datos), key=lambda item: item['fecha'], reverse=True)
        return cls.formateoFechaEnBlogs(sorted_json_list) 
    
    @classmethod    
    def formateoFecha(cls,fecha_str):
        import datetime
        fecha = datetime.datetime.strptime(fecha_str, '%Y-%m-%dT%H:%M:%S.%f')
        return fecha.strftime('%Y-%m-%d %H:%M')
    
    @classmethod    
    def formateoFechaEnBlogs(cls,dictBlogs):
        for blog in dictBlogs:
            blog['fecha'] = cls.formateoFecha(blog['fecha'])
        return dictBlogs


    @classmethod
    def removerMuestraDeExperimento(cls, idExperimento, idMuestra):
        cls.validarRemoverMuestraExperimento(idExperimento, idMuestra)
        Experimento.objects(id_experimento=idExperimento).update(pull__muestrasExternas__id_muestra=idMuestra)
    
    def validarRemoverMuestraExperimento(idExperimento, idMuestra):
        if not Validacion().elExperimentoExiste(idExperimento):
            raise Exception(f"El experimento con id {idExperimento} no existe.")
        if not Validacion().existeLaMuestra(idMuestra):
            raise Exception(f"La muestra con id {idMuestra} no existe.")
        if not Validacion().elExperimentoTieneLaMuestra(idExperimento, idMuestra):
            raise Exception(f"El experimento con id {idExperimento} no tiene la muestra con id {idMuestra}.")

    @classmethod
    def obtenerBlogsExperimentoDeProyecto(cls,_id_proyecto,datos):
        import itertools # para aplanar la lista
        experimentos = cls.find_by_id_proyecto(_id_proyecto)
        return list(itertools.chain.from_iterable([x for x in list(map(lambda exp: cls.obtenerBlogs(exp,datos),experimentos)) if x]))

    @classmethod
    def obtenerBlogs(cls,experimento,datos):
        from servicios.blogService import BlogService
        blogs = BlogService.busquedaPorFecha(experimento.blogs,datos['fechaDesde'],datos['fechaHasta'])
        return cls.deserializarBlogsExp(blogs,experimento) 
   
    @classmethod
    def deserializarBlogsExp(cls,blogs,exp):
        return list(map(lambda blog: cls.agregarDatosExtraBlogExp(blog,exp),blogs))

    @classmethod
    def agregarDatosExtraBlogExp(cls,blog,exp):
        from schemas.blogSchema import BlogSchemaExtendido
        dictBlog =  BlogSchemaExtendido().dump(blog)
        dictBlog['codigoExperimento'] = exp.codigo
        return dictBlog

    @classmethod
    def experimentos(self):
        return Experimento.objects.all()

    @classmethod
    def nombreExperimento(cls,idExperimento):
        return cls.find_by_id(idExperimento).codigo