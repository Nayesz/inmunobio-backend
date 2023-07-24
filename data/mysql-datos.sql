-- MySQL dump 10.13  Distrib 8.0.31, for Linux (x86_64)
--
-- Host: localhost    Database: db_mysql_inmunobio
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `id_permiso` int NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`id_permiso`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
INSERT INTO `permisos` VALUES (1,'Superusuario'),(2,'Director de centro'),(3,'Jefe de grupo'),(4,'Director de proyecto / bioterio'),(5,'Técnico');
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisosxUsuarios`
--

DROP TABLE IF EXISTS `permisosxUsuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisosxUsuarios` (
  `usuario_id` int DEFAULT NULL,
  `permiso_id` int DEFAULT NULL,
  KEY `usuario_id` (`usuario_id`),
  KEY `permiso_id` (`permiso_id`),
  CONSTRAINT `permisosxusuarios_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `permisosxusuarios_ibfk_2` FOREIGN KEY (`permiso_id`) REFERENCES `permisos` (`id_permiso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permisosxUsuarios`
--

LOCK TABLES `permisosxUsuarios` WRITE;
/*!40000 ALTER TABLE `permisosxUsuarios` DISABLE KEYS */;
INSERT INTO `permisosxUsuarios` VALUES (1,5),(2,4),(2,3),(2,5),(3,3),(3,5),(3,4),(4,2),(4,5),(4,4),(4,3),(5,4),(5,3),(5,5),(5,1),(5,2),(6,5),(7,5),(8,5);
/*!40000 ALTER TABLE `permisosxUsuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(60) DEFAULT NULL,
  `nombre` varchar(30) DEFAULT NULL,
  `password` varchar(80) DEFAULT NULL,
  `habilitado` tinyint(1) DEFAULT NULL,
  `direccion` varchar(50) DEFAULT NULL,
  `telefono` varchar(120) DEFAULT NULL,
  `id_grupoDeTrabajo` int DEFAULT NULL,
  `esJefeDe` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `usuarios_chk_1` CHECK ((`habilitado` in (0,1)))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'jyole8@baidu.com','Juana Caresse','sha256$CRdT3cRS$f17a6628e07870e143fd655475587b108f8111245c613db6cc4caa2c7541a630',1,'San Lorenzo 321, La Plata','+54 281 906 0485',1,0),(2,'dcratere2@indiegogo.com','Roxana Benson','sha256$bw2YJxP2$d5090ea523a89e757d9b0c513f1240b3b7e698c15d66977eed1d9f46eb12cb21',1,'Yrigoyen 567, Barrio La Cascada','+92 125 142 9573',0,1),(3,'bbrienf@vimeo.com','Kevin Siffre','sha256$RQ0MoXpQ$ecb344541be6e4835e088565b46a1926b441e9ee58eaf2e0020177e216c1f6c5',1,'9 de Julio 876, Villa Aurora','+82 173 506 5621',0,2),(4,'schoppen3@gmail.com','Santiago Rodríguez','sha256$sDQ8VYpt$9191ce7a8663679dbe89d7dda2dc0d47eb3f8d8b34c7ffce7cebe2894d7f7538',1,'Mitre 654, Barrio Los Pájaros','+82 173 506 5621',0,3),(5,'arenoden4@gmail.com','Valentina López','sha256$J4s1UcbF$60a81a53a9c56bff0e46c6f99d55da1085d1290693b05c84b0c0b8d5098281b4',1,'Sarmiento 987, Barrio del Sol','+255 599 345 4355',0,0),(6,'oharrimana@gmail.com','Matías Fernández','sha256$5zIPxuZU$e415d43623da67302075d09f3932fb415561b4041bdad2616a66a2a287b3baf2',1,'Moreno 543, Barrio Primavera','+7 353 758 6246',2,0),(7,'kmcgerr1@gmail.com','Facundo Gómez','sha256$p8g3VEVI$c50a0d58143b7d7dfbca7f308b28f85ae7704677be4bd951d379493d78dd79b5',1,'Belgrano 210, Villa Bella Vista','+86 884 432 221',3,0),(8,'mohallagan0@gmail.com','Sofía Herrera','sha256$8n0HWrQN$f92b12be7bf303f85c0d55c43840395a4d86c63d57b27ac220e6e8d6b034542a',1,'Rivadavia 789, Villa Esperanza','+423 456 321 9680',3,0);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-23 21:07:25
