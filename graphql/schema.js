const { gql } = require('apollo-server');

const typeDefs = gql`

scalar Date
scalar JSONObject

  type Query {   
    getPing:String
    postLogin:JSONObject
  }

  type Mutation {
    # if false, signup failed -- check errors
    editCustomer(id: [ID]!): User!

    # if false, cancellation failed -- check errors
    deleteCustomer(id: ID!): User

    login(user: UserLogin!): String!

    editUser(id:  ID!): User
  }

  input UserUpdate {
    token: String!
    message: String
    username: String!
    password: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    salutation: Salutation
    geburtstag: Date
    telefon: String!
    token: String
  }

  type UserAddress {
    street: String
    plz: String
    stadt: String        
  }

    type UserAddress {
    street: String
    plz: String
    stadt: String        
  }

  type LieferAngaben {
    abweichendeOrtsbez: String
    ablageort: String
    anzahlParteien: Int
    wunschdatum: Date
    anmerkung: String
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
  
  type Mutation {
    # if false, signup failed -- check errors
    editCustomer(id: [ID]!): User!

    # if false, cancellation failed -- check errors
    deleteCustomer(id: ID!): User

    #login(user: UserLogin!): String!

    #editUser(id:  ID!): User
  }` ;

module.exports = typeDefs;