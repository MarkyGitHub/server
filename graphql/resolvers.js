import DateTimeSSSZ from "./DateTimeSSSZ.js";
import JavaDate from "./JavaDate.js";

//Json
//import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';

import { promises as fs } from 'fs';

async function readJson ( jsonFile )
{

  try
  {

    const data = await fs.readFile( jsonFile, 'utf8' );

    const assistent = JSON.parse( data );

    return assistent;

  } catch ( err )
  {
    console.error( err );
    throw err;

  }

}

const assistents = await readJson( './data/salesAssistent.json' );
const samples = await readJson( './data/samples.json' );
const customers = await readJson( './data/customers.json' );

const resolvers = {
  DateTimeSSSZ,
  JavaDate,
  Query: {
    /**
     * Queries from Login API - Pwa backend
     */
    getPing: async ( parent, args, context, info ) =>
    {
      return await context.dataSources.loginAPI.getPing();
    },
    postLogin: async ( parent, { username, password }, context, info ) =>
    {
      const data = await context.dataSources.loginAPI.postLogin(
        username,
        password
      );
      if ( data && data.jwtToken )
      {
        context.response.cookie( "jwtToken", data.jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24
        } );
      }
      return data;
    },
    getSampleDeliveries: async (parent, { calendarWeek, paginate }, context, info) => {

      const page = paginate.page || 1; // Default to page 1 if no page provided
      const limit = paginate.limit || 10; // Default to 10 items per page
    
      const startIndex = (page - 1) * limit;
      const paginatedSamples = samples.slice(startIndex, startIndex + limit);
      const hasNextPage = startIndex + limit < samples.length;
      const totalPages = Math.ceil(samples.length / limit);
    

      const mySamples = paginatedSamples.map(sample => {
        const customerData = customers.find(customer => customer.id === sample.customer);
        return { ...sample, customerData };
      });

      return {
        items: mySamples,
        hasNextPage,
        totalPages
      };
    },
     getSalesAssistent: async ( parent, args, context, info ) =>
     {
        const { username, password } = args; // Destructure username and password from args
        const filteredAssistent = assistents.filter( ( user ) =>
        {
          return ( user.userName === username );
        } );
        return filteredAssistent;
      
     }
  },

  Mutation: {
    postCreatePromoterActivities: async (
      parent,
      { entities },
      context,
      info
    ) =>
    {
      // Assuming you have a method in your promoterActivityDriveAPI that handles this
      return await context.dataSources.promoterActivitiesAPI.postCreatePromoterActivities(
        entities
      );
    },

    // Mutations for Sales-App

    saveSampleDelivery: async ( parent, { sampleDelivery }, context, info
    ) =>
    {
      //todo
      return;

    },

    acceptSampleDelivery: async ( parent, { sampleDelivery }, context, info
    ) =>
    {
      //todo
      return;
    }

  }
};

export default resolvers;