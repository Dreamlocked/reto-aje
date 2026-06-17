import { ProcessOutboxHandler } from '../../application/use-cases/outbox/ProcessOutboxHandler';

let isRunning = false;

export const startOutboxWorker = () => {
    const intervalMs = Number(process.env.OUTBOX_INTERVAL_MS || 30000);

    setInterval(async () => {
        if (isRunning) {
            return;
        }

        isRunning = true;

        try {
            const handler = new ProcessOutboxHandler();
            await handler.handle();
        } catch (error) {
            console.error('Error ejecutando OutboxWorker:', error);
        } finally {
            isRunning = false;
        }
    }, intervalMs);
};