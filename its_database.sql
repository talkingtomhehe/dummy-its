-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 26, 2025 lúc 05:50 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `its_database`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `assessments`
--

CREATE TABLE `assessments` (
  `assessment_id` int(11) NOT NULL,
  `topic_id` int(11) NOT NULL,
  `content_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `assessment_type` enum('quiz','project','assignment') NOT NULL,
  `description` text DEFAULT NULL,
  `time_limit` int(11) DEFAULT 0 COMMENT 'Time limit in minutes, 0 = no limit',
  `open_time` datetime DEFAULT NULL,
  `close_time` datetime DEFAULT NULL,
  `max_score` decimal(5,2) DEFAULT 10.00,
  `allowed_attempts` int(11) DEFAULT 0 COMMENT 'Number of allowed attempts, 0 = unlimited',
  `grading_method` enum('highest','average','last') DEFAULT 'highest' COMMENT 'Method used to calculate final grade from multiple attempts',
  `is_visible` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `assessments`
--

INSERT INTO `assessments` (`assessment_id`, `topic_id`, `content_id`, `title`, `assessment_type`, `description`, `time_limit`, `open_time`, `close_time`, `max_score`, `allowed_attempts`, `grading_method`, `is_visible`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 2, 7, '1.3 Quiz: Introduction Concepts', 'quiz', 'Quiz on basic testing concepts', 30, '2025-11-14 08:00:00', '2025-11-17 23:59:00', 10.00, 0, 'highest', 1, 0, '2025-11-15 02:27:14', '2025-11-25 13:30:49'),
(2, 3, 8, 'Nộp bài Assignment', 'assignment', 'Submit your final project assignment', 0, '2025-11-15 00:00:00', '2025-11-26 23:00:00', 10.00, 0, 'highest', 1, 0, '2025-11-15 02:27:14', '2025-11-15 02:27:14'),
(7, 1, 19, 'abc', 'quiz', '', 30, '2025-11-25 11:31:00', '2025-11-27 11:31:00', 10.00, 0, 'highest', 1, 0, '2025-11-25 04:31:28', '2025-11-25 12:06:59'),
(9, 1, 30, 'Assignment 1', 'assignment', '', 0, '2025-11-24 19:02:00', '2025-11-27 19:02:00', 10.00, 0, 'highest', 1, 0, '2025-11-25 12:02:55', '2025-11-25 12:13:08'),
(10, 1, 32, 'Quiz 1', 'quiz', '', 30, '2025-11-25 19:55:00', '2025-11-27 19:55:00', 10.00, 0, 'highest', 1, 0, '2025-11-25 12:55:41', '2025-11-26 15:51:41'),
(11, 1, 34, 'Quiz 2', 'quiz', '', 1, '2025-11-24 20:34:00', '2025-11-26 20:34:00', 10.00, 0, 'highest', 1, 0, '2025-11-25 13:34:55', '2025-11-25 13:34:55'),
(12, 1, 35, 'Quiz 4', 'quiz', '', 30, '2025-11-24 20:39:00', '2025-11-26 20:39:00', 10.00, 0, 'highest', 1, 0, '2025-11-25 13:39:39', '2025-11-25 13:39:39'),
(13, 1, 36, 'Quiz 5', 'quiz', '', 5, '2025-11-25 23:45:00', '2025-11-27 23:45:00', 10.00, 0, 'highest', 1, 0, '2025-11-26 16:45:23', '2025-11-26 16:45:23');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `assessment_results`
--

CREATE TABLE `assessment_results` (
  `result_id` int(11) NOT NULL,
  `assessment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `answers` text DEFAULT NULL COMMENT 'JSON encoded answers',
  `feedback` text DEFAULT NULL,
  `submission_file` text DEFAULT NULL COMMENT 'JSON array of uploaded file paths',
  `original_filenames` text DEFAULT NULL COMMENT 'JSON array of original filenames',
  `status` enum('pending','in_progress','submitted','graded','completed') DEFAULT 'submitted',
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `started_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `graded_at` timestamp NULL DEFAULT NULL,
  `time_taken` int(11) DEFAULT NULL COMMENT 'Time taken in seconds'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `assessment_results`
--

INSERT INTO `assessment_results` (`result_id`, `assessment_id`, `user_id`, `student_id`, `score`, `answers`, `feedback`, `submission_file`, `original_filenames`, `status`, `submitted_at`, `started_at`, `completed_at`, `graded_at`, `time_taken`) VALUES
(1, 1, 1, 1, 6.67, '{\"1\":\"c\",\"2\":\"a\",\"3\":[\"a\",\"b\"]}', NULL, NULL, NULL, 'completed', '2025-11-14 11:02:00', '2025-11-14 17:59:50', '2025-11-14 18:02:00', NULL, 130),
(2, 1, 2, 2, 10.00, '{\"1\":\"c\",\"2\":\"c\",\"3\":[\"a\",\"b\"]}', NULL, NULL, NULL, 'completed', '2025-11-14 12:15:00', '2025-11-14 19:09:28', '2025-11-14 19:15:00', NULL, 332),
(4, 2, 1, 1, NULL, NULL, NULL, 'assignment_2_student_1_20251123090239.pdf', NULL, 'submitted', '2025-11-23 08:02:39', NULL, NULL, NULL, NULL),
(6, 7, 1, 1, 3.33, '{\"10\":\"43\",\"11\":[\"46\"],\"12\":[\"48\"]}', 'hoc ngu qua', NULL, NULL, 'graded', '2025-11-25 12:10:24', NULL, '2025-11-25 19:10:24', '2025-11-25 12:10:53', NULL),
(7, 9, 1, 1, 9.00, NULL, 'Lam tot lam', '[\"assignment_9_student_1_20251125131448_0.pdf\",\"assignment_9_student_1_20251125131448_1.pdf\"]', '[\"WorkSummary.pdf\",\"EERD.pdf\"]', 'graded', '2025-11-25 12:14:48', NULL, NULL, '2025-11-26 16:37:11', NULL),
(11, 12, 1, 1, 10.00, '{\"19\":\"66\"}', NULL, NULL, NULL, 'completed', '2025-11-25 13:59:37', '2025-11-25 20:59:30', '2025-11-25 20:59:37', NULL, 7),
(14, 11, 1, 1, 1.67, '{\"16\":\"59\",\"17\":[\"62\"],\"18\":\"64\"}', NULL, NULL, NULL, 'completed', '2025-11-25 14:05:17', '2025-11-25 21:05:05', '2025-11-25 21:05:17', NULL, 12),
(17, 10, 1, 1, 6.67, '{\"13\":\"51\",\"14\":\"52\",\"15\":[\"55\",\"56\",\"57\"]}', NULL, NULL, NULL, 'completed', '2025-11-26 16:48:40', '2025-11-26 23:48:21', '2025-11-26 23:48:40', NULL, 19);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `content_items`
--

CREATE TABLE `content_items` (
  `content_id` int(11) NOT NULL,
  `topic_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content_type` enum('text','video','link','page','file','quiz','assignment','announcement') NOT NULL,
  `content_data` text DEFAULT NULL,
  `file_path` varchar(500) DEFAULT NULL,
  `is_visible` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `content_items`
--

INSERT INTO `content_items` (`content_id`, `topic_id`, `title`, `content_type`, `content_data`, `file_path`, `is_visible`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 1, 'Announcements', 'page', '<h2>Course Announcements</h2><p>Welcome to Software Testing course!</p>', NULL, 1, 1, '2025-11-15 02:27:14', '2025-11-15 02:27:14'),
(2, 1, 'Course Q&A Forum', 'page', '<h2>Q&A Forum</h2><p>Ask your questions here.</p>', NULL, 1, 2, '2025-11-15 02:27:14', '2025-11-15 02:27:14'),
(3, 2, '1.1 Slides: Introduction to Software Testing', 'page', '<h2>Introduction to Software Testing</h2><p>Software testing is a critical phase in software development...</p><p>Key concepts include: Verification, Validation, Quality Assurance.</p>', NULL, 1, 1, '2025-11-15 02:27:14', '2025-11-15 02:27:14'),
(4, 2, '1.2 Video: What is Testing?', 'video', 'https://www.youtube.com/embed/example', NULL, 1, 2, '2025-11-15 02:27:14', '2025-11-15 02:27:14'),
(5, 2, '1.2.1 External Link: Introduction to Testing', 'link', 'https://www.guru99.com/software-testing-introduction-importance.html', NULL, 1, 3, '2025-11-15 02:27:14', '2025-11-15 02:27:14'),
(6, 3, 'Assignment Specification', 'page', '<h2>Final Project Assignment</h2><p>Develop a comprehensive test plan for a given software system.</p><p><strong>Requirements:</strong></p><ul><li>Test case design</li><li>Test execution plan</li><li>Bug report documentation</li></ul>', NULL, 1, 1, '2025-11-15 02:27:14', '2025-11-15 02:27:14'),
(7, 2, '1.3 Quiz: Introduction Concepts', 'quiz', '', NULL, 1, 4, '2025-11-15 02:27:14', '2025-11-25 13:30:49'),
(8, 3, 'Final Project Submission', 'assignment', '<p>Upload your completed project deliverables.</p>', NULL, 1, 2, '2025-11-15 02:27:14', '2025-11-15 02:27:14'),
(19, 1, 'Quiz 3', 'quiz', '', NULL, 1, 0, '2025-11-25 04:31:28', '2025-11-25 13:11:24'),
(21, 6, 'video hay', 'video', 'https://www.youtube.com/watch?v=UrU3JQvpP60', NULL, 1, 0, '2025-11-25 08:50:07', '2025-11-25 10:53:28'),
(22, 6, 'abc', 'link', 'https://www.youtube.com/watch?v=UrU3JQvpP60', NULL, 1, 0, '2025-11-25 09:37:32', '2025-11-25 09:37:32'),
(30, 1, 'Assignment 1', 'assignment', '', NULL, 1, 0, '2025-11-25 12:02:55', '2025-11-25 12:02:55'),
(32, 1, 'Quiz 1', 'quiz', '', NULL, 1, 0, '2025-11-25 12:55:41', '2025-11-25 12:55:41'),
(33, 6, 'video hay nua', 'video', 'https://www.youtube.com/watch?v=RCPaonINEjo&list=PLKvoOwlacRoLUIt3JfQU90uGxTo_qu8IN&index=30', NULL, 1, 0, '2025-11-25 13:02:00', '2025-11-25 13:02:00'),
(34, 1, 'Quiz 2', 'quiz', '', NULL, 1, 0, '2025-11-25 13:34:55', '2025-11-25 13:34:55'),
(35, 1, 'Quiz 4', 'quiz', '', NULL, 1, 0, '2025-11-25 13:39:39', '2025-11-25 13:39:39'),
(36, 1, 'Quiz 5', 'quiz', '', NULL, 1, 0, '2025-11-26 16:45:23', '2025-11-26 16:45:23');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `type` enum('info','success','warning','error') DEFAULT 'info',
  `related_type` varchar(50) DEFAULT NULL COMMENT 'Type of related entity (quiz, assignment, etc.)',
  `related_id` int(11) DEFAULT NULL COMMENT 'ID of related entity',
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `title`, `message`, `type`, `related_type`, `related_id`, `is_read`, `read_at`, `created_at`) VALUES
(7, 2, 'New Topic Added', 'A new topic \'Topic 2\' has been added to Software Testing.', 'info', 'topic', NULL, 0, NULL, '2025-11-25 08:45:57'),
(8, 3, 'New Topic Added', 'A new topic \'Topic 2\' has been added to Software Testing.', 'info', 'topic', NULL, 0, NULL, '2025-11-25 08:45:57'),
(10, 2, 'New Content Available', 'New content \'hello\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 08:50:07'),
(11, 3, 'New Content Available', 'New content \'hello\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 08:50:07'),
(16, 2, 'New Content Available', 'New content \'abc\' has been added to Topic 2 in Software Testing.', 'info', 'content', 22, 0, NULL, '2025-11-25 09:37:32'),
(17, 3, 'New Content Available', 'New content \'abc\' has been added to Topic 2 in Software Testing.', 'info', 'content', 22, 0, NULL, '2025-11-25 09:37:32'),
(19, 2, 'Content Updated', '\'hehe\' in Software Testing has been updated.', 'info', 'content', 21, 0, NULL, '2025-11-25 09:38:23'),
(20, 3, 'Content Updated', '\'hehe\' in Software Testing has been updated.', 'info', 'content', 21, 0, NULL, '2025-11-25 09:38:23'),
(22, 2, 'New Content Available', 'New content \'hello\' has been added to Topic 2 in Software Testing.', 'info', 'content', 23, 0, NULL, '2025-11-25 09:39:53'),
(23, 3, 'New Content Available', 'New content \'hello\' has been added to Topic 2 in Software Testing.', 'info', 'content', 23, 0, NULL, '2025-11-25 09:39:53'),
(25, 2, 'New Content Available', 'New document \'bai hoc\' has been added to Topic 2 in Software Testing.', 'info', 'content', 24, 0, NULL, '2025-11-25 09:41:39'),
(26, 3, 'New Content Available', 'New document \'bai hoc\' has been added to Topic 2 in Software Testing.', 'info', 'content', 24, 0, NULL, '2025-11-25 09:41:39'),
(28, 2, 'New Content Available', 'New page \'hello\' has been added to Topic 2 in Software Testing.', 'info', 'content', 25, 0, NULL, '2025-11-25 10:10:05'),
(29, 3, 'New Content Available', 'New page \'hello\' has been added to Topic 2 in Software Testing.', 'info', 'content', 25, 0, NULL, '2025-11-25 10:10:05'),
(33, 2, 'New Content Available', 'New page \'abc\' has been added to Topic 2 in Software Testing.', 'info', 'content', 26, 0, NULL, '2025-11-25 10:20:49'),
(34, 3, 'New Content Available', 'New page \'abc\' has been added to Topic 2 in Software Testing.', 'info', 'content', 26, 0, NULL, '2025-11-25 10:20:49'),
(39, 2, 'New Content Available', 'New document \'abc\' has been added to Topic 2 in Software Testing.', 'info', 'content', 27, 0, NULL, '2025-11-25 10:42:18'),
(40, 3, 'New Content Available', 'New document \'abc\' has been added to Topic 2 in Software Testing.', 'info', 'content', 27, 0, NULL, '2025-11-25 10:42:18'),
(42, 2, 'New Content Available', 'New content \'abc\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 10:48:32'),
(43, 3, 'New Content Available', 'New content \'abc\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 10:48:32'),
(47, 2, 'Content Updated', '\'video hay\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 10:53:28'),
(48, 3, 'Content Updated', '\'video hay\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 10:53:28'),
(50, 2, 'New Content Available', 'New content \'sdad\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 10:54:04'),
(51, 3, 'New Content Available', 'New content \'sdad\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 10:54:04'),
(53, 2, 'Content Updated', '\'abc\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 11:58:21'),
(54, 3, 'Content Updated', '\'abc\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 11:58:21'),
(56, 2, 'Content Updated', '\'abc\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 11:58:33'),
(57, 3, 'Content Updated', '\'abc\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 11:58:33'),
(59, 2, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:01:54'),
(60, 3, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:01:54'),
(62, 2, 'New Content Available', 'New content \'Assignment 1\' has been added to General in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:02:55'),
(63, 3, 'New Content Available', 'New content \'Assignment 1\' has been added to General in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:02:55'),
(65, 2, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:06:59'),
(66, 3, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:06:59'),
(69, 2, 'Content Updated', '\'Assignment 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:12:32'),
(70, 3, 'Content Updated', '\'Assignment 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:12:32'),
(72, 2, 'Content Updated', '\'Assignment 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:13:08'),
(73, 3, 'Content Updated', '\'Assignment 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:13:08'),
(76, 2, 'New Content Available', 'New content \'video hay nua\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:53:56'),
(77, 3, 'New Content Available', 'New content \'video hay nua\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:53:56'),
(79, 2, 'Content Updated', '\'Quiz 2\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:54:44'),
(80, 3, 'Content Updated', '\'Quiz 2\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:54:44'),
(82, 2, 'New Content Available', 'New content \'Quiz 1\' has been added to General in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:55:41'),
(83, 3, 'New Content Available', 'New content \'Quiz 1\' has been added to General in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 12:55:41'),
(85, 2, 'New Content Available', 'New content \'video hay nua\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 13:02:00'),
(86, 3, 'New Content Available', 'New content \'video hay nua\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 13:02:00'),
(89, 2, 'Content Updated', '\'1.3 Quiz: Introduction Concepts\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 13:10:34'),
(90, 3, 'Content Updated', '\'1.3 Quiz: Introduction Concepts\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 13:10:34'),
(92, 2, 'Content Updated', '\'Quiz 3\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 13:11:24'),
(93, 3, 'Content Updated', '\'Quiz 3\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 13:11:24'),
(95, 2, 'Content Updated', '\'1.3 Quiz: Introduction Concept\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 13:11:45'),
(96, 3, 'Content Updated', '\'1.3 Quiz: Introduction Concept\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 13:11:45'),
(98, 2, 'Content Updated', '\'1.3 Quiz: Introduction Concepts\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 13:30:49'),
(99, 3, 'Content Updated', '\'1.3 Quiz: Introduction Concepts\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-25 13:30:49'),
(101, 2, 'New Content Available', 'New content \'Quiz 2\' has been added to General in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 13:34:55'),
(102, 3, 'New Content Available', 'New content \'Quiz 2\' has been added to General in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 13:34:55'),
(104, 2, 'New Content Available', 'New content \'Quiz 4\' has been added to General in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 13:39:39'),
(105, 3, 'New Content Available', 'New content \'Quiz 4\' has been added to General in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-25 13:39:39'),
(107, 2, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-26 15:51:41'),
(108, 3, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-26 15:51:41'),
(109, 1, 'Feedback Posted', 'Your assignment \'Assignment 1\' has received feedback from your instructor.', 'success', 'assignment', NULL, 1, '2025-11-26 16:37:22', '2025-11-26 16:37:11'),
(110, 1, 'New Topic Added', 'A new topic \'Topic 3\' has been added to Software Testing.', 'info', 'topic', NULL, 1, '2025-11-26 16:38:01', '2025-11-26 16:37:48'),
(111, 2, 'New Topic Added', 'A new topic \'Topic 3\' has been added to Software Testing.', 'info', 'topic', NULL, 0, NULL, '2025-11-26 16:37:48'),
(112, 3, 'New Topic Added', 'A new topic \'Topic 3\' has been added to Software Testing.', 'info', 'topic', NULL, 0, NULL, '2025-11-26 16:37:48'),
(113, 1, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 1, '2025-11-26 16:43:48', '2025-11-26 16:43:23'),
(114, 2, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-26 16:43:23'),
(115, 3, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-26 16:43:23'),
(116, 1, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-26 16:44:41'),
(117, 2, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-26 16:44:41'),
(118, 3, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-26 16:44:41'),
(119, 1, 'New Content Available', 'New content \'Quiz 5\' has been added to General in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-26 16:45:23'),
(120, 2, 'New Content Available', 'New content \'Quiz 5\' has been added to General in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-26 16:45:23'),
(121, 3, 'New Content Available', 'New content \'Quiz 5\' has been added to General in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-26 16:45:23');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quiz_options`
--

CREATE TABLE `quiz_options` (
  `option_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `option_text` text NOT NULL,
  `is_correct` tinyint(1) DEFAULT 0,
  `display_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `quiz_options`
--

INSERT INTO `quiz_options` (`option_id`, `question_id`, `option_text`, `is_correct`, `display_order`) VALUES
(16, 1, 'A. Một quy trình tìm lỗi trong phần mềm.', 0, 0),
(17, 1, 'B. Một quy trình xác minh rằng phần mềm hoạt động đúng như mong đợi.', 0, 1),
(18, 1, 'C. Cả A và B.', 1, 2),
(19, 1, 'D. Một quy trình viết mã.', 0, 3),
(20, 1, 'abc', 0, 4),
(21, 3, 'A. Kiểm thử cấu trúc.', 0, 0),
(22, 3, 'B. Kiểm thử hộp kính.', 1, 1),
(23, 3, 'C. Kiểm thử dựa trên thông số kỹ thuật.', 1, 2),
(24, 4, 'Đúng', 1, 0),
(25, 4, 'Sai', 0, 1),
(26, 5, 'cac', 0, 0),
(27, 5, 'ku', 0, 1),
(28, 5, 'chim', 0, 2),
(29, 5, 'cac dap an con la deu dung', 0, 3),
(30, 6, 'cu', 1, 0),
(31, 6, 'cac', 1, 1),
(32, 6, 'chim', 1, 2),
(43, 10, 'Exam', 1, 0),
(44, 10, 'Dog', 0, 1),
(45, 10, 'Cat', 0, 2),
(46, 11, 'Hi', 1, 0),
(47, 11, 'Halo', 1, 1),
(48, 12, 'Đúng', 0, 0),
(49, 12, 'Sai', 1, 1),
(50, 13, 'Đúng', 0, 0),
(51, 13, 'Sai', 1, 1),
(52, 14, 'hi', 1, 0),
(53, 14, 'bye', 0, 1),
(54, 14, 'goodbye', 0, 2),
(55, 15, 'hi', 1, 0),
(56, 15, 'hallo', 1, 1),
(57, 15, 'bye', 0, 2),
(58, 16, 'bye', 0, 0),
(59, 16, 'hi', 0, 1),
(60, 16, 'halo', 0, 2),
(61, 17, 'hi', 1, 0),
(62, 17, 'halo', 1, 1),
(63, 17, 'bye', 0, 2),
(64, 18, 'Đúng', 0, 0),
(65, 18, 'Sai', 1, 1),
(66, 19, 'hi', 1, 0),
(67, 19, 'bye', 0, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `question_id` int(11) NOT NULL,
  `assessment_id` int(11) NOT NULL,
  `question_text` text NOT NULL,
  `question_type` enum('mc-single','mc-multi','tf') NOT NULL,
  `points` decimal(5,2) DEFAULT 1.00,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `quiz_questions`
--

INSERT INTO `quiz_questions` (`question_id`, `assessment_id`, `question_text`, `question_type`, `points`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 1, '\"Testing\" là gì?', 'mc-single', 1.00, 0, '2025-11-15 02:27:14', '2025-11-16 19:02:30'),
(3, 1, 'Kiểm thử White-box còn được gọi là gì?', 'mc-multi', 1.00, 0, '2025-11-15 02:27:14', '2025-11-16 19:03:06'),
(4, 1, 'dung hay sai', 'tf', 1.00, 0, '2025-11-16 19:11:49', '2025-11-16 19:11:49'),
(5, 1, 'con kec la gi', 'mc-single', 1.00, 0, '2025-11-16 19:12:29', '2025-11-16 19:12:29'),
(6, 1, 'con kec la gi', 'mc-multi', 1.00, 0, '2025-11-16 19:12:49', '2025-11-16 19:12:49'),
(10, 7, 'What is a quiz?', 'mc-single', 1.00, 0, '2025-11-25 12:04:04', '2025-11-25 12:04:04'),
(11, 7, 'Similar to Hello?', 'mc-multi', 1.00, 0, '2025-11-25 12:05:20', '2025-11-25 12:05:20'),
(12, 7, 'A dog is a cat?', 'tf', 1.00, 0, '2025-11-25 12:05:36', '2025-11-25 12:05:36'),
(13, 10, 'dog is a cat?', 'tf', 1.00, 0, '2025-11-25 13:04:38', '2025-11-25 13:04:38'),
(14, 10, 'Similar to hello?', 'mc-single', 1.00, 0, '2025-11-25 13:05:04', '2025-11-25 13:05:04'),
(15, 10, 'Similar to hello?', 'mc-multi', 1.00, 0, '2025-11-25 13:33:05', '2025-11-25 13:33:05'),
(16, 11, 'Similar to hello?', 'mc-single', 1.00, 0, '2025-11-25 13:35:35', '2025-11-25 13:35:35'),
(17, 11, 'similar to hello?', 'mc-multi', 1.00, 0, '2025-11-25 13:35:56', '2025-11-25 13:35:56'),
(18, 11, 'Dog is a cat?', 'tf', 1.00, 0, '2025-11-25 13:36:47', '2025-11-25 13:36:47'),
(19, 12, 'similar to hello?', 'mc-single', 1.00, 0, '2025-11-25 13:40:20', '2025-11-25 13:40:20');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `subject_name` varchar(200) NOT NULL,
  `subject_code` varchar(20) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `instructor_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `subjects`
--

INSERT INTO `subjects` (`subject_id`, `subject_name`, `subject_code`, `description`, `instructor_id`, `created_at`, `updated_at`) VALUES
(1, 'Software Testing', 'CO3015', 'Comprehensive course on Software Testing methodologies and practices', 4, '2025-11-15 02:27:14', '2025-11-15 02:27:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `topics`
--

CREATE TABLE `topics` (
  `topic_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `topic_title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `topics`
--

INSERT INTO `topics` (`topic_id`, `subject_id`, `topic_title`, `description`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 1, 'General', 'General course materials and announcements', 0, '2025-11-15 02:27:14', '2025-11-25 10:25:49'),
(2, 1, 'Topic 1: Introduction to Software Testing', 'Introduction to fundamental concepts of software testing', 0, '2025-11-15 02:27:14', '2025-11-25 09:26:45'),
(3, 1, 'Project', 'Course project and assignments', 2, '2025-11-15 02:27:14', '2025-11-25 10:52:53'),
(6, 1, 'Topic 2', '', 0, '2025-11-25 08:45:57', '2025-11-25 10:52:53'),
(7, 1, 'Topic 3', '', 0, '2025-11-26 16:37:48', '2025-11-26 16:37:48');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('student','instructor') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`user_id`, `username`, `password_hash`, `full_name`, `email`, `role`, `created_at`) VALUES
(1, 'student1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Phan Khánh Nhân', 'nhan.phan@student.edu.vn', 'student', '2025-11-15 02:27:14'),
(2, 'student2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Võ Huỳnh Khánh Vy', 'vy.vo@student.edu.vn', 'student', '2025-11-15 02:27:14'),
(3, 'student3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Văn A', 'a.nguyen@student.edu.vn', 'student', '2025-11-15 02:27:14'),
(4, 'instructor1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bộ Hoài Thắng', 'thang.bo@instructor.edu.vn', 'instructor', '2025-11-15 02:27:14');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `assessments`
--
ALTER TABLE `assessments`
  ADD PRIMARY KEY (`assessment_id`),
  ADD KEY `idx_topic` (`topic_id`),
  ADD KEY `idx_content` (`content_id`),
  ADD KEY `idx_type` (`assessment_type`),
  ADD KEY `idx_visible` (`is_visible`),
  ADD KEY `idx_assessment_topic_type` (`topic_id`,`assessment_type`);

--
-- Chỉ mục cho bảng `assessment_results`
--
ALTER TABLE `assessment_results`
  ADD PRIMARY KEY (`result_id`),
  ADD KEY `idx_assessment` (`assessment_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_student` (`student_id`),
  ADD KEY `idx_submitted` (`submitted_at`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_results_user_assessment` (`user_id`,`assessment_id`),
  ADD KEY `idx_results_student_assessment` (`student_id`,`assessment_id`);

--
-- Chỉ mục cho bảng `content_items`
--
ALTER TABLE `content_items`
  ADD PRIMARY KEY (`content_id`),
  ADD KEY `idx_topic` (`topic_id`),
  ADD KEY `idx_visible` (`is_visible`),
  ADD KEY `idx_order` (`display_order`),
  ADD KEY `idx_content_topic_visible` (`topic_id`,`is_visible`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_read` (`is_read`),
  ADD KEY `idx_created` (`created_at`),
  ADD KEY `idx_user_read` (`user_id`,`is_read`),
  ADD KEY `idx_notifications_user_created` (`user_id`,`created_at`);

--
-- Chỉ mục cho bảng `quiz_options`
--
ALTER TABLE `quiz_options`
  ADD PRIMARY KEY (`option_id`),
  ADD KEY `idx_question` (`question_id`),
  ADD KEY `idx_correct` (`is_correct`);

--
-- Chỉ mục cho bảng `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `idx_assessment` (`assessment_id`),
  ADD KEY `idx_order` (`display_order`);

--
-- Chỉ mục cho bảng `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`),
  ADD KEY `idx_instructor` (`instructor_id`),
  ADD KEY `idx_subject_instructor` (`instructor_id`,`subject_id`);

--
-- Chỉ mục cho bảng `topics`
--
ALTER TABLE `topics`
  ADD PRIMARY KEY (`topic_id`),
  ADD KEY `idx_subject` (`subject_id`),
  ADD KEY `idx_order` (`display_order`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_role` (`role`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `assessments`
--
ALTER TABLE `assessments`
  MODIFY `assessment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT cho bảng `assessment_results`
--
ALTER TABLE `assessment_results`
  MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `content_items`
--
ALTER TABLE `content_items`
  MODIFY `content_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT cho bảng `quiz_options`
--
ALTER TABLE `quiz_options`
  MODIFY `option_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT cho bảng `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `topics`
--
ALTER TABLE `topics`
  MODIFY `topic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `assessments`
--
ALTER TABLE `assessments`
  ADD CONSTRAINT `assessments_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`topic_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assessments_ibfk_2` FOREIGN KEY (`content_id`) REFERENCES `content_items` (`content_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `assessment_results`
--
ALTER TABLE `assessment_results`
  ADD CONSTRAINT `assessment_results_ibfk_1` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`assessment_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assessment_results_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assessment_results_ibfk_3` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `content_items`
--
ALTER TABLE `content_items`
  ADD CONSTRAINT `content_items_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`topic_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `fk_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `quiz_options`
--
ALTER TABLE `quiz_options`
  ADD CONSTRAINT `quiz_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`question_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`assessment_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `subjects`
--
ALTER TABLE `subjects`
  ADD CONSTRAINT `subjects_ibfk_1` FOREIGN KEY (`instructor_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `topics`
--
ALTER TABLE `topics`
  ADD CONSTRAINT `topics_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
