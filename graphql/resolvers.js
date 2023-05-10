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
     */
    getFind: async ( parent, { id }, context, info ) =>
    {
      return await context.dataSources.timeRecordingAPI.getFind( id );
    },
    getFindByUser: async ( parent, args, context, info ) =>
    {
      return await context.dataSources.timeRecordingAPI.getFindByUser();
    },
    getFindRange: async ( parent, { from, to }, context, info ) =>
    {
      return await context.dataSources.timeRecordingAPI.getFindRange( from, to );
    },
    getCount: async ( parent, args, context, info ) =>
    {
      return await context.dataSources.timeRecordingAPI.getCount();
    },
    /**
     * Queries from User API - Pwa backend
     */
    getFindUser: async ( parent, { id }, context, info ) =>
    {
      return await context.dataSources.userAPI.getFind( id );
    },
    getUserData: async ( parent, args, context, info ) =>
    {
      return await context.dataSources.userAPI.getUserData();
    },
    getUserCount: async ( parent, args, context, info ) =>
    {
      return await context.dataSources.userAPI.getCount();
    },
    /**
     * Queries from Customer (PromoSample) API - Pwa backend
     */
    getFindCustomer: async ( parent, { id }, context, info ) =>
    {
      return await context.dataSources.customerAPI.getFind( id );
    },
    getFindCustomerByUser: async ( parent, args, context, info ) =>
    {
      return await context.dataSources.customerAPI.getFindByUser();
    },
    getFindCustomerRange: async ( parent, { from, to }, context, info ) =>
    {
      return await context.dataSources.customerAPI.getFindRange( from, to );
    },
    getCustomerCount: async ( parent, args, context, info ) =>
    {
      return await context.dataSources.customerAPI.getCount();
    }
  }
};
module.exports = resolvers;