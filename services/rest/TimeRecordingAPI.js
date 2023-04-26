const { RESTDataSource } = require('apollo-datasource-rest');

class TimeRecordingAPI extends RESTDataSource {
    constructor($restURL) {
        super();
        this.baseURL = $restURL;
    }

    // POST
    async postCreate(a) {
        return this.post(
            `webresources/timerecording/${encodeURIComponent(a)}` // path
        );
    }

    // PUT
    async newEdit(id, entity) {
        return this.put(
            `webresources/timerecording/${encodeURIComponent(id)}`, // path
            movie, // request body
        );
    }

    // DELETE
    async deleteRemove(id) {
        return this.delete(
            `webresources/timerecording/${encodeURIComponent(id)}`, // path
        );
    }

    // GET
    async getFind(id) {
        return this.get(
            `webresources/timerecording/${encodeURIComponent(id)}` // path
        );
    }

    // GET
    async getFindByUser(user) {
        return this.get(
            `webresources/timerecording/` // path
        );
    }

    // GET
    async getFindRange(a) {
        return this.get(
            `webresources/timerecording/${encodeURIComponent(a / a)}` // path
        );
    }

    // GET
    async getCount() {
        return this.get(
            `webresources/timerecording/count` // path
        );
    }

}
module.exports = TimeRecordingAPI;