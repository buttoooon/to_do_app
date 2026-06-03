-- SQL (MySQL 8.x) | Файл: schema.sql
-- Схема бази даних для To-Do List Manager

CREATE DATABASE IF NOT EXISTS todo_manager
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE todo_manager;

CREATE TABLE IF NOT EXISTS tasks (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  title       VARCHAR(255)  NOT NULL                    COMMENT 'Текст завдання',
  description TEXT          DEFAULT NULL                COMMENT 'Розширений опис (опціонально)',
  completed   TINYINT(1)    NOT NULL DEFAULT 0          COMMENT '0 — активне, 1 — виконане',
  priority    ENUM('low','medium','high')
              NOT NULL DEFAULT 'medium'                 COMMENT 'Пріоритет завдання',
  created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_completed (completed),
  INDEX idx_created   (created_at DESC)
) ENGINE=InnoDB;
