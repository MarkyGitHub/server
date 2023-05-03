const { gql } = require('apollo-server');

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
    username:String
    roles:[String] 
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

  input UserLogin {
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
  
  type Query {   
    getPing:String
    postLogin:JSONObject
  }

  type Mutation {
   # Save, edit, delete TimeRecordings
  postCreate(entities: [EntriesTimeRecording]!):[TimeRecording]!
   newEdit(id: [ID]!, entity: EntriesTimeRecording!):TimeRecording!
  deleteRemove(id: EntriesTimeRecording!):TimeRecording!

   # postCreate(type:[EntriesTimeRecording]!):[TimeRecording]!
  }

  ` ;
module.exports = typeDefs;