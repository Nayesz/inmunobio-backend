from marshmallow import ValidationError
#from servicios.commonService import CommonService
from schemas.blogSchema import BlogSchema,NuevoBlogSchema
from datetime import datetime

def cambioUTC():
    from datetime import datetime, timedelta
    # Obtener la fecha y hora actual en formato UTC
    fecha_utc = datetime.utcnow()
    # Restar 3 horas a la fecha y hora actual
    fecha_resta_tres_horas = fecha_utc - timedelta(hours=3)
    # Imprimir la fecha y hora resultante en formato ISO 8601
    return fecha_resta_tres_horas.isoformat()

class BlogService():
    @classmethod
    def nuevoBlog(cls,datos):
        #falta validar usuario q crea
        datos['fecha'] = cambioUTC()
        return NuevoBlogSchema().load(datos)

    @classmethod
    def convertirFecha(cls,fecha,hr,min,seg):
        return datetime.strptime(fecha, "%a %b %d %Y").replace(hour=hr, minute=min, second=seg, microsecond=0)

    @classmethod
    def busquedaPorFecha(cls,blogs,fecDesde,fecHasta):
        fecDesde= cls.convertirFecha(fecDesde,0,0,0)
        fecHasta = cls.convertirFecha(fecHasta,23,59,0)
        cls.validarFechas(fecDesde, fecHasta)
        blogFiltrados = []
        print("entramos a iterar blogs")
        for blog in blogs:
            print(blog.fecha)
            print(blog.fecha <= fecHasta and blog.fecha>=fecDesde)
        return cls.agregarDataUsuarios(list(filter(lambda blog: blog.fecha <= fecHasta and blog.fecha>=fecDesde , blogs)))
        
    @classmethod
    def agregarDataUsuarios(cls,blogs):
        from .commonService import CommonService
        return list(map(lambda blog: CommonService.asignarUsuario(blog), blogs))
        
    def validarFechas(fechaDesde,fechaHasta):
        if not fechaDesde<fechaHasta: raise Exception("El rango de fechas debe ser válido.")

    @classmethod
    def appendBlogs(cls,objetos):
        listaBlogs = []
        for objeto in objetos:listaBlogs.extend(objeto.blogs)
        return listaBlogs
    



