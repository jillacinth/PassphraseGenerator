-- phpMyAdmin SQL Dump
-- version 4.2.7.1
-- http://www.phpmyadmin.net
--
-- Host: sql1.njit.edu
-- Generation Time: Mar 26, 2025 at 10:52 PM
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
-- Table structure for table `SecurityQs`
--

CREATE TABLE IF NOT EXISTS `SecurityQs` (
  `QContent` varchar(1024) NOT NULL,
`QNum` int(9) NOT NULL
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci AUTO_INCREMENT=53 ;

--
-- Dumping data for table `SecurityQs`
--

INSERT INTO `SecurityQs` (`QContent`, `QNum`) VALUES
('How many countries have you visited?', 11),
('How many languages do you speak?', 12),
('What is a favorite movie you watched as a child?', 13),
('What was the first thing you bought with your own money?', 14),
('Which season do you look forward to the most?', 15),
('What is your favorite genre of music?', 16),
('What is your favorite color?', 17),
('Which country would you most like to visit?', 18),
('How old were you when you learned to ride a bike?', 19),
('What is your favorite type of tree?', 20),
('What was the name of your first pet?', 21),
('What is your favorite type of tree in our area?', 22),
('Where was the first place you ever camped?', 23),
('What is your favorite holiday tradition we have?', 24),
('Where do you feel most at peace?', 25),
('What is the make of your first bicycle?', 26),
('What is your most-played video game from childhood?', 27),
('What is the name of a local band you admire but others might not know?', 28),
('What is the last obscure movie you watched?', 29),
('What is your favorite brand of tea that''s not well-known?', 30),
('What is the model of your first camera?', 31),
('What is the name of a small, local store you frequent?', 32),
('What is the title of your favorite comic book series?', 33),
('What was your favorite toy as a child?', 34),
('What is the make of your first car?', 35),
('Who is your favorite historical figure?', 36),
('What is the first country you visited?', 37),
('What high school did you attend primarily?', 38),
('What city did you live in as a child?', 39),
('What was the first word you learned as a child?', 40),
('How many siblings do you have?', 41),
('How many close friends do you have?', 42),
('How old were you when you first started cooking alone?', 43),
('What shape reminds you of home?', 44),
('What is your lucky day of the week?', 45),
('What color was your first bicycle?', 46),
('What model was your first car?', 47),
('What board game did you play most as a child?', 48),
('What is the first song you learned to play on an instrument?', 49),
('How many pairs of shoes do you own?', 50),
('What color was your first car?', 51),
('What is your favorite constellation?', 52);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `SecurityQs`
--
ALTER TABLE `SecurityQs`
 ADD PRIMARY KEY (`QNum`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `SecurityQs`
--
ALTER TABLE `SecurityQs`
MODIFY `QNum` int(9) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=53;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
