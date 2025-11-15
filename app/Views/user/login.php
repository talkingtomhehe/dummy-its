<?php
/**
 * Login Form Page
 * Step 2 of login flow: User enters username and password
 * Role was already selected in the previous step
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - ITS</title>
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/css/style.css">
    <script src="https://unpkg.com/feather-icons"></script>
</head>
<body>
    <div id="page-login-form" class="page login-flow active">
        <div class="login-container">
            <div class="login-card">
                <div class="logo">
                    <i data-feather="book-open"></i>
                </div>
                <h2 id="login-title">Login<?= isset($roleLabel) ? ' as ' . $roleLabel : '' ?></h2>
                <p>Please enter your account information.</p>
                
                <?php if (isset($error)): ?>
                <div class="alert alert-danger" style="padding: 10px; margin-bottom: 20px; background-color: #f8d7da; color: #721c24; border-radius: 6px;">
                    <?= htmlspecialchars($error) ?>
                </div>
                <?php endif; ?>
                
                <form method="POST" action="<?= BASE_URL ?>/login" class="login-form" id="login-form">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" name="username" required 
                               value="<?= htmlspecialchars($_POST['username'] ?? '') ?>" 
                               placeholder="Enter your username">
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required 
                               placeholder="Enter your password">
                    </div>
                    
                    <button type="submit" class="button button-primary">
                        <i data-feather="log-in"></i>
                        Login
                    </button>
                </form>
                
                <div class="login-links">
                    <a href="<?= BASE_URL ?>/select-role">Back</a>
                    <a href="#">Forgot Password?</a>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        feather.replace();
    </script>
</body>
</html>
