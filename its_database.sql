-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 15, 2025 lúc 11:05 AM
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
  `title` varchar(200) NOT NULL,
  `assessment_type` enum('quiz','project','assignment') NOT NULL,
  `description` text DEFAULT NULL,
  `time_limit` int(11) DEFAULT 0 COMMENT 'Time limit in minutes, 0 = no limit',
  `open_time` datetime DEFAULT NULL,
  `close_time` datetime DEFAULT NULL,
  `max_score` decimal(5,2) DEFAULT 10.00,
  `is_visible` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `assessments`
--

INSERT INTO `assessments` (`assessment_id`, `topic_id`, `title`, `assessment_type`, `description`, `time_limit`, `open_time`, `close_time`, `max_score`, `is_visible`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 2, '1.3 Quiz: Introduction Concepts', 'quiz', 'Quiz on basic testing concepts', 30, '2025-11-14 08:00:00', '2025-11-17 23:59:00', 10.00, 1, 0, '2025-11-15 09:27:14', '2025-11-15 09:27:14'),
(2, 3, 'Nộp bài Assignment', 'assignment', 'Submit your final project assignment', 0, '2025-11-15 00:00:00', '2025-11-26 23:00:00', 10.00, 1, 0, '2025-11-15 09:27:14', '2025-11-15 09:27:14');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `assessment_results`
--

