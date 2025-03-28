import { ApolloServer } from 'apollo-server-micro';
import { typeDefs } from '../../graphql/schema';
import { resolvers } from '../../graphql/resolvers';

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export default apolloServer.createHandler({ path: '/api/graphql' });
export const config = { api: { bodyParser: false } };