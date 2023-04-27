const resolvers = {
  Query: {
    getPing: async (parent, args, context, info) => {
      return await context.dataSources.loginAPI.getPing()
    },
    postLogin: async (parameter, { data }, { context }, info) => {
      return context.dataSources.loginAPI.postLogin();
    },
    
    /* postLogin: async (parent, args, context, info) => {
      return await context.dataSources.loginAPI.postLogin()
    }, */
  },

/*const resolvers = {
  Query: {
    ping: async (_, __, { context }) =>
      dataSources.loginAPI.getPing(),
     login: async (_, userLogin, { dataSources }) =>
       dataSources.loginAPI.postLogin(userLogin),
       timerecording: async (_, __, { dataSources }) => {
        return dataSources.pwaBackendAPI.getTimerecordings();
      },
      user: async (_, __, { dataSources }) => {
        return dataSources.pwaBackendAPI.getUser();
      },
      user: async (_, __, { dataSources }) => {
        return dataSources.pwaBackendAPI.getUser();
      },
      user: async (_, __, { dataSources }) => {
        return dataSources.loginAPI.postLogin();
      },
      user: async (_, __, { dataSources }) => {
        return dataSources.pwaBackendAPI.getUser();
      }, 
  },
};*/

};
module.exports = resolvers;