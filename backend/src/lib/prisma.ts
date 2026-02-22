import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

// 1. Create a connection pool using your Neon URL
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Create the adapter
const adapter = new PrismaPg(pool);

// 3. Pass the adapter to the PrismaClient
export const prisma = new PrismaClient({ adapter });