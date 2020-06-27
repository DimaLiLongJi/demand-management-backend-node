/*
 Navicat MySQL Data Transfer

 Source Server         : 本地数据库
 Source Server Type    : MySQL
 Source Server Version : 50725
 Source Host           : localhost:3306
 Source Schema         : demand

 Target Server Type    : MySQL
 Target Server Version : 50725
 File Encoding         : 65001

 Date: 27/05/2020 10:30:21
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for approver
-- ----------------------------
DROP TABLE IF EXISTS `approver`;
CREATE TABLE `approver` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `demandTypeId` int(11) NOT NULL,
  `demandStatusId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_8f5be9ee31debf68f594cdf6a9b` (`demandTypeId`),
  KEY `FK_264f155c3e10d366ab4947981f7` (`demandStatusId`),
  KEY `FK_f45bf6ddd95d82e396792f50e33` (`userId`),
  CONSTRAINT `FK_264f155c3e10d366ab4947981f7` FOREIGN KEY (`demandStatusId`) REFERENCES `demand_status` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_8f5be9ee31debf68f594cdf6a9b` FOREIGN KEY (`demandTypeId`) REFERENCES `demand_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_f45bf6ddd95d82e396792f50e33` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for demand
-- ----------------------------
DROP TABLE IF EXISTS `demand`;
CREATE TABLE `demand` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `isPending` enum('1','2') COLLATE utf8mb4_bin NOT NULL DEFAULT '1',
  `detail` varchar(5000) COLLATE utf8mb4_bin DEFAULT NULL,
  `comment` varchar(5000) COLLATE utf8mb4_bin DEFAULT NULL,
  `url` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `manDay` int(11) DEFAULT NULL,
  `expect_date` datetime NOT NULL,
  `schedule_start_date` datetime DEFAULT NULL,
  `schedule_end_date` datetime DEFAULT NULL,
  `finish_date` datetime DEFAULT NULL,
  `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `delete_date` datetime DEFAULT NULL,
  `demandTypeId` int(11) NOT NULL,
  `demandStatusId` int(11) NOT NULL,
  `creatorId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_9afda450aa61be5bd5b95222a41` (`demandTypeId`),
  KEY `FK_5f0e369cd8b19cfc1af23798a15` (`demandStatusId`),
  KEY `FK_f31b06b5bfa8bdf4127eede75bb` (`creatorId`),
  CONSTRAINT `FK_5f0e369cd8b19cfc1af23798a15` FOREIGN KEY (`demandStatusId`) REFERENCES `demand_status` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_9afda450aa61be5bd5b95222a41` FOREIGN KEY (`demandTypeId`) REFERENCES `demand_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_f31b06b5bfa8bdf4127eede75bb` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for demand_broker
-- ----------------------------
DROP TABLE IF EXISTS `demand_broker`;
CREATE TABLE `demand_broker` (
  `demand` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  PRIMARY KEY (`demand`,`user`),
  KEY `IDX_10fab4770a5728dd639c751f92` (`demand`),
  KEY `IDX_617c88233b0241e5f198f62514` (`user`),
  CONSTRAINT `FK_10fab4770a5728dd639c751f926` FOREIGN KEY (`demand`) REFERENCES `demand` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_617c88233b0241e5f198f625141` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for demand_developer
-- ----------------------------
DROP TABLE IF EXISTS `demand_developer`;
CREATE TABLE `demand_developer` (
  `demand` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  PRIMARY KEY (`demand`,`user`),
  KEY `IDX_b2a796a4e2faba0ccf8e10c813` (`demand`),
  KEY `IDX_78617017f069723b6563f687af` (`user`),
  CONSTRAINT `FK_78617017f069723b6563f687afe` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_b2a796a4e2faba0ccf8e10c8139` FOREIGN KEY (`demand`) REFERENCES `demand` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for demand_devops
-- ----------------------------
DROP TABLE IF EXISTS `demand_devops`;
CREATE TABLE `demand_devops` (
  `demand` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  PRIMARY KEY (`demand`,`user`),
  KEY `IDX_2077f25d2f654b79aa1eb2442f` (`demand`),
  KEY `IDX_22a3368bfa13ad8581945242c3` (`user`),
  CONSTRAINT `FK_2077f25d2f654b79aa1eb2442f5` FOREIGN KEY (`demand`) REFERENCES `demand` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_22a3368bfa13ad8581945242c3b` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for demand_files
-- ----------------------------
DROP TABLE IF EXISTS `demand_files`;
CREATE TABLE `demand_files` (
  `demand` int(11) NOT NULL,
  `file` int(11) NOT NULL,
  PRIMARY KEY (`demand`,`file`),
  KEY `IDX_708564649c2b1407f423674ce1` (`demand`),
  KEY `IDX_016045651a8e4188a44edbc84a` (`file`),
  CONSTRAINT `FK_016045651a8e4188a44edbc84a2` FOREIGN KEY (`file`) REFERENCES `file` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_708564649c2b1407f423674ce19` FOREIGN KEY (`demand`) REFERENCES `demand` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for demand_log
-- ----------------------------
DROP TABLE IF EXISTS `demand_log`;
CREATE TABLE `demand_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('1','2','3','4','5','6','7','8') COLLATE utf8mb4_bin NOT NULL,
  `property` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `oldDetail` varchar(5000) COLLATE utf8mb4_bin DEFAULT NULL,
  `newDetail` varchar(5000) COLLATE utf8mb4_bin DEFAULT NULL,
  `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `demandId` int(11) NOT NULL,
  `creatorId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_d8eeb31cf416df23beb655b5f24` (`demandId`),
  KEY `FK_ff7275dc9b1872300691ba05f9f` (`creatorId`),
  CONSTRAINT `FK_d8eeb31cf416df23beb655b5f24` FOREIGN KEY (`demandId`) REFERENCES `demand` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_ff7275dc9b1872300691ba05f9f` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for demand_node
-- ----------------------------
DROP TABLE IF EXISTS `demand_node`;
CREATE TABLE `demand_node` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `detail` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `delete_date` datetime DEFAULT NULL,
  `finish_date` datetime DEFAULT NULL,
  `demandProgressId` int(11) NOT NULL,
  `creatorId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_5bf378744004842740f50916c7e` (`demandProgressId`),
  KEY `FK_29c2580d18940a8088a7818cd96` (`creatorId`),
  CONSTRAINT `FK_29c2580d18940a8088a7818cd96` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_5bf378744004842740f50916c7e` FOREIGN KEY (`demandProgressId`) REFERENCES `demand_progress` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for demand_progress
-- ----------------------------
DROP TABLE IF EXISTS `demand_progress`;
CREATE TABLE `demand_progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('1','2') COLLATE utf8mb4_bin NOT NULL,
  `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `schedule_start_date` datetime DEFAULT NULL,
  `schedule_end_date` datetime DEFAULT NULL,
  `finish_date` datetime DEFAULT NULL,
  `demandId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `creatorId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_61510ce5598799ec92764df3258` (`demandId`),
  KEY `FK_2eaf9ace2152718c19d69916988` (`userId`),
  KEY `FK_9977c8484f870233ccb8d40ec23` (`creatorId`),
  CONSTRAINT `FK_2eaf9ace2152718c19d69916988` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_61510ce5598799ec92764df3258` FOREIGN KEY (`demandId`) REFERENCES `demand` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_9977c8484f870233ccb8d40ec23` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for demand_proposer
-- ----------------------------
DROP TABLE IF EXISTS `demand_proposer`;
CREATE TABLE `demand_proposer` (
  `demand` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  PRIMARY KEY (`demand`,`user`),
  KEY `IDX_62be939bb601399dcd0ed3bc0b` (`demand`),
  KEY `IDX_ec7b87da98b28d0ec00045002a` (`user`),
  CONSTRAINT `FK_62be939bb601399dcd0ed3bc0bd` FOREIGN KEY (`demand`) REFERENCES `demand` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_ec7b87da98b28d0ec00045002a5` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for demand_status
-- ----------------------------
DROP TABLE IF EXISTS `demand_status`;
CREATE TABLE `demand_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `isEndStatus` enum('1','2') COLLATE utf8mb4_bin NOT NULL DEFAULT '1',
  `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `delete_date` datetime DEFAULT NULL,
  `creatorId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_942ad6b44fb19d02c93a0fd7b7` (`name`),
  KEY `FK_f91bc114e3df600eea569c02d15` (`creatorId`),
  CONSTRAINT `FK_f91bc114e3df600eea569c02d15` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for demand_type
-- ----------------------------
DROP TABLE IF EXISTS `demand_type`;
CREATE TABLE `demand_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `delete_date` datetime DEFAULT NULL,
  `creatorId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_f301411652f9b07d22be4e3366` (`name`),
  KEY `FK_06668dcaf95d5b06c207516b5f5` (`creatorId`),
  CONSTRAINT `FK_06668dcaf95d5b06c207516b5f5` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for demand_type_demand_status
-- ----------------------------
DROP TABLE IF EXISTS `demand_type_demand_status`;
CREATE TABLE `demand_type_demand_status` (
  `demand_type` int(11) NOT NULL,
  `demand_status` int(11) NOT NULL,
  PRIMARY KEY (`demand_type`,`demand_status`),
  KEY `IDX_a99297fd3cf6e6e49dbd28fa1a` (`demand_type`),
  KEY `IDX_4d5b58783bf84bac3a136a4592` (`demand_status`),
  CONSTRAINT `FK_4d5b58783bf84bac3a136a45929` FOREIGN KEY (`demand_status`) REFERENCES `demand_status` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_a99297fd3cf6e6e49dbd28fa1a7` FOREIGN KEY (`demand_type`) REFERENCES `demand_type` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for file
-- ----------------------------
DROP TABLE IF EXISTS `file`;
CREATE TABLE `file` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `creatorId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_df16ff3255e6dfc777b086949b` (`name`),
  KEY `FK_301b44a4226ae80beb0416d8831` (`creatorId`),
  CONSTRAINT `FK_301b44a4226ae80beb0416d8831` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for module
-- ----------------------------
DROP TABLE IF EXISTS `module`;
CREATE TABLE `module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `icon` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `delete_date` datetime DEFAULT NULL,
  `creatorId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_620a549dbcb1fff62ea85695ca` (`name`),
  KEY `FK_1a96608338d33b3b71285961206` (`creatorId`),
  CONSTRAINT `FK_1a96608338d33b3b71285961206` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Records of module
-- ----------------------------
BEGIN;
INSERT INTO `module` VALUES (1, '权限管理', 'cluster', '2020-05-27 09:43:56.438644', '2020-05-27 09:43:56.438644', NULL, 1);
INSERT INTO `module` VALUES (2, '个人中心', 'user', '2020-05-27 09:46:07.591745', '2020-05-27 09:46:07.591745', NULL, 1);
INSERT INTO `module` VALUES (3, '需求管理', 'project', '2020-05-27 09:46:44.982163', '2020-05-27 09:46:44.982163', NULL, 1);
COMMIT;

-- ----------------------------
-- Table structure for permission
-- ----------------------------
DROP TABLE IF EXISTS `permission`;
CREATE TABLE `permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `route` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `operating` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `creatorId` int(11) NOT NULL,
  `type` enum('1','2') COLLATE utf8mb4_bin NOT NULL,
  `moduleId` int(11) NOT NULL,
  `delete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_240853a0c3353c25fb12434ad3` (`name`),
  UNIQUE KEY `IDX_42ace477627f6f821f49689186` (`route`),
  UNIQUE KEY `IDX_49178e21c84645fa3a2a2cc6bb` (`operating`),
  KEY `FK_18f3ac6d3f1e3e6b5e3f8123289` (`moduleId`),
  KEY `FK_a88759d149c67ba80eee0e1e9af` (`creatorId`),
  CONSTRAINT `FK_18f3ac6d3f1e3e6b5e3f8123289` FOREIGN KEY (`moduleId`) REFERENCES `module` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_a88759d149c67ba80eee0e1e9af` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Records of permission
-- ----------------------------
BEGIN;
INSERT INTO `permission` VALUES (1, '权限列表', '/home/permission-list', NULL, '2019-10-10 16:27:44.754727', '2020-05-27 10:28:40.000000', 1, '1', 1, NULL);
INSERT INTO `permission` VALUES (2, '角色列表', '/home/role-list', NULL, '2019-10-11 09:43:03.390693', '2019-10-15 10:26:14.000000', 1, '1', 1, NULL);
INSERT INTO `permission` VALUES (3, '用户列表', '/home/user-list', NULL, '2019-10-11 10:08:03.849477', '2020-05-27 10:28:04.000000', 1, '1', 1, NULL);
INSERT INTO `permission` VALUES (4, '个人信息', '/home/self', NULL, '2019-10-15 14:26:54.657869', '2020-05-27 09:54:50.000000', 1, '1', 2, NULL);
INSERT INTO `permission` VALUES (5, '需求类型列表', '/home/demand-type-list', NULL, '2019-10-16 13:16:28.247285', '2020-05-27 10:28:10.000000', 1, '1', 3, NULL);
INSERT INTO `permission` VALUES (6, '需求状态列表', '/home/demand-status-list', NULL, '2019-10-16 17:32:57.459197', '2020-05-27 10:25:28.000000', 1, '1', 3, NULL);
INSERT INTO `permission` VALUES (7, '需求列表', '/home/demand-list', NULL, '2019-10-18 17:23:31.010902', '2020-05-27 10:27:52.000000', 1, '1', 3, NULL);
INSERT INTO `permission` VALUES (8, '修改个人角色和权限', NULL, 'change-self-role', '2019-10-20 22:13:00.850461', '2020-05-27 10:27:48.000000', 1, '2', 2, NULL);
INSERT INTO `permission` VALUES (9, '修改需求状态', NULL, 'update-demand-status', '2019-10-22 08:58:56.795643', '2020-05-27 10:27:45.000000', 1, '2', 3, NULL);
INSERT INTO `permission` VALUES (10, '新增需求', NULL, 'create-demand', '2019-10-22 09:12:00.018899', '2020-05-27 10:27:31.000000', 1, '2', 3, NULL);
INSERT INTO `permission` VALUES (11, '修改需求详情', NULL, 'update-demand', '2019-10-22 10:35:52.673418', '2020-05-27 10:27:35.000000', 1, '2', 3, NULL);
INSERT INTO `permission` VALUES (12, '我的需求', '/home/self-demand-list', NULL, '2019-10-22 11:46:10.457779', '2020-05-27 10:27:18.000000', 1, '1', 2, NULL);
INSERT INTO `permission` VALUES (13, '需求看板', '/home/kanban', NULL, '2020-03-28 14:52:26.599895', '2020-05-27 10:27:14.000000', 1, '1', 3, NULL);
INSERT INTO `permission` VALUES (14, '创建用户', NULL, 'create-user', '2020-05-30 11:43:27.538248', '2020-05-30 11:43:27.538248', 1, '2', 1, NULL);
INSERT INTO `permission` VALUES (15, '编辑用户', NULL, 'update-user', '2020-05-30 11:44:18.417886', '2020-05-30 11:44:18.417886', 1, '2', 1, NULL);
COMMIT;

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `delete_date` datetime DEFAULT NULL,
  `creatorId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_ae4578dcaed5adff96595e6166` (`name`),
  KEY `FK_c9a53388d75d33751e7046f3644` (`creatorId`),
  CONSTRAINT `FK_c9a53388d75d33751e7046f3644` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for role_demand_type
-- ----------------------------
DROP TABLE IF EXISTS `role_demand_type`;
CREATE TABLE `role_demand_type` (
  `role` int(11) NOT NULL,
  `demand_type` int(11) NOT NULL,
  PRIMARY KEY (`role`,`demand_type`),
  KEY `IDX_fe1cd4d2e5c0a403bb75b5153b` (`role`),
  KEY `IDX_05295dd680e1a43ce2b90c84d6` (`demand_type`),
  CONSTRAINT `FK_05295dd680e1a43ce2b90c84d63` FOREIGN KEY (`demand_type`) REFERENCES `demand_type` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_fe1cd4d2e5c0a403bb75b5153b1` FOREIGN KEY (`role`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for role_permission
-- ----------------------------
DROP TABLE IF EXISTS `role_permission`;
CREATE TABLE `role_permission` (
  `role` int(11) NOT NULL,
  `permission` int(11) NOT NULL,
  PRIMARY KEY (`role`,`permission`),
  KEY `IDX_64e5f40bfdde9ea2955ba56910` (`role`),
  KEY `IDX_8307c5c44a4ad6210b767b17a9` (`permission`),
  CONSTRAINT `FK_64e5f40bfdde9ea2955ba569109` FOREIGN KEY (`role`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_8307c5c44a4ad6210b767b17a99` FOREIGN KEY (`permission`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `mobile` varchar(11) COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `salt` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `create_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `update_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `delete_date` datetime DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  `creatorId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_29fd51e9cf9241d022c5a4e02e` (`mobile`),
  UNIQUE KEY `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`),
  KEY `FK_c28e52f758e7bbc53828db92194` (`roleId`),
  KEY `FK_b40ff13132b995b758b1187ee8a` (`creatorId`),
  CONSTRAINT `FK_b40ff13132b995b758b1187ee8a` FOREIGN KEY (`creatorId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (1, '管理员', '11111111111', '11111111111@163.com', '1587023984952', 'ce5ff45b8d56f397bbb4334d11b988f7', '2019-10-03 21:37:07.831000', '2020-04-16 15:59:44.958000', NULL, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for user_permission
-- ----------------------------
DROP TABLE IF EXISTS `user_permission`;
CREATE TABLE `user_permission` (
  `user` int(11) NOT NULL,
  `permission` int(11) NOT NULL,
  PRIMARY KEY (`user`,`permission`),
  KEY `IDX_77a8596c109cd7acc7b87bb06e` (`user`),
  KEY `IDX_8c65c37ee42d48a76c0612ad0f` (`permission`),
  CONSTRAINT `FK_77a8596c109cd7acc7b87bb06ea` FOREIGN KEY (`user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_8c65c37ee42d48a76c0612ad0fe` FOREIGN KEY (`permission`) REFERENCES `permission` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- ----------------------------
-- Records of user_permission
-- ----------------------------
BEGIN;
INSERT INTO `user_permission` VALUES (1, 1);
INSERT INTO `user_permission` VALUES (1, 2);
INSERT INTO `user_permission` VALUES (1, 3);
INSERT INTO `user_permission` VALUES (1, 4);
INSERT INTO `user_permission` VALUES (1, 5);
INSERT INTO `user_permission` VALUES (1, 6);
INSERT INTO `user_permission` VALUES (1, 7);
INSERT INTO `user_permission` VALUES (1, 8);
INSERT INTO `user_permission` VALUES (1, 9);
INSERT INTO `user_permission` VALUES (1, 10);
INSERT INTO `user_permission` VALUES (1, 11);
INSERT INTO `user_permission` VALUES (1, 12);
INSERT INTO `user_permission` VALUES (1, 13);
INSERT INTO `user_permission` VALUES (1, 14);
INSERT INTO `user_permission` VALUES (1, 15);
COMMIT;

-- ----------------------------
-- Table structure for demand_type_stataus_index
-- ----------------------------
DROP TABLE IF EXISTS `demand_type_stataus_index`;
CREATE TABLE `demand_type_stataus_index` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `statusIndex` int(11) NOT NULL,
  `demandTypeId` int(11) NOT NULL,
  `demandStatusId` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_008a9fbd4b568a218f84fd5b4a1` (`demandTypeId`),
  KEY `FK_6d5cc646dabf08fb10b4918e32d` (`demandStatusId`),
  CONSTRAINT `FK_008a9fbd4b568a218f84fd5b4a1` FOREIGN KEY (`demandTypeId`) REFERENCES `demand_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_6d5cc646dabf08fb10b4918e32d` FOREIGN KEY (`demandStatusId`) REFERENCES `demand_status` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

SET FOREIGN_KEY_CHECKS = 1;
