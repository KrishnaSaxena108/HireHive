const { gql } = require('graphql-tag');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    balance: Float
    postedJobs: [Job]
  }

  type Job {
    id: ID!
    title: String!
    description: String!
    budget: Float!
    status: String!
    clientId: Int!
    client: User
  }

  type Query {
    users: [User]
    jobs: [Job]
    job(id: ID!): Job
  }

  type Mutation {
    createJob(title: String!, description: String!, budget: Float!, clientId: Int!): Job
  }
`;

module.exports = typeDefs;