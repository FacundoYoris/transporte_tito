CREATE DATABASE  IF NOT EXISTS `innway_ingenieria` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `innway_ingenieria`;
-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: innway_ingenieria
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activos`
--

DROP TABLE IF EXISTS `activos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activos` (
  `idactivos` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL,
  `sector` varchar(45) DEFAULT NULL,
  `planta` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  `potencia_nominal` decimal(10,0) DEFAULT '0',
  `horas_uso` decimal(10,0) DEFAULT '0',
  PRIMARY KEY (`idactivos`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Maquinaria de la empresa';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activos`
--

LOCK TABLES `activos` WRITE;
/*!40000 ALTER TABLE `activos` DISABLE KEYS */;
INSERT INTO `activos` VALUES (18,'Grupo electrógeno','Generación de contingencia',NULL,'Disponible',0,0);
/*!40000 ALTER TABLE `activos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden_trabajo`
--

DROP TABLE IF EXISTS `orden_trabajo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orden_trabajo` (
  `id_orden_trabajo` int NOT NULL AUTO_INCREMENT,
  `tipo` varchar(45) NOT NULL DEFAULT '"One shoot"',
  `actividad` varchar(1000) DEFAULT '',
  `fecha_inicio` varchar(45) DEFAULT NULL,
  `activo` varchar(45) DEFAULT '',
  `responsable` varchar(45) DEFAULT '',
  `estado` varchar(45) DEFAULT 'Pendiente',
  `prioridad` varchar(45) DEFAULT 'Media',
  `usuario_creador` varchar(45) DEFAULT '',
  `descripción_problematica` varchar(1000) DEFAULT '',
  `descripcion_solucion` varchar(1000) DEFAULT '',
  `fecha_fin` varchar(45) DEFAULT NULL,
  `horas_totales` float DEFAULT NULL,
  `lapsoProgramada` decimal(10,0) NOT NULL,
  `fecha_inicio_real` varchar(45) DEFAULT NULL,
  `elemento` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_orden_trabajo`)
) ENGINE=InnoDB AUTO_INCREMENT=180 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Tabla que guarda todas las órdenes de trabajo.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orden_trabajo`
--

LOCK TABLES `orden_trabajo` WRITE;
/*!40000 ALTER TABLE `orden_trabajo` DISABLE KEYS */;
INSERT INTO `orden_trabajo` VALUES (1,'Programada','Revisar mediante inspección visual aislamientos de cables y terminales y torque del bus de conexiones del generador','2024-11-18T00:00','Grupo electrógeno','NahuelVelazquez','En proceso','Baja','yair','Tarea de mantenimiento preventiva con el fin de verificar la condición de los cables y terminales',NULL,NULL,NULL,720,'2024-11-14T18:44','Cables,terminales y bus de conexión'),(155,'Programada','Termografía de carcaza, cables, conexiones y rodamientos blindados','2025-02-26T16:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Alta','yair','Para realizar la termografía se debe dejar el generador alimentando la planta por un período de 20/30 minutos. \r\nTemperatura normal del rodamiento en operación 60°C; por encima de 110°C cambiar el rodamiento',NULL,NULL,NULL,4320,NULL,'Carcaza, cables, terminales y acoples'),(156,'Programada','Cambio de rodamientos','2026-04-22T08:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Alta','yair','Por desgaste de rodamiento se debe cambiar los mismos utilizando un extractor de rodamientos','',NULL,NULL,21600,NULL,'Acoplamiento - rodamiento'),(157,'Programada','Verificar indicador de servicio de filtro de aire','2024-11-19T00:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Baja','yair','Inspeccionar visualmente el estado del indicador de servicio del filtro de aire.\r\nEl indicador se pone de color rojo cuando el filtro esta sucio, destruido o roto.',NULL,NULL,NULL,720,NULL,'Filtro de aire'),(158,'Programada','Cambio de filtro de aire','2024-12-10T00:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Alta','yair','Utiliza llave especial para retirar el filtro (de tipo cadena), llenar con aceite 15W40 CL4 multigrado hasta 3/4 de la capacidad. Lubricar goma de la junta y colocar el filtro solo con las manos ajustándolo para no romper el nuevo filtro.','',NULL,NULL,8760,NULL,'Filtro de aire'),(159,'Programada','Accionar válvula de evacuación del filtro de aire','2024-11-21T16:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','-','',NULL,NULL,336,NULL,'Válvula del filtro de aire'),(160,'Programada','Verificar color de los gases de escape','2024-11-19T16:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','Si se verifica humo oscuro a la salida contactar con un profesional para el mantenimiento',NULL,NULL,NULL,336,NULL,'Sistema de escape'),(161,'Programada','Verificar nivel de combustible, mangueras, tubos y alrededores.','2024-11-21T16:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Alta','yair','Verificar pérdidas o fugas de combustible.','',NULL,NULL,336,NULL,'Combustible'),(162,'Programada','Drenar separador de agua','2024-11-22T16:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','Evitar el paso de agua al combustible','',NULL,NULL,336,NULL,'Separador de agua'),(163,'Programada','Cambiar separador de agua','2024-12-10T00:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','Evitar que el agua pase al combustible','',NULL,NULL,8760,NULL,'Separador de agua'),(164,'Programada','Cambiar prefiltro de combustible','2024-12-10T00:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','-','',NULL,NULL,8760,NULL,'Filtro de combustible'),(165,'Programada','Verificar que la velocidad se mantenga en valores nominales','2024-12-04T00:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','Controlar que muestra el display del controlador con la velocidad nominal de placa',NULL,NULL,NULL,336,NULL,'Gobernador de velocidad electrónico'),(166,'Programada','Verificar el estado del gobernador electrónico de velocidad','2024-12-04T00:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','Verificar que la distancia entre el sensor magnético de velocidad y  los dientes del engranaje anular no sea menor a 0,45 [mm]. \r\nVerificar que las señales de alimentación del gobernador sean las normalizadas (24 o 12 V)','',NULL,NULL,8760,NULL,'Gobernador de velocidad electrónico'),(167,'Programada','Verificar estado general del alternador y señales de tensión en la entrada y salida. Realizar limpieza de carcaza y aletas','2024-12-26T16:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','Verificar las conexiones eléctricas en búsqueda de corrosión, y el estado de las corridas del alternador. Realizar una limpieza de la carcaza y aletas.','',NULL,NULL,504,NULL,'Alternador'),(168,'Programada','Cambiar correa de distribución del alternador','2025-01-24T16:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Alta','yair','-','',NULL,NULL,8760,NULL,'Alternador'),(169,'Programada','Cambiar filtro de aceite','2024-11-18T16:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Alta','yair','-',NULL,NULL,NULL,8760,NULL,'Filtro de aceite'),(170,'Programada','Verificar nivel de aceite, estado de mangueras, tubos y posibles fugas en alrededores.','2024-11-19T16:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','El nivel debe estar entre el máximo y el mínimo que indica la varilla.','',NULL,NULL,336,NULL,'Filtro de aceite'),(171,'Programada','Reemplazar batería','2025-10-20T00:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','-','',NULL,NULL,17520,NULL,'Batería'),(172,'Programada','Verificar nivel del refrigerante','2024-11-28T00:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Alta','yair','Verificar que no existan fugas de refrigerante. En caso de bajo nivel agregar mezcla refrigerante de agua destilada mas anticongelante (40/60)','',NULL,NULL,336,NULL,'Refrigerante'),(173,'Programada','Verificar estado de la manguera del precalentador','2024-11-28T00:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','-','',NULL,NULL,336,NULL,'Manguera del precalentador'),(174,'Programada','Verificar desgaste de correa de bomba de agua y ventilador','2024-12-03T00:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','Verificar desgaste de la correa','',NULL,NULL,336,NULL,'Correa de bomba de agua'),(175,'Programada','Limpieza del radiador','2024-12-18T00:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','Se recomienda utilizar aire comprimido (en todo caso reemplazar por agua comprimida) para limpieza y remover obstrucciones del radiador.',NULL,NULL,NULL,8760,NULL,'Radiador'),(176,'Programada','Verificar estado del tapón del presurizado del radiador y alrededores.','2024-12-10T00:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','Prestar atención a fugas del refrigerante del radiador','',NULL,NULL,8760,NULL,'Termostato'),(177,'Programada','Realizar limpieza de contactores y tablero de transferencia automático','2024-12-19T16:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Alta','yair','Realizar limpiezas de contactos eléctricos utilizando fluidos dieléctricos','',NULL,NULL,4380,NULL,'Contactores - tablero'),(178,'Programada','Puesta en marcha durante 30 minutos. Inspección visual y sensorial del equipo.','2024-11-20T08:00','Grupo electrógeno','NahuelVelazquez','Pendiente','Media','yair','Detectar cualquier ruido y/o vibración irregular en la marcha del equipo',NULL,NULL,NULL,336,NULL,'Acoplamiento - motor - generador'),(179,'Correctiva','Crear x','2024-11-29T00:00','Grupo electrógeno','NahuelVelazquez','Finalizada','Media','yair','Descripción del problema','Finalizar tarea','2024-11-14T18:54',0.0114006,0,'2024-11-14T18:54','Elemento x');
/*!40000 ALTER TABLE `orden_trabajo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ot_programada_finalizada`
--

DROP TABLE IF EXISTS `ot_programada_finalizada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ot_programada_finalizada` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_orden_programada` int DEFAULT NULL,
  `fecha_fin` varchar(45) DEFAULT NULL,
  `fecha_inicio` varchar(45) DEFAULT NULL,
  `observacion` varchar(45) DEFAULT NULL,
  `fecha_inicio_real` varchar(45) DEFAULT NULL,
  `horas_totales` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ot_programada_finalizada`
--

LOCK TABLES `ot_programada_finalizada` WRITE;
/*!40000 ALTER TABLE `ot_programada_finalizada` DISABLE KEYS */;
INSERT INTO `ot_programada_finalizada` VALUES (27,154,'2024-11-14T18:50','2024-12-14T18:50','Cualquier observación necesaria','2024-11-14T18:48',0.0448431),(28,154,'2024-11-14T18:50','2024-12-14T18:50','Cualquier observación necesaria','2024-11-14T18:48',0.0489881),(29,154,'2024-11-14T18:50','2024-12-14T18:50','Cualquier observación necesaria','2024-11-14T18:48',0.0452306);
/*!40000 ALTER TABLE `ot_programada_finalizada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `procesos`
--

DROP TABLE IF EXISTS `procesos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `procesos` (
  `idproceso` int NOT NULL AUTO_INCREMENT,
  `idactivo` int DEFAULT NULL,
  `descripcion` varchar(70) DEFAULT NULL,
  PRIMARY KEY (`idproceso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `procesos`
--

LOCK TABLES `procesos` WRITE;
/*!40000 ALTER TABLE `procesos` DISABLE KEYS */;
/*!40000 ALTER TABLE `procesos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitud_ot`
--

DROP TABLE IF EXISTS `solicitud_ot`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitud_ot` (
  `idsolicitud_ot` int NOT NULL AUTO_INCREMENT,
  `activo` varchar(75) DEFAULT NULL,
  `prioridad` varchar(45) DEFAULT NULL,
  `problema` varchar(100) DEFAULT NULL,
  `usuario_generador` varchar(45) DEFAULT NULL,
  `estado` varchar(45) DEFAULT 'En revisión',
  PRIMARY KEY (`idsolicitud_ot`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Solicitudes de tareas generadas por los usuarios con perfil de operario o externo';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitud_ot`
--

LOCK TABLES `solicitud_ot` WRITE;
/*!40000 ALTER TABLE `solicitud_ot` DISABLE KEYS */;
INSERT INTO `solicitud_ot` VALUES (2,'Grupo electrógeno','Baja','Falta x','facuyoris','En revisión');
/*!40000 ALTER TABLE `solicitud_ot` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `idstock` int NOT NULL AUTO_INCREMENT,
  `item` varchar(75) NOT NULL DEFAULT '',
  `cantidad` int DEFAULT '0',
  `CantidadAdvertencia` int DEFAULT '0',
  `CantidadCritica` int DEFAULT '0',
  PRIMARY KEY (`idstock`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Tabla para administrar el stock de la empresa';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `terceros`
--

DROP TABLE IF EXISTS `terceros`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `terceros` (
  `idterceros` int NOT NULL AUTO_INCREMENT,
  `rol` varchar(45) DEFAULT NULL,
  `numero_telefonico` varchar(15) DEFAULT NULL COMMENT 'asd',
  `correo_electronico` varchar(100) DEFAULT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`idterceros`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Tabla que contiene los contactos externos a la empresa como lo puede ser un  proveedor.';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `terceros`
--

LOCK TABLES `terceros` WRITE;
/*!40000 ALTER TABLE `terceros` DISABLE KEYS */;
/*!40000 ALTER TABLE `terceros` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `usuario` varchar(45) NOT NULL,
  `contraseña` varchar(45) NOT NULL,
  `privilegio` int NOT NULL COMMENT '0 no tiene privilegios\n1 tiene privilegios.\nPrivilegios: Poder ver la función gestión de mantenimiento',
  `nombre` varchar(45) DEFAULT NULL,
  `apellido` varchar(45) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Destinada al login';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES ('Cesar','cesar',2,'Cesar','Correia','123456789'),('Colombia','mateo',0,'Mateo','Cespedes','123123123'),('facuyoris','42530953',0,'Facu','Yoris','3482655054'),('NahuelVelazquez','nahuel123',0,'Nahuel','Velazquez','3425066951'),('yair','123456789',1,'facundo','yoris','3482655054');
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

-- Dump completed on 2024-11-21 12:46:07
