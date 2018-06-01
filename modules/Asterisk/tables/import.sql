-- phpMyAdmin SQL Dump
-- version 4.0.10.8
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 20, 2015 at 03:07 PM
-- Server version: 5.1.73
-- PHP Version: 5.4.41

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `demo_ronikon`
--

-- --------------------------------------------------------

--
-- Table structure for table `asterisk_calls`
--

CREATE TABLE IF NOT EXISTS `asterisk_calls` (
  `id` int(36) NOT NULL AUTO_INCREMENT,
  `status` decimal(1,0) NOT NULL COMMENT '0 - ringing 1-linked 2-unlinked 3-missed 4-rejected',
  `event` varchar(30) NOT NULL,
  `operator` varchar(30) NOT NULL,
  `number_from` varchar(30) NOT NULL,
  `number_to` varchar(30) NOT NULL,
  `unique_id` varchar(100) NOT NULL,
  `date` datetime NOT NULL,
  `save_id` varchar(36) NOT NULL,
  `linked_id` varchar(36) NOT NULL,
  `links` text NOT NULL,
  `actual` tinyint(4) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `status` (`status`,`operator`),
  KEY `event` (`event`,`unique_id`),
  KEY `save_id` (`save_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=64 ;

-- --------------------------------------------------------

--
-- Table structure for table `asterisk_cel`
--

CREATE TABLE IF NOT EXISTS `asterisk_cel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `appdata` varchar(50) NOT NULL,
  `calleridnum` varchar(50) NOT NULL,
  `eventname` varchar(50) NOT NULL,
  `eventtime` varchar(50) NOT NULL,
  `exten` varchar(50) NOT NULL,
  `linked_id` varchar(50) NOT NULL,
  `unique_id` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1784 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
