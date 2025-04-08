CREATE DATABASE  IF NOT EXISTS `taskdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `taskdb`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: taskdb
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `master_roles`
--

DROP TABLE IF EXISTS `master_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` enum('Super Admin','Admin','Employee') NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_roles`
--

LOCK TABLES `master_roles` WRITE;
/*!40000 ALTER TABLE `master_roles` DISABLE KEYS */;
INSERT INTO `master_roles` VALUES (1,'Admin',0,'2025-02-25 11:05:39','2025-02-25 11:05:39'),(2,'Employee',0,'2025-02-25 11:05:39','2025-02-25 11:05:39'),(3,'Super Admin',0,'2025-02-25 11:05:39','2025-02-25 11:05:39');
/*!40000 ALTER TABLE `master_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_user`
--

DROP TABLE IF EXISTS `master_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile_number` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role_id` int NOT NULL,
  `position` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `otp` varchar(6) DEFAULT NULL,
  `otp_expires` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `master_user_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `master_roles` (`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_user`
--

LOCK TABLES `master_user` WRITE;
/*!40000 ALTER TABLE `master_user` DISABLE KEYS */;
INSERT INTO `master_user` VALUES (5,'Devang','Unmesh','Kolhe','devangkolhe@gmail.com','9504052323','$2b$10$5CArTodEQDa7aLU5ziTY2.rnF1g9LGwE5ObMKIwzwPamNIBlHWbN.',2,NULL,0,'2025-02-25 11:06:00','2025-04-08 06:28:30',NULL,NULL),(6,'Chaitanya','Prakash','Chandgude','admin@gmail.com','8421452208','$2b$10$W1YCtpd6IJ4ThBHDcqN8GOKAoSkgk9aVo0Ws4JbVTC4JWEW8pFC6O',1,'CEO',0,'2025-02-25 11:34:05','2025-03-05 12:03:50',NULL,NULL),(7,'Anil',NULL,'Adhav','anil@gmail.com','9130066221','$2b$10$PQJL8xd0zoyyptA.zjq9K.LkR.ftYPmw10eThqBxbCFyREIxusEsC',3,NULL,0,'2025-03-05 09:56:30','2025-04-04 10:35:35',NULL,NULL),(8,'Avishkar','Prakash','Chandgude','avishkarchandgude22@gmail.com','7028602766','$2b$10$ApJO/TqErw9FdhUhZhdbu.j/sZpsLO4JhB0Zkn6Kh04PMu7jkZBYC',2,'Intern',0,'2025-03-05 14:56:50','2025-03-05 15:15:50',NULL,NULL);
/*!40000 ALTER TABLE `master_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master_work_type`
--

DROP TABLE IF EXISTS `master_work_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `master_work_type` (
  `work_type_id` int NOT NULL AUTO_INCREMENT,
  `work_type` text NOT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`work_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master_work_type`
--

LOCK TABLES `master_work_type` WRITE;
/*!40000 ALTER TABLE `master_work_type` DISABLE KEYS */;
INSERT INTO `master_work_type` VALUES (1,'Internet Plan',0,'2025-03-04 06:48:33','2025-03-04 06:48:33'),(2,'CCTV Installation',0,'2025-03-04 06:50:43','2025-03-04 06:50:43'),(3,'Network Setup',0,'2025-03-11 12:53:05','2025-03-11 12:53:05');
/*!40000 ALTER TABLE `master_work_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task_assignees`
--

DROP TABLE IF EXISTS `task_assignees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task_assignees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `task_id` (`task_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `task_assignees_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `transaction_task` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `task_assignees_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `master_user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task_assignees`
--

LOCK TABLES `task_assignees` WRITE;
/*!40000 ALTER TABLE `task_assignees` DISABLE KEYS */;
INSERT INTO `task_assignees` VALUES (11,8,8),(12,9,5),(13,9,7),(9,23,5),(10,23,8);
/*!40000 ALTER TABLE `task_assignees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_daily_activity`
--

DROP TABLE IF EXISTS `transaction_daily_activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_daily_activity` (
  `activity_id` int NOT NULL AUTO_INCREMENT,
  `task_id` int DEFAULT NULL,
  `report_date` date NOT NULL,
  `activities` text NOT NULL,
  `actual_work` text,
  `payment_status` enum('Paid','Not Paid') DEFAULT 'Not Paid',
  `assigned_team` varchar(255) DEFAULT NULL,
  `adhoc_task_id` int DEFAULT NULL,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `user_id` int NOT NULL,
  `payment_amount` decimal(10,2) DEFAULT NULL,
  `payment_date` date DEFAULT NULL,
  `remarks` text,
  `status` enum('Pending','In Progress','Completed') DEFAULT 'Pending',
  PRIMARY KEY (`activity_id`),
  KEY `idx_task_id` (`task_id`),
  KEY `idx_adhoc_task_id` (`adhoc_task_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `transaction_daily_activity_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `transaction_task` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `transaction_daily_activity_ibfk_2` FOREIGN KEY (`adhoc_task_id`) REFERENCES `transaction_task` (`task_id`) ON DELETE SET NULL,
  CONSTRAINT `transaction_daily_activity_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `master_user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_daily_activity`
--

LOCK TABLES `transaction_daily_activity` WRITE;
/*!40000 ALTER TABLE `transaction_daily_activity` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction_daily_activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_notifications`
--

DROP TABLE IF EXISTS `transaction_notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `transaction_notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `master_user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_notifications`
--

LOCK TABLES `transaction_notifications` WRITE;
/*!40000 ALTER TABLE `transaction_notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction_notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_task`
--

DROP TABLE IF EXISTS `transaction_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_task` (
  `task_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `is_internal` tinyint(1) NOT NULL,
  `sub_company` varchar(255) DEFAULT NULL,
  `client_name` varchar(255) DEFAULT NULL,
  `client_details` text,
  `work_type_id` int DEFAULT NULL,
  `assigned_to` json DEFAULT NULL,
  `assigned_by` int DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `status` enum('Not Started','Started','Ongoing','Completed') DEFAULT 'Not Started',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `assigned_to_first_user` varchar(36) GENERATED ALWAYS AS (json_unquote(json_extract(`assigned_to`,_utf8mb4'$[0]'))) STORED,
  PRIMARY KEY (`task_id`),
  KEY `work_type_id` (`work_type_id`),
  KEY `assigned_by` (`assigned_by`),
  KEY `idx_assigned_to_first_user` (`assigned_to_first_user`),
  CONSTRAINT `transaction_task_ibfk_1` FOREIGN KEY (`work_type_id`) REFERENCES `master_work_type` (`work_type_id`) ON DELETE SET NULL,
  CONSTRAINT `transaction_task_ibfk_3` FOREIGN KEY (`assigned_by`) REFERENCES `master_user` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_task`
--

LOCK TABLES `transaction_task` WRITE;
/*!40000 ALTER TABLE `transaction_task` DISABLE KEYS */;
INSERT INTO `transaction_task` (`task_id`, `title`, `description`, `is_internal`, `sub_company`, `client_name`, `client_details`, `work_type_id`, `assigned_to`, `assigned_by`, `start_date`, `deadline`, `status`, `is_deleted`, `created_at`, `updated_at`) VALUES (1,'Network Setup','Completed',0,NULL,'Sanjivani College of Engineering','College',1,'5',NULL,'2025-03-04','2025-03-08','Not Started',1,'2025-03-04 07:08:24','2025-03-18 12:09:43'),(2,'Atma Malik CCTV EDITED','cctv',0,NULL,'Atma Malik','installation',2,'5',NULL,'2025-03-03','2025-03-07','Not Started',1,'2025-03-04 10:25:21','2025-03-19 13:38:25'),(3,'abc edits','aaaaaaaaaaaa',0,NULL,'sanjivani','college',2,'8',6,'2025-03-04','2025-03-04','Completed',1,'2025-03-04 10:26:33','2025-03-20 12:35:00'),(4,'ghjk edit','hhh',0,NULL,'sanjivani','academy',2,'[5, 6, 8]',6,'2025-04-08','2025-04-08','Completed',0,'2025-03-11 07:15:22','2025-04-08 05:13:56'),(5,'456789','ngnix',1,NULL,NULL,NULL,NULL,'7',NULL,NULL,'2025-03-11','Ongoing',1,'2025-03-11 07:15:47','2025-03-12 07:10:04'),(6,'2345432','jkewmd s,',1,NULL,NULL,NULL,NULL,'8',NULL,NULL,'2025-03-07','Completed',1,'2025-03-11 09:44:56','2025-03-12 07:04:12'),(8,'XYZ','abc',0,NULL,'ABC','bbvb',2,'[8]',6,'2025-04-08','2025-04-08','Completed',0,'2025-03-12 07:11:51','2025-04-08 06:37:08'),(9,'Fiber connectivity','From Airtel tower to server room',0,NULL,'cx','bggg',2,'[5, 7]',6,'2025-04-08','2025-04-08','Not Started',0,'2025-03-18 12:05:02','2025-04-08 06:37:27'),(10,'SAP','training',1,NULL,NULL,NULL,3,'8',NULL,'2025-03-20','2025-03-29','Completed',0,'2025-03-19 05:01:35','2025-03-20 11:36:55'),(11,'changed to avi','changed',0,NULL,'sssssssss','dffffffffffffff',2,'8',8,'2025-03-19','2025-03-19','Completed',0,'2025-03-19 05:14:33','2025-03-20 09:43:43'),(12,'edited','ttttttttttt',1,NULL,NULL,NULL,2,'6',NULL,'2025-03-21','2025-03-21','Started',0,'2025-03-19 05:26:49','2025-03-19 07:14:15'),(13,'vghjk','hjk',1,NULL,NULL,NULL,2,'6',NULL,'2025-03-19','2025-03-19','Not Started',0,'2025-03-19 10:22:26','2025-03-19 10:22:26'),(14,'HHH','BBB',1,NULL,NULL,NULL,2,'5',NULL,'2025-03-19','2025-03-19','Not Started',0,'2025-03-19 12:56:58','2025-03-19 12:56:58'),(15,'HHH','BBB',1,NULL,NULL,NULL,NULL,'5',NULL,'2025-03-19','2025-03-19','Not Started',0,'2025-03-19 12:57:11','2025-03-19 12:57:11'),(16,'xyz','',1,NULL,NULL,NULL,2,'7',NULL,'2025-03-20','2025-03-20','Not Started',0,'2025-03-20 04:52:33','2025-03-20 04:52:33'),(17,'shjshh','',1,NULL,NULL,NULL,2,'7',NULL,'2025-03-20','2025-03-20','Not Started',0,'2025-03-20 05:34:50','2025-03-20 05:34:50'),(18,'hjkl','',1,NULL,NULL,NULL,3,'7',7,'2025-03-20','2025-03-20','Not Started',0,'2025-03-20 05:37:56','2025-03-20 05:37:56'),(19,'changed to avi','ssssssssss   bbb',0,NULL,'abc','id',2,'6',6,'2025-03-19','2025-03-19','Started',0,'2025-03-20 06:31:23','2025-03-20 06:31:23'),(20,'1111111111','dbdqjdbhb',0,NULL,'ABCd','jdjdje',2,'8',6,'2025-03-20','2025-03-31','Ongoing',0,'2025-03-20 06:33:10','2025-03-20 10:10:53'),(21,'22222222','bbbbbbbbbbbbb',1,NULL,NULL,NULL,1,'8',6,'2025-03-20','2025-03-20','Started',0,'2025-03-20 06:34:18','2025-03-20 09:33:26'),(22,'new task','trial',1,'',NULL,NULL,2,'7',6,'2025-03-20','2025-03-20','Not Started',0,'2025-03-20 10:02:00','2025-03-20 10:02:27'),(23,'XYZaa','abc',0,NULL,'ABC','bbvb',2,NULL,6,'2025-04-08','2025-04-08','Completed',0,'2025-04-08 06:27:21','2025-04-08 06:27:21');
/*!40000 ALTER TABLE `transaction_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_task_reports`
--

DROP TABLE IF EXISTS `transaction_task_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_task_reports` (
  `report_id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `reported_by` int NOT NULL,
  `progress` text NOT NULL,
  `report_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`report_id`),
  KEY `task_id` (`task_id`),
  KEY `reported_by` (`reported_by`),
  CONSTRAINT `transaction_task_reports_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `transaction_task` (`task_id`) ON DELETE CASCADE,
  CONSTRAINT `transaction_task_reports_ibfk_2` FOREIGN KEY (`reported_by`) REFERENCES `master_user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_task_reports`
--

LOCK TABLES `transaction_task_reports` WRITE;
/*!40000 ALTER TABLE `transaction_task_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction_task_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_task_status_updates`
--

DROP TABLE IF EXISTS `transaction_task_status_updates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_task_status_updates` (
  `status_update_id` int NOT NULL AUTO_INCREMENT,
  `task_id` int NOT NULL,
  `status` enum('Not Started','Started','Ongoing','Completed') DEFAULT 'Not Started',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`status_update_id`),
  KEY `task_id` (`task_id`),
  CONSTRAINT `transaction_task_status_updates_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `transaction_task` (`task_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_task_status_updates`
--

LOCK TABLES `transaction_task_status_updates` WRITE;
/*!40000 ALTER TABLE `transaction_task_status_updates` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction_task_status_updates` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-08 14:44:14
