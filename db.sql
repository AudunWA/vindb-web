SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for `change_log`
-- ----------------------------
DROP TABLE IF EXISTS `change_log`;
CREATE TABLE `change_log` (
  `change_id` int(11) NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `start_import` datetime NOT NULL,
  `end_import` datetime DEFAULT NULL,
  PRIMARY KEY (`change_id`),
  KEY `time` (`time`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for `field`
-- ----------------------------
DROP TABLE IF EXISTS `field`;
CREATE TABLE `field` (
  `field_id` int(11) NOT NULL,
  `display_name` varchar(32) NOT NULL,
  PRIMARY KEY (`field_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of field
-- ----------------------------
INSERT INTO `field` VALUES ('0', 'Varenummer');
INSERT INTO `field` VALUES ('1', '');
INSERT INTO `field` VALUES ('2', 'Varenavn');
INSERT INTO `field` VALUES ('3', 'Volum');
INSERT INTO `field` VALUES ('4', 'Pris');
INSERT INTO `field` VALUES ('5', 'Varetype');
INSERT INTO `field` VALUES ('6', 'Produktutvalg');
INSERT INTO `field` VALUES ('7', 'Butikkategori');
INSERT INTO `field` VALUES ('8', 'Fylde');
INSERT INTO `field` VALUES ('9', 'Friskhet');
INSERT INTO `field` VALUES ('10', 'Garvestoffer');
INSERT INTO `field` VALUES ('11', 'Bitterhet');
INSERT INTO `field` VALUES ('12', 'Sødme');
INSERT INTO `field` VALUES ('13', 'Farge');
INSERT INTO `field` VALUES ('14', 'Lukt');
INSERT INTO `field` VALUES ('15', 'Smak');
INSERT INTO `field` VALUES ('16', 'Passer til 1');
INSERT INTO `field` VALUES ('17', 'Passer til 2');
INSERT INTO `field` VALUES ('18', 'Passer til 3');
INSERT INTO `field` VALUES ('19', 'Land');
INSERT INTO `field` VALUES ('20', 'Distrikt');
INSERT INTO `field` VALUES ('21', 'Underdistrikt');
INSERT INTO `field` VALUES ('22', 'Årgang');
INSERT INTO `field` VALUES ('23', 'Råstoff');
INSERT INTO `field` VALUES ('24', 'Metode');
INSERT INTO `field` VALUES ('25', 'Alkoholprosent');
INSERT INTO `field` VALUES ('26', 'Sukker');
INSERT INTO `field` VALUES ('27', 'Syre');
INSERT INTO `field` VALUES ('28', 'Lagringsgrad');
INSERT INTO `field` VALUES ('29', 'Produsent');
INSERT INTO `field` VALUES ('30', 'Grossist');
INSERT INTO `field` VALUES ('31', 'Distributør');
INSERT INTO `field` VALUES ('32', 'Emballasjetype');
INSERT INTO `field` VALUES ('33', 'Korktype');

-- ----------------------------
-- Table structure for `product`
-- ----------------------------
DROP TABLE IF EXISTS `product`;
CREATE TABLE `product` (
  `varenummer` bigint(20) NOT NULL,
  `first_seen` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `last_seen` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `varenavn` varchar(300) NOT NULL,
  `volum` double NOT NULL,
  `pris` decimal(10,2) NOT NULL,
  `varetype` varchar(64) DEFAULT NULL,
  `produktutvalg` varchar(64) NOT NULL,
  `butikkategori` varchar(64) NOT NULL,
  `fylde` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT 'Between 1-10',
  `friskhet` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT 'Between 1-10',
  `garvestoffer` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT 'Between 1-10',
  `bitterhet` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT 'Between 1-10',
  `sodme` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT 'Between 1-10',
  `farge` varchar(300) DEFAULT NULL,
  `lukt` varchar(300) DEFAULT NULL,
  `smak` varchar(300) DEFAULT NULL,
  `passer_til_1` text,
  `passer_til_2` text,
  `passer_til_3` text,
  `land` varchar(64) NOT NULL,
  `distrikt` varchar(64) NOT NULL,
  `underdistrikt` varchar(64) DEFAULT NULL,
  `argang` year(4) DEFAULT NULL,
  `rastoff` varchar(300) DEFAULT NULL,
  `metode` varchar(300) DEFAULT NULL,
  `alkohol` double unsigned NOT NULL,
  `sukker` double DEFAULT NULL,
  `syre` double DEFAULT NULL,
  `lagringsgrad` varchar(64) DEFAULT NULL,
  `produsent` varchar(64) DEFAULT NULL,
  `grossist` varchar(64) NOT NULL,
  `distributor` varchar(64) NOT NULL,
  `emballasjetype` varchar(64) NOT NULL,
  `korktype` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`varenummer`),
  KEY `volum` (`volum`),
  KEY `pris` (`pris`),
  KEY `alkohol` (`alkohol`),
  KEY `varenummer` (`varenummer`),
  KEY `volum_2` (`volum`,`pris`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for `product_change`
-- ----------------------------
DROP TABLE IF EXISTS `product_change`;
CREATE TABLE `product_change` (
  `product_id` bigint(20) NOT NULL,
  `field_id` int(11) NOT NULL,
  `change_id` int(11) NOT NULL,
  `old_value` varchar(300) DEFAULT NULL,
  `new_value` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`product_id`,`field_id`,`change_id`),
  KEY `change_id` (`change_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_change_ibfk_1` FOREIGN KEY (`change_id`) REFERENCES `change_log` (`change_id`),
  CONSTRAINT `product_change_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`varenummer`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;