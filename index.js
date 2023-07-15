import "dotenv/config";

// Server declarations
import cookie from 'cookie';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginInlineTrace } from "@apollo/server/plugin/inlineTrace";
import { expressMiddleware } from '@apollo/server/express4';

// Server constants
const isProduction = process.env.NODE_ENV === "production";
const aOrigin = process.env.yourOrigin;
const restURL = isProduction ? process.env.pwabackend_prod : process.env.pwabackend_dev;

// App declarations
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
import PromoterActivitiesAPI from './services/rest/PromoterActivitiesAPI.js';

//Logger
import loglevel from 'loglevel';
import winston from 'winston';
const { format, transports, createLogger, combine } = winston;
const { CATEGORY } = "PromoApp format";
let logger = loglevel.getLogger( 'apollo-server' );

logger.setLevel( isProduction === false ? loglevel.levels.DEBUG : loglevel.levels.INFO );

logger = winston.createLogger( {
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

// GraphQL types, etc. declarations
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';

// Error handling
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { timeStamp } from "console";

const myPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart ( requestContext )
  {
    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart ( requestContext )
      {
        logger.log( {
          level: "info",
          message: `Parsing started!`
        } );
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart ( requestContext )
      {
        logger.log( {
          level: "info",
          message: `Validation started!`
        } );
      },
      // Fires whenever Apollo Server will have errors
      async didEncounterErrors ( errors )
      {
        logger.log( {
          level: "error",
          message: errors
        } );
        logger.log( {
          level: "error",
          message: `Request has errors! Errors:\n ${ errors.extensions }`
        } );
        if ( errors.extensions?.code === ApolloServerErrorCode.INTERNAL_SERVER_ERROR )
        {
          //GraphQLError.extensions.code
          logger.log( {
            level: "error",
            message: `Request has internal server errors!`
          } );

        } else if ( errors.extensions?.code === 'ECONNREFUSED' )
        {
          logger.log( {
            level: "error",
            message: `Request has errors! Errors:\n ECONNREFUSED`
          } );

        }
      }
    };
  }
};

const configurations = {
  // Note: You may need sudo to run on port 443
  production: { ssl: true, port: 443, hostname: 'morgengold.de' },
  development: { ssl: false, port: 4000, hostname: 'localhost' },
};

const config = configurations[ process.env.NODE_ENV || 'production' ];

const app = express();

// Define your CORS settings for development
const corsOptionsDev = {
  origin: [
    aOrigin,
    "https://studio.apollographql.com",
    "http://localhost:3000",
    "http://v50gf.ibry-it.local:4000/",
    "http://localhost:5173",
    "https://mogo.ibry-it.local/promoapp",
    "https://v50gf.ibry-it.local:8095",
    "https://v50gf.ibry-it.local:8181",
  ], // replace with the domain of your client
  credentials: true // <-- REQUIRED backend setting
};

// Define your CORS settings for production
const corsOptionsProd = {
  origin: [ "https://morgengold.de", "https://www.morgengold.de" ],
  credentials: true // <-- REQUIRED backend setting
};

const aCORS = isProduction ? corsOptionsProd : corsOptionsDev

// Set up Apollo Server
const server = new ApolloServer( {
  typeDefs,
  resolvers,
  introspection: true,
  csrfPrevention: true,
  cache: "bounded",
  logger,
  status400ForVariableCoercionErrors: true,
  cors: {
    aCORS
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
  cors( aCORS ),
  json(),
  expressMiddleware( server, {
    context: async ( { req, res } ) =>
    {
      const cookies = cookie.parse( req.headers.cookie || '' );
      const jwtToken = cookies.jwtToken;
      const loginAPI = new LoginAPI( restURL, req );
      const promoterActivitiesAPI = new PromoterActivitiesAPI( restURL, req, jwtToken );
      logger;
      return {
        request: req,
        response: res,
        dataSources: {
          loginAPI,
          promoterActivitiesAPI,
        },
      };
    },
  } ),
);

app.listen( { port: 4000 }, () =>
{
  logger.log( {
    level: "info",
    message: `Server ready at ${ aOrigin }`
  } );
  logger.log( {
    level: "info",
    message: `Backend ready at ${ restURL }`
  } );
  logger.log( {
    level: "info",
    message: `Server is running in Production MODE: ${ isProduction }`
  } );
  logger.log( {
    level: "info",
    message: `Server started @: ${ new Date( Date.now() ).toLocaleString() }`
  } );
} );