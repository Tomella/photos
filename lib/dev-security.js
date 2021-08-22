export default class DevSecurity {
    constructor(config) {
        this.config = config;
    }

    isAdmin() {
        return true;
    }

    user() {
        return this.config.isLocal.user;
    }
}
