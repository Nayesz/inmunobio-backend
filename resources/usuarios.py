from models.usuario import Usuario, Permiso
from flask_restful import Resource,Api
from flask_jwt import jwt_required
from flask import jsonify, request
from db import db

class Usuarios(Resource):

    def get(self):
        usuarios =  Usuario.find_usuarios_Habilitados()
        if usuarios:
            return usuarios
        return {'name': 'None'},404

class UsuariosXIdUsuario(Resource):

    #@jwt_required()
    def get(self, id):
        usuario = Usuario.find_by_id(id)
        if usuario:
            return usuario.json()
        return {'name': 'None'},404

    #@jwt_required()
    def put(self,id):
        modificaciones = request.get_json()
        #aca los parametros pueden ser direccion y/o telefono y/o mail y/o contraseña
        usuario = Usuario.find_by_id(id)
        if (usuario and usuario.habilitado):
            for clave,valor in modificaciones.items():
                if hasattr(usuario, clave):
                    setattr(usuario, clave, valor)
            db.session.commit()
            return {'Status':'ok'}
        return {'name': 'None'},404

    def delete(self,id):
        usuario = Usuario.find_by_id(id)
        if (usuario and usuario.habilitado):
            setattr(usuario,'habilitado',False)
            db.session.commit()
            return {'Status':'ok'}
        return {'name': 'None'},404
    
""" class PermisosXIdUsuario(Resource):
	@jwt_required()
	def get(self, id):
		no hice la busqueda por username, me parecio mejor hacerla por id ya que es unico ->VER
		usuario = Usuario.find_by_id(id)
		permisos = {}
		if usuario:
		
			for permiso in usuario.id_permisos:
				permisos[permiso.id] = permiso.descripcion      
			return jsonify(permisos)
				
		return  {'name': 'None'},404 """


class NuevoUsuario(Resource):
    
    @jwt_required()
    def post(self):
        datos = request.get_json(silent=True)
        if (datos):
            nombre = datos['nombre']
            username = datos['username']
            password = datos['password']
            mail = datos['mail']
            direccion = datos['direccion']
            telefono = datos['telefono']
            usuario = Usuario(nombre , username , mail,password,direccion ,telefono )
            db.session.add(usuario)
            db.session.commit()
            return {'Status':'ok'},200
        return {'name': 'None'},404
   
    
class UsuarioxUsername(Resource):
	@jwt_required()
	def get(self, username):
		#usuario = Usuario.query.filter_by(username = username).first()
		usuario = Usuario.find_by_username(username)
		if usuario:
			return usuario.json()
		return {'name': 'None'},404


class ActualizarPermisos(Resource):
    #@jwt_required()
    def put(self):
        permisos= []
        datos = request.get_json(silent=True)
        if(datos):
            usuario = Usuario.find_by_id(datos['id'])
            if(usuario):
                for dato in datos['permisos']:
                    permiso = Permiso.find_by_id(dato['id'])
                    permisos.append(permiso)
                if(len(permisos) == len(datos['permisos'])):
                    usuario.id_permisos = permisos
                    db.session.add(usuario)
                    db.session.commit()
                    return usuario.json()
        return {'name': 'None'}, 404


