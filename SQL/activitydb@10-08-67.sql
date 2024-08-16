-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 09, 2024 at 07:13 PM
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
(20, 'Hello Plant2', 'Water The Plant', '2024-08-09', '2024-08-09', 10, 2, 'Garden NPRU', '2', 2, '2024-08-07 03:21:14', ''),
(22, 'Microsoft Word', 'หนทางการเป็นโปร Microsoft Word', '2024-08-29', '2024-08-31', 20, 0, 'c304 ', '2', 1, '0000-00-00 00:00:00', ''),
(24, 'การอบรมการเขียนโปรแกรมเบื้องต้น', 'กิจกรรมนี้จัดขึ้นเพื่อสอนการเขียนโปรแกรมเบื้องต้นสำหรับผู้ที่สนใจ โดยจะมีการสอนพื้นฐานการเขียนโค้ดในภาษา Python รวมถึงการทำโปรเจกต์เล็ก ๆ เพื่อให้ผู้เข้าร่วมสามารถนำความรู้ไปใช้ได้จริง', '2024-08-10', '2024-08-10', 2, 2, 'c301', '2', 2, '2024-08-07 03:25:01', ''),
(25, 'ค่ายพัฒนาทักษะการสื่อสาร', 'กิจกรรมนี้จัดขึ้นเพื่อพัฒนาทักษะการสื่อสารและการนำเสนอ โดยมีวิทยากรผู้เชี่ยวชาญมาแบ่งปันเทคนิคและกลยุทธ์ในการสื่อสารอย่างมีประสิทธิภาพ ผู้เข้าร่วมจะได้ฝึกปฏิบัติและทำงานกลุ่มเพื่อเสริมสร้างความมั่นใจในการพูดต่อหน้าผู้อื่น', '2024-08-09', '2024-08-12', 3, 3, 'c401', '2', 2, '2024-08-07 07:24:26', '0xc619ed60287aa69cef0ea6d89f5e59bcd933d96bc004831b0a805794c3aa0a2d'),
(29, 'Looker 101', 'looker for everyone', '2024-08-13', '2024-08-13', 3, 1, 'c888', '2', 2, '2024-08-07 07:22:38', '0x353297ad33457ab78485eb1fe4328b6c2b4376209aff699462ad693a5b220232'),
(30, 'Codeigniter4 101', 'Road to Pro Codeigniter 4', '2024-08-09', '2024-08-11', 5, 3, 'c301', '88', 1, '2024-08-07 07:34:15', ''),
(32, 'Carbon Credit', 'animation 2d', '2024-08-10', '2024-08-11', 4, 4, 'c301', '88', 2, '2024-08-07 06:32:25', '0xf22c15e105807c465847e533a035cbcc48438cbf84454afc8fb62607fe9f1353'),
(33, 'Night Marker', 'ซ์้อขายแลกเปลี่ยนสินค้ามือสอง', '2024-08-09', '2024-08-11', 3, 3, 'npru', '2', 1, '2024-08-07 07:01:19', ''),
(34, 'test news 01 ', 'test  news 01', '2024-08-14', '2024-08-14', 5, 0, 'c333', '', 1, '0000-00-00 00:00:00', ''),
(35, 'test 02 ', 'test 02 ', '2024-08-10', '2024-08-16', 4, 0, 'c333', '', 1, '0000-00-00 00:00:00', ''),
(36, 'dfdg', 'fgdb', '2024-08-10', '2024-08-16', 456, 0, 'dgrhf', '', 1, '0000-00-00 00:00:00', ''),
(37, 'wdefg', 'fesgrd', '2024-08-15', '2024-08-16', 45, 0, 'rgfh', '', 1, '0000-00-00 00:00:00', ''),
(38, 'test news 01', 'test news 01', '2024-08-10', '2024-08-13', 4, 0, 'c333', '2', 1, '0000-00-00 00:00:00', ''),
(39, 'ืnews 1088', 'newes 1088', '2024-08-26', '2024-08-27', 4, 0, 'c999', '88', 1, '2024-08-09 16:30:42', ''),
(40, 'sfdg', 'ggfh', '2024-08-07', '2024-08-10', 1, 0, 'fg', '', 1, '0000-00-00 00:00:00', ''),
(41, 'test 04', 'test 04', '2024-08-17', '2024-08-23', 4, 0, 'test 04q', '', 1, '0000-00-00 00:00:00', ''),
(42, 'dsfb', 'fgh', '2024-08-09', '2024-08-10', 14, 0, 'fghj', '88', 1, '0000-00-00 00:00:00', '');

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
(51, '644230013', '$2b$10$a79jvMG7aF88BkZ00IoLtuSr8YZEo/.wQ1pGLPA4FhHOgpO84K6T2', 'student'),
(52, '644230007', '$2b$10$WKoW.JHwN4fjzaQFT1uH9eiazydwh7R6y9F4l2OI.n8Mfb8W6YeaG', 'student'),
(53, '644230009', '$2b$10$0ZvHB1.NUP5aT/a/ahYRPODYmkx0QXqqYh.qU4WF8XAx.WEoQzkQG', 'student'),
(54, '644230001', '$2b$10$IHC2XPzqg8Wq8KRLSTnQmOn73K.sUUVaW.xcLxL8VooKzOQbT2btu', 'student'),
(55, '644230011', '$2b$10$AbwlqWay5D6a/oRgTBvo6eQSmd4GIVbcuoTHYnBPwdjLRnaR/0ynm', 'student'),
(56, '644230021', '$2b$10$OrzT8ArBH16r76LTxhDy4eHrE1CLQ.4iTgvD9u9ewBk5BweNXo1kC', 'student'),
(57, '644230016', '$2b$10$V5nKXjuVvGzods9xYdDfTOz4n0zqQLwEk0hu1g499.49PfEzcYH9u', 'student'),
(58, '644230019', '$2b$10$AuWppx9eshDpBl8zrtfEGOxhe4FOucSRaHPMHxa7EL.jZ8EjC1B6a', 'student'),
(59, '644230025', '$2b$10$hs7x5GF1S2x7cVULTldmpOizShbapPA6bxAM5dZQemzw.jNJR7wE6', 'student'),
(60, '644230014', '$2b$10$VFbmEqORotemUNniISPBseG15amr6vc7cOde/NeZTc/ttz1ViHUby', 'student'),
(61, '644230006', '$2b$10$vW/phbFa4TOiHVuihe3HKOmcwyznXyOQIL6dVuiEYnSrH7CQXGK0a', 'student'),
(62, '644230028', '$2b$10$Q0EKa6d6y5qEZ4bXCM7n7OsvEdOleLjOcXIqf5spfbQTmDkm4PBTG', 'student'),
(63, '644230032', '$2b$10$eyT7RAcCcHhwGx4owBacJunOa7G9Kg6OrL2CxT87z/BOLOx3NW6kq', 'student'),
(64, '644230030', '$2b$10$rHeLlNolOAdseZEn5AK4I.xpT6uKEo872.uI4sHOt0B9ZBAarljI2', 'student'),
(65, '644230035', '$2b$10$6GRAFaM7iNZwxKY2RJk0O./XWIHEh5sxGmIJayStp5.M6nGa0LI6q', 'student'),
(66, '644230039', '$2b$10$Mrw6lxyhHkUy32.dMpBCI.xpUtU9PUKn/kk7dq2xFCP/AG0Qbtdaq', 'student'),
(67, '644230041', '$2b$10$0.Q5qkk0jdKggw5.Ndz8/O1pea2pc8bf/zOw.gXdrTJmHSNcgC/my', 'student'),
(68, '644230040', '$2b$10$V5LJcGCly6euyDDxdakCluv7I2kNivS3F3..ULfL1z7mjajYzhDHu', 'student'),
(69, '644230046', '$2b$10$mozfSvw.6PecP2wgxifCd.67VoX7rPhGRf.WAb2zd4K36gtmreZQq', 'student'),
(70, '644230056', '$2b$10$Y7ZaoBaSUvjePvzJUWuhie82Y6gpa/SseArVoFO2P8rYdhjxwL.se', 'student'),
(71, '644230059', '$2b$10$NcOAmjn7Uk1zmRZSRE8u1.REhDLHgnZEgFL1RYs8pVjEnOiqN.tLq', 'student'),
(72, '644230055', '$2b$10$AvxUGo3i9LAK0im7jbvZ8ekF/MFzIJkRtfyP9W1oPxdKfm2YWwhw2', 'student'),
(73, '644230057', '$2b$10$ywZNI7yr53T1RbGi6KnMferJWLQvxaBro9IZb2SR/Byth922mh8..', 'student'),
(74, '644230061', '$2b$10$IgL2TMPzyk.8f/cprhei0.IBsZXE3edGyJMJk.3YDdkPgvZUArQTa', 'student'),
(75, '644230002', '$2b$10$7EqXF3.N.qoECYqfEGJ8N.Ewol21f/DSe3tlhRoiQ7/tGYjpOAaFu', 'student'),
(76, '644230003', '$2b$10$H7LpGPQgjTwj23b.9nPIQuPM6YJG0TYpbr4hcObIPbciBPGpUsweO', 'student'),
(77, '644230004', '$2b$10$v3.7bGMOmWeLjs4MaH09yuggKDVF9pdW3lW7iSd2w2Ssm7NftaZ.y', 'student'),
(78, '644230012', '$2b$10$IGcALOBNpr4VMfUU8Pz9nOXk.ilixCzsKHX8bU4pgrM2AEL5m1582', 'student'),
(79, '644230023', '$2b$10$oQT92y6mfUgUkosRQuDqaOii/07fbgHeMAL4Rj8j1XMmtpQLhAC96', 'student'),
(80, '644230020', '$2b$10$kfUk2ULgBLukG1eA5SEtY.Llk2A9qoCwIgDfswfzn3pgxw5styOme', 'student'),
(81, '644230017', '$2b$10$uUnlLMU4.xloNJ8YJunSDOLJL/WRkZGNcGvhcVMnAITw4ubtKNuiC', 'student'),
(82, '644230024', '$2b$10$VutMlDBpq62eyG3XZPIBkeUbOjX3hJanKuyMfE0TmdrcPSobsChgK', 'student'),
(83, '644230034', '$2b$10$dnI3svSsE2XAuEw9S0ByNeBK8QMd/5v9csQya0kisBMje/ZyOmB46', 'student'),
(84, '644230027', '$2b$10$zknz9dWamXrLkOBZ6HEN/uxRm5ow8EnNGDh4jeBLLa1snWeEQmqLa', 'student'),
(85, '644230036', '$2b$10$rY9IFBR.ce3hZiZL9ETtGOhUmLhtB2RndNsB.Y6ro6RqZAR1kSc7q', 'student'),
(86, '644230042', '$2b$10$Mc3yRF.F8whIutKXlx67P.Y2XUDYVyTx.bJ/517eOkJCmn/T87cwS', 'student'),
(87, '644230048', '$2b$10$gv1rEJOEV/4U0wErBp3fK.G7xCWFhdam2qh4DgJlQFXgoySsTJs4e', 'student'),
(88, 'teacher2', '$2b$10$9F.Q86xY92xkdf1RDZr5Z.Twpc29ZFdc7tvNBNjmzyyrv1elLqY0W', 'teacher'),
(89, '644230009', '$2b$10$Is6vdl5Xqoae62oMM03tjeoBFkBqQJ56STIfCW4QaeM.GzGNf3ubG', 'student'),
(90, '644230013', '$2b$10$4QZLtoYQlhawUQgkQaAYXODZL/.cyKwxI/3PqymLg15zjAtOpyjSq', 'student'),
(91, '644230007', '$2b$10$53ZxCg7hxm499gXWAwz9AeWXiISZYR3kpTXWjPqOD7ag9IEGDxnL.', 'student'),
(92, '644230011', '$2b$10$g6maAC7ZmFy5djGnecEvH.wJvBYtzWUTYeMo6oshTNTgBVOY60Ve2', 'student'),
(93, '644230001', '$2b$10$Vc4NEdL4WaQGxRy47eTE/uprbvUXx4FoyXnlYSKnAb1j6f2XOSuvu', 'student'),
(94, '644230016', '$2b$10$TGXUoPYyReOyRIpAzUmj7eQwyWhwbykuW.SnPjpenxmE0Loyh7MSu', 'student'),
(95, '644230006', '$2b$10$RnuWmWX5YywjSLwWXvzU1.Kl/z/89tIOVeOgfWsdlSvnyiEi2IMj.', 'student'),
(96, '644230014', '$2b$10$dtkac.BrBiTjfnzIFhUg3.RtlfCoWyN476W5Bbrl.YTNL8WP2nzuK', 'student'),
(97, '644230021', '$2b$10$SrslqnHv2PjuLcOuEfm0jeHOB/kOxk8w4zKgeqw9UqRv3ygaacgv6', 'student'),
(98, '644230019', '$2b$10$mylPYCrLsQkBej7e69V70u61vs5FDt9SIfcdJCZFULxw7EQDKrcSm', 'student'),
(99, '644230028', '$2b$10$0n5BUDsrJA9dp4rwfIErAegBamfaaHhDSgxjmrAgGXZlL0fOrPbwW', 'student'),
(100, '644230025', '$2b$10$pIGSgD6ezmRq2Qp2aJm2RO0Tu1PNXI/hMcJ0DuGE918C3bjgpvEhK', 'student'),
(101, '644230030', '$2b$10$hCwjKv0Ke1kt5u7uzdbmT.Aokqo1pt6qfKG/RseFes8WSOQ9RQ8/G', 'student'),
(102, '644230035', '$2b$10$LV3m6pDH4DG0GOludlmGKuK.SV6Jwur7CQw/tPBu2A7De2N7uv7Wy', 'student'),
(103, '644230032', '$2b$10$oEi2JEbXRn.eaSJkzdOy5ODqB.9isP4FffpTd8N7bTMEyF962yov2', 'student'),
(104, '644230039', '$2b$10$MAnA4.BqheWJDihpblERa.lLuLiR5WsDA7o8DZ2ULR0KdgTuvjz8q', 'student'),
(105, '644230040', '$2b$10$hc6xho1qoR/velnZK4iZFeNb4F6hm73EjrRMLD/jzyQxT6WNSt0A6', 'student'),
(106, '644230041', '$2b$10$kZY5aElKovsEhJafC1v.MuWkOiIcaR9H4O1STP4zokvfZo0UEDBNG', 'student'),
(107, '644230046', '$2b$10$Hp0oWmz/1.AUx9Vf5hSp5.DTLLzSDENSLz7AXsUYKe1mbjXyX2182', 'student'),
(108, '644230055', '$2b$10$i1HHZ/PxBm5jbf1vpNz40uwgYBTF/RvIw0Iyw253iHk9/oVI6G0wm', 'student'),
(109, '644230056', '$2b$10$zlYCluk1TExgbOavZ28oH.heuY7pQVesXLDoJKTUe.J7L3hU0TIKC', 'student'),
(110, '644230059', '$2b$10$r1HMnm28K2jpeVmtOp2c8ezNM9yVwYp4311.cddYrZunNGhq6g4he', 'student'),
(111, '644230061', '$2b$10$MHDF2btILNzbZfhjZL2qO.usF6ZI2eMe8AEPJe833e3o/ZaJvYxma', 'student'),
(112, '644230002', '$2b$10$G4Y5WJpP2Bu4ixHVOySaNuScI/er1AKw/jE69f6b8GTAy8ROsg6lW', 'student'),
(113, '644230057', '$2b$10$eqrRb.EnjgrD2rjPIehaneRpfu08UW7upqiEwMf2vquO0i8i5oqlK', 'student'),
(114, '644230004', '$2b$10$cyG/6txp0l9Braxa4Az1nOlRgVKzJ4nzS4g8AqWyN7hWSNUd3hgca', 'student'),
(115, '644230003', '$2b$10$HvIyt0BjSSU0iIEphqtDZOlse3FyyInxVN/TDXDJfqL6AGmFs3uM.', 'student'),
(116, '644230012', '$2b$10$HFBZIjJozzGdmdnfSxlo3uvzIxcXDrBsvMFR9ENDyACj9BWJPb/Km', 'student'),
(117, '644230017', '$2b$10$M7qXd/Uxc/mexgHiwFR2COP5z4Ywh4V.2eAwxx7JZOC6Oj.ny8tf2', 'student'),
(118, '644230020', '$2b$10$4gsGAxs9Otp1LnEbVKXfuemY7OpNej20qrzXqw/P8EwAaTlamlxQW', 'student'),
(119, '644230023', '$2b$10$cvXB.7mxQACmywtYTcVrnu5ti70K97z7Jno9GmXDEFBUy4QQ6hxOK', 'student'),
(120, '644230024', '$2b$10$luQgPlPmVqjhN3d2x.B1EuXR4mmClCNcgVmTAiPZ7rfK46UlAbpC2', 'student'),
(121, '644230027', '$2b$10$5adFfmHwiI4/Ec18PubZ8O41lk3TqbnMaeQ3QdG5PDsCy0paf6eQ2', 'student'),
(122, '644230034', '$2b$10$eo9/lUykErRLlqgnDCzF8eVZvNLNmA5bFXwFd6xnZyBDjV3os6Lwa', 'student'),
(123, '644230036', '$2b$10$VePDRmXwXSGKyaI6CPJZ5.OMKikacJsbTWq7C1HbtcM9xTpfohqPy', 'student'),
(124, '644230042', '$2b$10$NAZF9Tr9UovU7OmrCk18/.nElaUqGInaAH2fLZXr5yYE0icOVRztC', 'student'),
(125, '644230048', '$2b$10$fR8HRXHUC9IczKhLESb/g.dzK3K4wtmeAxxXqXpvFuL46PXTGi3t.', 'student'),
(126, '644230099', '$2b$10$TGeIQduuc7gKDLQZGqnDdekS9x3.AyBqISHDpMujPlTyuszeqBCxO', 'student'),
(127, '644230097', '$2b$10$6e4KlpKsS3R5RlBtI5.0wumenQDDZM1otjzcMeVcEvyogphuNl/pm', 'student'),
(128, '644230098', '$2b$10$TtpLJ9reAi5v3WVyzY8DiugRs/hGlN2YwaL.RU7bczRwOXqnqsG0G', 'teacher');

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
(1, '644230016', '25'),
(1, '644230046', '25'),
(1, '644230011', '25'),
(1, '644230011', '20'),
(1, '644230023', '20'),
(1, '644230023', '24'),
(1, '644230061', '24'),
(1, '644230006', '26'),
(1, '644230019', '26'),
(1, '644230001', '26'),
(1, '644230001', '27'),
(1, '644230024', '28'),
(1, '644230056', '29'),
(1, '644230061', '31'),
(1, '644230009', '30'),
(1, '644230016', '31'),
(1, '644230046', '31'),
(1, '644230009', '31'),
(1, '644230035', '32'),
(1, '644230055', '32'),
(1, '644230007', '32'),
(1, '644230011', '32'),
(1, '644230011', '33'),
(1, '644230046', '33'),
(1, '644230011', '30'),
(1, '644230061', '33'),
(1, '644230046', '30');

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
(15, 'all', 'แจ้งข่าวการลบกิจกรรม 11 ', 'จึงเรียนมาเพื่อทราบ', '2024-08-09 17:11:53', '11', 1);

