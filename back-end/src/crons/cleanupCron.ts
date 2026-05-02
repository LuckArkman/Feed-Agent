import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import logger from '../utils/logger';
import prisma from '../models/prismaClient';
import { DraftStatus } from '@prisma/client';

const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');

export const initCronJobs = () => {
  // 1. Clean up temporary images from disk
  // Runs every day at 03:00 AM ('0 3 * * *')
  cron.schedule('0 3 * * *', () => {
    logger.info('[cron]: Starting daily upload directory cleanup...');
    try {
      if (fs.existsSync(UPLOADS_DIR)) {
        const files = fs.readdirSync(UPLOADS_DIR);
        const now = Date.now();
        // Assume files older than 24 hours are safe to delete
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;

        let deletedCount = 0;
        for (const file of files) {
          const filePath = path.join(UPLOADS_DIR, file);
          const stats = fs.statSync(filePath);
          
          if (now - stats.mtimeMs > ONE_DAY_MS) {
            fs.unlinkSync(filePath);
            deletedCount++;
          }
        }
        logger.info(`[cron]: Upload cleanup finished. Deleted ${deletedCount} old files.`);
      }
    } catch (error) {
      logger.error(`[cron]: Failed to clean uploads directory: ${(error as Error).message}`);
    }
  });

  // 2. Clean up old rejected/pending drafts from PostgreSQL
  // Runs every day at 03:30 AM ('30 3 * * *')
  cron.schedule('30 3 * * *', async () => {
    logger.info('[cron]: Starting daily PostgreSQL drafts cleanup...');
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const result = await prisma.draft.deleteMany({
        where: {
          status: {
            in: [DraftStatus.REJECTED, DraftStatus.PENDING, DraftStatus.CANCELLED]
          },
          createdAt: {
            lt: thirtyDaysAgo
          }
        }
      });

      logger.info(`[cron]: Draft cleanup finished. Deleted ${result.count} old drafts.`);
    } catch (error) {
      logger.error(`[cron]: Failed to clean PostgreSQL drafts: ${(error as Error).message}`);
    }
  });

  logger.info('[cron]: Registered all cron jobs.');
};
