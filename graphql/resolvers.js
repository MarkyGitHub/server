const { paginateResults } = require('utils');

const resolvers = {
  Query: {
    customer: async (_, { id }, { dataSources }) => {
      return dataSources.pwaBackendAPI.getCustomer(id);
    },
    timerecording: async (_, __, { dataSources }) => {
      return dataSources.pwaBackendAPI.getTimerecordings();
    },
    user: async (_, __, { dataSources }) => {
      return dataSources.pwaBackendAPI.getUser();
    },
  },
};