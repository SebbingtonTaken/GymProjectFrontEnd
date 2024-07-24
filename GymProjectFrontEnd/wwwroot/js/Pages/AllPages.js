import { SessionManager } from '../SessionManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const sessionManager = new SessionManager();

    const loginLink = document.querySelector('a[asp-page="/Login"]');
    if (loginLink) {
        loginLink.addEventListener('click', async (event) => {
            if (sessionManager.isLoggedIn()) {
                event.preventDefault();
                window.location.href = "/AccountInformation";
            }
        });
    }

    const logoutLink = document.querySelector('a[asp-page="/Logout"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', async (event) => {
            event.preventDefault();
            await sessionManager.logout();
            alert("Logged out successfully.");
            window.location.href = "/Index";
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
