import { RESTDataSource } from '@apollo/datasource-rest';

class PwaBackendAPI extends RESTDataSource {
  constructor($restURL) {
    super();
    this.baseURL = $restURL;
  }

  async getCustomer(id) {
    return this.get(
      `webresources/customer/${encodeURIComponent(id)}` // path
    );
  }

  async getTimerecordings(limit = 10) {
    const data = await this.get('timerecording', {
      // Query parameters
      per_page: limit,
      order_by: 'created',
    });
    return data.results;
  }

  async getUser(id) {
    return this.get(
      `webresources/user/${encodeURIComponent(id)}` // path
    );
  }
}

module.exports = PwaBackendAPI;
