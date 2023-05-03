const { RESTDataSource } = require('apollo-datasource-rest');

class LoginAPI extends RESTDataSource {

    constructor($restURL) {
        super();
        this.baseURL = $restURL;
    }

    willSendRequest(request) {
        request.headers.set('Content-Type', 'application/json');
        request.headers.set('Accept-Encoding', 'gzip');
    }

    // GET
    async getPing() {
        const data = await this.get(`${this.baseURL}webresources/login`);
        return data;
    }

    // POST
    async postLogin() {
        try {
            const data = this.post(`${this.baseURL}webresources/login`, // path
            {  "username": "marek", "password": "mgf" }, // request body
        );
        return data;
        } catch (error) {
            console.log(error);
        }       
    }
}

module.exports = LoginAPI;