class SessionManager {
    constructor() {
        this.loadSession(); 
    }

    loadSession() {
        const user = localStorage.getItem('user');
        this.isLogged = user !== null; 
    }

    login(user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.isLogged = true;
    }

    async logout() {
        await new Promise(resolve => setTimeout(resolve, 100));
        localStorage.removeItem('user');
        this.isLogged = false;
    }

    setLoggedIn(status) {
        this.isLogged = status;
    }

    getUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    isLoggedIn() {
        return this.isLogged;
    }
}

export { SessionManager };
