-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 04, 2024 at 04:28 AM
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
-- Database: `activity_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity`
--

CREATE TABLE `activity` (
  `act_ID` int(11) NOT NULL,
  `t_ID` int(11) NOT NULL,
  `act_title` varchar(100) DEFAULT NULL,
  `act_desc` text DEFAULT NULL,
  `act_dateStart` date DEFAULT NULL,
  `act_dateEnd` date DEFAULT NULL,
  `act_numStd` int(11) NOT NULL,
  `act_location` varchar(255) NOT NULL,
  `act_status` enum('เปิดลงทะเบียน','ปิดลงทะเบียน','สิ้นสุดลงแล้ว') DEFAULT 'เปิดลงทะเบียน',
  `act_createAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `act_transaction` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity`
--

INSERT INTO `activity` (`act_ID`, `t_ID`, `act_title`, `act_desc`, `act_dateStart`, `act_dateEnd`, `act_numStd`, `act_location`, `act_status`, `act_createAt`, `act_transaction`) VALUES
(3, 4, 'php 101', 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, obcaecati.', '2024-08-02', '2024-08-04', 10, 'c101', 'เปิดลงทะเบียน', '2024-08-30 12:41:38', NULL),
(9, 3, 'react 103', 'lorem', '2024-09-07', '2024-09-07', 11, 'c111', 'ปิดลงทะเบียน', '2024-09-01 13:07:41', NULL),
(12, 4, 'aaa', 'aaa', '2024-09-04', '2024-09-07', 12, 'aaaa', 'เปิดลงทะเบียน', '2024-09-01 16:09:54', NULL),
(13, 4, 'dfgh', 'erthfg', '2024-09-05', '2024-09-05', 4, 'efrdg', 'เปิดลงทะเบียน', '2024-09-01 17:02:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `a_ID` int(11) NOT NULL,
  `login_ID` int(11) DEFAULT NULL,
  `a_fname` varchar(50) NOT NULL,
  `a_lname` varchar(50) NOT NULL,
  `a_mobile` varchar(15) DEFAULT NULL,
  `a_email` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`a_ID`, `login_ID`, `a_fname`, `a_lname`, `a_mobile`, `a_email`) VALUES
(3, 10, 'admin', 'admin', NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `login_ID` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','student','teacher') NOT NULL,
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiration` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`login_ID`, `username`, `password`, `role`, `resetToken`, `resetTokenExpiration`) VALUES
(10, 'admin', '$2a$10$TVuCs0.6S1dYRkUrTAA1Te6XeQIQgctHuRs4B1rhg2atFFK5x1Nhm', 'admin', NULL, NULL),
(11, 'teacher', '$2a$10$YmCt8tabz9olQbhsBmfRHuPMb/6i8KnJblY/iagsF4t3M6J8XAFH.', 'teacher', NULL, NULL),
(12, '644230016', '$2a$10$TFcTr37xiKLL89ll.uVrjuhvyeQgoy5OrZanAQ7IX5qAICVH6O996', 'student', NULL, NULL),
(14, '644230046', '$2a$10$gZF1Conb6UJcwo2bpGVgjerHIn10Qp5SOrKmOMVU1vS1jG1.ZnZ/.', 'student', NULL, NULL),
(15, 'suksawat', '$2a$10$JIOrx8.DSpdbYtwN9fn0veDgeIPCjlfaMULl.HX98P4fig7PRsmLG', 'teacher', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `noti_ID` int(11) NOT NULL,
  `topic` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`noti_ID`, `topic`, `description`, `createdAt`) VALUES
(1, NULL, NULL, '2024-09-01 23:08:11'),
(2, 'fdsds', '644230046', '2024-09-01 23:09:25'),
(3, 'กิจกรรมใหม่ aaa', NULL, '2024-09-01 23:09:54'),
(4, 'กิจกรรมใหม่ dfgh', 'erthfg ระยะเวลา 2024-09-05T00:02 - 2024-09-05T00:02 สถานที่ ณ efrdg จำนวนที่เปิดรับ 4 คน', '2024-09-02 00:02:04'),
(5, 'กิจกรรมใหม่ news 101', 'uhjk ระยะเวลา 2024-09-05T00:11 - 2024-09-05T00:11 สถานที่ ณ fds จำนวนที่เปิดรับ 32 คน', '2024-09-02 00:11:53'),
(6, 'กิจกรรมใหม่ canva 101', 'hijlk ระยะเวลา 2024-09-05T10:12 - 2024-09-06T10:12 สถานที่ ณ hijk จำนวนที่เปิดรับ 11 คน', '2024-09-02 10:12:24');

-- --------------------------------------------------------

--
-- Table structure for table `notify`
--

CREATE TABLE `notify` (
  `noti_ID` int(11) NOT NULL,
  `login_ID` int(11) NOT NULL,
  `noti_status` enum('อ่านแล้ว','ยังไม่ได้อ่าน','','') NOT NULL DEFAULT 'อ่านแล้ว'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notify`
--

INSERT INTO `notify` (`noti_ID`, `login_ID`, `noti_status`) VALUES
(5, 10, 'อ่านแล้ว'),
(5, 11, 'อ่านแล้ว'),
(5, 12, 'อ่านแล้ว'),
(5, 14, 'อ่านแล้ว'),
(5, 15, 'อ่านแล้ว'),
(6, 10, 'อ่านแล้ว'),
(6, 11, 'อ่านแล้ว'),
(6, 12, 'อ่านแล้ว'),
(6, 14, 'อ่านแล้ว'),
(6, 15, 'อ่านแล้ว');

-- --------------------------------------------------------

--
-- Table structure for table `participate`
--

CREATE TABLE `participate` (
  `act_ID` int(11) NOT NULL,
  `std_ID` varchar(11) NOT NULL,
  `par_status` enum('ลงทะเบียน','เข้าร่วม','ลงทะเบียนแต่ไม่เข้าร่วม') NOT NULL DEFAULT 'ลงทะเบียน',
  `par_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `participate`
--

INSERT INTO `participate` (`act_ID`, `std_ID`, `par_status`, `par_date`) VALUES
(3, '644230016', 'ลงทะเบียน', '2024-09-02 03:46:56'),
(3, '644230046', 'ลงทะเบียน', '2024-09-02 03:49:21'),
(9, '644230046', 'ลงทะเบียน', '2024-09-02 03:52:43'),
(12, '644230046', 'ลงทะเบียน', '2024-09-02 04:09:24'),
(13, '644230046', 'ลงทะเบียน', '2024-09-02 04:34:32');

-- --------------------------------------------------------

--
-- Table structure for table `section`
--

CREATE TABLE `section` (
  `sec_ID` int(11) NOT NULL,
  `t_ID` int(11) DEFAULT NULL,
  `sec_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `section`
--

INSERT INTO `section` (`sec_ID`, `t_ID`, `sec_name`) VALUES
(3, 3, '64/38');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `std_ID` varchar(11) NOT NULL,
  `login_ID` int(11) DEFAULT NULL,
  `sec_ID` int(11) DEFAULT NULL,
  `std_fname` varchar(50) DEFAULT NULL,
  `std_lname` varchar(50) DEFAULT NULL,
  `std_mobile` varchar(15) DEFAULT NULL,
  `std_email` varchar(100) DEFAULT NULL,
  `std_address` varchar(255) DEFAULT NULL,
  `std_province` varchar(50) DEFAULT NULL,
  `std_district` varchar(50) DEFAULT NULL,
  `std_subdistrict` varchar(255) NOT NULL,
  `std_zipcode` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`std_ID`, `login_ID`, `sec_ID`, `std_fname`, `std_lname`, `std_mobile`, `std_email`, `std_address`, `std_province`, `std_district`, `std_subdistrict`, `std_zipcode`) VALUES
('644230016', 12, 3, 'karan', 'khanthong', NULL, NULL, NULL, NULL, NULL, '', NULL),
('644230046', 14, 3, 'น.ส.burin', 'chai', '123456', '644230016@webmail.npru.ac.th', 'yuhj', 'ชัยภูมิ', '', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `teacher`
--

CREATE TABLE `teacher` (
  `t_ID` int(11) NOT NULL,
  `login_ID` int(11) DEFAULT NULL,
  `t_fname` varchar(50) DEFAULT NULL,
  `t_lname` varchar(50) DEFAULT NULL,
  `t_mobile` varchar(15) DEFAULT NULL,
  `t_email` varchar(100) DEFAULT NULL,
  `t_address` varchar(255) NOT NULL,
  `t_district` varchar(50) DEFAULT NULL,
  `t_province` varchar(50) DEFAULT NULL,
  `t_subdistrict` varchar(255) NOT NULL,
  `t_zipcode` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teacher`
--

INSERT INTO `teacher` (`t_ID`, `login_ID`, `t_fname`, `t_lname`, `t_mobile`, `t_email`, `t_address`, `t_district`, `t_province`, `t_subdistrict`, `t_zipcode`) VALUES
(3, 11, 'teacher', 'teacher', NULL, NULL, '', NULL, NULL, '', NULL),
(4, 15, 'อ.suksawat', 'saelim', '123', 'suksawat@gmail.com', '', NULL, NULL, '', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity`
--
ALTER TABLE `activity`
  ADD PRIMARY KEY (`act_ID`),
  ADD KEY `t_ID` (`t_ID`);

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`a_ID`),
  ADD KEY `login_ID` (`login_ID`);

--
-- Indexes for table `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`login_ID`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`noti_ID`);

--
-- Indexes for table `notify`
--
ALTER TABLE `notify`
  ADD KEY `login_ID` (`login_ID`),
  ADD KEY `noti_ID` (`noti_ID`);

--
-- Indexes for table `participate`
--
ALTER TABLE `participate`
  ADD KEY `act_ID` (`act_ID`),
  ADD KEY `std_ID` (`std_ID`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`sec_ID`),
  ADD KEY `t_ID` (`t_ID`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`std_ID`),
  ADD KEY `login_ID` (`login_ID`),
  ADD KEY `sec_ID` (`sec_ID`);

--
-- Indexes for table `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`t_ID`),
  ADD KEY `login_ID` (`login_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity`
--
ALTER TABLE `activity`
  MODIFY `act_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `a_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `login_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `noti_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `sec_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `teacher`
--
ALTER TABLE `teacher`
  MODIFY `t_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity`
--
ALTER TABLE `activity`
  ADD CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`t_ID`) REFERENCES `teacher` (`t_ID`);

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`login_ID`) REFERENCES `login` (`login_ID`);

--
-- Constraints for table `notify`
--
ALTER TABLE `notify`
  ADD CONSTRAINT `notify_ibfk_1` FOREIGN KEY (`login_ID`) REFERENCES `login` (`login_ID`),
  ADD CONSTRAINT `notify_ibfk_2` FOREIGN KEY (`noti_ID`) REFERENCES `notification` (`noti_ID`);

--
-- Constraints for table `participate`
--
ALTER TABLE `participate`
  ADD CONSTRAINT `participate_ibfk_1` FOREIGN KEY (`act_ID`) REFERENCES `activity` (`act_ID`),
  ADD CONSTRAINT `participate_ibfk_2` FOREIGN KEY (`std_ID`) REFERENCES `student` (`std_ID`);

--
-- Constraints for table `section`
--
ALTER TABLE `section`
  ADD CONSTRAINT `section_ibfk_1` FOREIGN KEY (`t_ID`) REFERENCES `teacher` (`t_ID`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`login_ID`) REFERENCES `login` (`login_ID`),
  ADD CONSTRAINT `student_ibfk_2` FOREIGN KEY (`sec_ID`) REFERENCES `section` (`sec_ID`);

--
-- Constraints for table `teacher`
--
ALTER TABLE `teacher`
  ADD CONSTRAINT `teacher_ibfk_1` FOREIGN KEY (`login_ID`) REFERENCES `login` (`login_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
