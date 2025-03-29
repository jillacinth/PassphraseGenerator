-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: sql1.njit.edu
-- Generation Time: Mar 26, 2025 at 10:56 PM
-- Server version: 8.0.17
-- PHP Version: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `pk577`
--

-- --------------------------------------------------------

--
-- Table structure for table `MSUsers`
--

CREATE TABLE IF NOT EXISTS `MSUsers` (
  `Username` varchar(256) NOT NULL,
  `HashPass` varchar(1024) NOT NULL,
  `HashSalt` varchar(1024) NOT NULL,
  `Q1` int(9) NOT NULL,
  `Q2` int(9) NOT NULL,
  `Q3` int(9) NOT NULL,
  `Q4` int(9) NOT NULL,
  `Q5` int(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `MSUsers`
--

INSERT INTO `MSUsers` (`Username`, `HashPass`, `HashSalt`, `Q1`, `Q2`, `Q3`, `Q4`, `Q5`) VALUES
('user', '$2b$10$YzMviLlkJHqtqnF2cDgIs.FvpgALB8NUkII8ZOFDfHkVjMMdVIC/e', '$2b$10$YzMviLlkJHqtqnF2cDgIs.', 21, 40, 34, 43, 27),
('user2', '$2b$10$etautJ8tZ/mLhuuFUwlV4Ot4uqLQimmKyPfiL10Qyglc691huPBi2', '$2b$10$etautJ8tZ/mLhuuFUwlV4O', 38, 42, 15, 13, 40),
('user3', '$2b$10$WH9jQHLB6llnkqFPSo8jN.8UP64TzkLaGmKt0ew2AqFdzcuxv.Lz.', '$2b$10$WH9jQHLB6llnkqFPSo8jN.', 44, 12, 21, 16, 24),
('user5', '$2b$10$44JFSiDAhot0kUJKY43JGOqqsNhHqIqIJPBYNVhcRbcKWKleG4uEK', '$2b$10$44JFSiDAhot0kUJKY43JGO', 48, 16, 20, 31, 39);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `MSUsers`
--
ALTER TABLE `MSUsers`
 ADD PRIMARY KEY (`Username`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
