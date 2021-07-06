from flask import jsonify
from exceptions.exception import ErrorNombreInvalido
class CommonService():
    
    def updateAtributes(object,atribute,keyExclude = ""):
        for key,value in atribute.items():
            if keyExclude != key and hasattr(object, key) :
                setattr(object, key, value)
  
    def comparar(objeto,otroObjeto,atributos):
        for att in atributos:
            if (getattr(objeto,att) != getattr(otroObjeto,att)): return False
        return True

    def jsonMany(datos,schema):
        return jsonify(schema().dump(datos,many=True))
    
    def json(datos,schema):
        return schema().dump(datos)
    
    @classmethod
    def asignarNombreEspacioFisico(cls,objetos):
        from servicios.espacioFisicoService import EspacioFisicoService
        for objeto in objetos: objeto['nombreEspFisico']  =  EspacioFisicoService.find_by_id(objeto['id_espacioFisico']).nombre
        return objetos
    
    @classmethod
    def asignarNombreProyecto(cls,objetos):
        from servicios.proyectoService import ProyectoService
        for objeto in objetos: 
            if objeto['id_proyecto']: objeto['nombreProyecto'] = ProyectoService.find_by_id(objeto['id_proyecto']).nombre 
            else:  objeto['nombreProyecto'] = objeto['id_proyecto']
        return objetos
    
    @classmethod
    def asignarNombreDistribuidora(cls,objetos):
        for objeto in objetos: cls.asignacionNombresDistribuidora(objeto,objeto['id_distribuidora'])
        return objetos

    @classmethod
    def asignacionNombresDistribuidora(cls,objeto,valor):
        from servicios.distribuidoraService import DistribuidoraService
        if valor : objeto['nombreDistribuidora'] = DistribuidoraService.find_by_id(valor).nombre 
        else:  objeto['nombreDistribuidora'] = valor
        return objeto

    @classmethod
    def asignarNombreContenedor(cls,objeto):
        from servicios.contenedorService import ContenedorService
        try:
            cls.validarId(objeto['codigoContenedor'])
            cls.asignaNombre(ContenedorService.obtenerNombreContenedor(objeto['codigoContenedor']), 'nombreContenedor',objeto)
        except ErrorNombreInvalido as err:
            cls.asignaNombre(objeto['codigoContenedor'], 'nombreContenedor',objeto)

    @classmethod
    def validarId(cls,id):
        if not id : raise ErrorNombreInvalido

    @classmethod
    def asignaNombre(cls,valor,clave,objeto):
        objeto[clave] = valor