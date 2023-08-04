from re import U
import sys
from resources.token import TokenDeAcceso
from schemas.usuarioSchema import UsuarioSchema
from servicios.commonService import CommonService
from warnings import catch_warnings
from servicios.usuarioService import UsuarioService
from flask_restful import Resource
from flask import request
from servicios.commonService import CommonService
from marshmallow import ValidationError

class ObtenerUsuariosResource(Resource):
    @TokenDeAcceso.token_nivel_de_acceso(TokenDeAcceso.SUPERUSUARIO)
    def get(self):
        return CommonService.jsonMany(UsuarioService.findUsuariosHabilitados(), UsuarioSchema)

class UsuarioResource(Resource):
    @TokenDeAcceso.token_nivel_de_acceso(TokenDeAcceso.TEC)
    def put(self):
        datos = request.get_json()
        if (datos):
            try:
                UsuarioService.modificarUsuario(datos)
                return {'Status': 'Usuario modificado.'}, 200
            except Exception as err:
                return {'Error': err.args}, 400
        return {'Error': 'Deben suministrarse los datos para modificar el usuario.'}, 400

    @TokenDeAcceso.token_nivel_de_acceso(TokenDeAcceso.SUPERUSUARIO)
    def post(self):
        datos = request.get_json()
        if (datos):
            try:
                print(datos)
                UsuarioService.nuevoUsuario(datos)
                return {'Status': 'Usuario creado.'}, 200
            except ValidationError as errors:
                return {'Error': list(errors.messages.values())[0]['message']}, 400
            except Exception as err:
                return {'Error': err.args}, 400
        return {'Error': 'Deben suministrarse los datos para el alta de usuario.'}, 400


class UsuarioID(Resource):

    @TokenDeAcceso.token_nivel_de_acceso(TokenDeAcceso.SUPERUSUARIO)
    def get(self, id_usuario):
        if(id_usuario):
            try:
                usuario = UsuarioService.find_by_id(id_usuario)
                return CommonService.json(usuario, UsuarioSchema)
            except Exception as err:
                return {'Error': err.args}, 400
        return {'Error': 'Debe indicarse id_usuario'}, 400
        
    @TokenDeAcceso.token_nivel_de_acceso(TokenDeAcceso.SUPERUSUARIO)
    def delete(self, id_usuario):
        if(id_usuario):
            try:
                UsuarioService.deshabilitarUsuario(id_usuario)
                return {'Status': 'Se deshabilitó el usuario.'}, 200
            except Exception as err:
                return {'Error': err.args}, 400
        return {'Error': 'Debe indicarse id_usuario'}, 400

class ObtenerUsuariosParaProyecto(Resource):
    # aca el 5 representa el id de los tecnicos, ya que ellos pueden formar parte de proyectos
    @TokenDeAcceso.token_nivel_de_acceso(TokenDeAcceso.BIO)
    def get(self, id_usuario):
        if(id_usuario):
            try:
                usuarios = UsuarioService.candidatosAProyecto(5,id_usuario)
                return CommonService.jsonMany(usuarios, UsuarioSchema)
            except Exception as err:
                return {'Error': err.args}, 400
        return {'Error': 'Debe indicarse id_usuario'}, 400

class ObtenerJefesParaProyecto(Resource):
    def get(self):
        return CommonService.jsonMany(UsuarioService.usuariosJefes(), UsuarioSchema)

class ObtenerUsuariosParaGrupo(Resource):
    @TokenDeAcceso.token_nivel_de_acceso(TokenDeAcceso.BIO)
    def get(self):
          try:
            candidatos = UsuarioService.candidatosAGrupo()
            print(candidatos)
            return CommonService.jsonMany(candidatos, UsuarioSchema)
          except Exception as err:
                return {'Error': err.args}, 400


class Logins(Resource):
    def post(self):
        datos = request.get_json()
        if datos :
            try:
                return UsuarioService.loginUsuario(datos)
            except Exception as err:
                return {'Error': err.args}, 401
        return {'Error': 'Deben enviarse datos para el login.'}, 400

    """ def post(self):
        from flask_jwt import jwt

        datos = request.get_json()
        from app import app
        data = jwt.decode(
            datos['token'], app.config['SECRET_KEY'], algorithms=["HS256"])
        if not any(permiso['id_permiso'] <= 3 for permiso in data['permisos']):
            raise Exception(f"El usuario {data['email']}")
        return data, 200 """
