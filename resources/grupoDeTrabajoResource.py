from db import dbMongo
from flask_restful import Resource
from flask import request
from servicios.grupoDeTrabajoService import GrupoDeTrabajoService
from exceptions.exception import ErrorGrupoInexistente,ErrorUsuarioInexistente,ErrorGrupoDeTrabajoGeneral
from marshmallow import  ValidationError
from servicios.commonService import CommonService
from schemas.grupoTrabajoSchema import GrupoDeTrabajoSchema

class RenombrarJefeGrupo(Resource):
    def put(self):
        datos = request.get_json()
        if datos:
            try:
                GrupoDeTrabajoService.modificarJefeGrupo(datos)
                return {'Status':'ok'},200  
            except ValidationError as err:
                return {'error': err.messages},400
            except (ErrorGrupoInexistente,ErrorUsuarioInexistente) as err:
                return {'Error':err.message},400
        return {'name': 'None'},400

class GrupoDeTrabajo(Resource):
    def post(self):
        datos = request.get_json()
        if datos:
            try:
                GrupoDeTrabajoService.nuevoGrupo(datos)
                return {'Status':'ok'},200  
            except ValidationError as err:
                return {'error': err.messages},400
            except ErrorUsuarioInexistente as err:
                return {'Error': err.message},400
        return {'name': 'None'},400

    def put(self):
        datos = request.get_json()
        if datos: 
            try:
                GrupoDeTrabajoService.modificarMiembrosGrupo(datos)
                return {'Status':'ok'},200  
            except ValidationError as err:
                return {'error': err.messages},400
            except (ErrorGrupoInexistente,ErrorUsuarioInexistente) as err:
                return {'Error':err.message},400
        return {'name': 'None'},400

class GrupoDeTrabajoID(Resource):
    def get(self,id_grupoDeTrabajo):  
        if(id_grupoDeTrabajo):
            try:
                grupo,jefeNombre = GrupoDeTrabajoService.obtenerGrupoPorId(id_grupoDeTrabajo)
                return CommonService.json(grupo,GrupoDeTrabajoSchema),jefeNombre
            except (ErrorGrupoInexistente,ErrorUsuarioInexistente) as err:
                return {'Error':err.message},400
        return {'name': 'None'},400

    def delete(self,id_grupoDeTrabajo):
        if(id_grupoDeTrabajo):
            try:
                GrupoDeTrabajoService.removerGrupo(id_grupoDeTrabajo)
                return {'Status':'ok'},200
            except ValidationError as err:
                return {'error': err.messages},400
            except (ErrorGrupoInexistente,ErrorGrupoDeTrabajoGeneral) as err:
                return {'Error':err.message},400
        return {'name': 'None'},400

class GruposDeTrabajo(Resource):
    def get(self):
        return GrupoDeTrabajoService.obtenerTodosLosGrupos()



