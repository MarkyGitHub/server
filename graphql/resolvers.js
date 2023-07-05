const { UserInputError } = require("apollo-server-express");
const { Logger } = require("winston");

const resolvers = {
  Query: {
    /**
     * Queries from Login API - Pwa backend
     */
    getPing: async (parent, args, context, info) => {
      return await context.dataSources.loginAPI.getPing();
    },
    postLogin: async (parent, { username, password }, context, info) => {
      const data = await context.dataSources.loginAPI.postLogin(
        username,
        password
      );
      if (data && data.jwtToken) {
        context.res.cookie("jwtToken", data.jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24
        });
      }
      return data;
    },
    /**
     * Queries from TimeRecording API - Pwa backend
     */
    getFind: async (parent, { id }, context, info) => {
      return await context.dataSources.timeRecordingAPI.getFind(id);
    },
    getFindByUser: async (parent, args, context, info) => {
      return await context.dataSources.timeRecordingAPI.getFindByUser();
    },
    getFindRange: async (parent, { from, to }, context, info) => {
      return await context.dataSources.timeRecordingAPI.getFindRange(from, to);
    },
    getCount: async (parent, args, context, info) => {
      return await context.dataSources.timeRecordingAPI.getCount();
    },
    /**
     * Queries from User API - Pwa backend
     */
    getFindUser: async (parent, { id }, context, info) => {
      return await context.dataSources.userAPI.getFind(id);
    },
    getUserData: async (parent, args, context, info) => {
      return await context.dataSources.userAPI.getUserData();
    },
    getUserCount: async (parent, args, context, info) => {
      return await context.dataSources.userAPI.getCount();
    },
    /**
     * Queries from Customer (PromoSample) API - Pwa backend
     */
    getFindCustomer: async (parent, { id }, context, info) => {
      return await context.dataSources.customerAPI.getFind(id);
    },
    getFindCustomerByUser: async (parent, args, context, info) => {
      return await context.dataSources.customerAPI.getFindByUser();
    },
    getFindCustomerRange: async (parent, { from, to }, context, info) => {
      return await context.dataSources.customerAPI.getFindRange(from, to);
    },
    getCustomerCount: async (parent, args, context, info) => {
      return await context.dataSources.customerAPI.getCount();
    }
  },

  Mutation: {
    /**
     * 
     */
    postCreatePromoSamples: async (parent, { entities }, context, info) => {
      // Assuming you have a method in your customerAPI that handles this
      return await context.dataSources.customerAPI.postCreatePromoSamples(
        entities
      );
    },
    /*editPromoSample: async (parent, {id, entity}, context, info) => {
      return await context.dataSources.customerAPI.editPromoSample(id, entity);
    },
    deletePromoSample: async (parent, {id}, context, info) => {
      return await context.dataSources.customerAPI.deletePromoSample(id);
    },  }*/
    postCreatePromoterActivityHA: async (
      parent,
      { entities },
      context,
      info
    ) => {
      // Assuming you have a method in your promoterActivityHAAPI that handles this
      return await context.dataSources.promoterActivityHAAPI.postCreatePromoterActivityHA(
        entities
      );
    },
    postCreatePromoterDriveActivity: async (
      parent,
      { entities },
      context,
      info
    ) => {
      // Assuming you have a method in your promoterActivityDriveAPI that handles this
      return await context.dataSources.promoterActivityDriveAPI.postCreatePromoterActivityDrive(
        entities
      );
    },
    postCreatePromoterActivityCTADistribute: async (
      parent,
      { entities },
      context,
      info
    ) => {
      // Assuming you have a method in your promoterActivityDriveAPI that handles this
      return await context.dataSources.promoterActivityCTADistributeAPI.postCreatePromoterActivityCTADistribute(
        entities
      );
    },
    postCreatePromoterActivityCTACollect: async (
      parent,
      { entities },
      context,
      info
    ) => {
      // Assuming you have a method in your promoterActivityDriveAPI that handles this
      return await context.dataSources.promoterActivityCTACollectAPI.postCreatePromoterActivityCTACollect(
        entities
      );
    },
    postCreatePromoterActivities: async (
      parent,
      { entities },
      context,
      info
    ) => {
      // Assuming you have a method in your promoterActivityDriveAPI that handles this
      return await context.dataSources.promoterActivitiesAPI.postCreatePromoterActivities(
        entities
      );
    }
  }
};
module.exports = resolvers;
