require("dotenv").config();
// Server declarations

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs, resolvers } from './schema';

const { ApolloServer, gql } = require("apollo-server-express");
const {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginInlineTrace
} = require("apollo-server-core");
const { GraphQLJSON, GraphQLJSONObject } = require("graphql-type-json");

// Rest data source delarations
const { RESTDataSource } = require("apollo-datasource-rest");
const CustomerAPI = require("./services/rest/CustomerAPI");
const LoginAPI = require("./services/rest/LoginAPI");
const TimeRecordingAPI = require("./services/rest/TimeRecordingAPI");
const UserAPI = require("./services/rest/UserAPI");

const PromoterActivityHAAPI = require("./services/rest/PromoterActivityHAAPI");
const PromoterActivityDriveAPI = require("./services/rest/PromoterActivityDriveAPI");
const PromoterActivityCTADistributeAPI = require("./services/rest/PromoterActivityCTADistributeAPI");
const PromoterActivityCTACollectAPI = require("./services/rest/PromoterActivityCTACollectAPI");
const PromoterActivitiesAPI = require("./services/rest/PromoterActivitiesAPI");

// GraphQL types, etc. delarations
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

//Logger
const winston = require("winston");
const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, printf, prettyPrint } = format;
const CATEGORY = "VertriebsApp format";
const express = require("express");

// Error handling
//const { ApolloServerErrorCode } = require( '@apollo/server/errors' );
const { GraphQLError } = require("graphql");
const cors = require("cors");

// Security, Authentication, CORS, etc.

const myPlugin = {
  // Fires whenever a GraphQL request is received from a client.
  async requestDidStart(requestContext) {
    return {
      // Fires whenever Apollo Server will parse a GraphQL
      // request to create its associated document AST.
      async parsingDidStart(requestContext) {
        console.log("Parsing started!");
      },

      // Fires whenever Apollo Server will validate a
      // request's document AST against your GraphQL schema.
      async validationDidStart(requestContext) {
        console.log("Validation started!");
      },
      // Fires whenever Apollo Server will have errors
      async didEncounterErrors(errors) {
        console.log(errors);
        console.log("Request has errors! Errors:\n" + errors.extensions);
        /*if ( errors.extensions?.code === ApolloServerErrorCode.INTERNAL_SERVER_ERROR )
        {
          //GraphQLError.extensions.code
          console.log( 'Request has internal server errors! Errors:\n' + errors );
        } else if ( errors.extensions?.code === 'ECONNREFUSED' )
        {
          console.log( 'Request has errors! Errors:\n ECONNREFUSED' + errors );

        }*/
        console.log("Request has errors! Errors:\n" + errors);
      }
    };
  }
};

const logger = winston.createLogger({
  level: "info",
  format: combine(
    label({ label: CATEGORY }),
    timestamp({
      format: "MMM-DD-YYYY HH:mm:ss"
    }),
    prettyPrint()
  ),
  transports: [
    new transports.File({
      filename: "./log/error.log",
      level: "error"
    }),
    new transports.File({
      filename: "./log/combined.log",
      level: "verbose"
    }),
    new transports.Console()
  ]
});

const isProduction = process.env.NODE_ENV === "production";
const aOrigin = process.env.yourOrigin;
const restURL = isProduction
  ? process.env.pwabackend_prod
  : process.env.pwabackend_dev;

const app = express();

// Define your CORS settings for development
const corsOptionsDev = {
  origin: [
    aOrigin,
    "https://studio.apollographql.com",
    "http://localhost:3000",
    "http://v50gf.ibry-it.local:4000/",
    "http://localhost:5173",
    "https://mogo.ibry-it.local/vertrieb-app"
  ], // replace with the domain of your client
  credentials: true // <-- REQUIRED backend setting
};

// Define your CORS settings for production
const corsOptionsProd = {
  origin: ["https://morgengold.de", "https://www.morgengold.de"],
  credentials: true // <-- REQUIRED backend setting
};

app.use(cors(isProduction ? corsOptionsProd : corsOptionsDev));

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    return {
      req,
      res,
      logger,
      cookies: req.cookies
    };
  },
  dataSources: () => {
    return {
      customerAPI: new CustomerAPI(restURL),
      loginAPI: new LoginAPI(restURL),
      timeRecordingAPI: new TimeRecordingAPI(restURL),
      userAPI: new UserAPI(restURL),
      promoterActivityHAAPI: new PromoterActivityHAAPI(restURL),
      promoterActivityDriveAPI: new PromoterActivityDriveAPI(restURL),
      promoterActivityCTADistributeAPI: new PromoterActivityCTADistributeAPI(
        restURL
      ),
      promoterActivityCTACollectAPI: new PromoterActivityCTACollectAPI(restURL),
      promoterActivitiesAPI: new PromoterActivitiesAPI(restURL)
    };
  },
  introspection: true,
  csrfPrevention: true,
  cache: "bounded",
  cors: {
    ...(isProduction ? corsOptionsProd : corsOptionsDev)
  },
  plugins: [
    {
      async serverWillStart() {
        console.log("Server Bry-IT starting up....");
      }
    },
    ...(isProduction
      ? []
      : [ApolloServerPluginLandingPageLocalDefault({ embed: true })]), // disable in production
    ApolloServerPluginInlineTrace(),
    myPlugin
  ]
});

server
  .start()
  .then(() => {
    server.applyMiddleware({ app, cors: false }); // <-- use the CORS middleware, disable built-in cors in apollo server
    if (process.env.NODE_ENV !== "test") {
      app.listen({ port: 4000 }, () => {
        console.log(`Server ready at ${aOrigin}`);
        logger.log({
          level: "info",
          message: `Server ready at ${aOrigin}`
        });
      });
    }
  })
  .catch(error => console.error(error));

/* const { url } = await startStandaloneServer( server, {
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
module.exports = {
  typeDefs,
  resolvers,
  logger,
  ApolloServer,
  server
};
