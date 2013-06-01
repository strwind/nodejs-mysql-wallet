-- phpMyAdmin SQL Dump
-- version 3.5.1
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2013 年 06 月 01 日 08:41
-- 服务器版本: 5.5.24-log
-- PHP 版本: 5.3.13

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `wallet`
--

-- --------------------------------------------------------

--
-- 表的结构 `finance`
--

CREATE TABLE IF NOT EXISTS `finance` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `consume` float NOT NULL,
  `remain` float NOT NULL,
  `time` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `finance`
--

INSERT INTO `finance` (`id`, `name`, `username`, `consume`, `remain`, `time`) VALUES
(1, '毛权', 'maoquan', -65, 590, '1370076020913'),
(2, '周莲洁', 'zhoulianjie', -65, 735, '1370076020913'),
(3, '李思瑾', 'lisijin', -65, -10, '1370076020913'),
(4, '姚飞飞', 'yaofeifei', -65, 130, '1370076020913');

-- --------------------------------------------------------

--
-- 表的结构 `lisijin`
--

CREATE TABLE IF NOT EXISTS `lisijin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `consume` float NOT NULL,
  `remain` float NOT NULL,
  `time` varchar(200) NOT NULL,
  `remark` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=38 ;

--
-- 转存表中的数据 `lisijin`
--

INSERT INTO `lisijin` (`id`, `consume`, `remain`, `time`, `remark`) VALUES
(18, -5, 48, '1369982851712', '扣款'),
(19, -25, 75, '1369985947290', '扣款'),
(20, -5, 270, '1369987078288', '扣款'),
(21, -25, 245, '1369987972706', '扣款'),
(22, -25, 220, '1369987981329', '扣款'),
(23, -25, 195, '1369988604040', '扣款'),
(24, -75, 120, '1369989038975', '扣款'),
(25, 20, 140, '1369989062309', '充值'),
(26, -10, 130, '1369990686364', '扣款'),
(27, -50, 80, '1369992284016', '扣款'),
(28, -50, 30, '1369992642720', '扣款'),
(29, -25, 5, '1369993454669', '扣款'),
(30, 500, 505, '1369993802626', '充值'),
(31, -125, 380, '1369993803092', '扣款'),
(32, -50, 330, '1370005764608', '扣款'),
(33, -150, 180, '1370073973403', '扣款'),
(34, -50, 130, '1370075215562', '扣款'),
(35, -50, 80, '1370075271311', '扣款'),
(36, -25, 55, '1370075800888', '扣款'),
(37, -65, -10, '1370076021367', '扣款');

-- --------------------------------------------------------

--
-- 表的结构 `maoquan`
--

CREATE TABLE IF NOT EXISTS `maoquan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `consume` float NOT NULL,
  `remain` float NOT NULL,
  `time` varchar(200) NOT NULL,
  `remark` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=50 ;

--
-- 转存表中的数据 `maoquan`
--

INSERT INTO `maoquan` (`id`, `consume`, `remain`, `time`, `remark`) VALUES
(21, 100, 200, '1369985946633', '充值'),
(22, -25, 175, '1369985947010', '扣款'),
(23, 20, 20, '1369987074820', '充值'),
(24, -5, 15, '1369987076207', '扣款'),
(25, 100, 115, '1369987972191', '充值'),
(26, -25, 90, '1369987972469', '扣款'),
(27, 100, 190, '1369987980746', '充值'),
(28, -25, 165, '1369987981069', '扣款'),
(29, 100, 265, '1369988603540', '充值'),
(30, -25, 240, '1369988603762', '扣款'),
(31, 300, 540, '1369988619962', '充值'),
(32, 300, 840, '1369989038498', '充值'),
(33, -75, 765, '1369989038731', '扣款'),
(34, -10, 755, '1369990686131', '扣款'),
(35, 200, 955, '1369992283528', '充值'),
(36, -50, 905, '1369992283794', '扣款'),
(37, 100, 1005, '1369992298128', '充值'),
(38, -50, 955, '1369992642475', '扣款'),
(39, 100, 1055, '1369993383335', '充值'),
(40, 100, 1055, '1369993384668', '充值'),
(41, 100, 1130, '1369993454113', '充值'),
(42, -25, 1105, '1369993454367', '扣款'),
(43, -125, 980, '1369993802847', '扣款'),
(44, -50, 930, '1370005764285', '扣款'),
(45, -150, 780, '1370073973165', '扣款'),
(46, -50, 730, '1370075215084', '扣款'),
(47, -50, 680, '1370075271072', '扣款'),
(48, -25, 655, '1370075800566', '扣款'),
(49, -65, 590, '1370076021151', '扣款');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `username`, `password`) VALUES
(0, 'admin', 'admin'),
(1, 'yaofeifei', 'yaofeifei'),
(2, 'lisijin', 'lisijin'),
(3, 'zhoulianjie', 'zhoulianjie'),
(4, 'maoquan', 'maoquan');