CREATE TABLE `assessment_results` (
  `result_id` int(11) NOT NULL,
  `assessment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `score` decimal(5,2) DEFAULT NULL,
  `answers` text DEFAULT NULL COMMENT 'JSON encoded answers',
  `feedback` text DEFAULT NULL,
  `submission_file` varchar(500) DEFAULT NULL,
  `submitted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `graded_at` timestamp NULL DEFAULT NULL,
  `time_taken` int(11) DEFAULT NULL COMMENT 'Time taken in seconds'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `assessment_results`
--

INSERT INTO `assessment_results` (`result_id`, `assessment_id`, `user_id`, `score`, `answers`, `feedback`, `submission_file`, `submitted_at`, `graded_at`, `time_taken`) VALUES
(1, 1, 1, 6.67, '{\"1\":\"c\",\"2\":\"a\",\"3\":[\"a\",\"b\"]}', NULL, NULL, '2025-11-14 18:02:00', NULL, 130),
(2, 1, 2, 10.00, '{\"1\":\"c\",\"2\":\"c\",\"3\":[\"a\",\"b\"]}', NULL, NULL, '2025-11-14 19:15:00', NULL, 332);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `content_items`
--

CREATE TABLE `content_items` (
  `content_id` int(11) NOT NULL,
  `topic_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `content_type` enum('text','video','link','page','file') NOT NULL,
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
(1, 1, 'Announcements', 'page', '<h2>Course Announcements</h2><p>Welcome to Software Testing course!</p>', NULL, 1, 1, '2025-11-15 09:27:14', '2025-11-15 09:27:14'),
(2, 1, 'Course Q&A Forum', 'page', '<h2>Q&A Forum</h2><p>Ask your questions here.</p>', NULL, 1, 2, '2025-11-15 09:27:14', '2025-11-15 09:27:14'),
(3, 2, '1.1 Slides: Introduction to Software Testing', 'page', '<h2>Introduction to Software Testing</h2><p>Software testing is a critical phase in software development...</p><p>Key concepts include: Verification, Validation, Quality Assurance.</p>', NULL, 1, 1, '2025-11-15 09:27:14', '2025-11-15 09:27:14'),
(4, 2, '1.2 Video: What is Testing?', 'video', 'https://www.youtube.com/embed/example', NULL, 1, 2, '2025-11-15 09:27:14', '2025-11-15 09:27:14'),
(5, 2, '1.2.1 External Link: Introduction to Testing', 'link', 'https://www.guru99.com/software-testing-introduction-importance.html', NULL, 1, 3, '2025-11-15 09:27:14', '2025-11-15 09:27:14'),
(6, 3, 'Assignment Specification', 'page', '<h2>Final Project Assignment</h2><p>Develop a comprehensive test plan for a given software system.</p><p><strong>Requirements:</strong></p><ul><li>Test case design</li><li>Test execution plan</li><li>Bug report documentation</li></ul>', NULL, 1, 1, '2025-11-15 09:27:14', '2025-11-15 09:27:14');

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
(1, 1, 'A. Một quy trình tìm lỗi trong phần mềm.', 0, 1),
(2, 1, 'B. Một quy trình xác minh rằng phần mềm hoạt động đúng như mong đợi.', 0, 2),
(3, 1, 'C. Cả A và B.', 1, 3),
(4, 1, 'D. Một quy trình viết mã.', 0, 4),
(5, 2, 'A. Chức năng đầu vào.', 0, 1),
(6, 2, 'B. Chức năng đầu ra.', 0, 2),
(7, 2, 'C. Cấu trúc mã nguồn bên trong.', 1, 3),
(8, 3, 'A. Kiểm thử cấu trúc.', 1, 1),
(9, 3, 'B. Kiểm thử hộp kính.', 1, 2),
(10, 3, 'C. Kiểm thử dựa trên thông số kỹ thuật.', 0, 3);

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
(1, 1, '\"Testing\" là gì?', 'mc-single', 3.33, 1, '2025-11-15 09:27:14', '2025-11-15 09:27:14'),
(2, 1, 'Kiểm thử Black-box KHÔNG quan tâm đến:', 'mc-single', 3.33, 2, '2025-11-15 09:27:14', '2025-11-15 09:27:14'),
(3, 1, 'Kiểm thử White-box còn được gọi là gì?', 'mc-multi', 3.34, 3, '2025-11-15 09:27:14', '2025-11-15 09:27:14');

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
(1, 'Software Testing', 'CO3015', 'Comprehensive course on Software Testing methodologies and practices', 4, '2025-11-15 09:27:14', '2025-11-15 09:27:14');

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
(1, 1, 'General', 'General course materials and announcements', 0, '2025-11-15 09:27:14', '2025-11-15 09:27:14'),
(2, 1, 'Topic 1: Introduction to Software Testing', 'Introduction to fundamental concepts of software testing', 1, '2025-11-15 09:27:14', '2025-11-15 09:27:14'),
(3, 1, 'Project', 'Course project and assignments', 2, '2025-11-15 09:27:14', '2025-11-15 09:27:14');

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
(1, 'student1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Phan Khánh Nhân', 'nhan.phan@student.edu.vn', 'student', '2025-11-15 09:27:14'),
(2, 'student2', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Võ Huỳnh Khánh Vy', 'vy.vo@student.edu.vn', 'student', '2025-11-15 09:27:14'),
(3, 'student3', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyễn Văn A', 'a.nguyen@student.edu.vn', 'student', '2025-11-15 09:27:14'),
(4, 'instructor1', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bộ Hoài Thắng', 'thang.bo@instructor.edu.vn', 'instructor', '2025-11-15 09:27:14');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `assessments`
--
ALTER TABLE `assessments`
  ADD PRIMARY KEY (`assessment_id`),
  ADD KEY `idx_topic` (`topic_id`),
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
  ADD KEY `idx_submitted` (`submitted_at`),
  ADD KEY `idx_results_user_assessment` (`user_id`,`assessment_id`);

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
  MODIFY `assessment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `assessment_results`
--
ALTER TABLE `assessment_results`
  MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `content_items`
--
ALTER TABLE `content_items`
  MODIFY `content_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `quiz_options`
--
ALTER TABLE `quiz_options`
  MODIFY `option_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `topics`
--
ALTER TABLE `topics`
  MODIFY `topic_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  ADD CONSTRAINT `assessments_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`topic_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `assessment_results`
--
ALTER TABLE `assessment_results`
  ADD CONSTRAINT `assessment_results_ibfk_1` FOREIGN KEY (`assessment_id`) REFERENCES `assessments` (`assessment_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assessment_results_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `content_items`
--
ALTER TABLE `content_items`
  ADD CONSTRAINT `content_items_ibfk_1` FOREIGN KEY (`topic_id`) REFERENCES `topics` (`topic_id`) ON DELETE CASCADE;

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
