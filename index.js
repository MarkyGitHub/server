import "dotenv/config";

// Server declarations
import { ApolloServer } from '@apollo/server';

import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginInlineTrace } from "@apollo/server/plugin/inlineTrace";
import { expressMiddleware } from '@apollo/server/express4';

//GraphQL input validation
import validation from 'graphql-constraint-directive';
const { createApolloQueryValidationPlugin, constraintDirectiveTypeDefs, constraintDirectiveDocumentation } = validation;
import { GraphQLError } from 'graphql';

import { makeExecutableSchema } from '@graphql-tools/schema';
import loglevel from 'loglevel';
import winston from 'winston';

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
import cookie from 'cookie';

// Rest data source delarations
import LoginAPI from "./services/rest/LoginAPI.js";
import PromoterActivitiesAPI from './services/rest/PromoterActivitiesAPI.js';

// GraphQL types, resolvers, etc. declarations
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolvers.js';

//Json
import { GraphQLJSON, GraphQLJSONObject } from 'graphql-type-json';

let schema = makeExecutableSchema( {
  typeDefs: [ constraintDirectiveTypeDefs, typeDefs ],
  resolvers: resolvers, // Make sure your resolvers are defined
  constraintDirectiveDocumentation: constraintDirectiveDocumentation(
    {
      header: '*Changed header:*',
      descriptionsMap: {
        minLength: 'Minimale Länge wurde nicht erreicht.',
        maxLength: 'Maximale Länge wurde überschritten.',
        startsWith: 'Beginnt nicht mit ',
        endsWith: 'Beginnt nicht mit ',
        contains: 'Enthält ',
        notContains: 'Enthält nicht',
        pattern: 'Eingabe muss mit dem Eingabemuster übereinstimmen.',
        format: 'Eingabe muss mit dem Format übereinstimmen.',
        min: 'Minimum value',
        max: 'Maximum value',
        exclusiveMin: 'Mindestwert nicht erreicht.',
        exclusiveMax: 'Weniger als Wert überschritten.',
        multipleOf: 'Muss ein Vielfaches sein.',
        minItems: 'Mindestanzahl an Artikeln nicht erreicht.',
        maxItems: 'Maximalanzahl an Artikeln nicht erreicht.'
      }
    }
  ),
} )

/* schema = constraintDirectiveDocumentation(
  {
    header: '*Changed header:*',
    descriptionsMap: {
      minLength: 'Minimale Länge wurde nicht erreicht.',
      maxLength: 'Maximale Länge wurde überschritten.',
      startsWith: 'Beginnt nicht mit ',
      endsWith: 'Beginnt nicht mit ',
      contains: 'Enthält ',
      notContains: 'Enthält nicht',
      pattern: 'Eingabe muss mit dem Eingabemuster übereinstimmen.',
      format: 'Eingabe muss mit dem Format übereinstimmen.',
      min: 'Minimum value',
      max: 'Maximum value',
      exclusiveMin: 'Mindestwert nicht erreicht.',
      exclusiveMax: 'Weniger als Wert überschritten.',
      multipleOf: 'Muss ein Vielfaches sein.',
      minItems: 'Mindestanzahl an Artikeln nicht erreicht.',
      maxItems: 'Maximalanzahl an Artikeln nicht erreicht.'
    }
  }
)( schema ); */

//schema = constraintDirective()( schema )

//Logger
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

// Error handling
import { ApolloServerErrorCode } from '@apollo/server/errors';
/*
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
          message: `Request has errors! @: ${ new Date( Date.now() ).toLocaleString() } `

        } );
        if ( errors.extensions?.code === 'INTERNAL_SERVER_ERROR' )
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
            message: `Request has errors! Errors: ECONNREFUSED`
          } );

        }
      }
    };
  }
};*/

const configurations = {
  // Note: You may need sudo to run on port 443
  production: { ssl: true, port: 443, hostname: 'morgengold.de' },
  development: { ssl: false, port: 4000, hostname: 'localhost' },
};

const config = configurations[ process.env.NODE_ENV || 'production' ];

const formatError = function ( error )
{
  const code = error?.originalError?.originalError?.code || error?.originalError?.code || error?.code
  console.log( code );
  let message = 'Eingabe enthält fehler: ';
  if ( code === ApolloServerErrorCode.BAD_USER_INPUT )
  {
    throw new GraphQLError( message, {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT, myCustomExtensions },
    } );
  }

  return error
}

const app = express();

if ( isProduction )
{
  app.use( ( req, res, next ) =>
  {
    if ( req.path === '/graphql' && req.method === 'GET' )
    {
      res.status( 404 ).send( 'Not found' );
    } else
    {
      next();
    }
  } );
}

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
  origin: [ "https://morgengold.de/", "https://www.morgengold.de/" ],
  credentials: true // <-- REQUIRED backend setting
};

const aCORS = isProduction ? corsOptionsProd : corsOptionsDev

// Set up Apollo Server
const server = new ApolloServer( {
  schema,
  resolvers,
  /*   formatError: ( formattedError, error ) =>
    {
      console.log( "-------------------------------1\n\n", formattedError.extensions.code );
      // Return a different error message
      if ( formattedError.extensions.code.toLocaleString() === 'INTERNAL_SERVER_ERROR' &&
        formattedError.message.toLocaleString().contains( '' )
      ) 
      {
        console.log( "-------------------------------2\n\n", JSON.parse( formattedError.message ) );
        return {
          ...formattedError,
          message: "Eingabe Validierung hat Fehler festgestellt.",
          error: error
        };
      }
  
      // Otherwise return the formatted error. This error can also
      // be manipulated in other ways, as long as it's returned.
      //return formattedError;
    }, */
  // introspection is not allowed for production
  introspection: isProduction ? false : true,
  csrfPrevention: true,
  cache: "bounded",
  logger,
  status400ForVariableCoercionErrors: true,
  includeStacktraceInErrorResponses: false,
  cors: {
    aCORS
  },
  plugins: [
    {
      async serverWillStart ()
      {
        logger.log( {
          level: "info",
          message: `Server Bry-IT starting up....`
        } );
      }
    },
    ...( isProduction
      ? []
      : [ ApolloServerPluginLandingPageLocalDefault( { embed: true } ) ] ), // disable in production
    ApolloServerPluginInlineTrace(),
    createApolloQueryValidationPlugin( {
      schema
    } )/*,
    myPlugin*/
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
    message: `Backend running at ${ restURL }`
  } );
  logger.log( {
    level: "info",
    message: `Server is in Production MODE: ${ isProduction }`
  } );
  logger.log( {
    level: "info",
    message: `Server started @: ${ new Date( Date.now() ).toLocaleString() }`
  } );
} );