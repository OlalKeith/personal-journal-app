import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface RegisterArgs {
  email: string;
  password: string;
}

interface LoginArgs {
  email: string;
  password: string;
}

export const resolvers = {
  Query: {
    entries: async () => await prisma.journalEntry.findMany(),
  },
  Mutation: {
    register: async (_parent: unknown, args: RegisterArgs) => {
      const hashedPassword = await bcrypt.hash(args.password, 10);
      const user = await prisma.user.create({
        data: { email: args.email, password: hashedPassword },
      });
      return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    },
    login: async (_parent: unknown, args: LoginArgs) => {
      const user = await prisma.user.findUnique({ where: { email: args.email } });
      if (!user || !(await bcrypt.compare(args.password, user.password))) {
        throw new Error('Invalid credentials');
      }
      return jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });
    },
  },
};
