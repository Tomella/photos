-- Database structure for photos
CREATE DATABASE IF NOT EXISTS `photos` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `photos`;

-- Structure for table photos.photo
CREATE TABLE IF NOT EXISTS `photo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(250) NOT NULL DEFAULT '0',
  `description` varchar(2500) DEFAULT NULL,
  `latitude` double NOT NULL DEFAULT '0',
  `longitude` double NOT NULL DEFAULT '0',
  `elevation` double NOT NULL DEFAULT '0',
  `time_point` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `location` point NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT DEFAULT CHARSET=utf8mb4 COMMENT='This is where the photo metadata is logged';

-- Structure for table photos.user
CREATE TABLE IF NOT EXISTS `user` (
  `id` char(50) DEFAULT NULL,
  `name` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
