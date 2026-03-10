const { gql } = require('graphql-tag');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
    profile: Profile
    postedJobs: [Job]
    averageRating: Float
    profilePictureUrl: String
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
    category: String!
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
    content: String!
    senderId: ID!
    receiverId: ID!
    jobId: ID
    createdAt: String
    sender: User
    receiver: User
  }

  type Notification {
    id: ID!
    message: String!
    isRead: Boolean!
    user: User
    createdAt: String
  }

  type Review {
    id: ID!
    rating: Int!
    comment: String
    reviewer: User
    reviewee: User
    job: Job
    createdAt: String
  }

  type ContactInquiry {
    id: ID!
    name: String!
    email: String!
    message: String!
  }

  type AdminStats {
    totalUsers: Int!
    totalJobs: Int!
    totalProposals: Int!
    activeJobs: Int!
    completedJobs: Int!
  }

  type Query {
    users: [User]
    me: User
    jobs: [Job]
    jobsByCategory(category: String!): [Job]
    searchJobs(keyword: String, category: String, minBudget: Float, maxBudget: Float, status: String): [Job]
    job(id: ID!): Job
    myProposals: [Proposal]
    messages(receiverId: ID!): [Message]
    freelancerProposals: [Proposal]
    notifications(userId: ID!): [Notification]
    reviewsByUser(userId: ID!): [Review]
    reviewsByJob(jobId: ID!): [Review]
    searchFreelancers(query: String, category: String): [User]
    popularCategories: [String]

    # --- Admin Queries ---
    adminUsers: [User]
    adminJobs: [Job]
    adminProposals: [Proposal]
    adminStats: AdminStats
  }

  type Mutation {
    # --- Auth (#6, #7) ---
    register(username: String!, email: String!, password: String!, role: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    
    # --- Profile (#10) ---
    updateProfile(bio: String, skills: String, hourlyRate: Float): Profile

    # --- Jobs & Proposals (#11, #16, #18) ---
    createJob(title: String!, description: String!, budget: Float!, category: String): Job
    submitProposal(jobId: ID!, coverLetter: String!, bidAmount: Float!): Proposal
    acceptProposal(proposalId: ID!): Proposal
    
    # --- Chat (#20) ---
    sendMessage(receiverId: ID!, content: String!, jobId: ID): Message

    # --- Notifications ---
    markNotificationRead(id: ID!): Notification

    # --- Reviews & Ratings ---
    submitReview(revieweeId: ID!, jobId: ID!, rating: Int!, comment: String): Review

    # --- Contact Form ---
    submitContactForm(name: String!, email: String!, message: String!): ContactInquiry

    # --- Admin Mutations ---
    suspendUser(userId: ID!): User
    activateUser(userId: ID!): User
    deleteJob(jobId: ID!): Boolean
    deleteProposal(proposalId: ID!): Boolean
  }

  type AuthPayload {
    token: String
    user: User
  }
`;

module.exports = typeDefs;