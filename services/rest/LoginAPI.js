const { RESTDataSource } = require('apollo-datasource-rest');

class LoginAPI extends RESTDataSource {
    constructor($restURL) {
        super();
        this.baseURL = $restURL;
    }

    /*  willSendRequest(request) {
         request.headers.set('Authorization', this.context.token);
     } */

    // GET
    async getPing() {
        const data = await this.get('https://mogo.ibry-it.local/pwabackend/webresources/login')
        console.log(data);
        return data
        return this.get(`webresources/login`);
    }

    /* // POST
    async postLogin(userLogin) {
        return this.post(
            `webresources/login/${encodeURIComponent(a)}` // path
        );
    } */
}

module.exports = LoginAPI;