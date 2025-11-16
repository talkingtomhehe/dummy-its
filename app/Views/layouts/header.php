<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?? 'Intelligent Tutoring System' ?></title>
    <link rel="stylesheet" href="/its/public/css/style.css">
    <script src="https://unpkg.com/feather-icons"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body data-base-url="/its">
    <?php if (isset($showHeader) && $showHeader): ?>
    <header>
        <div class="header-left">
            <div class="logo">ITS</div>
            <nav>
                <a href="/its/dashboard" class="nav-link <?= ($activePage ?? '') == 'dashboard' ? 'active' : '' ?>">Dashboard</a>
                <a href="/its/course" class="nav-link <?= ($activePage ?? '') == 'courses' ? 'active' : '' ?>">My courses</a>
            </nav>
        </div>
        <div class="header-right">
            <?php if (isset($isInstructor) && $isInstructor): ?>
            <label class="editing-label">Editing</label>
            <label class="toggle-switch">
                <input type="checkbox" id="editing-toggle" <?= \App\Core\Session::get('is_editing', false) ? 'checked' : '' ?>>
                <span class="slider"></span>
            </label>
            <?php endif; ?>
            
            <button class="icon-button" id="notification-btn">
                <i data-feather="bell"></i>
            </button>
            
            <div class="avatar-container">
                <img src="https://placehold.co/35x35/0D8FA3/FFFFFF?text=<?= substr($userName ?? 'U', 0, 1) ?>" alt="Avatar" class="avatar" id="avatar-btn">
                <div class="avatar-dropdown" id="avatar-dropdown">
                    <div class="avatar-dropdown-item" onclick="window.location.href='/its/profile'">
                        <i data-feather="user"></i>
                        <span>Profile</span>
                    </div>
                    <div class="avatar-dropdown-item" onclick="window.location.href='/its/settings'">
                        <i data-feather="settings"></i>
                        <span>Settings</span>
                    </div>
                    <div class="avatar-dropdown-divider"></div>
                    <div class="avatar-dropdown-item" onclick="window.location.href='/its/logout'">
                        <i data-feather="log-out"></i>
                        <span>Logout</span>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <?php endif; ?>
