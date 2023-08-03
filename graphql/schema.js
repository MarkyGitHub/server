import pkg from 'graphql-tag';
const { gql } = pkg;

const typeDefs = gql`

  scalar Date
  scalar JSONObject

  enum Status {
    AKTIV
    INAKTIV
    GELOESCHT
    BANKROTT
    INTERESSENT
    ABGELEHNT
  }

  type PaginatedSampleDeliveries {
  items: [SampleDelivery!]!
  total: Int!
}

input PaginationInput {
  limit: Int
  page: Int
}

  type Query {
    getPing: String
    postLogin( username: String!, password: String!):User
    getSampleDeliveries(calendarWeek: String!, paginate: PaginationInput): PaginatedSampleDeliveries!
    getSalesAssistent(username: String!, password: String!): JSONObject
  }
  
  enum Salutation {
    Herr
    Frau
    Familie
    All
    Firma
  }

  type User {
    id: ID!
    name: String!
    firstName: String
    lastName:  String
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

  input PlainPromoSample {
    birthDate: JavaDate
    callingTime: DateTimeSSSZ
    city: String @constraint(maxLength: 40)
    cityInfo: String @constraint(maxLength: 5)
    code: String
    companyName: String @constraint(maxLength: 40) 
    country: String @constraint(maxLength: 40) 
    deliveryDate:  JavaDate
    email: String @constraint(format: "email")
    firstName: String @constraint(maxLength: 80),
    name: String @constraint(minLength: 1, maxLength: 40) 
    phone: String @constraint(pattern: "^[0-9]*$", minLength: 4, maxLength: 20)
    postCode: String @constraint(maxLength: 10)
    storagePlace: String @constraint(maxLength: 255)
    remark: String @constraint(maxLength: 255)
    salutation: Salutation
    streetAddress: String @constraint(maxLength: 40)
    tenants: Int @constraint(pattern: "^[0-9]*$")
  }

  input PromoterActivitiesInput {
    ctaCollectActivities : [PromoterActivityCTACollect]
    ctaDistributeActivities : [PromoterActivityCTADistribute]
    driveActivities : [PromoterActivityDrive]
    haActivities : [PromoterActivityHA]
  }
  
  input PromoterActivityHA {
    id: ID!
    startTime: DateTimeSSSZ
    endTime:  DateTimeSSSZ
    duration: Int @constraint(pattern: "^[0-9]*$")
    description: String @constraint(maxLength: 255)
    tentantsAcquired: Int @constraint(pattern: "^[0-9]*$")
    tentantsNotMet: Int @constraint(pattern: "^[0-9]*$")
    tentantsNoNeed: Int @constraint(pattern: "^[0-9]*$")
    promoSamples: [PlainPromoSample]!
  }
  
  input PromoterActivityDrive {
    id: ID!
    startTime: DateTimeSSSZ
    endTime: DateTimeSSSZ
    duration: Int @constraint(pattern: "^[0-9]*$")
    description: String @constraint(maxLength: 255),
    distanceDriven: Int @constraint(pattern: "^[0-9]*$")
    }
  
  input PromoterActivityCTADistribute {
      id: ID!
      startTime: DateTimeSSSZ
      endTime: DateTimeSSSZ
      duration: Int @constraint(pattern: "^[0-9]*$")
      description: String @constraint(maxLength: 255),
      flyersDistributed: Int @constraint(pattern: "^[0-9]*$")
  }
  
  input PromoterActivityCTACollect {
    id: ID!,
    startTime: DateTimeSSSZ
    endTime: DateTimeSSSZ
    duration: Int @constraint(pattern: "^[0-9]*$")
    description: String @constraint(maxLength: 255),
    tentantsAcquired: Int @constraint(pattern: "^[0-9]*$")
    distributionActivityId: String
    promoSamples: [PlainPromoSample]!
  }

  type Mutation {
    postCreatePromoterActivities(entities: PromoterActivitiesInput!): JSONObject!
    saveSampleDelivery(sampleDelivery: SampleDeliveryInput): JSONObject!
    acceptSampleDelivery(sampleDelivery: SampleDeliveryInput): JSONObject!
  }
 
  scalar DateTimeSSSZ
  scalar JavaDate

  # Declarations for Sales-App

  type SampleDelivery {
    id: ID!
   	customer: ID!
    customerData: Customer
    deliveryDate: JavaDate
    orderDate: JavaDate!
    accepted: Int
    note: String
    followUp: JavaDate
    editor: ID	
    deliveryAddress: DeliveryAddress
  }

  type Address {
    city: String! 
    cityInfo: String    
    firstName: String! 
    name: String!   
    postCode: String! 
    streetAddress: String!
  }

  type DeliveryAddress {  
    deliveryDate:  JavaDate   
    address: Address! 
  }

  type Customer {
    id: ID!
    name: String!
    firstName: String
    salutation: Salutation    
    companyName: String
    dateOfBirth: JavaDate!
    email: String 
    fax: String 
    mobilePhone:  String      
    phone: String!    
    city: String!          
    postCode: String! 
    streetAddress: String!
    paymentMethod: PaymentMethod!
    membersInHousehold: Int
    postInvoice: Boolean
    advertisePerEmail: Boolean
    discountRate: Int
    deliveryRate1: Float
    deliveryRate2: Float
    password: String
    storageLocation: String
    iban: String
    bic: String
    bank: String
    acHolder: String
  }

  type PaginatedSampleDeliveries {
  items: [SampleDelivery!]!
  hasNextPage: Boolean!
  totalPages: Int!
}

  type Contact {
    email: String 
    fax: String 
    mobilePhone:  String      
    phone: String!    
  }

  enum PaymentMethod {
    Invoice
    DEBIT   
  }

  type OtherDetails {
    membersInHousehold: Int
    postInvoice: Boolean
    advertisePerEmail: Boolean
    discountRate: Int
    deliveryRate1: Float
    deliveryRate2: Float
    password: String
  }

  type SalesAssistent {
    id: ID!   
    phone: String!
    userName: String!
    name: String!
    firstName: String!
    salutation: Salutation    
    contact: Contact!
    password: String
    bankDetails: BankDetails
    address: Address!
  }

  type BankDetails {
    iban: String
    bic: String
    bank: String
    acHolder: String
  }

  input SampleDeliveryInput {
    id: ID!
   	customer: ID!
    deliveryDate: JavaDate
    orderDate: JavaDate!
    accepted: Int
    note: String
    followUp: JavaDate
    editor: ID	
    deliveryAddress: DeliveryAddressInput
  }

  input DeliveryAddressInput {  
    deliveryDate:  JavaDate   
    address: AddressInput! 
  }

  input AddressInput {
    city: String! 
    cityInfo: String    
    firstName: String! 
    name: String!   
    postCode: String! 
    streetAddress: String!
  }

`;

export default typeDefs;