import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type User {
    id: ID!
    email: String!
  }

  type JournalEntry {
    id: ID!
    title: String!
    content: String!
    category: String!
    createdAt: String!
    updatedAt: String!
    userId: String!
  }

  type Query {
    entries: [JournalEntry]
  }

  type Mutation {
    register(email: String!, password: String!): String
    login(email: String!, password: String!): String
  }
`;
