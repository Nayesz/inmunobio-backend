from calendar import c
from models.mysql.usuario import Usuario
from schemas.permisosSchema import PermisoExistenteSchema
from schemas.usuarioSchema import UsuarioSchemaModificar, UsuarioNuevoSchema,LoginUsuario,UsuarioSchema
from servicios.commonService import CommonService
from servicios.permisosService import PermisosService
from servicios.validationService import  ValidacionesUsuario
from werkzeug.security import generate_password_hash,check_password_hash

class UsuarioService():

    
    @classmethod
    def modificarUsuario(cls, datos):
        usuario = cls.validarModificacion(datos)
        usuario.permisos = cls.asignarRolDefault(datos)
        CommonService.updateAtributes(usuario , datos, ['permisos','password'])
        cls.modificacionPassword(usuario,datos['password'])
        #cls.asignarPermisos(usuario, datos['permisos'])
        from db import db
        db.session.commit()

    @classmethod
    def validarModificacion(cls, datos):
        UsuarioSchemaModificar().load(datos)
        usuarioAnt = UsuarioService.find_by_id(datos['id'])
        cls.validaModificacionEmail(usuarioAnt,datos['email'])
        cls.validarModificacionPermisos(usuarioAnt,datos['permisos'])
        return usuarioAnt

    @classmethod
    def validarModificacionPermisos(cls,usuarioAnt,permisos):
        from servicios.permisosService import PermisosService
        from servicios.proyectoService import ProyectoService
        nuevosPermisos = PermisosService.permisosById(permisos)
        if not PermisosService.tieneElPermiso(nuevosPermisos,PermisosService.jefeProyecto) and ProyectoService.usuarioEsJefeDeAlgunProyecto(usuarioAnt.id) :
            raise Exception("El usuario es jefe de un proyecto activo.No se puede revocar el permiso -Jefe de Proyecto-.")
        if not PermisosService.tieneElPermiso(nuevosPermisos,PermisosService.jefeDeGrupo) and usuarioAnt.esJefeDe :
            raise Exception("El usuario es jefe de un grupo activo.No se puede revocar el permiso -Jefe de Grupo-.")
        
    @classmethod
    def asignarPermisos(cls, usuario, permisosDicts):
        from servicios.permisosService import PermisosService
        usuario.permisos = PermisosService.permisosById(permisosDicts)

    @classmethod
    def asignarRolDefault(cls,datos):
        permisos_obj = []
        #Conversion de JSON a Objetos
        for permisox in datos["permisos"]:
           permisos_obj.append(PermisoExistenteSchema().load(permisox))
        return PermisosService.permisosById(permisos_obj)

    @classmethod
    def nuevoUsuario(cls,datos):
        usuario = UsuarioNuevoSchema().load(datos)
        usuario.permisos = cls.asignarRolDefault(datos)
        cls.validarEmail(usuario.email)
        cls.hashPassword(usuario,usuario.password)
        from db import db
        db.session.add(usuario)
        db.session.commit()

    @classmethod
    def hashPassword(cls,usuario,password):
        usuario.password = generate_password_hash(password, method='sha256')
         
    @classmethod
    def validaModificacionEmail(cls,usuario,email):
        if usuario.email != email : cls.validarEmail(email)

    @classmethod
    def modificacionPassword(cls,usuario,password):
        if usuario.password != password: 
            cls.hashPassword(usuario,password)

    @classmethod
    def validarEmail(cls,email ):
        if cls.find_by_email(email):
            raise Exception(f"Ya existe un/a usuario/a asociado/a con el email indicado.") 

    @classmethod
    def find_by_email(cls, _email):
        return Usuario.query.filter_by(email=_email, habilitado = True).first()

    @classmethod
    def find_by_id(cls, _id):
        '''dada una id de usuario devuelve usuario si esta habilitado '''
        resultado = Usuario.query.filter_by(id=_id,habilitado=True).first()
        if not resultado: raise Exception(f"No hay usuario/a asociado/a con id {_id}")
        return resultado

    @classmethod
    def find_by_id_all(cls, _id):
        return CommonService.json(Usuario.query.filter_by(id=_id).first(),UsuarioSchema)  

    @classmethod
    def findUsuariosHabilitados(cls):
        return Usuario.query.filter_by(habilitado=True).all()

    @classmethod
    def usuariosSinElPermiso(cls, id_permiso):
        from models.mysql.permiso import Permiso
        return Usuario.query.filter(~Usuario.permisos.any(
            Permiso.id_permiso.in_([id_permiso])))            

    @classmethod
    def usuariosJefes(cls):
        from models.mysql.permiso import Permiso
        jefes = Usuario.query.filter(
                Usuario.permisos.any(Permiso.id_permiso == 3) &
        (Usuario.esJefeDe == 0)
            ).all()
        return jefes
    
    @classmethod
    def candidatosAGrupo(cls):
        from models.mysql.permiso import Permiso
        ids_permisos = [5, 4]
        candidatos = Usuario.query.filter(
        Usuario.permisos.any(Permiso.id_permiso.in_(ids_permisos)),
        Usuario.id_grupoDeTrabajo == 0
    ).all()
        print("buscamos candidados")
        return candidatos

    @classmethod
    def usuariosTecnicos(cls):
        from models.mysql.permiso import Permiso
        ids_permisos = [1, 2, 3, 4]
        tecnicos = Usuario.query.filter(
            Usuario.permisos.any(
                ~Permiso.id_permiso.in_(ids_permisos) & 
                Usuario.id_grupoDeTrabajo == 0
            )
        ).all()
        return tecnicos
    
    @classmethod
    def usuariosSoloConElPermiso(cls, id_permiso):
        from models.mysql.permiso import Permiso
        usuarios_con_permiso_exclusivo = Usuario.query.filter(
        Usuario.permisos.any(Permiso.id_permiso == id_permiso) &
    ~Usuario.permisos.any(Permiso.id_permiso != id_permiso)).all()
        return usuarios_con_permiso_exclusivo
        #return Usuario.query.filter(~Usuario.permisos.any(
        #    Permiso.id_permiso.in_([id_permiso])))  
    


    @classmethod
    def deshabilitarUsuario(cls, id_usuario):
        from db import db
        usuario = UsuarioService.find_by_id(id_usuario)
        ValidacionesUsuario.jefeDeProyecto(usuario)  
        usuario.habilitado =False 
        db.session.commit()
        ValidacionesUsuario.desvincularDeProyectos(id_usuario)

    @classmethod
    def busquedaUsuariosID(cls, list_id_usuario):
        return list(map(UsuarioService.find_by_id,list_id_usuario))

    @classmethod
    def cambiarIdGrupo(cls, _id_usuario, idGrupo ):
        from db import db
        cls.find_by_id(_id_usuario).id_grupoDeTrabajo = idGrupo
        db.session.commit()
        
    @classmethod
    def asignarGrupoAJefe(cls, _id_usuario, idGrupo ):
        from db import db
        cls.find_by_id(_id_usuario).esJefeDe = idGrupo
        db.session.commit()

    @classmethod
    def validaAsignacionGrupo(cls, _id_usuario):
        usuario = cls.find_by_id(_id_usuario)
        if usuario.id_grupoDeTrabajo:
            raise Exception(f"El usuario {usuario.nombre} pertenece a otro grupo (con id.{usuario.id_grupoDeTrabajo})")

    @classmethod
    def validarJefeDeGrupo(cls, _id_usuario,idNueva ):
        from servicios.permisosService import PermisosService
        jefe = cls.find_by_id(_id_usuario)
        print(jefe)
        if jefe.esJefeDe and jefe.esJefeDe != idNueva : raise Exception(f"El usuario {jefe.nombre} ya es jefe del grupo {jefe.esJefeDe}")
        if not PermisosService.tieneElPermiso(jefe.permisos, PermisosService.jefeDeGrupo):
            raise Exception(f"El usuario {jefe.nombre} no posee permisos para ser jefe de grupo.")
        #Devolvemos true en caso de que tmb sea jefe de proyecto
        return cls.esJefeDeProyecto(jefe.permisos)


    @classmethod
    def validaUnicidadDeJefe(cls,integrantes,jefeDeGrupoEsJefeDeProyecto):
        print("validamos unicidad del jefe")
        integrantesObj = cls.busquedaUsuariosID(integrantes)
        if (jefeDeGrupoEsJefeDeProyecto):
            for user in integrantesObj: 
                if cls.esJefeDeProyecto(user.permisos): raise Exception(f"Solo puede existir un jefe de proyecto por grupo de trabajo.")
        else:
            listaDePermisos = []
            for user in integrantesObj: 
                numeros_permisos = [permiso['id_permiso'] for permiso in user.permisos]
                listaDePermisos.append(numeros_permisos)
            # nadie mas puede ser jefe de proyecto:
            if cls.verificar_repeticion(4,listaDePermisos): raise Exception(f"Solo puede existir un jefe de proyecto por grupo de trabajo.")

    def verificar_repeticion(numero_a_verificar, listas):
        numeros_vistos = set()
        for lista in listas:
            for numero in lista:
                if numero == numero_a_verificar:
                    if numero in numeros_vistos:
                        return True
                    else:
                        numeros_vistos.add(numero)
        return False

    @classmethod
    def esJefeDeProyecto(cls, permisos):
        from servicios.permisosService import PermisosService
        print("verificamos si el jefe de g e s jefe de p")
        if PermisosService.tieneElPermiso(permisos, PermisosService.jefeProyecto): return True
        return False

    

    @classmethod
    def loginUsuario(cls,datos):
        from flask import jsonify
        from werkzeug.security import check_password_hash
        from datetime import datetime, timedelta
        from app import app
        from flask_jwt import jwt

        LoginUsuario().load(datos)
        usuario = UsuarioService.find_by_email(datos['email'])
        usuarioJson = CommonService.json(usuario, UsuarioSchema)
        if usuario:
            if check_password_hash(usuario.password, datos['password']):
                dt = datetime.now() + timedelta(minutes=60*12)
                usuarioJson['exp'] = dt
                token = jwt.encode(usuarioJson, app.config['SECRET_KEY'])
                return jsonify({'token': token.decode('UTF-8')})
            raise Exception("Las credenciales son incorrectas.")
        raise Exception("No existe ningún usuario con ese mail.")
