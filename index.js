import "dotenv/config";
// Server declarations

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginInlineTrace } from "@apollo/server/plugin/inlineTrace";
import { expressMiddleware } from '@apollo/server/express4';
//import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import express from 'express';
import http from 'http';
import cors from 'cors';
import pkg from 'body-parser';
const { json } = pkg;

// GraphQL types, etc. declarations
import { readFileSync } from 'fs';

// Rest data source delarations
import { RESTDataSource } from '@apollo/datasource-rest';
import LoginAPI from "./services/rest/LoginAPI.js";

//Logger
import winston from 'winston';
const { format, transports, createLogger, combine } = winston;
const { CATEGORY } = "VertriebsApp format";

//const LoginAPI = require("./services/rest/LoginAPI");
import PromoterActivitiesAPI from './services/rest/PromoterActivitiesAPI.js';

// GraphQL types, etc. declarations
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';

// Error handling
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { makeExecutableSchema } from '@graphql-tools/schema';
//Logger
const { timestamp, label, printf, prettyPrint } = format;

const myPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart ( requestContext )
  {
    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart ( requestContext )
      {
        console.log( "Parsing started!" );
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart ( requestContext )
      {
        console.log( "Validation started!" );
      },
      // Fires whenever Apollo Server will have errors
      async didEncounterErrors ( errors )
      {
        console.log( errors );
        console.log( "Request has errors! Errors:\n" + errors.extensions );
        if ( errors.extensions?.code === ApolloServerErrorCode.INTERNAL_SERVER_ERROR )
        {
          //GraphQLError.extensions.code
          console.log( 'Request has internal server errors! Errors:\n' + errors );
        } else if ( errors.extensions?.code === 'ECONNREFUSED' )
        {
          console.log( 'Request has errors! Errors:\n ECONNREFUSED' + errors );

        }
        console.log( "Request has errors! Errors:\n" + errors );
      }
    };
  }
};

const logger = winston.createLogger( {
  level: "info",

  transports: [
    new transports.File( {
      filename: "./log/error.log",
      level: "error"
    } ),
    new transports.File( {
      filename: "./log/combined.log",
      level: "verbose"
    } ),
    new transports.Console()
  ]
} );

const isProduction = process.env.NODE_ENV === "production";
const aOrigin = process.env.yourOrigin;
const restURL = isProduction ? process.env.pwabackend_prod : process.env.pwabackend_dev;

const app = express();

// Define your CORS settings for development
const corsOptionsDev = {
  origin: [
    aOrigin,
    "https://studio.apollographql.com",
    "http://localhost:3000",
    "http://v50gf.ibry-it.local:4000/",
    "http://localhost:5173",
    "https://mogo.ibry-it.local/vertrieb-app",
    "http://v50gf.ibry-it.local:8095/vertrieb-app",
    "https://v50gf.ibry-it.local:8181/vertrieb-app",
  ], // replace with the domain of your client
  credentials: true // <-- REQUIRED backend setting
};

// Define your CORS settings for production
const corsOptionsProd = {
  origin: [ "https://morgengold.de", "https://www.morgengold.de" ],
  credentials: true // <-- REQUIRED backend setting
};

app.use( cors( isProduction ? corsOptionsProd : corsOptionsDev ) );

// Set up Apollo Server
const server = new ApolloServer( {
  typeDefs,
  resolvers,
  /* context: async ( { req, res } ) =>
   {
     return {
       req,
       res,
       logger,
       cookies: req.cookies
     };
   },
    dataSources: () =>
    {
      return {
        loginAPI: new LoginAPI( restURL ),
        promoterActivitiesAPI: new PromoterActivitiesAPI( restURL ),
      };
    }, */
  introspection: true,
  csrfPrevention: true,
  cache: "bounded",
  cors: {
    ...( isProduction ? corsOptionsProd : corsOptionsDev )
  },
  plugins: [
    {
      async serverWillStart ()
      {
        console.log( "Server Bry-IT starting up...." );
      }
    },
    ...( isProduction
      ? []
      : [ ApolloServerPluginLandingPageLocalDefault( { embed: true } ) ] ), // disable in production
    ApolloServerPluginInlineTrace(),
    myPlugin
  ]
} );

await server.start();

app.use(
  '/graphql',
  cors(),
  json(),
  expressMiddleware( server, {
    context: async ( { req, res } ) =>
    {
      const loginAPI = new LoginAPI( restURL );
      const promoterActivitiesAPI = new PromoterActivitiesAPI( restURL );
      return {
        dataSources: {
          loginAPI,
          promoterActivitiesAPI
        }
      }
    },
  } ),
);

app.listen( { port: 4000 }, () =>
{
  aOrigin: process.env.yourOrigin,
    console.log( `Server ready at ${ process.env.yourOrigin }` );
  console.log( `Backend ready at ${ process.env.pwabackend_dev }` );
  logger.log( {
    level: "info",
    message: `Server ready at ${ process.env.yourOrigin }`
  } );
} );

/**server
  .start()
  .then(() => {
    server.applyMiddleware({ app, cors: false }); // <-- use the CORS middleware, disable built-in cors in apollo server
    if (process.env.NODE_ENV !== "test") {
      app.listen({ port: 4000 }, () => {
        console.log(`Server ready at ${aOrigin + server.graphqlPath}`);
        logger.log({
          level: "info",
          message: `Server ready at ${aOrigin + server.graphqlPath}`
        });
      });
    }
  })
  .catch(error => console.error(error));

 const { url } = await startStandaloneServer( server, {
  context: async () =>
  {
    const customerAPI = new CustomerAPI( restURL );
    const loginAPI = new LoginAPI( restURL );
    const timeRecordingAPI = new TimeRecordingAPI( restURL );
    const userAPI = new UserAPI( restURL );
    return {
      dataSources: {
        customerAPI, loginAPI, timeRecordingAPI, userAPI
      },
      logger,
    };
  },
} ); */

// export all the important pieces for integration/e2e tests to use

