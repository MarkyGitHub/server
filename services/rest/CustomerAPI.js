const { RESTDataSource } = require('apollo-datasource-rest');

class CustomerAPI extends RESTDataSource {
    constructor($restURL) {
        super();
        this.baseURL = $restURL;
    }

    // POST
    async postCreate(a) {
        return this.post(
            `webresources/customer/${encodeURIComponent(a)}` // path
        );
    }

    // PUT
    async newEdit(id) {
        return this.put(
            `webresources/customer/${encodeURIComponent(id)}`, // path
        );
    }

    // DELETE
    async deleteRemove(id) {
        return this.delete(
            `webresources/customer/${encodeURIComponent(id)}`, // path
        );
    }

    // GET
    async getFind(id) {
        return this.get(
            `webresources/customer/${encodeURIComponent(id)}` // path
        );
    }

    // GET
    async getFindByUser(user) {
        return this.get(
            `webresources/customer/` // path
        );
    }

    // GET
    async getFindByUser(user) {
        return this.get(
            `webresources/customer/` // path
        );
    }

    // GET
    // GET
    async getFindRange(a) {
        return this.get(
            `webresources/customer/${encodeURIComponent(a / a)}` // path
        );
    }

    // GET
    async getCount() {
        return this.get(
            `webresources/customer/count` // path
        );
    }

}