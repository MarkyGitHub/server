const { UserInputError } = require( "apollo-server-express" );
const { Logger } = require( "winston" );


const resolvers = {
  Query: {
    /**
     * Queries from Login API - Pwa backend
     */
    getPing: async ( parent, args, context, info ) =>
    {
      return await context.dataSources.loginAPI.getPing();
    },
    postLogin: ( parent, { username, password }, context, info ) =>
    {
      return context.dataSources.loginAPI.postLogin( { username, password } );
    },
    /**
     * Queries from TimeRecording API - Pwa backend
     *
    getFind: async (parent, args, context, info) => {
      return await context.dataSources.timeRecordingAPI.getFind();
    },
    getFindByUser: async (parent, args, context, info) => {
      return await context.dataSources.timeRecordingAPI.getFindByUser();
    },
    getFindRange: async (parent, args, context, info) => {
      return await context.dataSources.timeRecordingAPI.getFindRange();
    },
    getCount: async (parent, args, context, info) => {
      return await context.dataSources.timeRecordingAPI.getCount();
    },
    /**
     * Queries from User API - Pwa backend
     *
    getFind: async (parent, args, context, info) => {
      return await context.dataSources.userAPI.getFind();
    },
    getUserData: async (parent, args, context, info) => {
      return await context.dataSources.userAPI.getUserData();
    },
    getCount: async (parent, args, context, info) => {
      return await context.dataSources.userAPI.getCount();
    },
    /**
     * Queries from Customer (PromoSample) API - Pwa backend
     *
    getFind: async (parent, args, context, info) => {
      return await context.dataSources.customerAPI.getFind();
    },
    getFindByUser: async (parent, args, context, info) => {
      return await context.dataSources.customerAPI.getFindByUser();
    },
    getFindRange: async (parent, args, context, info) => {
      return await context.dataSources.customerAPI.getFindRange();
    },
    getCount: async (parent, args, context, info) => {
      return await context.dataSources.customerAPI.getCount();
    }*/
  },
};
module.exports = resolvers;