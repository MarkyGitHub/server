const { RESTDataSource } = require('apollo-datasource-rest');

const $userLogin = {
    $username: "075502",
    $password: "mgf"
}

class LoginAPI extends RESTDataSource {

    constructor($restURL) {
        super();
        this.baseURL = $restURL;
    }

    willSendRequest(request) {
        request.headers.set('Content-Type', 'application/json');
        request.headers.set('Accept-Encoding', 'gzip');
        //request.headers.set('Access-Control-Allow-Origin', '*');
        //request.headers.set('Authorization', this.$token);
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
            {  "username": "075502", "password": "mgf" },
            $userLogin, // request body
        );
        return data;
        } catch (error) {
            console.log(error);
        }
       
    }
}

module.exports = LoginAPI;