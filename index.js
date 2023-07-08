import "dotenv/config";
// Server declarations

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloServerPluginInlineTrace } from "@apollo/server/plugin/inlineTrace";
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
//import { gql } from 'grapgql';
import express from 'express';
import http from 'http';
import cors from 'cors';
import pkg from 'body-parser';
const { json } = pkg;

// GraphQL types, etc. declarations
import { readFileSync } from 'fs';

// Rest data source delarations
import { RESTDataSource } from '@apollo/datasource-rest';

//Logger
import winston from 'winston';
const { format, transports, createLogger, combine} = winston;
const { CATEGORY} =  "VertriebsApp format";

// Error handling
//const { ApolloServerErrorCode } = require( '@apollo/server/errors' );
import { GraphQLScalarType, Kind, GraphQLError  } from 'graphql';

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

const logger = createLogger({
  level: "info",

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

const resolvers = {
  Query: {
    /**
     * Queries from Login API - Pwa backend
     */
     getPing: async (parent, args, context, info) => {
      return await this.context.dataSources.loginAPI.getPing();
    },
    postLogin: async (_, { username, password }, { dataSources }) => {
      const data = dataSources.loginAPI.postLogin(
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
  },

  Mutation: {
    /**
     * 
     
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
    },  }
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
    },*/
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

const typeDefs = `#graphql

scalar Date
scalar JSONObject

type Query {
	getPing: String
	postLogin( username: String!, password: String!):User
	getFind(id: ID!): JSONObject
	getFindByUser: [TimeRecording]   
	getFindRange(from: Int, to: Int): JSONObject    
	getCount: Int
	getFindUser(id: ID!) : JSONObject
	getUserData: JSONObject
	getUserCount: Int
	getFindCustomer: JSONObject
	getFindCustomerByUser: JSONObject
	getFindCustomerRange(from: Int, to: Int ): JSONObject 
	getCustomerCount: Int
}

enum Salutation {
	Herr
	Frau
	Familie
	All
	Firma
}

enum Status {
	AKTIV
	INAKTIV
	GELOESCHT
	BANKROTT
	INTERESSENT
	ABGELEHNT
}

type User {
	id: ID!
	name: String!
	firstName: String
	salutation: Salutation
	status: Status
	username: String
	roles: [String]
	areaName: String
	companyName: String
	locked: Boolean
	jwtToken: String
	errorMessage: String
	deliveryArea: [String]!
}
type TimeRecordingDistribute {
	timeRecording: TimeRecording!
	noOfFlyers: Int
	timeRecordingCol: TimeRecordingCollection
}

type TimeRecordingCollection {
	timeRecording: TimeRecording!
	samples: [PromoSample]
}

type TimeRecording {
	id: ID!
	description: String
	startTime: Date!
	endTime: Date!
	workDate: Date!
	user: User
}

type PromoterActivityCTACollectOutput {
    id: ID!,
	startTime: String,
	endTime: String,
	duration: Int,
	description: String,
	tentantsAcquired: Int,
	distributionActivityId: String,
	promoSamples: [PromoSample]!
}

type PromoterActivityCTADistributeOutput {
   	id: ID!,
	startTime: String,
	endTime: String,
	duration: Int,
	description: String,
	flyersDistributed: Int
}

type PromoterActivityDriveOutput {
    id: ID!,
	startTime: String,
	endTime: String,
	duration: Int,
	description: String,
	distanceDriven: Int
}

type PromoterActivityHAOutput {
    id: ID!,
	startTime: String,
	endTime: String,
	duration: Int,
	description: String,
	tentantsAcquired: Int,
	tentantsNotMet: Int,
	tentantsNoNeed: Int,
	promoSamples: [PromoSample]!
}


type PromoterActivities {
	ctaCollectActivities : [PromoterActivityCTACollectOutput]
	ctaDistributeActivities : [PromoterActivityCTADistributeOutput]
	driveActivities : [PromoterActivityDriveOutput]
	haActivities : [PromoterActivityHAOutput]
}

input PromoterActivitiesInput {
	ctaCollectActivities : [PromoterActivityCTACollect]
	ctaDistributeActivities : [PromoterActivityCTADistribute]
	driveActivities : [PromoterActivityDrive]
	haActivities : [PromoterActivityHA]
}


type PromoSample {
	id: ID!
	birthDate: Date!
	callingTime: String
	city: String
	cityInfor: String
	companyName: String
	country: String
	deliveryDate: Date!
	email: String
	firstName: String
	name: String
	phone: String
	postCode: String
	storagePlace: String
	remark: String
	salutation: Salutation
	streetAddrees: String
	tenants: Int
	user: User
}


input PlainPromoSample {
	birthDate: Date!
	callingTime: String
	city: String
	cityInfo: String
	code: String
	companyName: String
	country: String
	deliveryDate: Date!
	email: String
	firstName: String
	name: String
	phone: String
	postCode: String
	storagePlace: String
	remark: String
	salutation: Salutation
	streetAddress: String
	tenants: Int
}


input PromoterActivityHA {
    id: ID!,
	startTime: String,
	endTime: String,
	duration: Int,
	description: String,
	tentantsAcquired: Int,
	tentantsNotMet: Int,
	tentantsNoNeed: Int,
	promoSamples: [PlainPromoSample]!
}

input PromoterActivityDrive {
    id: ID!,
	startTime: String,
	endTime: String,
	duration: Int,
	description: String,
	distanceDriven: Int
  }

  input PromoterActivityCTADistribute {
   	id: ID!,
	startTime: String,
	endTime: String,
	duration: Int,
	description: String,
	flyersDistributed: Int
}

input PromoterActivityCTACollect {
   	id: ID!,
	startTime: String,
	endTime: String,
	duration: Int,
	description: String,
	tentantsAcquired: Int,
	distributionActivityId: String,
	promoSamples: [PlainPromoSample]!
}

input PromoSampleInput {
	salutation: Salutation
	firstName: String
	name: String
	companyName: String
	phone: String
	code : String
	email: String
	streetAddress: String
	postCode: String
	city: String
	cityInfo: String
	birthDate: Date
	tenants: Int
	remark: String
	deliveryDate: Date
}

type LieferAngaben {
	abweichendeOrtsbez: String
	ablageort: String
	anzahlParteien: Int
	wunschdatum: Date
	anmerkung: String
}

type UserAddress {
	street: String
	postCode: String
	city: String        
}

input EntriesTimeRecording {
	description: String
	startTime: Date
	endTime: Date
	workDate: Date  
}

input UserUpdate {
	token: String!
	message: String
	username: String!
	password: String!
}

input UserLoginRequest {
	username: String!
	password: String!
}

input UserUpdate {
	token: String!
	message: String
	username: String!
	password: String!
	email: String!
	token: String
}
input UserInput {
	name: String!
	firstName: String
	salutation: Salutation
	status: Status
	username: String
	role: String
	companyName: String
	
}

type Mutation {
	# Save, edit, delete TimeRecordings
	postCreateTimeRecordings(entities: [EntriesTimeRecording]!): [TimeRecording]!
	editTimeRecording(id: [ID]!, entity: EntriesTimeRecording!): TimeRecording!
	deleteTimeRecording(id: EntriesTimeRecording!): TimeRecording!

	# Save, edit, delete PromoSamples
	postCreatePromoSamples(entities: [PromoSampleInput]!): [Int]!

	editPromoSample(id: [ID]!, entity: PromoSampleInput!): PromoSample!
	deletePromoSample(id: PromoSampleInput!): PromoSample!

	# Edit User
	editUser(id: [ID]!, entity: UserInput!): User!

	# Save PromoterActivityHA
	postCreatePromoterActivityHA(entities: [PromoterActivityHA]!): JSONObject!
	# Save PromoterDriveActivity
	postCreatePromoterDriveActivity(entities: [PromoterActivityDrive]!): JSONObject!
	# Save postCreatePromoterActivityCTADistribute
	postCreatePromoterActivityCTADistribute(entities: [PromoterActivityCTADistribute]!): JSONObject!
	# Save postCreatePromoterActivityCTACollect
	postCreatePromoterActivityCTACollect(entities: [PromoterActivityCTACollect]!): JSONObject!
	# Save postCreatePromoterActivities
	postCreatePromoterActivities(entities: PromoterActivitiesInput!): JSONObject!

	postCreate(type: [EntriesTimeRecording]!): [TimeRecording]!
	postLogin(userLoginRequest: UserLoginRequest!): JSONObject
}

`;

/* interface BryITContext {
  loginAPI: LoginAPI;
  promoterActivitiesAPI: PromoterActivitiesAPI;
} */

const isProduction = process.env.NODE_ENV === "production";
const aOrigin = process.env.yourOrigin;

// Define your CORS settings for development
const corsOptionsDev = {
  origin: [
    process.env.yourOrigin,
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
  origin: ["https://morgengold.de", "https://www.morgengold.de"],
  credentials: true // <-- REQUIRED backend setting
};

const app = express();
app.use(cors(isProduction ? corsOptionsProd : corsOptionsDev));

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  includeStacktraceInErrorResponses: true,
  async context({ req,res }) {   
    return {
      req,
      res,
      logger,
      cookies: req.cookies,
      dataSources: {
        restURL:  isProduction ? process.env.pwabackend_prod : process.env.pwabackend_dev,                
        loginAPI: new LoginAPI(restURL),      
        promoterActivitiesAPI: new PromoterActivitiesAPI(restURL),
      },
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
    ...(process.env.NODE_ENV === "production"
      ? [ApolloServerPluginLandingPageProductionDefault()]
      : [ApolloServerPluginLandingPageLocalDefault({ embed: false })]), // disable in production
    ApolloServerPluginInlineTrace(),
    myPlugin
  ]
});

await server.start();

app.use(
  '/graphql',
  cors(),
  json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  }),
);


/* server
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
  .catch(error => console.error(error)); */

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
app.listen({ port: 4000 }, () => {
  aOrigin: process.env.yourOrigin,
  console.log(`Server ready at ${process.env.yourOrigin}`);
  console.log(`Backend ready at ${process.env.pwabackend_dev}`);
  logger.log({
    level: "info",
    message: `Server ready at ${process.env.yourOrigin}`
  });
});