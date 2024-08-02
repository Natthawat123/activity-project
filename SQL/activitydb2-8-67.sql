-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 02, 2024 at 04:25 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

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
  `act_numStdReserve` int(100) NOT NULL,
  `act_location` varchar(255) NOT NULL,
  `staff_ID` varchar(9) NOT NULL,
  `act_status` int(11) NOT NULL,
  `act_createAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `act_transaction` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity`
--

INSERT INTO `activity` (`act_ID`, `act_title`, `act_desc`, `act_dateStart`, `act_dateEnd`, `act_numStd`, `act_numStdReserve`, `act_location`, `staff_ID`, `act_status`, `act_createAt`, `act_transaction`) VALUES
(1, 'ทำความสะอาดห้องเรียน', 'กิจกรรมอาสาทำความสะอาดชายหาดเพื่อรักษาสิ่งแวดล้อม', '2024-07-13', '2024-07-13', 5, 0, 'หาดสมิหลา, สงขลา', '2', 2, '2024-07-31 12:53:34', ''),
(2, 'เวียนเทียน', 'เวียนเทียนรอบโบสถ์', '2024-07-31', '2024-07-31', 0, 0, 'วัด', '', 2, '2024-07-31 12:53:34', ''),
(3, 'อบรม Microsoft Word', 'สอนการใช้ โปรแกรม Microsoft Word', '2024-08-06', '2024-08-06', 10, 2, 'c304', '2', 1, '2024-08-01 16:33:22', ''),
(5, 'นำเสนอความคืบหน้า', 'นำเสนอ', '2024-07-17', '2024-07-18', 0, 1, 'ตึกคอมพิวเตอร์', '2', 2, '2024-07-30 06:12:26', ''),
(14, 'defsg', 'egdfh', '2024-07-31', '2024-07-31', 0, 1, 'gdhfj', '', 2, '2024-07-30 06:12:26', '0x78333d8a3ce1180b8ede7152f587b7a8af8783a6b38a9ae7123385b270b05e40'),
(15, 'Pokemon', 'Naruto', '2024-08-06', '2024-08-07', 84, -3, 'Bleach', '', 1, '2024-08-01 15:48:44', ''),
(16, 'hacker0078', 'To be Hacker007', '2024-08-06', '2024-08-06', 777, 2, 'com 007', '3', 2, '2024-08-01 14:43:00', '');

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `login_ID` int(11) NOT NULL,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mobile` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`login_ID`, `fname`, `lname`, `email`, `mobile`) VALUES
(1, 'admin', 'admin', 'admin@gmail.com', '1234567890');

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
(5, '644230046', '$2b$10$1AKRKPlBahXEY2IwanA.3OoiBjylE.5dh6Hfw1BlOu2ZXbpGMcjUe', 'student'),
(31, '644230009', '$2b$10$0peZhviBuNcG1W2dswvNsuWS9EMyNw1FDzRZwZUnGRpeZGytMqz5W', 'student'),
(45, '644230016', '$2b$10$49n80BvkK//6FAObztxXdeAqLB8Iz1p4l5RhqmkYbv7cT7vN4P7Pu', 'student');

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
(1, '644230016', '15'),
(1, '644230016', '3'),
(1, '644230046', '3');

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
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `login_ID` varchar(9) NOT NULL,
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

INSERT INTO `student` (`login_ID`, `std_fname`, `std_lname`, `sec_ID`, `std_email`, `std_mobile`, `std_address`, `province`, `district`, `subdistrict`, `zipcode`) VALUES
('644230009', 'ณภัทรนุ ', ' ลอ', 1, '644230009@webmail.npru.ac.th', '1234567890', '88/33', 'ตราด', 'บ่อไร่', 'ด่านชุมพล', '23140'),
('644230016', 'John', 'Doe', 1, 'john.doe@example.com', '+1234567890', '123 Elm Street', 'Ontario', 'Toronto', 'Downtown', 'M5A 1'),
('644230046', 'นายบุรินทร์ชัย', 'สุขอ่อน', 2, '644230046@webmail.npru.ac.th', '0806503175', '51 หมู่ 8 ', 'นครปฐม', 'เมืองนครปฐม', 'วังตะกู', '73000');

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE `teacher` (
  `login_ID` int(9) NOT NULL,
  `staff_fname` varchar(255) DEFAULT NULL,
  `staff_lname` varchar(255) DEFAULT NULL,
  `staff_email` varchar(255) DEFAULT NULL,
  `staff_mobile` varchar(10) DEFAULT NULL,
  `staff_address` varchar(255) DEFAULT NULL,
  `province` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `subdistrict` varchar(255) DEFAULT NULL,
  `zipcode` varchar(5) DEFAULT NULL,
  `sec_ID` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`login_ID`, `staff_fname`, `staff_lname`, `staff_email`, `staff_mobile`, `staff_address`, `province`, `district`, `subdistrict`, `zipcode`, `sec_ID`) VALUES
(2, 'อ.สุขสวัสดิ์', 'แซ่ลิ่ม', 'suksawat@webmail.npru.ac.th', '0000000000', 'บ้านเลขที่ 38/39 หมู่ 64', 'นครปฐม', 'เมืองนครปฐม', 'วังตะกู', '73000', 1),
(3, 'ขาว', 'ดำ', 'red@webmail.npru.ac.th', '4561237890', 'บ้านเลขที่ 38/39 หมู่ 64', 'นครปฐม', 'เมืองนครปฐม', 'วังตะกู', '73000', 2),
(42, 'f', 'f', 'f', 'f', NULL, NULL, NULL, NULL, NULL, 0),
(43, 't', 't', 't', 't', NULL, NULL, NULL, NULL, NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity`
--
ALTER TABLE `activity`
  ADD PRIMARY KEY (`act_ID`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`login_ID`);

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
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`login_ID`);

--
-- Indexes for table `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`login_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity`
--
ALTER TABLE `activity`
  MODIFY `act_ID` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `login_ID` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `sec_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
