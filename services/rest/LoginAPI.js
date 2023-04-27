const { RESTDataSource } = require('apollo-datasource-rest');

//$token: String;
const $userLogin = {
    $username: "075502",
    $password: "mgf"
}

class LoginAPI extends RESTDataSource {
    constructor($restURL) {
        super();
        this.baseURL = $restURL;
        // this.$token = $aToken;
    }

    willSendRequest(request) {
        request.headers.set('Content-Type', 'application/json');
        request.headers.set('Access-Control-Allow-Origin', '*');
        request.headers.set('Authorization', this.$token);
    }

    // GET
    async getPing() {
        return this.get(`${this.baseURL}webresources/login`);
    }

    // POST
    async postLogin(userdata) {
        const data = this.post(`${this.baseURL}webresources/login`, // path
            userdata, // request body
        );
        //const data=  this.post(`${this.baseURL}webresources/login${encodeURIComponent($username/$password)}`);
        //this.$token = data.getToken();
        return data;
    }
}

module.exports = LoginAPI;