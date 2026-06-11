-- MySQL dump 10.13  Distrib 9.6.0, for macos26.4 (arm64)
--
-- Host: localhost    Database: rtis
-- ------------------------------------------------------
-- Server version	9.6.0

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '93eeb962-63e7-11f1-91b6-a9db51021566:1-6123';

--
-- Current Database: `rtis`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `rtis` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `rtis`;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` bigint NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `due_type_rates`
--

DROP TABLE IF EXISTS `due_type_rates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `due_type_rates` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `effective_from` date NOT NULL,
  `effective_to` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `due_type_rates`
--

LOCK TABLES `due_type_rates` WRITE;
/*!40000 ALTER TABLE `due_type_rates` DISABLE KEYS */;
INSERT INTO `due_type_rates` VALUES (1,'satpam',100000.00,'2025-06-01',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(2,'kebersihan',15000.00,'2025-06-01',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34');
/*!40000 ALTER TABLE `due_type_rates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `house_residents`
--

DROP TABLE IF EXISTS `house_residents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `house_residents` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `house_id` int unsigned NOT NULL,
  `resident_id` int unsigned NOT NULL,
  `is_pic` tinyint(1) NOT NULL DEFAULT '0',
  `moved_in_at` date DEFAULT NULL,
  `moved_out_at` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `house_residents_house_id_foreign` (`house_id`),
  KEY `house_residents_resident_id_foreign` (`resident_id`),
  CONSTRAINT `house_residents_house_id_foreign` FOREIGN KEY (`house_id`) REFERENCES `houses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `house_residents_resident_id_foreign` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `house_residents`
--

LOCK TABLES `house_residents` WRITE;
/*!40000 ALTER TABLE `house_residents` DISABLE KEYS */;
INSERT INTO `house_residents` VALUES (1,1,1,1,'2025-01-11','2025-07-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(2,1,2,0,'2025-02-11','2026-02-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(3,1,3,1,'2026-05-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(4,1,4,0,'2026-05-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(5,1,5,0,'2026-01-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(6,2,6,1,'2025-06-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(7,2,7,0,'2025-09-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(8,2,8,0,'2025-11-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(9,3,9,1,'2024-06-11','2025-07-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(10,3,10,0,'2024-07-11','2025-09-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(11,3,11,0,'2024-03-11','2025-11-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(12,3,12,1,'2026-05-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(13,4,13,1,'2026-02-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(14,4,14,0,'2025-09-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(15,4,15,0,'2025-08-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(16,5,16,1,'2026-05-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(17,5,17,0,'2025-10-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(18,5,18,0,'2025-09-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(19,6,19,1,'2024-04-11','2025-08-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(20,6,20,0,'2024-10-11','2025-08-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(21,6,21,0,'2025-08-11','2026-03-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(22,6,22,1,'2025-11-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(23,6,23,0,'2026-01-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(24,7,24,1,'2025-01-11','2025-12-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(25,7,25,0,'2025-04-11','2025-10-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(26,7,26,1,'2026-04-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(27,7,27,0,'2025-10-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(28,7,28,0,'2025-12-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(29,8,29,1,'2024-09-11','2025-08-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(30,8,30,1,'2026-03-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(31,9,31,1,'2025-07-11','2026-04-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(32,9,32,0,'2023-10-11','2025-08-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(33,9,33,1,'2026-01-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(34,9,34,0,'2025-10-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(35,9,35,0,'2026-04-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(36,10,36,1,'2023-09-11','2025-08-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(37,10,37,0,'2024-12-11','2025-07-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(38,10,38,1,'2026-04-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(39,11,39,1,'2025-11-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(40,11,40,0,'2026-04-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(41,11,41,0,'2025-12-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(42,12,42,1,'2024-03-11','2026-01-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(43,12,43,0,'2024-11-11','2025-09-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(44,12,44,0,'2025-05-11','2026-02-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(45,12,45,1,'2026-01-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(46,12,46,0,'2025-09-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(47,12,47,0,'2026-02-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(48,13,48,1,'2026-02-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(49,14,49,1,'2026-04-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(50,15,50,1,'2024-08-11','2026-03-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(51,15,51,0,'2024-11-11','2026-05-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(52,15,52,0,'2023-09-11','2025-08-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(53,15,53,1,'2026-05-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(54,15,54,0,'2025-06-11',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(55,17,55,1,'2024-04-11','2026-04-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(56,17,56,0,'2025-05-11','2026-03-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(57,17,57,0,'2024-04-11','2025-12-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(58,18,58,1,'2025-01-11','2025-08-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(59,18,59,0,'2024-06-11','2025-10-11','2026-06-11 11:01:34','2026-06-11 11:01:34'),(60,18,60,0,'2025-09-11','2026-04-11','2026-06-11 11:01:34','2026-06-11 11:01:34');
/*!40000 ALTER TABLE `house_residents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `houses`
--

DROP TABLE IF EXISTS `houses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `houses` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `uuid` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('dihuni','tidak_dihuni') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'tidak_dihuni',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `houses_uuid_unique` (`uuid`),
  UNIQUE KEY `houses_code_unique` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `houses`
--

LOCK TABLES `houses` WRITE;
/*!40000 ALTER TABLE `houses` DISABLE KEYS */;
INSERT INTO `houses` VALUES (1,'b337b214-c686-4fe6-9b75-2575fc6323aa','A-36','Jl. Danau Buyan T No 76','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(2,'2e188cab-e10e-476e-baf1-605e095cadc5','V-43','Jl. Danau Buyan D No 37','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(3,'bf400994-4cd1-4036-ab39-b9c0cbc3693f','U-45','Jl. Danau Buyan H No 9','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(4,'5e3032d6-c5d6-4a4e-a6ea-f813499e86dd','A-02','Jl. Danau Buyan C No 60','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(5,'cd414d02-e3be-4b6e-a61b-0772b02238e7','I-26','Jl. Danau Buyan Y No 43','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(6,'45f3218f-5d6f-49c3-851e-5be74d44feb7','U-55','Jl. Danau Buyan C No 15','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(7,'812b0ba2-4c13-4581-a43b-da8fe2d73575','N-77','Jl. Danau Buyan K No 19','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(8,'9d3aa4c6-b06d-4ee3-b544-164ac0d9ec63','V-23','Jl. Danau Buyan L No 66','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(9,'85296cf4-1e21-4d7b-8389-5530b9d5b6e3','X-21','Jl. Danau Buyan T No 58','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(10,'8c02d318-ab32-458c-b031-48de29cec46a','H-92','Jl. Danau Buyan N No 11','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(11,'5877aa9a-b31f-4fc9-aab6-1d41b5cd8279','Z-00','Jl. Danau Buyan A No 51','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(12,'986fab71-337c-4e4b-89fe-0f48f7e98c23','I-24','Jl. Danau Buyan N No 79','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(13,'0170de66-d2d8-4a25-9ee2-3c0bb842b5b3','A-13','Jl. Danau Buyan W No 54','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(14,'1203f723-84d2-4cf6-a5fe-bd3144386b7b','S-68','Jl. Danau Buyan U No 10','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(15,'a8e356d4-0529-42a4-aeb3-6fdbd46bba3d','P-41','Jl. Danau Buyan N No 7','dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(16,'2b187f86-b716-4777-b936-8d8cc57d39f3','C-29','Jl. Danau Buyan O No 32','tidak_dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(17,'ed035f1f-5679-42d2-9021-725c7f2fbb02','V-94','Jl. Danau Buyan Q No 20','tidak_dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(18,'4456cdee-edee-47de-abf7-4398038d83c0','E-45','Jl. Danau Buyan Y No 16','tidak_dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(19,'a2379ad3-3afc-4f31-9edb-4ae21eefc793','V-99','Jl. Danau Buyan G No 11','tidak_dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34'),(20,'dd504bb4-7a96-4c0d-8c65-931948f6bae7','U-34','Jl. Danau Buyan T No 20','tidak_dihuni','2026-06-11 11:01:34','2026-06-11 11:01:34');
/*!40000 ALTER TABLE `houses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` smallint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2026_06_09_090248_create_personal_access_tokens_table',1),(5,'2026_06_09_105643_create_houses_table',1),(6,'2026_06_09_164941_create_residents_table',1),(7,'2026_06_09_164942_create_house_residents_table',1),(8,'2026_06_10_102945_create_due_type_rates_table',1),(9,'2026_06_10_102950_create_transaction_categories_table',1),(10,'2026_06_10_161410_create_payments_table',1),(11,'2026_06_10_214250_create_transactions_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `house_id` int unsigned NOT NULL,
  `resident_id` int unsigned NOT NULL,
  `due_type_rate_id` int unsigned NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `period_month` varchar(7) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_date` date NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `payments_house_id_foreign` (`house_id`),
  KEY `payments_resident_id_foreign` (`resident_id`),
  KEY `payments_due_type_rate_id_foreign` (`due_type_rate_id`),
  CONSTRAINT `payments_due_type_rate_id_foreign` FOREIGN KEY (`due_type_rate_id`) REFERENCES `due_type_rates` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_house_id_foreign` FOREIGN KEY (`house_id`) REFERENCES `houses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payments_resident_id_foreign` FOREIGN KEY (`resident_id`) REFERENCES `residents` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=418 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,1,1,100000.00,'2025-06','2025-06-15','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(2,1,1,2,15000.00,'2025-06','2025-06-13','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(3,1,1,1,100000.00,'2025-07','2025-07-10','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(4,1,1,2,15000.00,'2025-07','2025-07-04','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(5,1,1,1,100000.00,'2025-08','2025-08-21','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(6,1,1,2,15000.00,'2025-08','2025-08-12','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(7,1,1,1,100000.00,'2025-09','2025-09-03','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(8,1,1,2,15000.00,'2025-09','2025-09-11','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(9,1,1,1,100000.00,'2025-10','2025-10-20','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(10,1,1,2,15000.00,'2025-10','2025-10-08','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(11,1,1,1,100000.00,'2025-11','2025-11-18','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(12,1,1,2,15000.00,'2025-11','2025-11-21','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(13,1,1,1,100000.00,'2025-12','2025-12-13','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(14,1,1,2,15000.00,'2025-12','2025-12-10','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(15,1,1,1,100000.00,'2026-01','2026-01-17','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(16,1,1,2,15000.00,'2026-01','2026-01-18','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(17,1,1,1,100000.00,'2026-02','2026-02-17','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(18,1,1,2,15000.00,'2026-02','2026-02-18','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(19,1,1,1,100000.00,'2026-03','2026-03-19','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(20,1,1,2,15000.00,'2026-03','2026-03-20','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(21,1,1,1,100000.00,'2026-04','2026-04-04','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(22,1,1,2,15000.00,'2026-04','2026-04-17','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(23,1,1,1,100000.00,'2026-05','2026-05-11','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(24,1,1,2,15000.00,'2026-05','2026-05-13','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(25,1,1,1,100000.00,'2026-06','2026-06-19','Pembayaran Satpam periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(26,1,1,2,15000.00,'2026-06','2026-06-15','Pembayaran Kebersihan periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(27,2,6,1,100000.00,'2025-06','2025-06-12','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(28,2,6,2,15000.00,'2025-06','2025-06-14','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(29,2,6,1,100000.00,'2025-07','2025-07-03','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(30,2,6,2,15000.00,'2025-07','2025-07-03','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(31,2,6,1,100000.00,'2025-08','2025-08-17','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(32,2,6,2,15000.00,'2025-08','2025-08-19','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(33,2,6,1,100000.00,'2025-09','2025-09-05','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(34,2,6,2,15000.00,'2025-09','2025-09-03','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(35,2,6,1,100000.00,'2025-10','2025-10-02','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(36,2,6,2,15000.00,'2025-10','2025-10-12','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(37,2,6,1,100000.00,'2025-11','2025-11-21','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(38,2,6,2,15000.00,'2025-11','2025-11-04','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(39,2,6,1,100000.00,'2025-12','2025-12-05','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(40,2,6,2,15000.00,'2025-12','2025-12-17','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(41,2,6,1,100000.00,'2026-01','2026-01-14','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(42,2,6,2,15000.00,'2026-01','2026-01-06','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(43,2,6,1,100000.00,'2026-02','2026-02-05','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(44,2,6,2,15000.00,'2026-02','2026-02-04','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(45,2,6,1,100000.00,'2026-03','2026-03-16','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(46,2,6,2,15000.00,'2026-03','2026-03-05','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(47,2,6,1,100000.00,'2026-04','2026-04-16','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(48,2,6,2,15000.00,'2026-04','2026-04-15','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(49,2,6,1,100000.00,'2026-05','2026-05-21','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(50,2,6,2,15000.00,'2026-05','2026-05-21','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(51,2,6,1,100000.00,'2026-06','2026-06-05','Pembayaran Satpam periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:02:42','2026-06-11 11:02:42'),(52,2,6,2,15000.00,'2026-06','2026-06-12','Pembayaran Kebersihan periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(53,3,9,1,100000.00,'2025-06','2025-06-11','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(54,3,9,2,15000.00,'2025-06','2025-06-04','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(55,3,9,1,100000.00,'2025-07','2025-07-10','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(56,3,9,2,15000.00,'2025-07','2025-07-02','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(57,3,9,1,100000.00,'2025-08','2025-08-19','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(58,3,9,2,15000.00,'2025-08','2025-08-17','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(59,3,9,1,100000.00,'2025-09','2025-09-20','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(60,3,9,2,15000.00,'2025-09','2025-09-14','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(61,3,9,1,100000.00,'2025-10','2025-10-14','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(62,3,9,2,15000.00,'2025-10','2025-10-02','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(63,3,9,1,100000.00,'2025-11','2025-11-07','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(64,3,9,2,15000.00,'2025-11','2025-11-03','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(65,3,9,1,100000.00,'2025-12','2025-12-16','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(66,3,9,2,15000.00,'2025-12','2025-12-21','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(67,3,9,1,100000.00,'2026-01','2026-01-18','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(68,3,9,2,15000.00,'2026-01','2026-01-20','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(69,3,9,1,100000.00,'2026-02','2026-02-19','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(70,3,9,2,15000.00,'2026-02','2026-02-18','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(71,3,9,1,100000.00,'2026-03','2026-03-21','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(72,3,9,2,15000.00,'2026-03','2026-03-03','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(73,3,9,1,100000.00,'2026-04','2026-04-03','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(74,3,9,2,15000.00,'2026-04','2026-04-02','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(75,3,9,1,100000.00,'2026-05','2026-05-15','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:03:13','2026-06-11 11:03:13'),(76,3,9,2,15000.00,'2026-05','2026-05-04','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(77,3,9,1,100000.00,'2026-06','2026-06-13','Pembayaran Satpam periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:02:47','2026-06-11 11:02:47'),(78,3,9,2,15000.00,'2026-06','2026-06-21','Pembayaran Kebersihan periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:02:46','2026-06-11 11:02:46'),(79,4,13,1,100000.00,'2025-06','2025-06-19','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(80,4,13,2,15000.00,'2025-06','2025-06-20','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(81,4,13,1,100000.00,'2025-07','2025-07-17','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(82,4,13,2,15000.00,'2025-07','2025-07-20','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(83,4,13,1,100000.00,'2025-08','2025-08-02','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(84,4,13,2,15000.00,'2025-08','2025-08-15','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(85,4,13,1,100000.00,'2025-09','2025-09-03','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(86,4,13,2,15000.00,'2025-09','2025-09-16','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(87,4,13,1,100000.00,'2025-10','2025-10-02','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(88,4,13,2,15000.00,'2025-10','2025-10-13','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(89,4,13,1,100000.00,'2025-11','2025-11-15','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(90,4,13,2,15000.00,'2025-11','2025-11-12','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(91,4,13,1,100000.00,'2025-12','2025-12-10','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(92,4,13,2,15000.00,'2025-12','2025-12-15','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(93,4,13,1,100000.00,'2026-01','2026-01-21','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(94,4,13,2,15000.00,'2026-01','2026-01-03','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(95,4,13,1,100000.00,'2026-02','2026-02-19','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(96,4,13,2,15000.00,'2026-02','2026-02-06','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(97,4,13,1,100000.00,'2026-03','2026-03-15','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(98,4,13,2,15000.00,'2026-03','2026-03-14','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(99,4,13,1,100000.00,'2026-04','2026-04-16','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(100,4,13,2,15000.00,'2026-04','2026-04-09','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(101,4,13,1,100000.00,'2026-05','2026-05-17','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(102,4,13,2,15000.00,'2026-05','2026-05-14','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(103,4,13,1,100000.00,'2026-06','2026-06-13','Pembayaran Satpam periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(104,4,13,2,15000.00,'2026-06','2026-06-08','Pembayaran Kebersihan periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(105,5,16,1,100000.00,'2025-06','2025-06-06','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(106,5,16,2,15000.00,'2025-06','2025-06-08','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(107,5,16,1,100000.00,'2025-07','2025-07-15','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(108,5,16,2,15000.00,'2025-07','2025-07-12','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(109,5,16,1,100000.00,'2025-08','2025-08-04','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(110,5,16,2,15000.00,'2025-08','2025-08-07','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(111,5,16,1,100000.00,'2025-09','2025-09-05','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(112,5,16,2,15000.00,'2025-09','2025-09-15','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(113,5,16,1,100000.00,'2025-10','2025-10-15','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(114,5,16,2,15000.00,'2025-10','2025-10-11','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(115,5,16,1,100000.00,'2025-11','2025-11-03','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(116,5,16,2,15000.00,'2025-11','2025-11-04','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(117,5,16,1,100000.00,'2025-12','2025-12-10','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(118,5,16,2,15000.00,'2025-12','2025-12-03','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(119,5,16,1,100000.00,'2026-01','2026-01-03','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(120,5,16,2,15000.00,'2026-01','2026-01-17','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(121,5,16,1,100000.00,'2026-02','2026-02-12','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(122,5,16,2,15000.00,'2026-02','2026-02-11','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(123,5,16,1,100000.00,'2026-03','2026-03-20','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(124,5,16,2,15000.00,'2026-03','2026-03-07','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(125,5,16,1,100000.00,'2026-04','2026-04-17','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(126,5,16,2,15000.00,'2026-04','2026-04-12','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(127,5,16,1,100000.00,'2026-05','2026-05-04','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(128,5,16,2,15000.00,'2026-05','2026-05-09','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(129,5,16,1,100000.00,'2026-06','2026-06-17','Pembayaran Satpam periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(130,5,16,2,15000.00,'2026-06','2026-06-09','Pembayaran Kebersihan periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(131,6,19,1,100000.00,'2025-06','2025-06-06','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(132,6,19,2,15000.00,'2025-06','2025-06-19','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(133,6,19,1,100000.00,'2025-07','2025-07-04','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(134,6,19,2,15000.00,'2025-07','2025-07-11','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(135,6,19,1,100000.00,'2025-08','2025-08-12','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(136,6,19,2,15000.00,'2025-08','2025-08-08','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(137,6,19,1,100000.00,'2025-09','2025-09-08','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(138,6,19,2,15000.00,'2025-09','2025-09-07','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(139,6,19,1,100000.00,'2025-10','2025-10-15','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(140,6,19,2,15000.00,'2025-10','2025-10-03','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(141,6,19,1,100000.00,'2025-11','2025-11-14','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(142,6,19,2,15000.00,'2025-11','2025-11-08','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(143,6,19,1,100000.00,'2025-12','2025-12-19','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(144,6,19,2,15000.00,'2025-12','2025-12-11','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(145,6,19,1,100000.00,'2026-01','2026-01-15','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(146,6,19,2,15000.00,'2026-01','2026-01-09','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(147,6,19,1,100000.00,'2026-02','2026-02-03','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(148,6,19,2,15000.00,'2026-02','2026-02-20','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(149,6,19,1,100000.00,'2026-03','2026-03-20','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(150,6,19,2,15000.00,'2026-03','2026-03-02','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(151,6,19,1,100000.00,'2026-04','2026-04-20','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(152,6,19,2,15000.00,'2026-04','2026-04-03','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(153,6,19,1,100000.00,'2026-05','2026-05-10','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(154,6,19,2,15000.00,'2026-05','2026-05-12','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(155,6,19,1,100000.00,'2026-06','2026-06-12','Pembayaran Satpam periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(156,6,19,2,15000.00,'2026-06','2026-06-04','Pembayaran Kebersihan periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(157,7,24,1,100000.00,'2025-06','2025-06-03','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(158,7,24,2,15000.00,'2025-06','2025-06-13','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(159,7,24,1,100000.00,'2025-07','2025-07-16','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(160,7,24,2,15000.00,'2025-07','2025-07-07','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(161,7,24,1,100000.00,'2025-08','2025-08-11','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(162,7,24,2,15000.00,'2025-08','2025-08-16','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(163,7,24,1,100000.00,'2025-09','2025-09-08','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(164,7,24,2,15000.00,'2025-09','2025-09-12','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(165,7,24,1,100000.00,'2025-10','2025-10-03','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(166,7,24,2,15000.00,'2025-10','2025-10-11','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(167,7,24,1,100000.00,'2025-11','2025-11-03','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(168,7,24,2,15000.00,'2025-11','2025-11-09','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(169,7,24,1,100000.00,'2025-12','2025-12-03','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(170,7,24,2,15000.00,'2025-12','2025-12-10','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(171,7,24,1,100000.00,'2026-01','2026-01-10','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(172,7,24,2,15000.00,'2026-01','2026-01-03','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(173,7,24,1,100000.00,'2026-02','2026-02-07','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(174,7,24,2,15000.00,'2026-02','2026-02-21','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(175,7,24,1,100000.00,'2026-03','2026-03-06','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(176,7,24,2,15000.00,'2026-03','2026-03-11','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(177,7,24,1,100000.00,'2026-04','2026-04-16','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(178,7,24,2,15000.00,'2026-04','2026-04-09','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(179,7,24,1,100000.00,'2026-05','2026-05-15','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(180,7,24,2,15000.00,'2026-05','2026-05-21','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(181,7,24,1,100000.00,'2026-06','2026-06-15','Pembayaran Satpam periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(182,7,24,2,15000.00,'2026-06','2026-06-16','Pembayaran Kebersihan periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(183,8,29,1,100000.00,'2025-06','2025-06-21','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(184,8,29,2,15000.00,'2025-06','2025-06-09','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(185,8,29,1,100000.00,'2025-07','2025-07-10','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(186,8,29,2,15000.00,'2025-07','2025-07-09','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(187,8,29,1,100000.00,'2025-08','2025-08-12','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(188,8,29,2,15000.00,'2025-08','2025-08-10','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(189,8,29,1,100000.00,'2025-09','2025-09-06','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(190,8,29,2,15000.00,'2025-09','2025-09-09','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(191,8,29,1,100000.00,'2025-10','2025-10-13','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(192,8,29,2,15000.00,'2025-10','2025-10-04','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(193,8,29,1,100000.00,'2025-11','2025-11-16','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(194,8,29,2,15000.00,'2025-11','2025-11-10','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(195,8,29,1,100000.00,'2025-12','2025-12-15','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(196,8,29,2,15000.00,'2025-12','2025-12-19','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(197,8,29,1,100000.00,'2026-01','2026-01-18','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(198,8,29,2,15000.00,'2026-01','2026-01-17','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(199,8,29,1,100000.00,'2026-02','2026-02-19','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(200,8,29,2,15000.00,'2026-02','2026-02-08','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(201,8,29,1,100000.00,'2026-03','2026-03-09','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(202,8,29,2,15000.00,'2026-03','2026-03-08','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(203,8,29,1,100000.00,'2026-04','2026-04-12','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(204,8,29,2,15000.00,'2026-04','2026-04-05','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(205,8,29,1,100000.00,'2026-05','2026-05-20','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(206,8,29,2,15000.00,'2026-05','2026-05-03','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(207,8,29,1,100000.00,'2026-06','2026-06-04','Pembayaran Satpam periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(208,8,29,2,15000.00,'2026-06','2026-06-03','Pembayaran Kebersihan periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(209,9,31,1,100000.00,'2025-06','2025-06-06','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(210,9,31,2,15000.00,'2025-06','2025-06-13','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(211,9,31,1,100000.00,'2025-07','2025-07-11','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(212,9,31,2,15000.00,'2025-07','2025-07-19','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(213,9,31,1,100000.00,'2025-08','2025-08-08','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(214,9,31,2,15000.00,'2025-08','2025-08-09','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(215,9,31,1,100000.00,'2025-09','2025-09-16','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(216,9,31,2,15000.00,'2025-09','2025-09-11','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(217,9,31,1,100000.00,'2025-10','2025-10-02','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(218,9,31,2,15000.00,'2025-10','2025-10-08','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(219,9,31,1,100000.00,'2025-11','2025-11-17','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(220,9,31,2,15000.00,'2025-11','2025-11-15','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(221,9,31,1,100000.00,'2025-12','2025-12-19','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(222,9,31,2,15000.00,'2025-12','2025-12-12','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(223,9,31,1,100000.00,'2026-01','2026-01-04','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(224,9,31,2,15000.00,'2026-01','2026-01-08','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(225,9,31,1,100000.00,'2026-02','2026-02-05','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(226,9,31,2,15000.00,'2026-02','2026-02-05','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(227,9,31,1,100000.00,'2026-03','2026-03-20','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(228,9,31,2,15000.00,'2026-03','2026-03-10','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(229,9,31,1,100000.00,'2026-04','2026-04-06','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(230,9,31,2,15000.00,'2026-04','2026-04-13','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(231,9,31,1,100000.00,'2026-05','2026-05-02','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(232,9,31,2,15000.00,'2026-05','2026-05-08','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(233,9,31,1,100000.00,'2026-06','2026-06-14','Pembayaran Satpam periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(234,9,31,2,15000.00,'2026-06','2026-06-09','Pembayaran Kebersihan periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(235,10,36,1,100000.00,'2025-06','2025-06-04','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(236,10,36,2,15000.00,'2025-06','2025-06-09','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(237,10,36,1,100000.00,'2025-07','2025-07-21','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(238,10,36,2,15000.00,'2025-07','2025-07-16','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(239,10,36,1,100000.00,'2025-08','2025-08-03','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(240,10,36,2,15000.00,'2025-08','2025-08-12','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(241,10,36,1,100000.00,'2025-09','2025-09-08','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(242,10,36,2,15000.00,'2025-09','2025-09-06','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(243,10,36,1,100000.00,'2025-10','2025-10-20','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(244,10,36,2,15000.00,'2025-10','2025-10-09','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(245,10,36,1,100000.00,'2025-11','2025-11-20','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(246,10,36,2,15000.00,'2025-11','2025-11-11','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(247,10,36,1,100000.00,'2025-12','2025-12-21','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(248,10,36,2,15000.00,'2025-12','2025-12-09','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(249,10,36,1,100000.00,'2026-01','2026-01-18','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(250,10,36,2,15000.00,'2026-01','2026-01-19','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(251,10,36,1,100000.00,'2026-02','2026-02-02','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(252,10,36,2,15000.00,'2026-02','2026-02-21','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(253,10,36,1,100000.00,'2026-03','2026-03-02','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(254,10,36,2,15000.00,'2026-03','2026-03-13','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(255,10,36,1,100000.00,'2026-04','2026-04-17','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(256,10,36,2,15000.00,'2026-04','2026-04-10','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(257,10,36,1,100000.00,'2026-05','2026-05-05','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(258,10,36,2,15000.00,'2026-05','2026-05-16','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(259,10,36,1,100000.00,'2026-06','2026-06-16','Pembayaran Satpam periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(260,10,36,2,15000.00,'2026-06','2026-06-02','Pembayaran Kebersihan periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(261,11,39,1,100000.00,'2025-06','2025-06-04','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(262,11,39,2,15000.00,'2025-06','2025-06-07','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(263,11,39,1,100000.00,'2025-07','2025-07-08','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(264,11,39,2,15000.00,'2025-07','2025-07-14','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(265,11,39,1,100000.00,'2025-08','2025-08-17','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(266,11,39,2,15000.00,'2025-08','2025-08-15','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(267,11,39,1,100000.00,'2025-09','2025-09-08','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(268,11,39,2,15000.00,'2025-09','2025-09-16','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(269,11,39,1,100000.00,'2025-10','2025-10-07','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(270,11,39,2,15000.00,'2025-10','2025-10-17','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(271,11,39,1,100000.00,'2025-11','2025-11-09','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(272,11,39,2,15000.00,'2025-11','2025-11-04','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(273,11,39,1,100000.00,'2025-12','2025-12-07','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(274,11,39,2,15000.00,'2025-12','2025-12-14','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(275,11,39,1,100000.00,'2026-01','2026-01-18','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(276,11,39,2,15000.00,'2026-01','2026-01-02','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(277,11,39,1,100000.00,'2026-02','2026-02-07','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(278,11,39,2,15000.00,'2026-02','2026-02-10','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(279,11,39,1,100000.00,'2026-03','2026-03-12','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(280,11,39,2,15000.00,'2026-03','2026-03-20','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(281,11,39,1,100000.00,'2026-04','2026-04-20','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(282,11,39,2,15000.00,'2026-04','2026-04-10','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(283,11,39,1,100000.00,'2026-05','2026-05-06','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(284,11,39,2,15000.00,'2026-05','2026-05-21','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(285,12,42,1,100000.00,'2025-06','2025-06-21','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(286,12,42,2,15000.00,'2025-06','2025-06-12','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(287,12,42,1,100000.00,'2025-07','2025-07-16','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(288,12,42,2,15000.00,'2025-07','2025-07-15','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(289,12,42,1,100000.00,'2025-08','2025-08-06','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(290,12,42,2,15000.00,'2025-08','2025-08-15','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(291,12,42,1,100000.00,'2025-09','2025-09-14','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(292,12,42,2,15000.00,'2025-09','2025-09-02','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(293,12,42,1,100000.00,'2025-10','2025-10-14','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(294,12,42,2,15000.00,'2025-10','2025-10-05','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(295,12,42,1,100000.00,'2025-11','2025-11-21','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(296,12,42,2,15000.00,'2025-11','2025-11-18','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(297,12,42,1,100000.00,'2025-12','2025-12-10','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(298,12,42,2,15000.00,'2025-12','2025-12-13','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(299,12,42,1,100000.00,'2026-01','2026-01-02','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(300,12,42,2,15000.00,'2026-01','2026-01-21','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(301,12,42,1,100000.00,'2026-02','2026-02-08','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(302,12,42,2,15000.00,'2026-02','2026-02-09','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(303,12,42,1,100000.00,'2026-03','2026-03-11','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(304,12,42,2,15000.00,'2026-03','2026-03-06','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(305,12,42,1,100000.00,'2026-04','2026-04-16','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(306,12,42,2,15000.00,'2026-04','2026-04-13','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(307,12,42,1,100000.00,'2026-05','2026-05-15','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(308,12,42,2,15000.00,'2026-05','2026-05-21','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(309,12,42,1,100000.00,'2026-06','2026-06-20','Pembayaran Satpam periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(310,12,42,2,15000.00,'2026-06','2026-06-16','Pembayaran Kebersihan periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(311,13,48,1,100000.00,'2025-06','2025-06-02','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(312,13,48,2,15000.00,'2025-06','2025-06-19','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(313,13,48,1,100000.00,'2025-07','2025-07-17','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(314,13,48,2,15000.00,'2025-07','2025-07-04','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(315,13,48,1,100000.00,'2025-08','2025-08-21','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(316,13,48,2,15000.00,'2025-08','2025-08-07','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(317,13,48,1,100000.00,'2025-09','2025-09-12','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(318,13,48,2,15000.00,'2025-09','2025-09-15','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(319,13,48,1,100000.00,'2025-10','2025-10-03','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(320,13,48,2,15000.00,'2025-10','2025-10-15','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(321,13,48,1,100000.00,'2025-11','2025-11-11','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(322,13,48,2,15000.00,'2025-11','2025-11-06','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(323,13,48,1,100000.00,'2025-12','2025-12-21','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(324,13,48,2,15000.00,'2025-12','2025-12-15','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(325,13,48,1,100000.00,'2026-01','2026-01-18','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(326,13,48,2,15000.00,'2026-01','2026-01-15','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(327,13,48,1,100000.00,'2026-02','2026-02-16','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(328,13,48,2,15000.00,'2026-02','2026-02-18','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(329,13,48,1,100000.00,'2026-03','2026-03-02','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(330,13,48,2,15000.00,'2026-03','2026-03-08','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(331,13,48,1,100000.00,'2026-04','2026-04-06','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(332,13,48,2,15000.00,'2026-04','2026-04-15','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(333,13,48,1,100000.00,'2026-05','2026-05-17','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(334,13,48,2,15000.00,'2026-05','2026-05-13','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(335,13,48,1,100000.00,'2026-06','2026-06-08','Pembayaran Satpam periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(336,13,48,2,15000.00,'2026-06','2026-06-17','Pembayaran Kebersihan periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(337,14,49,1,100000.00,'2025-06','2025-06-10','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(338,14,49,2,15000.00,'2025-06','2025-06-05','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(339,14,49,1,100000.00,'2025-07','2025-07-17','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(340,14,49,2,15000.00,'2025-07','2025-07-20','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(341,14,49,1,100000.00,'2025-08','2025-08-07','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(342,14,49,2,15000.00,'2025-08','2025-08-11','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(343,14,49,1,100000.00,'2025-09','2025-09-17','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(344,14,49,2,15000.00,'2025-09','2025-09-19','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(345,14,49,1,100000.00,'2025-10','2025-10-12','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(346,14,49,2,15000.00,'2025-10','2025-10-04','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(347,14,49,1,100000.00,'2025-11','2025-11-02','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(348,14,49,2,15000.00,'2025-11','2025-11-21','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(349,14,49,1,100000.00,'2025-12','2025-12-02','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(350,14,49,2,15000.00,'2025-12','2025-12-16','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(351,14,49,1,100000.00,'2026-01','2026-01-04','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(352,14,49,2,15000.00,'2026-01','2026-01-19','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(353,14,49,1,100000.00,'2026-02','2026-02-02','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(354,14,49,2,15000.00,'2026-02','2026-02-09','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(355,14,49,1,100000.00,'2026-03','2026-03-06','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(356,14,49,2,15000.00,'2026-03','2026-03-14','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(357,14,49,1,100000.00,'2026-04','2026-04-14','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(358,14,49,2,15000.00,'2026-04','2026-04-02','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(359,14,49,1,100000.00,'2026-05','2026-05-14','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(360,14,49,2,15000.00,'2026-05','2026-05-21','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(361,14,49,1,100000.00,'2026-06','2026-06-03','Pembayaran Satpam periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(362,14,49,2,15000.00,'2026-06','2026-06-04','Pembayaran Kebersihan periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(363,15,50,1,100000.00,'2025-06','2025-06-16','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(364,15,50,2,15000.00,'2025-06','2025-06-06','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(365,15,50,1,100000.00,'2025-07','2025-07-08','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(366,15,50,2,15000.00,'2025-07','2025-07-03','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(367,15,50,1,100000.00,'2025-08','2025-08-06','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(368,15,50,2,15000.00,'2025-08','2025-08-10','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(369,15,50,1,100000.00,'2025-09','2025-09-21','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(370,15,50,2,15000.00,'2025-09','2025-09-15','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(371,17,55,1,100000.00,'2025-06','2025-06-04','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(372,17,55,2,15000.00,'2025-06','2025-06-05','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(373,17,55,1,100000.00,'2025-07','2025-07-10','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(374,17,55,2,15000.00,'2025-07','2025-07-16','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(375,17,55,1,100000.00,'2025-08','2025-08-04','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(376,17,55,2,15000.00,'2025-08','2025-08-05','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(377,17,55,1,100000.00,'2025-09','2025-09-14','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(378,17,55,2,15000.00,'2025-09','2025-09-09','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(379,17,55,1,100000.00,'2025-10','2025-10-03','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(380,17,55,2,15000.00,'2025-10','2025-10-07','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(381,17,55,1,100000.00,'2025-11','2025-11-17','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(382,17,55,2,15000.00,'2025-11','2025-11-04','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(383,17,55,1,100000.00,'2025-12','2025-12-17','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(384,17,55,2,15000.00,'2025-12','2025-12-05','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(385,17,55,1,100000.00,'2026-01','2026-01-04','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(386,17,55,2,15000.00,'2026-01','2026-01-10','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(387,17,55,1,100000.00,'2026-02','2026-02-20','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(388,17,55,2,15000.00,'2026-02','2026-02-14','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(389,17,55,1,100000.00,'2026-03','2026-03-14','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(390,17,55,2,15000.00,'2026-03','2026-03-17','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(391,17,55,1,100000.00,'2026-04','2026-04-13','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(392,18,58,1,100000.00,'2025-06','2025-06-09','Pembayaran Satpam periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(393,18,58,2,15000.00,'2025-06','2025-06-06','Pembayaran Kebersihan periode 2025-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(394,18,58,1,100000.00,'2025-07','2025-07-09','Pembayaran Satpam periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(395,18,58,2,15000.00,'2025-07','2025-07-09','Pembayaran Kebersihan periode 2025-07','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(396,18,58,1,100000.00,'2025-08','2025-08-02','Pembayaran Satpam periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(397,18,58,2,15000.00,'2025-08','2025-08-08','Pembayaran Kebersihan periode 2025-08','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(398,18,58,1,100000.00,'2025-09','2025-09-09','Pembayaran Satpam periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(399,18,58,2,15000.00,'2025-09','2025-09-21','Pembayaran Kebersihan periode 2025-09','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(400,18,58,1,100000.00,'2025-10','2025-10-16','Pembayaran Satpam periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(401,18,58,2,15000.00,'2025-10','2025-10-17','Pembayaran Kebersihan periode 2025-10','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(402,18,58,1,100000.00,'2025-11','2025-11-14','Pembayaran Satpam periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(403,18,58,2,15000.00,'2025-11','2025-11-08','Pembayaran Kebersihan periode 2025-11','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(404,18,58,1,100000.00,'2025-12','2025-12-17','Pembayaran Satpam periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(405,18,58,2,15000.00,'2025-12','2025-12-18','Pembayaran Kebersihan periode 2025-12','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(406,18,58,1,100000.00,'2026-01','2026-01-11','Pembayaran Satpam periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(407,18,58,2,15000.00,'2026-01','2026-01-16','Pembayaran Kebersihan periode 2026-01','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(408,18,58,1,100000.00,'2026-02','2026-02-11','Pembayaran Satpam periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(409,18,58,2,15000.00,'2026-02','2026-02-15','Pembayaran Kebersihan periode 2026-02','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(410,18,58,1,100000.00,'2026-03','2026-03-21','Pembayaran Satpam periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(411,18,58,2,15000.00,'2026-03','2026-03-20','Pembayaran Kebersihan periode 2026-03','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(412,18,58,1,100000.00,'2026-04','2026-04-05','Pembayaran Satpam periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(413,18,58,2,15000.00,'2026-04','2026-04-21','Pembayaran Kebersihan periode 2026-04','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(414,18,58,1,100000.00,'2026-05','2026-05-05','Pembayaran Satpam periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(415,18,58,2,15000.00,'2026-05','2026-05-19','Pembayaran Kebersihan periode 2026-05','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(416,18,58,1,100000.00,'2026-06','2026-06-16','Pembayaran Satpam periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(417,18,58,2,15000.00,'2026-06','2026-06-15','Pembayaran Kebersihan periode 2026-06','2026-06-11 11:01:34','2026-06-11 11:01:34',NULL);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `residents`
--

DROP TABLE IF EXISTS `residents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `residents` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ktp_photo_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('tetap','kontrak') COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_married` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=61 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `residents`
--

LOCK TABLES `residents` WRITE;
/*!40000 ALTER TABLE `residents` DISABLE KEYS */;
INSERT INTO `residents` VALUES (1,'Jaiden Sipes',NULL,'tetap','083686353760',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(2,'Faye Rohan',NULL,'kontrak','080496768407',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(3,'Alysson Rempel',NULL,'tetap','084127290811',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(4,'Summer Daugherty',NULL,'tetap','089536963503',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(5,'Mr. Alford Labadie',NULL,'tetap','086241731181',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(6,'Mr. Toby Eichmann',NULL,'kontrak','086401261577',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(7,'Dr. Presley O\'Conner',NULL,'tetap','086685886441',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(8,'Jordane Schaefer',NULL,'kontrak','089233369974',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(9,'Isaias Cremin',NULL,'kontrak','082626919934',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(10,'Prof. Sandrine Sauer',NULL,'kontrak','085664859036',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(11,'Prof. Ron Ratke',NULL,'tetap','085668896887',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(12,'Anissa Kovacek',NULL,'kontrak','084937418427',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(13,'Elias Goyette',NULL,'kontrak','084321748956',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(14,'Prof. Cathy Muller',NULL,'kontrak','082641237968',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(15,'Prof. Jan Ruecker DDS',NULL,'tetap','086439077987',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(16,'Dr. Bailey Mueller',NULL,'kontrak','086035799227',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(17,'Myrtle Schiller III',NULL,'tetap','081161098468',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(18,'Michel Schamberger',NULL,'kontrak','083406776460',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(19,'Prof. Koby Sauer PhD',NULL,'kontrak','087429728545',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(20,'Dr. Bernadine Quigley',NULL,'tetap','086948409408',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(21,'Lessie Altenwerth',NULL,'tetap','082637872510',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(22,'Reinhold Emard Sr.',NULL,'kontrak','081070916325',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(23,'Dr. Sidney Koch',NULL,'kontrak','085088619281',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(24,'Mr. Merlin Luettgen Jr.',NULL,'kontrak','086744820354',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(25,'Annabelle Leannon',NULL,'tetap','087556849917',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(26,'Prof. Harmony Kling',NULL,'tetap','086575050042',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(27,'Dr. Elias Ryan Jr.',NULL,'tetap','085961401142',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(28,'Jana Mertz',NULL,'tetap','082144335723',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(29,'Winnifred Borer',NULL,'kontrak','088705225590',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(30,'Aileen Turcotte',NULL,'kontrak','087931322175',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(31,'Lavinia Kunde',NULL,'tetap','089349779783',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(32,'Kevon Hamill',NULL,'kontrak','080510018182',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(33,'Hellen Koch III',NULL,'tetap','087200422322',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(34,'Mitchell Miller',NULL,'tetap','085065131220',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(35,'Wilbert Schumm',NULL,'tetap','084752240003',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(36,'Ms. Elda DuBuque',NULL,'tetap','088445983452',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(37,'Raymond Goodwin',NULL,'tetap','082443940034',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(38,'Roselyn Cummerata',NULL,'kontrak','087031629502',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(39,'Prof. Robert Anderson',NULL,'kontrak','084845816667',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(40,'Nayeli Howe',NULL,'kontrak','081899595394',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(41,'Dr. Randall Kreiger',NULL,'kontrak','087606075031',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(42,'Imelda Bauch',NULL,'tetap','083299833169',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(43,'Mrs. Kaela Little',NULL,'tetap','086312843100',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(44,'Suzanne Mertz',NULL,'kontrak','084303332995',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(45,'Ms. Shanie Donnelly DVM',NULL,'tetap','086277748286',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(46,'Keven West',NULL,'tetap','082516079585',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(47,'Karl Stoltenberg',NULL,'tetap','086610900393',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(48,'Mrs. Kenyatta McKenzie',NULL,'tetap','084138920628',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(49,'Camron Ferry',NULL,'tetap','087576701869',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(50,'Rick Weber',NULL,'kontrak','084252554392',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(51,'D\'angelo Torphy',NULL,'tetap','086410900761',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(52,'Neil Baumbach',NULL,'kontrak','086221717716',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(53,'Theresa Greenfelder',NULL,'tetap','081860632752',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(54,'Serenity Wyman III',NULL,'tetap','081943959569',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(55,'Guillermo Schroeder',NULL,'kontrak','087610832237',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(56,'Freddy Schowalter',NULL,'tetap','088014235508',0,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(57,'Daryl Gerhold',NULL,'tetap','089366620797',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(58,'Mr. Logan Quigley',NULL,'tetap','080809661391',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(59,'Xavier Wuckert',NULL,'tetap','088681398483',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL),(60,'Diego Collins',NULL,'kontrak','087171922207',1,'2026-06-11 11:01:34','2026-06-11 11:01:34',NULL);
/*!40000 ALTER TABLE `residents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('1lcijQShrBXRn24zT7I73mc3AO0APDiXuSxxSOT1',2,'127.0.0.1','Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','eyJfdG9rZW4iOiJYVjZPRVhKaUJmSmIzbEJaSGdwMVlyM3k3Qk5jZ0dXR2huMmxKTlRMIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI6MiwicGFzc3dvcmRfaGFzaF93ZWIiOiIyYTAxYWI5NWViMDExNmVkNzVhMDQxNWEyNjRiNzliMjU1MzAyMDJmNDc4NjY5NGUzM2FmMDgzYWRhM2E0ZjhjIn0=',1781201025);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_categories`
--

DROP TABLE IF EXISTS `transaction_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('expense','income') COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_categories`
--

LOCK TABLES `transaction_categories` WRITE;
/*!40000 ALTER TABLE `transaction_categories` DISABLE KEYS */;
INSERT INTO `transaction_categories` VALUES (1,'expense','Gaji Satpam','2026-06-11 11:01:34','2026-06-11 11:01:34'),(2,'expense','Listrik','2026-06-11 11:01:34','2026-06-11 11:01:34'),(3,'expense','Perbaikan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(4,'expense','Kebersihan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(5,'expense','Kegiatan Warga','2026-06-11 11:01:34','2026-06-11 11:01:34'),(6,'expense','Lain-lain','2026-06-11 11:01:34','2026-06-11 11:01:34'),(7,'income','Saldo Awal','2026-06-11 11:01:34','2026-06-11 11:01:34'),(8,'income','Sumbangan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(9,'income','Pemda','2026-06-11 11:01:34','2026-06-11 11:01:34'),(10,'income','Denda','2026-06-11 11:01:34','2026-06-11 11:01:34'),(11,'income','Lain-lain','2026-06-11 11:01:34','2026-06-11 11:01:34');
/*!40000 ALTER TABLE `transaction_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `transaction_category_id` int unsigned NOT NULL,
  `date` date NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transactions_transaction_category_id_foreign` (`transaction_category_id`),
  CONSTRAINT `transactions_transaction_category_id_foreign` FOREIGN KEY (`transaction_category_id`) REFERENCES `transaction_categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,7,'2025-06-01',15000000.00,'Saldo Awal','Saldo kas awal','2026-06-11 11:01:34','2026-06-11 11:01:34'),(2,1,'2025-06-25',1500000.00,'Gaji Satpam Pak Budi','Gaji bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(3,4,'2025-06-26',200000.00,'Iuran Kebersihan Lingkungan','Pembayaran petugas sampah','2026-06-11 11:01:34','2026-06-11 11:01:34'),(4,2,'2025-06-05',25000.00,'Token Listrik Pos Satpam','Token bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(5,1,'2025-07-25',1500000.00,'Gaji Satpam Pak Budi','Gaji bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(6,4,'2025-07-26',200000.00,'Iuran Kebersihan Lingkungan','Pembayaran petugas sampah','2026-06-11 11:01:34','2026-06-11 11:01:34'),(7,2,'2025-07-05',25000.00,'Token Listrik Pos Satpam','Token bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(8,1,'2025-08-25',1500000.00,'Gaji Satpam Pak Budi','Gaji bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(9,4,'2025-08-26',200000.00,'Iuran Kebersihan Lingkungan','Pembayaran petugas sampah','2026-06-11 11:01:34','2026-06-11 11:01:34'),(10,2,'2025-08-05',25000.00,'Token Listrik Pos Satpam','Token bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(11,1,'2025-09-25',1500000.00,'Gaji Satpam Pak Budi','Gaji bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(12,4,'2025-09-26',200000.00,'Iuran Kebersihan Lingkungan','Pembayaran petugas sampah','2026-06-11 11:01:34','2026-06-11 11:01:34'),(13,2,'2025-09-05',25000.00,'Token Listrik Pos Satpam','Token bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(14,1,'2025-10-25',1500000.00,'Gaji Satpam Pak Budi','Gaji bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(15,4,'2025-10-26',200000.00,'Iuran Kebersihan Lingkungan','Pembayaran petugas sampah','2026-06-11 11:01:34','2026-06-11 11:01:34'),(16,2,'2025-10-05',25000.00,'Token Listrik Pos Satpam','Token bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(17,1,'2025-11-25',1500000.00,'Gaji Satpam Pak Budi','Gaji bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(18,4,'2025-11-26',200000.00,'Iuran Kebersihan Lingkungan','Pembayaran petugas sampah','2026-06-11 11:01:34','2026-06-11 11:01:34'),(19,2,'2025-11-05',25000.00,'Token Listrik Pos Satpam','Token bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(20,1,'2025-12-25',1500000.00,'Gaji Satpam Pak Budi','Gaji bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(21,4,'2025-12-26',200000.00,'Iuran Kebersihan Lingkungan','Pembayaran petugas sampah','2026-06-11 11:01:34','2026-06-11 11:01:34'),(22,2,'2025-12-05',25000.00,'Token Listrik Pos Satpam','Token bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(23,1,'2026-01-25',1500000.00,'Gaji Satpam Pak Budi','Gaji bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(24,4,'2026-01-26',200000.00,'Iuran Kebersihan Lingkungan','Pembayaran petugas sampah','2026-06-11 11:01:34','2026-06-11 11:01:34'),(25,2,'2026-01-05',25000.00,'Token Listrik Pos Satpam','Token bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(26,8,'2026-01-10',1100000.00,'Sumbangan Warga','Sumbangan sukarela','2026-06-11 11:01:34','2026-06-11 11:01:34'),(27,1,'2026-02-25',1500000.00,'Gaji Satpam Pak Budi','Gaji bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(28,4,'2026-02-26',200000.00,'Iuran Kebersihan Lingkungan','Pembayaran petugas sampah','2026-06-11 11:01:34','2026-06-11 11:01:34'),(29,2,'2026-02-05',25000.00,'Token Listrik Pos Satpam','Token bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(30,1,'2026-03-25',1500000.00,'Gaji Satpam Pak Budi','Gaji bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(31,4,'2026-03-26',200000.00,'Iuran Kebersihan Lingkungan','Pembayaran petugas sampah','2026-06-11 11:01:34','2026-06-11 11:01:34'),(32,2,'2026-03-05',25000.00,'Token Listrik Pos Satpam','Token bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(33,8,'2026-03-10',700000.00,'Sumbangan Warga','Sumbangan sukarela','2026-06-11 11:01:34','2026-06-11 11:01:34'),(34,1,'2026-04-25',1500000.00,'Gaji Satpam Pak Budi','Gaji bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(35,4,'2026-04-26',200000.00,'Iuran Kebersihan Lingkungan','Pembayaran petugas sampah','2026-06-11 11:01:34','2026-06-11 11:01:34'),(36,2,'2026-04-05',25000.00,'Token Listrik Pos Satpam','Token bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(37,8,'2026-04-10',800000.00,'Sumbangan Warga','Sumbangan sukarela','2026-06-11 11:01:34','2026-06-11 11:01:34'),(38,1,'2026-05-25',1500000.00,'Gaji Satpam Pak Budi','Gaji bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(39,4,'2026-05-26',200000.00,'Iuran Kebersihan Lingkungan','Pembayaran petugas sampah','2026-06-11 11:01:34','2026-06-11 11:01:34'),(40,2,'2026-05-05',25000.00,'Token Listrik Pos Satpam','Token bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(41,8,'2026-05-10',1900000.00,'Sumbangan Warga','Sumbangan sukarela','2026-06-11 11:01:34','2026-06-11 11:01:34'),(42,2,'2026-06-05',25000.00,'Token Listrik Pos Satpam','Token bulanan','2026-06-11 11:01:34','2026-06-11 11:01:34'),(43,8,'2026-06-10',1000000.00,'Sumbangan Warga','Sumbangan sukarela','2026-06-11 11:01:34','2026-06-11 11:01:34');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test User','test@example.com',NULL,'$2y$12$mAdmjwbeZbhjIvzZPVriTO/KoVCa4UPTo4FmiVTM/rh2KQceufgw2',NULL,'2026-06-11 11:01:34','2026-06-11 11:01:34'),(2,'Admin RT','admin@rtis.local',NULL,'$2y$12$DZwNLx5UcZqwFlDmcRLkZ.v3tbI38xlmUqzBqi3QNVaH0KOC7B6/q',NULL,'2026-06-11 11:01:38','2026-06-11 11:01:38');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-12  1:19:14
