import { SessionManager } from '../SessionManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const sessionManager = new SessionManager();

    const hideMenuBasedOnPermissions = () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const dropdownMenu = document.querySelector('.dropdown-nav-menu');
        let showMenu = true;

        if (!user || !user.userPermissions) {
            showMenu = false;
        } else {
            const permissions = user.userPermissions;

            if (!permissions.includes(10) && !permissions.includes(11)) {
                document.getElementById('manage-payment').style.display = 'none';
            }
        }

        dropdownMenu.style.display = showMenu ? 'block' : 'none';
    };

    hideMenuBasedOnPermissions();

    const loginLink = document.querySelector('a[asp-page="/Login"]');
    if (loginLink) {
        loginLink.addEventListener('click', async (event) => {
            if (sessionManager.isLoggedIn()) {
                event.preventDefault();
                window.location.href = "/AccountInformation";
            }
        });
    }

    const logoutLink = document.getElementById('log-out');
    if (logoutLink) {
        logoutLink.addEventListener('click', async (event) => {
            event.preventDefault();
            if (sessionManager.isLoggedIn()) {
                await sessionManager.logout();
                alert("Logged out successfully.");
                window.location.href = "/Index";
            } else {
                console.log("No active session found.");
            }
        });
    }

    const currentPage = window.location.pathname;

    if (!sessionManager.isLoggedIn()) {
        if (currentPage === '/Logout') {
            sessionManager.logout();
            alert("Logged out successfully.");
            window.location.href = "/Index";
        }
    } else {
        if (currentPage === '/Login') {
            window.location.href = "/AccountInformation";
        }
    }
});
