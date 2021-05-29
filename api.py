from flask_restful import Api

from resources.usuariosResource import  ObtenerUsuariosResource,UsuarioResource, UsuarioID,ObtenerUsuariosParaProyecto
from resources.proyectoResource import *
from resources.permisosResource import Permisos,ObtenerPermisoPorId
from resources.grupoDeTrabajoResource import GrupoDeTrabajoID,GrupoDeTrabajo,GruposDeTrabajo,RenombrarJefeGrupo
from resources.experimentoResource import ExperimentoResource, Experimentos
from resources.proyectoResource import *
from resources.experimentoResource import ExperimentoResource, Experimentos, CerrarExperimento
from resources.contenedorResource import Contenedor, ContenedorProyecto, ContenedorParent
from resources.stockResource import ObtenerProductosStock,ProductoEnStock,BorrarTodoStock,ConsumirStockResource
from resources.productoResource import ProductoResource,ObtenerProductosResource,ObtenerProductoResource,ArchivoProducto
from resources.distribuidoraResource import DistribuidoraResource,ObtenerDistribuidorasResource,ObtenerDistribuidoraResource


api = Api()
#permisos
api.add_resource(ObtenerPermisoPorId, '/api/v1/permiso/<int:id_permiso>')
api.add_resource(Permisos, '/api/v1/permisos')

#usuarios
api.add_resource(ObtenerUsuariosResource, '/api/v1/usuarios')
api.add_resource(UsuarioResource, '/api/v1/usuario')
api.add_resource(UsuarioID, '/api/v1/usuario/<int:id_usuario>')
api.add_resource(ObtenerUsuariosParaProyecto, '/api/UsuariosParaProyecto')

#proyectos
api.add_resource(Proyectos, '/api/v1/proyectos')
api.add_resource(NuevoProyecto, '/api/v1/nuevoProyecto')
api.add_resource(ProyectoID, '/api/v1/proyecto/<int:id_proyecto>')
api.add_resource(CerrarProyecto, '/api/v1/cerrarProyecto')
api.add_resource(ModificarProyecto, '/api/v1/modificarProyecto')

#Grupo de trabajo
api.add_resource(GrupoDeTrabajo,'/api/v1/grupoDeTrabajo')
api.add_resource(GruposDeTrabajo, '/api/v1/gruposDeTrabajo')
api.add_resource(GrupoDeTrabajoID, '/api/v1/grupoDeTrabajo/<int:id_grupoDeTrabajo>')
api.add_resource(RenombrarJefeGrupo, '/api/v1/nuevoJefeDeGrupo') # ver si se queda o no 
#stock
api.add_resource(ObtenerProductosStock, '/api/v1/obtenerStock/<int:id_grupoDeTrabajo>/<int:id_espacioFisico>')
api.add_resource(ProductoEnStock, '/api/v1/productoEnStock')
api.add_resource(BorrarTodoStock, '/api/v1/borrar/<int:id_grupoDeTrabajo>')
api.add_resource(ConsumirStockResource, '/api/v1/consumirStock')


#producto
api.add_resource(ProductoResource, '/api/v1/producto')
api.add_resource(ObtenerProductosResource, '/api/v1/getProductos')
api.add_resource(ObtenerProductoResource, '/api/v1/getProducto/<int:id_producto>')
api.add_resource(ArchivoProducto, '/api/v1/producto/subirArchivo/<int:id_producto>')

#distribuidora
api.add_resource(DistribuidoraResource, '/api/v1/distribuidora')
api.add_resource(ObtenerDistribuidorasResource, '/api/v1/getDistribuidoras')
api.add_resource(ObtenerDistribuidoraResource, '/api/v1/getDistribuidora/<int:id_distribuidora>')

#experimentos
api.add_resource(Experimentos, '/api/v1/proyecto/<int:idProyecto>/experimentos')
api.add_resource(ExperimentoResource, '/api/v1/experimento/<int:idExperimiento>', endpoint='experimento')
api.add_resource(ExperimentoResource, '/api/v1/nuevoExperimento', endpoint='nuevo_experimento')
api.add_resource(ExperimentoResource, '/api/v1/experimento/gruposExperimentales', endpoint='agregar_grupos_experimentales')
api.add_resource(CerrarExperimento, '/api/v1/cerrarExperimento', endpoint='cerrar_experimento')

#contenedor
api.add_resource(Contenedor, '/api/v1/contenedores', endpoint='contenedores')
api.add_resource(Contenedor, '/api/v1/nuevoContenedor', endpoint='nuevo_contenedore')
api.add_resource(ContenedorProyecto, '/api/v1/contenedoresDelProyecto', endpoint='contenedores_del_proyecto')
api.add_resource(ContenedorProyecto, '/api/v1/asignarProyectoAlContenedor', endpoint='asignar_proyecto_al_contenedor')
api.add_resource(ContenedorParent, '/api/v1/subcontenedores', endpoint='subcontenedores')
api.add_resource(ContenedorParent, '/api/v1/asignarParentAContenedores', endpoint='asignar_parent_a_contenedores')