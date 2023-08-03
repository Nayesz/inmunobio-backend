from schemas.grupoTrabajoSchema import jefeDeGrupoSchema, ModificarGrupoDeTrabajoSchema, GrupoDeTrabajoSchema, GrupoDeTrabajo, NuevoGrupoDeTrabajoSchema
from schemas.usuarioSchema import UsuarioSchema
from servicios.commonService import CommonService

class GrupoDeTrabajoService():

    idGrupoDefault = 0

    def find_by_id(id):
        grupo = GrupoDeTrabajo.objects.filter(id_grupoDeTrabajo=id).first()
        if(not grupo):
            raise Exception("Grupo de trabajo inexistente.")
        return grupo

    def find_by_nombre(_nombre):
        return GrupoDeTrabajo.objects(nombre=_nombre).first()
    
    def find_by_jefeDeGrupo(idJefe):
        return CommonService.jsonMany(GrupoDeTrabajo.objects(jefeDeGrupo = idJefe), GrupoDeTrabajoSchema)

    @classmethod
    def modificarGrupo(cls, datos):
        grupoModificado = ModificarGrupoDeTrabajoSchema().load(datos)
        grupoAModificar = cls.find_by_id(grupoModificado.id_grupoDeTrabajo)
        cls.validarMiembros(cls.diferenciaConjuntos(grupoModificado.integrantes, grupoAModificar.integrantes))
        cls.validarJefe(grupoModificado.jefeDeGrupo,grupoModificado.id_grupoDeTrabajo)
        cls.modificacionMiembros(grupoModificado, grupoAModificar)
        grupoAModificar.update(integrantes= grupoModificado.integrantes, jefeDeGrupo= grupoModificado.jefeDeGrupo, nombre= grupoModificado.nombre)

    @classmethod
    def modificacionMiembros(cls, grupoNuevo, grupoViejo):
        cls.asignarIdGrupoMiembros(cls.diferenciaConjuntos(grupoNuevo.integrantes, grupoViejo.integrantes), grupoViejo.id_grupoDeTrabajo)
        cls.asignarIdGrupoMiembros(cls.diferenciaConjuntos(grupoViejo.integrantes, grupoNuevo.integrantes), cls.idGrupoDefault)
        if(grupoNuevo.jefeDeGrupo != grupoViejo.jefeDeGrupo):
            cls.nombrarJefe(grupoNuevo.jefeDeGrupo, grupoNuevo.id_grupoDeTrabajo)
            cls.nombrarJefe(grupoViejo.jefeDeGrupo, cls.idGrupoDefault)

    @classmethod
    def diferenciaConjuntos(cls, primerConjunto, segundoConjunto):
        # Devuelve una lista de los items que estan en el primer conjunto y que no estan en el segundo.
        return [x for x in primerConjunto if x not in set(segundoConjunto)]

    @classmethod
    def nuevoGrupo(cls, datos):
        print("entramso a  crear nuevo grupo")
        grupoCreado = NuevoGrupoDeTrabajoSchema().load(datos)
        print("validamos al jefe y vemos si tambien es jefe de proyecto")
        jefeDeGrupoEsJefeDeProyecto = cls.validarJefe(grupoCreado.jefeDeGrupo,cls.idGrupoDefault)
        print("MIEMBROS", grupoCreado.integrantes)
        grupoCreado.integrantes = cls.quitarMiembroJefeRepetido(grupoCreado.jefeDeGrupo,grupoCreado.integrantes)
        #no puede haber otro jefe de proyecto entre los integrantes
        print("MIEMBROS;:" , grupoCreado.integrantes)
        cls.validarMiembros(grupoCreado.integrantes,jefeDeGrupoEsJefeDeProyecto)
        grupoCreado.save()
        cls.asignarIDGrupo(grupoCreado, grupoCreado.id_grupoDeTrabajo)

    @classmethod
    def removerGrupo(cls, id_grupoDeTrabajo):
        grupoABorrar = cls.find_by_id(id_grupoDeTrabajo)
        print("llegamos a borrar")
        cls.validarDelete(grupoABorrar)
        cls.asignarIDGrupo(grupoABorrar, cls.idGrupoDefault)
        #grupoABorrar.delete()
    @classmethod
    def quitarMiembroJefeRepetido(cls, jefe,integrantes):
        nuevaLista = integrantes
        if jefe in nuevaLista: 
            nuevaLista.remove(jefe)
        return nuevaLista



    @classmethod
    def obtenerGrupoPorId(cls, idGrupoDeTrabajo):
        grupoConsulta = cls.find_by_id(idGrupoDeTrabajo)
        cls.agregarDatosGrupo(grupoConsulta)
        return grupoConsulta
    
    @classmethod
    def obtenerTodosLosGruposDe(cls, idUsuario):
        from servicios.usuarioService import UsuarioService
        usuario = UsuarioService.find_by_id(idUsuario)
        usaurioJson = CommonService.json(usuario, UsuarioSchema)
        print(f"Permisos del usuario {usaurioJson['permisos']} ")
        for permiso in usaurioJson['permisos']:            
            if permiso['descripcion'] in ['Superusuario', 'Director de centro', 'Director de proyecto / bioterio']:
                return cls.obtenerTodosLosGrupos()
            elif permiso['descripcion'] in ['Jefe de grupo']:
                return cls.find_by_jefeDeGrupo(idUsuario)
            else:
                raise Exception(f"El usuario no tiene permisos para ver los grupos de trabajo.")

    @classmethod
    def agregarDatosGrupo(cls,grupo):
        from servicios.usuarioService import UsuarioService
        grupo.jefeDeGrupo = UsuarioService.find_by_id(grupo.jefeDeGrupo)
        grupo.integrantes = UsuarioService.busquedaUsuariosID(grupo.integrantes)

    @classmethod
    def asignarIDGrupo(cls, grupo, id):        
        from servicios.usuarioService import UsuarioService
        cls.asignarIdGrupoMiembros(grupo.integrantes, id)
        UsuarioService.cambiarIdGrupo(grupo.jefeDeGrupo,id)
        cls.nombrarJefe(grupo.jefeDeGrupo, id)

    @classmethod
    def asignarIdGrupoMiembros(cls, idIntegrantes, idGrupo):
        from servicios.usuarioService import UsuarioService
        [UsuarioService.cambiarIdGrupo(id, idGrupo) for id in idIntegrantes]

    def obtenerTodosLosGrupos():
        return CommonService.jsonMany(GrupoDeTrabajo.objects.all(), GrupoDeTrabajoSchema)

    @classmethod
    def nombrarJefe(cls, idJefe, idGrupo):
        from servicios.usuarioService import UsuarioService
        UsuarioService.asignarGrupoAJefe(idJefe, idGrupo)

    @classmethod
    def validarDelete(cls,grupo):
        if grupo.grupoGral: raise Exception("El grupo es general y no puede darse de baja." )
        #  Validar existencia de stock asociado a este grupo.
        cls.validarStockAsociadoAlGrupo(grupo.id_grupoDeTrabajo)
        # Validar que no existan proyectos activos donde el jefe de grupo pertenezca
        cls.validarProyectosAsociadosAlGrupo(grupo)

    @classmethod
    def validarStockAsociadoAlGrupo(cls,idGrupo):
        from servicios.stockService import StockService
        if(len(StockService.stockDeGrupo(idGrupo))):raise Exception("El grupo tiene stock activo y no puede darse de baja." )

    @classmethod
    def validarProyectosAsociadosAlGrupo(cls,grupo):
        #from servicios.stockService import StockService
        #if(len(StockService.stockDeGrupo(idGrupo))):raise Exception("El grupo tiene stock activo y no puede darse de baja." )
        print(grupo.integrantes)


    @classmethod
    def validarMiembros(cls, integrantes,jefeDeGrupoEsJefeDeProyecto):
        from servicios.usuarioService import UsuarioService
        for idIntegrante in integrantes: UsuarioService.validaAsignacionGrupo(idIntegrante)
        UsuarioService.validaUnicidadDeJefe(integrantes,jefeDeGrupoEsJefeDeProyecto)

    @classmethod
    def validarJefe(cls, id_jefeDeGrupo,idGrupo): 
        from servicios.usuarioService import UsuarioService
        return UsuarioService.validarJefeDeGrupo(id_jefeDeGrupo,idGrupo)

    #-------------------este endpoint ya no se usa:
    @classmethod
    def modificarJefeGrupo(cls, datos):
        jefeDeGrupoSchema().load(datos)
        grupoAModificar = cls.find_by_id(datos['id_grupoDeTrabajo'])
        cls.validarJefe(datos['jefeDeGrupo'],grupoAModificar.id_grupoDeTrabajo)
        cls.desnombrarJefe(grupoAModificar.jefeDeGrupo)
        cls.nombrarJefe(grupoAModificar.jefeDeGrupo,
                        grupoAModificar.id_grupoDeTrabajo)
        grupoAModificar.update(jefeDeGrupo=grupoAModificar.jefeDeGrupo)