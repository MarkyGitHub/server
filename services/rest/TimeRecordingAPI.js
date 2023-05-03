const { RESTDataSource } = require('apollo-datasource-rest');

class TimeRecordingAPI extends RESTDataSource {

    constructor($restURL) {
        super();
        this.baseURL = $restURL;
    }

    willSendRequest(request) {
        request.headers.set('Content-Type', 'application/json');
        request.headers.set('Accept-Encoding', 'gzip');
    }

    // POST
    async postCreate(id, entity) {
        const data = this.post(`webresources/timerecording/${encodeURIComponent(a)}`, // path
            { entity }, // request body
        );
    }

    // PUT
    async newEdit(id, entity) {
        return this.put(`webresources/timerecording/${encodeURIComponent(id)}`, // path
        entity, // request body
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
        const data = await  this.get(
            `webresources/timerecording/${encodeURIComponent(id)}` // path
        );
        return data;
    }

    // GET
    async getFindByUser(user) {
        const data = await  this.get(
            `webresources/timerecording/` // path
        );
        return data;
    }

    // GET
    async getFindRange(from, to) {
        const data = await this.get(
            `webresources/timerecording/${encodeURIComponent(from / to)}` // path
        );
        return data;
    }

    // GET
    async getCount() {
        const data = await this.get(
            `webresources/timerecording/count` // path
        );
        return data;
    }

}
module.exports = TimeRecordingAPI;