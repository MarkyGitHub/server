const { gql } = require( 'apollo-server' );
const { GraphQLJSON, GraphQLJSONObject } = require( 'graphql-type-json' );

const typeDefs = gql`

scalar Date
scalar JSONObject

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
	companyName: String
	locked: Boolean    
}

type TimeRecording {
	id: ID!
	description: String
	startTime: Date!
	endTime: Date!
	workDate: Date!
	user: User
}

type PromoSample {
	id: ID!
	birthDate: Date!
	callingTime: String
	city: String
	cityInfor: String
	code: String
	companyName: String
	country: String
	deliveryDate: Date!
	email: String
	firstName: String
	name: String
	phone: String
	postCode: String
	reson: String
	remark: String
	salutation: Salutation
	streetAddrees: String
	tenants: String
	user: User
}

input PromoSampleInput {
	salutation: Salutation
	firstName: String
	name: String
	companyName: String
	phone: String
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

type Query {
	getPing: String
	postLogin(username: String!, password: String!): JSONObject
	getFind(id: ID!): JSONObject
	getFindByUser: JSONObject   
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

type Mutation {
	# Save, edit, delete TimeRecordings
	postCreateTimeRecordings(entities: [EntriesTimeRecording]!): [TimeRecording]!
	editTimeRecording(id: [ID]!, entity: EntriesTimeRecording!): TimeRecording!
	deleteTimeRecording(id: EntriesTimeRecording!): TimeRecording!

	# Save, edit, delete PromoSamples
	postCreatePromoSamples(entities: [PromoSampleInput]!): [PromoSample]!
	editPromoSample(id: [ID]!, entity: PromoSampleInput!): PromoSample!
	deletePromoSample(id: PromoSampleInput!): PromoSample!

	# Edit User
	editUser(id: [ID]!, entity: UserInput!): User!

	postCreate(type: [EntriesTimeRecording]!): [TimeRecording]!
	postLogin(userLoginRequest: UserLoginRequest!): JSONObject
}

` ;

module.exports = typeDefs;