-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 03, 2024 at 07:54 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `activitydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity`
--

CREATE TABLE `activity` (
  `act_ID` int(3) NOT NULL,
  `act_title` varchar(255) NOT NULL,
  `act_desc` text NOT NULL,
  `act_dateStart` date NOT NULL,
  `act_dateEnd` date NOT NULL,
  `act_numStd` int(100) NOT NULL,
  `act_location` varchar(255) NOT NULL,
  `staff_ID` varchar(9) NOT NULL,
  `act_status` int(11) NOT NULL,
  `act_createAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity`
--

INSERT INTO `activity` (`act_ID`, `act_title`, `act_desc`, `act_dateStart`, `act_dateEnd`, `act_numStd`, `act_location`, `staff_ID`, `act_status`, `act_createAt`) VALUES
(1, 'dddj', 'fdsa', '2024-03-05', '2024-03-13', 54, 'uyjh', 'lkgj', 1, '2024-03-12 10:33:48'),
(2, 'Team Building Workshop', 'A workshop to enhance team collaboration and communication skills.', '2024-03-15', '2024-03-16', 30, 'Conference Room A', '1', 1, '2024-03-11 17:00:00'),
(5, 'Team4 Building Workshop', 'A workshop to enhance team collaboration and communication skills.', '2024-03-15', '2024-03-16', 30, 'Conference Room A', 'll', 1, '2024-03-12 14:42:51'),
(6, 'Team65 Building Workshop', 'A workshop to enhance team collaboration and communication skills.', '2024-03-15', '2024-03-16', 30, 'Conference Room A', 'll', 1, '2024-03-13 06:23:53'),
(7, 'fdsa', 'fdsa', '2024-03-09', '2024-03-30', 163, 'jhg', '10', 1, '2024-03-13 06:28:47'),
(8, 'fff', 'ffff', '2024-03-20', '2024-03-21', 50, 'ffff', '011', 1, '0000-00-00 00:00:00'),
(9, 'fsfsefef', 'esfefefef', '2024-06-14', '2024-06-18', 50, 'fesfefe', '11', 1, '0000-00-00 00:00:00'),
(10, 'fsfsefef', 'esfefefef', '2024-06-14', '2024-06-18', 50, 'fesfefe', '11', 1, '0000-00-00 00:00:00'),
(11, 'อบรมการใช้งาน igniter 4 ', 'หาดบหยก', '2024-06-19', '2024-06-21', 50, 'C310', '11', 1, '0000-00-00 00:00:00'),
(12, 'ดเดดดด', 'ฟหกฟหก', '2024-07-04', '2024-07-05', 100, 'บ้านเราเอง', '11', 1, '0000-00-00 00:00:00'),
(13, 'าาาาาาา', 'สสสสสสสส', '2024-07-03', '2024-07-11', 100, 'บ้าน', '11', 1, '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `login_ID` int(9) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`login_ID`, `username`, `password`, `role`) VALUES
(1, 'admin', '$2b$10$qKHgpeY9A6XaGTcLeP9aUuYcK94WouJ2qbW9zUO8MzmxIWI1yawPm', 'admin'),
(2, 'teacher', '$2b$10$KNTzxsqOSFu0ZBG2BxuPreRzGY1WY3YIKN4jlUSIZcQLS8PSBVBzG', 'teacher'),
(3, '644230009', '$2b$10$ahrQLZA5HuK0744r3x5vru1OrRIX3hypdMXduTS6YpYlehperZ9oW', 'student'),
(4, '644230016', '$2b$10$YZlyBk.Lty0A3MSaPK8Fze52Dutb/N/7PFv97zJgaYOJy5gGk7HUm', 'student'),
(5, '644230046', '$2b$10$1AKRKPlBahXEY2IwanA.3OoiBjylE.5dh6Hfw1BlOu2ZXbpGMcjUe', 'student'),
(6, '644230044', '$2b$10$l.6uIGywmwobvcF8btbnaO..UkAD.v4ujTgFUF1kbiM6cVGy8Jjqi', 'student'),
(7, '644230057', '$2b$10$vvwv3GIVjZdDqGwPsRnQrOGOVrpoONiz.8wGr2jD71pTILPGJMUES', 'student'),
(8, '644230055', '$2b$10$LqXj1bADS6HN1Y4CSn8B.OhiafPwK6.L5wC6elaeL1tQUSHzcJMCq', 'student'),
(9, 'paripat007', '$2b$10$DR6rGl.MeoCurEKu8f6Vp.9D.92y3pDFsjmOm9thOgfuMQZ3FGfJm', 'teacher');

-- --------------------------------------------------------

--
-- Table structure for table `manage`
--

CREATE TABLE `manage` (
  `man_status` tinyint(1) NOT NULL,
  `std_ID` varchar(9) NOT NULL,
  `act_ID` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `manage`
--

INSERT INTO `manage` (`man_status`, `std_ID`, `act_ID`) VALUES
(1, '644230016', '2'),
(1, '644230016', '1'),
(1, '644230046', '2'),
(1, '644230046', '7'),
(1, '644230046', '2'),
(1, '644230046', '7'),
(1, '644230046', '9'),
(1, '644230046', '11'),
(1, '644230046', '9'),
(1, '644230046', '13'),
(1, '644230009', '13'),
(1, '644230009', '13'),
(1, '644230009', '13'),
(1, '644230046', '12');

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `sec_ID` int(11) NOT NULL,
  `sec_name` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`sec_ID`, `sec_name`) VALUES
(1, '64/38'),
(2, '64/39');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `staff_ID` int(11) NOT NULL,
  `login_ID` int(9) NOT NULL,
  `staff_fname` varchar(255) DEFAULT NULL,
  `staff_lname` varchar(255) DEFAULT NULL,
  `staff_email` varchar(255) DEFAULT NULL,
  `staff_mobile` varchar(10) DEFAULT NULL,
  `staff_address` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `subdistrict` varchar(255) DEFAULT NULL,
  `zipcode` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`staff_ID`, `login_ID`, `staff_fname`, `staff_lname`, `staff_email`, `staff_mobile`, `staff_address`, `province`, `district`, `subdistrict`, `zipcode`) VALUES
(1, 1, 'admin', 'admin', 'admin@gmail.com', '000000000', 'sdfasdf', 'sdfsd', 'sdfd', 'sfdsf', '15325'),
(2, 2, 'สุขสวัสดิ์', 'แซ่ลิ่ม555756', 'suksawat@webmail.npru.ac.th', '4566620656', 'บ้านเลขที่ 38/39 หมู่ 64', 'นครปฐม', 'เมืองนครปฐม', 'วังตะกู', '73000'),
(3, 9, 'ปริภัทร', '007', 'paripat007@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `std_ID` varchar(9) NOT NULL,
  `login_ID` int(9) NOT NULL,
  `std_fname` varchar(255) DEFAULT NULL,
  `std_lname` varchar(255) DEFAULT NULL,
  `sec_ID` int(11) DEFAULT NULL,
  `std_email` varchar(255) DEFAULT NULL,
  `std_mobile` varchar(101) DEFAULT NULL,
  `std_address` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `subdistrict` varchar(255) DEFAULT NULL,
  `zipcode` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`std_ID`, `login_ID`, `std_fname`, `std_lname`, `sec_ID`, `std_email`, `std_mobile`, `std_address`, `province`, `district`, `subdistrict`, `zipcode`) VALUES
('644230009', 3, 'กรุณาเปลี่ยนชื่อของคุณ', 'กรุณาเปลี่ยนนามสกุลของคุณ', 1, '644230009@webmail,npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230016', 4, 'กรัณฑ์', 'ขันทอง', 1, 'jklhi', '0923233', 'fs', 'เชียงราย', 'แม่ลาว', 'จอมหมอกแก้ว', '57250'),
('644230044', 6, 'กรุณาเปลี่ยนชื่อของคุณ', 'กรุณาเปลี่ยนนามสกุลของคุณ', 1, '644230044@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230046', 5, 'บุรินทร์ชัย555', 'สุขอ่อน', 2, '644230046@webmail.npru.ac.th', '0806503175', '51 หมู่ 8 ', 'ราชบุรี', 'วัดเพลง', 'วัดเพลง', '70170'),
('644230055', 8, 'วิชัย', 'ทองเปราะ', 1, '644230055@webmail.npru.ac.th', '0806666666', NULL, NULL, NULL, NULL, NULL),
('644230057', 7, 'กรุณาเปลี่ยนชื่อของคุณ', 'กรุณาเปลี่ยนนามสกุลของคุณ', 1, '644230057@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity`
--
ALTER TABLE `activity`
  ADD PRIMARY KEY (`act_ID`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`login_ID`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`sec_ID`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`staff_ID`),
  ADD KEY `login_ID` (`login_ID`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`std_ID`),
  ADD KEY `login_ID` (`login_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity`
--
ALTER TABLE `activity`
  MODIFY `act_ID` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `login_ID` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `sec_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `staff_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
