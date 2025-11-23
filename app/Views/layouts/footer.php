    <!-- Footer -->
    <footer class="site-footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>About ITS</h3>
                <p>Intelligent Tutoring System - An advanced learning platform designed to enhance student engagement and learning outcomes.</p>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul class="footer-links">
                    <li><a href="<?= BASE_URL ?>/dashboard">Dashboard</a></li>
                    <li><a href="<?= BASE_URL ?>/course">Courses</a></li>
                    <li><a href="<?= BASE_URL ?>/profile">Profile</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Contact Us</h3>
                <ul class="footer-contact">
                    <li><i data-feather="mail"></i> support@its-platform.edu</li>
                    <li><i data-feather="phone"></i> +84 123 456 789</li>
                    <li><i data-feather="map-pin"></i> Ho Chi Minh City, Vietnam</li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Follow Us</h3>
                <div class="footer-social">
                    <a href="#" title="Facebook"><i data-feather="facebook"></i></a>
                    <a href="#" title="Twitter"><i data-feather="twitter"></i></a>
                    <a href="#" title="LinkedIn"><i data-feather="linkedin"></i></a>
                    <a href="#" title="GitHub"><i data-feather="github"></i></a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; <?= date('Y') ?> Intelligent Tutoring System. All rights reserved.</p>
        </div>
    </footer>

    <script src="<?= BASE_URL ?>/public/js/main.js"></script>
    <script>
        feather.replace();
    </script>
</body>
</html>
