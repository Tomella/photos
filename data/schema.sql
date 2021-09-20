-- --------------------------------------------------------
-- Host:                         192.168.1.154
-- Server version:               10.1.26-MariaDB-0+deb9u1 - Debian 9.1
-- Server OS:                    debian-linux-gnueabihf
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for photos
-- DROP DATABASE IF EXISTS `photos`;
CREATE DATABASE IF NOT EXISTS `photos` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `photos`;

-- Dumping structure for table photos.keyword
-- DROP TABLE IF EXISTS `keyword`;
CREATE TABLE IF NOT EXISTS `keyword` (
  `name` varchar(50) NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nameIdx` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table photos.photo
-- DROP TABLE IF EXISTS `photo`;
CREATE TABLE IF NOT EXISTS `photo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(250) NOT NULL DEFAULT '0',
  `description` varchar(2500) DEFAULT NULL,
  `annotation` varchar(250) DEFAULT NULL,
  `latitude` double NOT NULL DEFAULT '0',
  `longitude` double NOT NULL DEFAULT '0',
  `elevation` double NOT NULL DEFAULT '0',
  `time_point` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `location` point NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `filenameIdx` (`filename`(191)) USING BTREE,
  KEY `time_point` (`time_point`)
) ENGINE=InnoDB AUTO_INCREMENT=4131 DEFAULT CHARSET=utf8mb4 COMMENT='This is where the photo metadata is logged';

-- Data exporting was unselected.

-- Dumping structure for table photos.photo_keyword
-- DROP TABLE IF EXISTS `photo_keyword`;
CREATE TABLE IF NOT EXISTS `photo_keyword` (
  `keyword` int(11) NOT NULL,
  `photo` int(11) NOT NULL,
  PRIMARY KEY (`keyword`,`photo`),
  KEY `FK_photo_keyword_photo` (`photo`),
  CONSTRAINT `FK_photo_keyword_keyword` FOREIGN KEY (`keyword`) REFERENCES `keyword` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_photo_keyword_photo` FOREIGN KEY (`photo`) REFERENCES `photo` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table photos.user
-- DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `username` varchar(50) NOT NULL,
  `last_name` varchar(250) NOT NULL,
  `first_name` varchar(100) NOT NULL,
	`email` VARCHAR(250) NULL DEFAULT NULL,
  `admin` enum('Y','N') NOT NULL DEFAULT 'N',
	`password` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
