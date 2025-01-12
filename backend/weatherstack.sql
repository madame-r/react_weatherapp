-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : sam. 11 jan. 2025 à 14:26
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `weatherstack`
--

-- --------------------------------------------------------

--
-- Structure de la table `weather_data`
--

DROP TABLE IF EXISTS `weather_data`;
CREATE TABLE IF NOT EXISTS `weather_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `local_time` datetime DEFAULT NULL,
  `temperature` int DEFAULT NULL,
  `weather_descriptions` text,
  `weather_icon` varchar(255) DEFAULT NULL,
  `timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `weather_data`
--

INSERT INTO `weather_data` (`id`, `name`, `country`, `local_time`, `temperature`, `weather_descriptions`, `weather_icon`, `timestamp`) VALUES
(1, 'Rome', 'Italy', '2025-01-11 13:57:00', 14, 'Partly cloudy', 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png', '2025-01-11 14:42:22'),
(2, 'Split', 'Croatia', '2025-01-11 14:44:00', 11, 'Sunny', 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png', '2025-01-11 14:45:34'),
(3, 'Seoul', 'South Korea', '2025-01-11 22:07:00', -7, 'Clear', 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0008_clear_sky_night.png', '2025-01-11 14:52:20'),
(4, 'Paris', 'France', '2025-01-11 14:38:00', 1, 'Overcast', 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0004_black_low_cloud.png', '2025-01-11 14:54:54'),
(5, 'Rome', 'Italy', '2025-01-11 14:56:00', 14, 'Partly cloudy', 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0002_sunny_intervals.png', '2025-01-11 14:57:39'),
(6, 'Seoul', 'South Korea', '2025-01-11 22:59:00', -7, 'Clear', 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0008_clear_sky_night.png', '2025-01-11 15:00:27'),
(7, 'Dehlingen', 'France', '2025-01-11 15:49:00', 3, 'Patchy rain nearby', 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0009_light_rain_showers.png', '2025-01-11 15:06:26');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
