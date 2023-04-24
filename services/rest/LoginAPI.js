const { RESTDataSource } = require('apollo-datasource-rest');

class LoginAPI extends RESTDataSource {
    constructor($restURL) {
        super();
        this.baseURL = $restURL;
    }

    // GET
    async getPing() {
        return this.get(
            `webresources/login` // path
        );
    }

    // POST
    async postLogin(userLogin) {
        return this.post(
            `webresources/login/${encodeURIComponent(a)}` // path
        );
    }
}