-- --------------------------------------------------------

--
-- 表的结构 `yaofeifei`
--

CREATE TABLE IF NOT EXISTS `yaofeifei` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `consume` float NOT NULL,
  `remain` float NOT NULL,
  `time` varchar(200) NOT NULL,
  `remark` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=38 ;

--
-- 转存表中的数据 `yaofeifei`
--

INSERT INTO `yaofeifei` (`id`, `consume`, `remain`, `time`, `remark`) VALUES
(18, -25, 75, '1369985947401', '扣款'),
(19, -5, 370, '1369987079285', '扣款'),
(20, -25, 345, '1369987972812', '扣款'),
(21, -25, 320, '1369987981437', '扣款'),
(22, -25, 295, '1369988604151', '扣款'),
(23, -75, 220, '1369989039097', '扣款'),
(24, -10, 210, '1369990686475', '扣款'),
(25, -50, 160, '1369992284127', '扣款'),
(26, -50, 110, '1369992643008', '扣款'),
(27, -25, 85, '1369993454926', '扣款'),
(28, -125, -40, '1369993803203', '扣款'),
(29, 200, 160, '1370005763964', '充值'),
(30, -50, 110, '1370005764752', '扣款'),
(31, -150, -40, '1370073973512', '扣款'),
(32, -50, -90, '1370075215740', '扣款'),
(33, -50, -140, '1370075271418', '扣款'),
(34, 100, -40, '1370075800067', '充值'),
(35, -25, -65, '1370075801074', '扣款'),
(36, 260, 195, '1370076020912', '充值'),
(37, -65, 130, '1370076021600', '扣款');

-- --------------------------------------------------------

--
-- 表的结构 `zhoulianjie`
--

CREATE TABLE IF NOT EXISTS `zhoulianjie` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `consume` float NOT NULL,
  `remain` float NOT NULL,
  `time` varchar(200) NOT NULL,
  `remark` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=45 ;

--
-- 转存表中的数据 `zhoulianjie`
--

INSERT INTO `zhoulianjie` (`id`, `consume`, `remain`, `time`, `remark`) VALUES
(22, -25, 75, '1369985947122', '扣款'),
(23, -5, 270, '1369987077301', '扣款'),
(24, -25, 245, '1369987972579', '扣款'),
(25, -25, 220, '1369987981209', '扣款'),
(26, -25, 195, '1369988603929', '扣款'),
(27, -75, 120, '1369989038864', '扣款'),
(28, 50, 170, '1369990668734', '充值'),
(29, 40, 210, '1369990685797', '充值'),
(30, -10, 200, '1369990686242', '扣款'),
(31, -50, 150, '1369992283905', '扣款'),
(32, 200, 350, '1369992642231', '充值'),
(33, -50, 300, '1369992642587', '扣款'),
(34, -25, 250, '1369993454479', '扣款'),
(35, -125, 125, '1369993802981', '扣款'),
(36, -50, 75, '1370005764430', '扣款'),
(37, 600, 675, '1370073972933', '充值'),
(38, -150, 525, '1370073973277', '扣款'),
(39, 200, 725, '1370075214697', '充值'),
(40, -50, 675, '1370075215395', '扣款'),
(41, 200, 875, '1370075270829', '充值'),
(42, -50, 825, '1370075271184', '扣款'),
(43, -25, 800, '1370075800677', '扣款'),
(44, -65, 735, '1370076021256', '扣款');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
