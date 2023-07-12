import pkg from 'graphql-tag';
const { gql } = pkg;

const typeDefs = gql`

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
	deliveryArea: [String]
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

` ;

export default typeDefs;