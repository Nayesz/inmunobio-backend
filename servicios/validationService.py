from models.mongo.proyecto import Proyecto
from models.mongo.experimento import Experimento
from models.mongo.muestra import Muestra
from models.mongo.grupoExperimental import GrupoExperimental
from models.mongo.fuenteExperimental import FuenteExperimental
class ValidacionesUsuario():
    @classmethod
    def desvincularDeProyectos(cls,id_usuario):
        proyectos = Proyecto.objects.update(pull__participantes=id_usuario)

class Validacion():

    @classmethod
    def elProyectoExiste(cls, idProyecto):
        return Proyecto.objects(id_proyecto=idProyecto).first() != None
    
    @classmethod
    def elExperimentoEstaFinalizado(cls, id_experimento):
        return Experimento.objects(id_experimento = id_experimento, finalizado = False).first() != None
    
    @classmethod
    def elExperimentoPerteneceAlProyecto(cls, id_experimento, id_proyecto):
        return Experimento.objects(id_experimento = id_experimento, id_proyecto = id_proyecto).first() != None
    
    @classmethod
    def elGrupoExperimentalPerteneceAlExperimento(cls, id_experimento, id_grupoExperimental):
        return GrupoExperimental.objects(id_grupoExperimental=id_grupoExperimental, id_experimento=id_experimento).first() != None

    @classmethod
    def existeLaMuestra(self, idMuestra):
        return Muestra.objects(id_muestra=idMuestra).first() != None
    
    @classmethod
    def laMuestraEstaHabilitada(self, idMuestra):
        return Muestra.objects(id_muestra=idMuestra, habilitada = True).first() != None

    def existeElgrupoExperimental(grupoExperimental):
        return GrupoExperimental.objects(id_grupoExperimental=grupoExperimental.id_grupoExperimental, habilitado = True).first() != None
    
    def elGrupoExperimentalEsDelMismoTipoQueLasFuentes(grupoExperimental):
        return all(grupoExperimental.tipo == fuenteExperimental.tipo for fuenteExperimental in grupoExperimental.fuentesExperimentales)

    def todasLasFuentesTienenElMismoGrupoExperimental(grupoExperimental):
        return all(grupoExperimental.codigo == fuenteExperimental.codigoGrupoExperimental for fuenteExperimental in grupoExperimental.fuentesExperimentales)
    
    def losAnimalesEstanHabilitados(fuentesExperimentales):
        return all(FuenteExperimental.objects(id_fuenteExperimental = fuente.id_fuenteExperimental, baja = False).first() is not None for fuente in fuentesExperimentales)
    
    def losAnimalesNoTienenGrupoExperimental(fuentesExperimentales):
        return all(FuenteExperimental.objects(id_fuenteExperimental = fuente.id_fuenteExperimental, codigo = "", codigoGrupoExperimental = "").first() is not None for fuente in fuentesExperimentales)
    
    def losAnimalesPertenecenAlMismoProyectoDelExperimento(grupoExperimental):
        experimento = Experimento.objects(id_experimento = grupoExperimental.id_experimento).first()
        for animal in grupoExperimental.fuentesExperimentales:
            print(f"Fuente: {animal.id_fuenteExperimental}  y el proyecto es {animal.id_proyecto}" )
        return all(experimento.id_proyecto == animal.id_proyecto for animal in grupoExperimental.fuentesExperimentales)