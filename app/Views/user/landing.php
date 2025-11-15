<?php
/**
 * Landing Page
 * Welcome page for unauthenticated users
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome - Intelligent Tutoring System</title>
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/css/style.css">
    <script src="https://unpkg.com/feather-icons"></script>
</head>
<body>
    <div class="page login-flow active">
        <div class="landing-page">
            <div class="landing-header">
                <div class="landing-logo">
                    <i data-feather="award"></i>
                    Intelligent Tutoring System
                </div>
                <a href="<?= BASE_URL ?>/select-role" class="button button-secondary" style="background-color: white; color: var(--primary-color);">
                    <i data-feather="log-in"></i>
                    Login
                </a>
            </div>
            <div class="landing-content">
                <h1>Welcome to ITS</h1>
                <p>Your comprehensive platform for online learning, assessments, and knowledge tracking.</p>
                <button class="button" onclick="window.location.href='<?= BASE_URL ?>/select-role'">
                    <i data-feather="arrow-right"></i>
                    Get Started
                </button>
            </div>
        </div>
    </div>
    
    <script>
        feather.replace();
    </script>
</body>
</html>
