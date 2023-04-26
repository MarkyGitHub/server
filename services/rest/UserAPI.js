const { RESTDataSource } = require('apollo-datasource-rest');

class UserAPI extends RESTDataSource {
    constructor($restURL) {
        super();
        this.baseURL = $restURL;
    }

    // PUT
    async newEdit(id) {
        return this.put(
            `webresources/user/${encodeURIComponent(id)}`, // path
        );
    }

    // GET
    async getFind(id) {
        return this.get(
            `webresources/user/${encodeURIComponent(id)}` // path
        );
    }

    // GET
    async getFind() {
        return this.get(
            `webresources/user/${encodeURIComponent(id)}` // path
        );
    }

    // GET
    async getCount() {
        return this.get(
            `webresources/user/count` // path
        );
    }

    // GET
    async getUserData() {
        return this.get(
            `webresources/user/userData` // path
        );
    }

}
module.exports = UserAPI;