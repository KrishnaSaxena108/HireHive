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
    sender: User
    receiver: User
    jobId: ID
    createdAt: String
  }

  type Query {
    users: [User]
    jobs: [Job]
    job(id: ID!): Job
    myProposals: [Proposal]
    messages(receiverId: ID!): [Message]
    freelancerProposals: [Proposal] # <--- Add this line
  }
    type Message {
  id: ID!
  content: String!
  senderId: ID!    # Add this line
  receiverId: ID!  # Add this line
  jobId: ID
  createdAt: String
  sender: User
  receiver: User
}
type Query {
  # ... existing queries
  searchFreelancers(query: String, category: String): [User]
  popularCategories: [String]
}
  type ContactInquiry {
  id: ID!
  name: String!
  email: String!
  message: String!
}

type Mutation {
  submitContactForm(name: String!, email: String!, message: String!): ContactInquiry
}
  type Mutation {
    # --- Auth (#6, #7) ---
    register(username: String!, email: String!, password: String!, role: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    
    # --- Profile (#10) ---
    updateProfile(bio: String, skills: String, hourlyRate: Float): Profile

    # --- Jobs & Proposals (#11, #16, #18) ---
    createJob(title: String!, description: String!, budget: Float!): Job
    submitProposal(jobId: ID!, coverLetter: String!, bidAmount: Float!): Proposal
    acceptProposal(proposalId: ID!): Proposal
    
    # --- Chat (#20) ---
    sendMessage(receiverId: ID!, content: String!, jobId: ID): Message
  }

  type AuthPayload {
    token: String
    user: User
  }
`;

module.exports = typeDefs;