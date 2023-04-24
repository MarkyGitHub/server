class MoviesAPI extends RESTDataSource {
    constructor() {
      super();
      this.baseURL = process.env.pwabackend_dev;
    }
  
    // GET
    async getUser(id) {
      return this.get(
        `users/${encodeURIComponent(id)}` // path
      );
    }
  }