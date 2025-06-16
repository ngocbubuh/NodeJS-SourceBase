import { PrismaClient } from '@prisma/client';
import { Semaphore } from 'async-mutex';

class PrismaManager {
  private static instance: PrismaManager;
  private prisma: PrismaClient;
  private semaphore: Semaphore;
  private readonly MAX_CONNECTIONS = 10;
  private activeConnections: Set<string> = new Set();

  private constructor() {
    this.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
    
    this.semaphore = new Semaphore(this.MAX_CONNECTIONS);
  }

  public static getInstance(): PrismaManager {
    if (!PrismaManager.instance) {
      PrismaManager.instance = new PrismaManager();
    }
    return PrismaManager.instance;
  }

  public async getClient(): Promise<{ client: PrismaClient; release: () => void }> {
    const [, release] = await this.semaphore.acquire();
    const connectionId = Math.random().toString(36).substring(7);
    this.activeConnections.add(connectionId);
    
    return {
      client: this.prisma,
      release: () => {
        this.activeConnections.delete(connectionId);
        release();
      }
    };
  }

  public getActiveConnectionsCount(): number {
    return this.activeConnections.size;
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  // Middleware để tự động release connection sau timeout
  public async withConnection<T>(operation: (client: PrismaClient) => Promise<T>): Promise<T> {
    const { client, release } = await this.getClient();
    try {
      const result = await Promise.race([
        operation(client),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database operation timeout')), 30000)
        )
      ]);
      return result as T;
    } finally {
      release();
    }
  }
}

export const prismaManager = PrismaManager.getInstance();