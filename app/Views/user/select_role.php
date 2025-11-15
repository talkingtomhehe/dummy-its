<?php
/**
 * Role Selection Page
 * User chooses whether they are a Student or Instructor
 * This is step 1 of the login flow (before entering credentials)
 */
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Select Role - ITS</title>
    <link rel="stylesheet" href="<?= BASE_URL ?>/public/css/style.css">
    <script src="https://unpkg.com/feather-icons"></script>
</head>
<body>
    <div id="page-select-role" class="page login-flow active">
        <div class="login-container">
            <div class="login-card">
                <div class="logo">
                    <i data-feather="book-open"></i>
                </div>
                <h2>Select Your Role</h2>
                <p>Please choose your role to continue.</p>
                
                <div class="role-selection">
                    <button class="role-button" onclick="selectRole('student')">
                        <i data-feather="user"></i>
                        <span>I am a Student</span>
                    </button>
                    <button class="role-button" onclick="selectRole('instructor')">
                        <i data-feather="briefcase"></i>
                        <span>I am an Instructor</span>
                    </button>
                </div>
                
                <div class="login-links">
                    <a href="<?= BASE_URL ?>/">Back to Home</a>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        feather.replace();
        
        function selectRole(role) {
            const params = new URLSearchParams({ role });

            fetch('<?= BASE_URL ?>/select-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString()
            })
            .then(async response => {
                const payload = await response.json().catch(() => ({}));

                if (response.ok && payload.success) {
                    window.location.href = payload.redirect || '<?= BASE_URL ?>/login';
                    return;
                }

                throw new Error(payload.message || 'Role selection failed.');
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message || 'An error occurred. Please try again.');
            });
        }
    </script>
</body>
</html>
