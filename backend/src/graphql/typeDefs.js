const { gql } = require('graphql-tag');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    profile: Profile
    postedJobs: [Job]
  }

  type Profile {
    id: ID!
    bio: String
    skills: String
    hourlyRate: Float
    portfolioUrl: String
  }

  type Job {
    id: ID!
    title: String!
    description: String!
    budget: Float!
    status: String!
    client: User
    proposals: [Proposal]
  }

  type Proposal {
    id: ID!
    coverLetter: String
    bidAmount: Float
    status: String
    job: Job
    freelancer: User
  }

  type Message {
    id: ID!
    content: String
    senderId: ID
    receiverId: ID
    jobId: ID
    createdAt: String
    sender: User
    receiver: User
  }

  type ContactInquiry {
    id: ID!
    name: String!
    email: String!
    message: String!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Query {
    users: [User]
    jobs: [Job]
    job(id: ID!): Job
    myProposals: [Proposal]
    freelancerProposals: [Proposal]
    messages(receiverId: ID!): [Message]
    searchFreelancers(query: String, category: String): [User]
    popularCategories: [String]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!, role: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    updateProfile(bio: String, skills: String, hourlyRate: Float): Profile
    createJob(title: String!, description: String!, budget: Float!): Job
    submitProposal(jobId: ID!, coverLetter: String!, bidAmount: Float!): Proposal
    acceptProposal(proposalId: ID!): Proposal
    sendMessage(receiverId: ID!, content: String!, jobId: ID): Message
    submitContactForm(name: String!, email: String!, message: String!): ContactInquiry
  }
`;

module.exports = typeDefs;