-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 21, 2024 at 01:17 PM
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
  `act_dateStart` datetime NOT NULL,
  `act_dateEnd` datetime NOT NULL,
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
(1, 'New', 'adwawd', '2024-08-28 00:00:00', '2024-08-29 00:00:00', 50, 1, 'awdwdwa', '1', 1, '2024-08-21 11:12:21', '');

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
(1, 'admin', 'admin', 'admin@webmail.npru.ac.th', '1234567890');

-- --------------------------------------------------------

--
-- Table structure for table `login`
--

CREATE TABLE `login` (
  `login_ID` int(9) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(10) NOT NULL,
  `resetToken` varchar(300) NOT NULL,
  `resetTokenExpiration` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `login`
--

INSERT INTO `login` (`login_ID`, `username`, `password`, `role`, `resetToken`, `resetTokenExpiration`) VALUES
(1, 'admin', '$2b$10$qKHgpeY9A6XaGTcLeP9aUuYcK94WouJ2qbW9zUO8MzmxIWI1yawPm', 'admin', '', ''),
(2, 'teacher', '$2b$10$yRzW/WPYKJQ67yLq/xOIue0AgmOUzwA4E0rMmLhj61ZwbzH.qsI92', 'teacher', '', ''),
(88, 'teacher2', '$2b$10$9F.Q86xY92xkdf1RDZr5Z.Twpc29ZFdc7tvNBNjmzyyrv1elLqY0W', 'teacher', '', ''),
(136, '644230006', '$2b$10$fW68Er1Ahwx.M68iKe2e2.yLtVAtvHN6/ct8MKE6KcAOrmiCoFTvm', 'student', '', ''),
(137, '644230007', '$2b$10$67td9OBDVMKYcmiPtmvjuuzMgl2pOhhjEeek96znFmYyKyqXaS8q6', 'student', '', ''),
(138, '644230011', '$2b$10$Z6lG7f6pUIHmF4WJNFY7TOxDDT8e3fJn86moZiE5E5FxdY9dcX2DS', 'student', '', ''),
(139, '644230001', '$2b$10$RdSvzdhqztnaWEIAnKILwe1Gf9eKh5pTKVidbYFsBkBH7/sKdPbxa', 'student', '', ''),
(140, '644230013', '$2b$10$/gF/Na8OIN701W71ckw0p.Qc7WtBdupAjGUFpLitGJyYDrTdjT/R6', 'student', '', ''),
(141, '644230014', '$2b$10$z/TkVTLMcaKlOYxFqUMhjebl85z7.hsE7vY55RXMHZL8hXGt6OjhC', 'student', '', ''),
(142, '644230009', '$2b$10$aqGB73WNveQEFCcsJHlHqeMvyxSG8SD0p7m5J5dM6Xf7DZvp8V5Pq', 'student', '', ''),
(143, '644230016', '$2b$10$p724CITTq2h2LiaUQMcuNOSnKb1HCsZMrp9rPs8o1cPNJp6wx4c7q', 'student', '', ''),
(144, '644230019', '$2b$10$4MaGDsLLOw5ulMS8B1cVrusVFTPYv3sVLD3FuuzQZkfxuUjgIIbG.', 'student', '', ''),
(145, '644230021', '$2b$10$hfnw7sYqAbyfbzQEOVJexOxP4Yfl8vzgps3Aw//D0bG7I8wZnQCpW', 'student', '', ''),
(146, '644230025', '$2b$10$RcTChbLl4bqwLviwj5jyQeb9kDbVyrpBj1rw/A0w74UUZn96atJDm', 'student', '', ''),
(147, '644230028', '$2b$10$1AEaWYRhP7BMGHdPMrqKQeEGmXKzD00sA1jPF0ymLfgWz7PAijznW', 'student', '', ''),
(148, '644230030', '$2b$10$wVGYN53n5CYwO4WlyMHUoOjf2NwyFKABOgj/d25QgMFkUHtOH8vse', 'student', '', ''),
(149, '644230032', '$2b$10$Y40iypkzFoFz/oEztnsqb.gaCOzDQWUtZF6czijbnunoJyNdvAKmC', 'student', '', ''),
(150, '644230035', '$2b$10$QkCMZMhnt9NNvkufV97gW.W.ZSAzEr9AvrMpfSToHaAJqdgfHyxPG', 'student', '', ''),
(151, '644230039', '$2b$10$sRnEdq4ExF.8f2lMPK3TV.Q/Z.LdDU3B8Lv7qJg97gl9jgFI0T9we', 'student', '', ''),
(152, '644230040', '$2b$10$lDN6aNTPObriPjk6aoXh0OnlBb7RE8n/LqSzJV2EELGBk4raJaZSK', 'student', '', ''),
(153, '644230041', '$2b$10$cx.k6zBaSKcNZ.rZF6HNKeFJV3P7LqDK1UIb7CuGcrMsASrSmykoq', 'student', '', ''),
(154, '644230055', '$2b$10$W2bHZ3uJIjVaT7mu/hF.ZuBHUmoi4jZIL02L6PWO/kiMBikYib6LC', 'student', '', ''),
(155, '644230046', '$2b$10$H9gWTCW008LINXkeqJTbr.KtMxkHR/WeYx9r7l6H0gGYDXRTHBrra', 'student', '', ''),
(156, '644230057', '$2b$10$v291PsNyGf8Vxk6ypZCow.a0zWLGxE04t0i7cDAGp1cEDlbmwpxey', 'student', '', ''),
(157, '644230056', '$2b$10$D2mhU3nV9/o/lad9Uv8cpuUZ80jLsJOqDHscozhN/OIzoRiqBeita', 'student', '', ''),
(158, '644230059', '$2b$10$L6WtFUoEbq4CFZEL7ThxG.oNPiHWzKP4A86OapKB2VyoQcH8uYUoW', 'student', '', ''),
(159, '644230061', '$2b$10$laRduY6nTs5KYUsKc8wxO.q4BUZxctWlwi8Zsj8dgWWMvhp0erofy', 'student', '', ''),
(160, '644230002', '$2b$10$kqkvQT3imPmgGxH/sKJz3.CrFqZ2osDh/hqJag/Jqju3JTfW1W1xi', 'student', '', ''),
(161, '644230003', '$2b$10$0aqpPUMZjkqQK4LLlLiw9eX/qz7YzVJVtxBYykgxYov4B5qKmFxYy', 'student', '', ''),
(162, '644230004', '$2b$10$D.MHWEpQlSU109LNysI91OYe8B2DYtV1lYPEa3PIFZLk.CNkXFi3O', 'student', '', ''),
(163, '644230012', '$2b$10$fFPGb2BIvYJ.QORUmCljzOEj8/lSeWqP7wy.6rVU1.BbwH93m473.', 'student', '', ''),
(164, '644230017', '$2b$10$/cOACPe3.X77wuIjpu2hH.zbpNzbK9wCjcT697prKs840Isg7AGh.', 'student', '', ''),
(165, '644230020', '$2b$10$GpB8B/Av.tmXyghClz8AMucgsZKYtpqWrLrgMXChpe97oxxA045t.', 'student', '', ''),
(166, '644230023', '$2b$10$Zk5r/uji0vu/NIEfyObabe3pCLifvnCLI9ng2YhkIu4yVGrX5qyli', 'student', '', ''),
(167, '644230024', '$2b$10$g.KZzDN.VB9YvviHcpG7JePsV/LLuljXRQ5mtfm0fO.LwgzgfXL1C', 'student', '', ''),
(168, '644230027', '$2b$10$27K0jsa5Mu4kPA0A/Jcoa.4gQotwk.2URkxY/yigfSlbqI2RiEE.2', 'student', '', ''),
(169, '644230036', '$2b$10$YklUU59iNDyUD/Cq9gCcIOEoDnkWEMrpcgrW0AqmmoyMdNOBsnyBa', 'student', '', ''),
(170, '644230042', '$2b$10$AJrbHosIFLhMi09ocAOP6.b2NnNALBBvrBSnJfTiHLmpPKjlKhd0G', 'student', '', ''),
(171, '644230034', '$2b$10$6vbMz84eoLZ/ABpagnRQRuGfzPGSjcYLXzUrppXgPNrPumlAAA7sq', 'student', '', ''),
(172, '644230048', '$2b$10$jY/JqVR7Rh7lKgeUvsCuvOm92NCLqq09P8zB7/CwNNdyzU44KRVhe', 'student', '', '');

-- --------------------------------------------------------

--
-- Table structure for table `manage`
--

CREATE TABLE `manage` (
  `man_status` tinyint(1) NOT NULL,
  `std_ID` varchar(9) NOT NULL,
  `act_ID` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `manage`
--

INSERT INTO `manage` (`man_status`, `std_ID`, `act_ID`) VALUES
(1, '644230046', 1);

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `news_ID` int(5) NOT NULL,
  `news_type` text NOT NULL,
  `news_topic` text NOT NULL,
  `news_desc` text NOT NULL,
  `news_date` datetime NOT NULL,
  `act_title` varchar(255) NOT NULL,
  `news_create` int(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`news_ID`, `news_type`, `news_topic`, `news_desc`, `news_date`, `act_title`, `news_create`) VALUES
(8, '644230016', 'กิจกรรมใหม่ test new 02 ', 'desc test news 02  ระยะเวลา 2024-08-30T01:03 - 2024-08-31T01:03 สถานที่ ณ c999 จำนวนที่เปิดรับ 4 คน', '2024-08-08 18:03:38', '0', 1),
(9, '644230046', 'กิจกรรมใหม่ sfdg', 'ggfh ระยะเวลา 2024-08-07T08:19 - 2024-08-10T08:19 สถานที่ ณ fg จำนวนที่เปิดรับ 1 คน', '2024-08-09 01:20:15', '', 1),
(11, 'all', 'กิจกรรมใหม่ dsfb', 'fgh ระยะเวลา 2024-08-09T19:04 - 2024-08-10T19:04 สถานที่ ณ fghj จำนวนที่เปิดรับ 14 คน', '2024-08-09 12:04:59', '', 1),
(12, 'all', 'แจ้งข่าวการลบกิจกรรม 4 ', 'จึงเรียนมาเพื่อทราบ', '2024-08-09 17:08:57', '4', 1),
(14, 'all', 'แจ้งข่าวการลบกิจกรรม 222 ', 'จึงเรียนมาเพื่อทราบ', '2024-08-09 17:10:31', '222', 1),
(15, 'all', 'แจ้งข่าวการลบกิจกรรม 11 ', 'จึงเรียนมาเพื่อทราบ', '2024-08-09 17:11:53', '11', 1),
(16, '', 'ลงทะเบียนสำเร็จ', 'ลงทะเบียนเข้าร่วมกิจกรรม Microsoft Word', '2024-08-16 16:18:01', '', 0),
(17, '', 'ยกการลงทะเบียน', 'ยกการลงทะเบียนกิจกรรม Microsoft Word', '2024-08-16 16:19:52', '', 0),
(18, '', 'ลงทะเบียนสำเร็จ', 'ลงทะเบียนเข้าร่วมกิจกรรม Microsoft Word', '2024-08-16 16:21:02', '', 0),
(19, '', 'ยกการลงทะเบียน', 'ยกการลงทะเบียนกิจกรรม Microsoft Word', '2024-08-16 16:22:25', '', 0),
(20, '', 'ลงทะเบียนสำเร็จ', 'ลงทะเบียนเข้าร่วมกิจกรรม Microsoft Word', '2024-08-16 16:48:16', '', 0),
(21, '', 'ยกการลงทะเบียน', 'ยกการลงทะเบียนกิจกรรม Microsoft Word', '2024-08-16 16:49:25', '', 0),
(22, '', 'กิจกรรม ืnews 1088', 'แก้ไขรายละเอียดกิจกรรม  ืnews 1088', '2024-08-21 03:22:13', '', 0),
(23, '', 'กิจกรรม ืnews 1088', 'แก้ไขรายละเอียดกิจกรรม  ืnews 1088', '2024-08-21 03:22:37', '', 0),
(24, '', 'กิจกรรม ืnews 1088', 'แก้ไขรายละเอียดกิจกรรม  ืnews 1088', '2024-08-21 03:23:02', '', 0),
(25, '', 'กิจกรรมใหม่ Today', 'Todo ระยะเวลา 2024-08-28T10:30 - 2024-08-29T10:35 สถานที่ ณ C505 จำนวนที่เปิดรับ 50 คน', '2024-08-21 03:35:09', '', 0),
(26, '', 'กิจกรรม Today', 'แก้ไขรายละเอียดกิจกรรม  Today', '2024-08-21 03:40:25', '', 0),
(27, '', 'กิจกรรม Today', 'แก้ไขรายละเอียดกิจกรรม  Today', '2024-08-21 03:40:39', '', 0),
(28, '', 'ลงทะเบียนสำเร็จ', 'ลงทะเบียนเข้าร่วมกิจกรรม Microsoft Word', '2024-08-21 06:34:09', '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `notify`
--

CREATE TABLE `notify` (
  `news_ID` int(5) NOT NULL,
  `notify_status` text NOT NULL,
  `login_ID` int(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(2, '64/39'),
(3, '67/44'),
(4, '65/41'),
(5, '66/50'),
(6, '65/40'),
(7, '67/88'),
(8, '69/58');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `login_ID` int(9) NOT NULL,
  `std_ID` varchar(9) NOT NULL,
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

INSERT INTO `student` (`login_ID`, `std_ID`, `std_fname`, `std_lname`, `sec_ID`, `std_email`, `std_mobile`, `std_address`, `province`, `district`, `subdistrict`, `zipcode`) VALUES
(139, '644230001', 'นายกรกฎา', 'เปรมกิจ', 1, '644230001@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(160, '644230002', 'น.ส.กรกนก', 'โคฮุด', 2, '644230002@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(161, '644230003', 'นายกลวิชร', 'ถาวร', 2, '644230003@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(162, '644230004', 'น.ส.เกวลิน', 'อินทฤทธิ์', 2, '644230004@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(136, '644230006', 'นายจรัสย์', 'สืบบูรพากุล', 1, '644230006@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(137, '644230007', 'นายชุติวัต', 'ขำสาคร', 1, '644230007@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(142, '644230009', 'นายณภัทร', 'ลอนุ', 1, '644230009@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(138, '644230011', 'นายณัฐพงษ์', 'สร้อยสน', 1, '644230011@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(163, '644230012', 'นายธนดล', 'จันทร์ทอง', 2, '644230012@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(140, '644230013', 'นายธนธรณ์', 'เหนี่ยวองอาจ', 1, '644230013@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(141, '644230014', 'นายธนาธิป', 'ก๊วยประเสริฐ', 1, '644230014@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(143, '644230016', 'นายกรัณฑ์', 'ขันทอง', 1, '644230016@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(164, '644230017', 'นายนรุตม์', 'แก้วพิจิตร', 2, '644230017@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(144, '644230019', 'นายจิรสิน', 'เกิดจงรักษ์', 1, '644230019@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(165, '644230020', 'น.ส.พรพรรณ', 'บุญก่อสร้าง', 2, '644230020@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(145, '644230021', 'น.ส.ชนากานต์', 'ป่าสลุง', 1, '644230021@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(166, '644230023', 'นายฐิรวิชญ์', 'ทองคำ', 2, '644230023@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(167, '644230024', 'นายวรชิต', 'จุ้ยสามพราน', 2, '644230024@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(146, '644230025', 'นายวิชญ์', 'เต็มบริบูรณ์', 1, '644230025@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(168, '644230027', 'นายศินุเดช', 'แก้ววิลัย', 2, '644230027@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(147, '644230028', 'นายณรงค์ศักดิ์', 'ปานเกิดผล', 1, '644230028@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(148, '644230030', 'นายสมกานต์', 'ปัญญาโรจน์', 1, '644230030@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(149, '644230032', 'นายสหรัฐ', 'พลสันต์', 1, '644230032@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(171, '644230034', 'นายสาร์ทจีน', 'บูรณะสุวรรณ', 2, '644230034@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(150, '644230035', 'นายสุเมธ', 'อำพรศักดิ์', 1, '644230035@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(169, '644230036', 'นายอติเทพ', 'โกมุทฉาย', 2, '644230036@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(151, '644230039', 'น.ส.ธิดารัตน์', 'ทองสินธุ์', 1, '644230039@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(152, '644230040', 'นายสุชาครีย์', 'อัครเศรณี', 1, '644230040@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(153, '644230041', 'นายธีรภัทร', 'พัดบาง', 1, '644230041@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(170, '644230042', 'นายธีรภัทร', 'สถิตเสถียรวงศ์', 2, '644230042@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(155, '644230046', 'นายบุรินทร์ชัย', 'สุขอ่อน', 1, '644230046@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(172, '644230048', 'นายพงศภัค', 'พลอยมะกล่ำ', 2, '644230048@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(154, '644230055', 'นายวิชัย', 'ทองเปราะ', 1, '644230055@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(157, '644230056', 'นายสหรัฐ', 'วงษ์จันทร์', 1, '644230056@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(156, '644230057', 'นายณัฐวัฒน์', 'หิรัญวงษ์', 1, '644230057@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(158, '644230059', 'นายภิญโญ', 'สบาย', 1, '644230059@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
(159, '644230061', 'นายพันธ์วริศ', 'สุริวัลย์', 1, '644230061@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL);

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
(88, 'อ.พิชยา', 'สุขปลั่ง', 'teacher2@webmail.npru.ac.th', '', NULL, NULL, NULL, NULL, NULL, 2);

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
-- Indexes for table `manage`
--
ALTER TABLE `manage`
  ADD KEY `std_ID` (`std_ID`),
  ADD KEY `act_ID` (`act_ID`);

--
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`news_ID`);

--
-- Indexes for table `notify`
--
ALTER TABLE `notify`
  ADD KEY `news_ID` (`news_ID`),
  ADD KEY `login_ID` (`login_ID`);

--
-- Indexes for table `section`
--
ALTER TABLE `section`
  ADD PRIMARY KEY (`sec_ID`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`std_ID`),
  ADD KEY `login_ID` (`login_ID`);

--
-- Indexes for table `teacher`
--
ALTER TABLE `teacher`
  ADD PRIMARY KEY (`login_ID`),
  ADD KEY `sec_ID` (`sec_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity`
--
ALTER TABLE `activity`
  MODIFY `act_ID` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `login_ID` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=173;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `news_ID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `sec_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`login_ID`) REFERENCES `login` (`login_ID`);

--
-- Constraints for table `manage`
--
ALTER TABLE `manage`
  ADD CONSTRAINT `manage_ibfk_1` FOREIGN KEY (`std_ID`) REFERENCES `student` (`std_ID`),
  ADD CONSTRAINT `manage_ibfk_2` FOREIGN KEY (`act_ID`) REFERENCES `activity` (`act_ID`);

--
-- Constraints for table `notify`
--
ALTER TABLE `notify`
  ADD CONSTRAINT `notify_ibfk_1` FOREIGN KEY (`news_ID`) REFERENCES `news` (`news_ID`),
  ADD CONSTRAINT `notify_ibfk_2` FOREIGN KEY (`login_ID`) REFERENCES `login` (`login_ID`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`sec_ID`) REFERENCES `section` (`sec_ID`);

--
-- Constraints for table `teacher`
--
ALTER TABLE `teacher`
  ADD CONSTRAINT `teacher_ibfk_1` FOREIGN KEY (`sec_ID`) REFERENCES `section` (`sec_ID`),
  ADD CONSTRAINT `teacher_ibfk_2` FOREIGN KEY (`login_ID`) REFERENCES `login` (`login_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