-- --------------------------------------------------------

--
-- Table structure for table `notify`
--

CREATE TABLE `notify` (
  `news_ID` int(5) NOT NULL,
  `notify_status` text NOT NULL,
  `user_ID` int(9) NOT NULL
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
('644230001', 'นายกรกฎา', 'เปรมกิจ', 1, '644230001@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230002', 'นส.กรกนก', 'โคฮุด', 2, '644230002@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230003', 'นายกลวิชร', 'ถาวร', 2, '644230003@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230004', 'นส.เกวลิน', 'อินทฤทธิ์', 2, '644230004@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230006', 'นายจรัสย์', 'สืบบูรพากุล', 1, '644230006@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230007', 'น.ส.ชุติวัต', 'ขำสาคร', 1, '644230007@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230009', 'นายณภัทร', 'ลอนุ', 1, '644230009@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230011', 'นายณัฐพงษ์', 'สร้อยสน', 1, '644230011@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230012', 'นายธนดล', 'จันทร์ทอง', 2, '644230012@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230013', 'นางธนธรณ์', 'เหนี่ยวองอาจ', 1, '644230013@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230014', 'นายธนาธิป', 'ก๊วยประเสริฐ', 1, '644230014@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230016', 'นายกรัณฑ์', 'ขันทอง', 1, '644230016@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230017', 'นายนรุตม์', 'แก้วพิจิตร', 2, '644230017@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230019', 'นายจิรสิน', 'เกิดจงรักษ์', 1, '644230019@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230020', 'นส.พรพรรณ', 'บุญก่อสร้าง', 2, '644230020@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230021', 'นส.ชนากานต์', 'ป่าสลุง', 1, '644230021@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230023', 'นายฐิรวิชญ์', 'ทองคำ', 2, '644230023@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230024', 'นายวรชิต', 'จุ้ยสามพราน', 2, '644230024@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230025', 'นายวิชญ์', 'เต็มบริบูรณ์', 1, '644230025@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230027', 'นายศินุเดช', 'แก้ววิลัย', 2, '644230027@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230028', 'นายณรงค์ศักดิ์', 'ปานเกิดผล', 1, '644230028@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230030', 'นายสมกานต์', 'ปัญญาโรจน์', 1, '644230030@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230032', 'นายสหรัฐ', 'พลสันต์', 1, '644230032@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230034', 'นายสาร์ทจีน', 'บูรณะสุวรรณ', 2, '644230034@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230035', 'นายสุเมธ', 'อำพรศักดิ์', 1, '644230035@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230036', 'นายอติเทพ', 'โกมุทฉาย', 2, '644230036@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230039', 'นส.ธิดารัตน์', 'ทองสินธุ์', 1, '644230039@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230040', 'นายสุชาครีย์', 'อัครเศรณี', 1, '644230040@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230041', 'นายธีรภัทร', 'พัดบาง', 1, '644230041@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230042', 'นายธีรภัทร', 'สถิตเสถียรวงศ์', 2, '644230042@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230046', 'นายบุรินทร์ชัย', 'สุขอ่อน', 1, '644230046@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230048', 'นายพงศภัค', 'พลอยมะกล่ำ', 2, '644230048@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230055', 'นายวิชัย', 'ทองเปราะ', 1, '644230055@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230056', 'นายสหรัฐ', 'วงษ์จันทร์', 1, '644230056@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230057', 'นายณัฐวัฒน์', 'หิรัญวงษ์', 1, '644230057@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230059', 'นายภิญโญ', 'สบาย', 1, '644230059@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230061', 'นายพันธ์วริศ', 'สุริวัลย์', 1, '644230061@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230097', 'แดง', 'ดำ', 2, '644230097@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL),
('644230099', 'นายเวฟ', 'zaza', 1, '644230099@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL);

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
(2, 'ดร.สุขสวัสดิ์', 'แซ่ลิ่ม', 'suksawat@webmail.npru.ac.th', '0000000000', 'บ้านเลขที่ 38/39 หมู่ 64', 'นครปฐม', 'เมืองนครปฐม', 'วังตะกู', '73000', 1),
(88, 'อ.พิชยา', 'สุขปลั่ง', 'teacher2@webmail.npru.ac.th', '', NULL, NULL, NULL, NULL, NULL, 2),
(128, 'เคน', 'เทพza007', '644230098@webmail.npru.ac.th', NULL, NULL, NULL, NULL, NULL, NULL, 1);

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
-- Indexes for table `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`news_ID`);

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
  MODIFY `act_ID` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `login`
--
ALTER TABLE `login`
  MODIFY `login_ID` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=129;

--
-- AUTO_INCREMENT for table `news`
--
ALTER TABLE `news`
  MODIFY `news_ID` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `section`
--
ALTER TABLE `section`
  MODIFY `sec_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
