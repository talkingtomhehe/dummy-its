-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 27, 2025 lúc 05:16 PM
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
  `is_visible` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `max_attempts` int(11) DEFAULT 1 COMMENT 'Maximum number of attempts allowed, 0 = unlimited',
  `grading_method` enum('highest','average','first','last') DEFAULT 'last' COMMENT 'Method to calculate final grade from multiple attempts',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `assessments`
--

INSERT INTO `assessments` (`assessment_id`, `topic_id`, `content_id`, `title`, `assessment_type`, `description`, `time_limit`, `open_time`, `close_time`, `max_score`, `is_visible`, `display_order`, `max_attempts`, `grading_method`, `created_at`, `updated_at`) VALUES
(1, 2, 7, '1.3 Quiz: Introduction Concepts', 'quiz', 'Quiz on basic testing concepts', 30, '2025-11-14 08:00:00', '2025-11-17 23:59:00', 10.00, 1, 0, 1, 'last', '2025-11-15 02:27:14', '2025-11-27 09:53:03'),
(2, 3, 8, 'Nộp bài Assignment', 'assignment', 'Submit your final project assignment', 0, '2025-11-15 00:00:00', '2025-11-26 23:00:00', 10.00, 1, 0, 1, 'last', '2025-11-15 02:27:14', '2025-11-15 02:27:14'),
(9, 6, 22, 'Quiz 1', 'quiz', '', 25, '2025-11-26 15:51:00', '2025-11-28 15:51:00', 10.00, 1, 0, 2, 'average', '2025-11-27 08:51:21', '2025-11-27 10:01:10'),
(10, 6, 23, 'Quiz 2', 'quiz', '', 30, '2025-11-26 16:12:00', '2025-11-28 16:12:00', 10.00, 1, 0, 2, 'highest', '2025-11-27 09:12:42', '2025-11-27 09:30:00'),
(11, 6, 24, 'Assignment 1', 'assignment', '', 0, '2025-11-26 16:55:00', '2025-11-29 16:55:00', 10.00, 1, 0, 1, 'last', '2025-11-27 09:55:34', '2025-11-27 09:55:34'),
(12, 6, 25, 'Quiz 3', 'quiz', '', 30, '2025-11-26 23:04:00', '2025-11-29 23:04:00', 10.00, 1, 0, 1, 'last', '2025-11-27 16:05:03', '2025-11-27 16:05:03');

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
  `attempt_number` int(11) DEFAULT 1 COMMENT 'Attempt number for this submission',
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `started_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `graded_at` timestamp NULL DEFAULT NULL,
  `time_taken` int(11) DEFAULT NULL COMMENT 'Time taken in seconds'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `assessment_results`
--

INSERT INTO `assessment_results` (`result_id`, `assessment_id`, `user_id`, `student_id`, `score`, `answers`, `feedback`, `submission_file`, `original_filenames`, `status`, `attempt_number`, `submitted_at`, `started_at`, `completed_at`, `graded_at`, `time_taken`) VALUES
(1, 1, 1, 1, 6.67, '{\"1\":\"c\",\"2\":\"a\",\"3\":[\"a\",\"b\"]}', NULL, NULL, NULL, 'completed', 1, '2025-11-14 11:02:00', '2025-11-14 17:59:50', '2025-11-14 18:02:00', NULL, 130),
(2, 1, 2, 2, 10.00, '{\"1\":\"c\",\"2\":\"c\",\"3\":[\"a\",\"b\"]}', NULL, NULL, NULL, 'completed', 1, '2025-11-14 12:15:00', '2025-11-14 19:09:28', '2025-11-14 19:15:00', NULL, 332),
(4, 2, 1, 1, NULL, NULL, NULL, 'assignment_2_student_1_20251123090239.pdf', NULL, 'submitted', 1, '2025-11-23 08:02:39', NULL, NULL, NULL, NULL),
(6, 10, 1, 1, 8.33, '{\"10\":\"40\",\"11\":[\"44\"],\"12\":\"47\"}', 'hay qua', NULL, NULL, 'graded', 1, '2025-11-27 09:33:29', '2025-11-27 16:33:15', '2025-11-27 16:33:29', '2025-11-27 09:51:30', 13),
(8, 11, 1, 1, NULL, NULL, NULL, '[\"assignment_11_student_1_20251127165610_0.pdf\",\"assignment_11_student_1_20251127165610_1.pdf\"]', '[\"WorkSummary.pdf\",\"EERD.pdf\"]', 'submitted', 1, '2025-11-27 09:56:10', NULL, NULL, NULL, NULL),
(14, 9, 1, 1, 10.00, '{\"13\":\"48\",\"14\":[\"50\",\"51\"],\"15\":\"54\"}', NULL, NULL, NULL, 'completed', 1, '2025-11-27 16:02:45', '2025-11-27 23:02:26', '2025-11-27 23:02:45', NULL, 18),
(16, 12, 1, 1, 5.00, '{\"16\":[\"59\"]}', NULL, NULL, NULL, 'completed', 1, '2025-11-27 16:09:04', '2025-11-27 23:09:00', '2025-11-27 23:09:04', NULL, 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `content_items`
--

CREATE TABLE `content_items` (
  `content_id` int(11) NOT NULL,
  `topic_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content_type` enum('text','video','link','page','file','quiz','assignment') NOT NULL,
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
(7, 2, '1.3 Quiz: Introduction Concepts', 'quiz', '', NULL, 1, 4, '2025-11-15 02:27:14', '2025-11-27 09:53:03'),
(8, 3, 'Final Project Submission', 'assignment', '<p>Upload your completed project deliverables.</p>', NULL, 1, 2, '2025-11-15 02:27:14', '2025-11-15 02:27:14'),
(21, 6, 'Video hay', 'video', 'https://www.youtube.com/watch?v=M-uUFLU9IFU', NULL, 1, 0, '2025-11-27 08:50:13', '2025-11-27 08:50:13'),
(22, 6, 'Quiz 1', 'quiz', '', NULL, 1, 0, '2025-11-27 08:51:21', '2025-11-27 08:51:21'),
(23, 6, 'Quiz 2', 'quiz', '', NULL, 1, 0, '2025-11-27 09:12:42', '2025-11-27 09:12:42'),
(24, 6, 'Assignment 1', 'assignment', '', NULL, 1, 0, '2025-11-27 09:55:34', '2025-11-27 09:55:34'),
(25, 6, 'Quiz 3', 'quiz', '', NULL, 1, 0, '2025-11-27 16:05:03', '2025-11-27 16:05:03');

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
(4, 2, 'New Topic Added', 'A new topic \'Topic 2\' has been added to Software Testing.', 'info', 'topic', NULL, 0, NULL, '2025-11-27 08:40:21'),
(5, 3, 'New Topic Added', 'A new topic \'Topic 2\' has been added to Software Testing.', 'info', 'topic', NULL, 0, NULL, '2025-11-27 08:40:21'),
(7, 2, 'New Content Available', 'New content \'Video hay\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-27 08:50:13'),
(8, 3, 'New Content Available', 'New content \'Video hay\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-27 08:50:13'),
(10, 2, 'New Content Available', 'New content \'Quiz 1\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-27 08:51:21'),
(11, 3, 'New Content Available', 'New content \'Quiz 1\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-27 08:51:21'),
(13, 2, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-27 08:52:44'),
(14, 3, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-27 08:52:44'),
(16, 2, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-27 09:08:16'),
(17, 3, 'Content Updated', '\'Quiz 1\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-27 09:08:16'),
(19, 2, 'New Content Available', 'New content \'Quiz 2\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-27 09:12:42'),
(20, 3, 'New Content Available', 'New content \'Quiz 2\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-27 09:12:42'),
(22, 2, 'Content Updated', '\'Quiz 2\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-27 09:30:00'),
(23, 3, 'Content Updated', '\'Quiz 2\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-27 09:30:00'),
(24, 1, 'Feedback Posted', 'Your quiz \'Quiz 2\' has received feedback from your instructor.', 'success', 'quiz', NULL, 0, NULL, '2025-11-27 09:51:30'),
(25, 1, 'Content Updated', '\'1.3 Quiz: Introduction Concepts\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-27 09:53:03'),
(26, 2, 'Content Updated', '\'1.3 Quiz: Introduction Concepts\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-27 09:53:03'),
(27, 3, 'Content Updated', '\'1.3 Quiz: Introduction Concepts\' in Software Testing has been updated.', 'info', 'content', NULL, 0, NULL, '2025-11-27 09:53:03'),
(28, 1, 'New Content Available', 'New content \'Assignment 1\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-27 09:55:34'),
(29, 2, 'New Content Available', 'New content \'Assignment 1\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-27 09:55:34'),
(30, 3, 'New Content Available', 'New content \'Assignment 1\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-27 09:55:34'),
(31, 1, 'Feedback Posted', 'Your quiz \'Quiz 1\' has received feedback from your instructor.', 'success', 'quiz', NULL, 0, NULL, '2025-11-27 10:36:12'),
(32, 1, 'New Content Available', 'New content \'Quiz 3\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-27 16:05:03'),
(33, 2, 'New Content Available', 'New content \'Quiz 3\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-27 16:05:03'),
(34, 3, 'New Content Available', 'New content \'Quiz 3\' has been added to Topic 2 in Software Testing.', 'info', 'content', NULL, 0, NULL, '2025-11-27 16:05:03');

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
(40, 10, 'Dog', 1, 0),
(41, 10, 'Cat', 0, 1),
(42, 10, 'Ant', 0, 2),
(43, 11, 'hi', 1, 0),
(44, 11, 'hello', 1, 1),
(45, 11, 'bye', 0, 2),
(46, 12, 'Đúng', 0, 0),
(47, 12, 'Sai', 1, 1),
(48, 13, 'dog', 1, 0),
(49, 13, 'cat', 0, 1),
(50, 14, 'hi', 1, 0),
(51, 14, 'hello', 1, 1),
(52, 14, 'bye', 0, 2),
(53, 15, 'Đúng', 0, 0),
(54, 15, 'Sai', 1, 1),
(58, 16, 'hi', 1, 0),
(59, 16, 'hello', 1, 1),
(60, 16, 'bye', 0, 2);

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
(10, 10, 'Dog is a cat?', 'mc-single', 1.00, 0, '2025-11-27 09:31:33', '2025-11-27 09:31:33'),
(11, 10, 'similar to hi?', 'mc-multi', 1.00, 0, '2025-11-27 09:31:58', '2025-11-27 09:31:58'),
(12, 10, 'dog is a cat?', 'tf', 1.00, 0, '2025-11-27 09:32:13', '2025-11-27 09:32:13'),
(13, 9, 'what is a dog?', 'mc-single', 1.00, 0, '2025-11-27 10:01:37', '2025-11-27 10:01:37'),
(14, 9, 'similar to hello?', 'mc-multi', 1.00, 0, '2025-11-27 10:02:04', '2025-11-27 10:02:04'),
(15, 9, 'dog is a cat?', 'tf', 1.00, 0, '2025-11-27 10:02:19', '2025-11-27 10:02:19'),
(16, 12, 'similar to hello?', 'mc-multi', 1.00, 0, '2025-11-27 16:05:49', '2025-11-27 16:08:45');

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
(1, 'Software Testing', 'CO3015', 'Comprehensive course on Software Testing methodologies and practices', 4, '2025-11-15 02:27:14', '2025-11-15 02:27:14'),
(2, 'Web Development', 'CO3013', 'Comprehensive course on modern web development technologies including HTML, CSS, JavaScript, and frameworks', 4, '2025-11-27 16:14:17', '2025-11-27 16:14:17'),
(3, 'Database Management Systems', 'CO2013', 'Introduction to database design, SQL, and database management concepts', 4, '2025-11-27 16:14:17', '2025-11-27 16:14:17');

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
(1, 1, 'General', 'General course materials and announcements', 0, '2025-11-15 02:27:14', '2025-11-15 02:27:14'),
(2, 1, 'Topic 1: Introduction to Software Testing', 'Introduction to fundamental concepts of software testing', 0, '2025-11-15 02:27:14', '2025-11-27 08:40:27'),
(3, 1, 'Project', 'Course project and assignments', 2, '2025-11-15 02:27:14', '2025-11-15 02:27:14'),
(6, 1, 'Topic 2', '', 1, '2025-11-27 08:40:20', '2025-11-27 08:40:27');

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
  MODIFY `assessment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `assessment_results`
--
ALTER TABLE `assessment_results`
  MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `content_items`
--
ALTER TABLE `content_items`
  MODIFY `content_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT cho bảng `quiz_options`
--
ALTER TABLE `quiz_options`
  MODIFY `option_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT cho bảng `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `topics`
--
ALTER TABLE `topics`
  MODIFY `topic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
