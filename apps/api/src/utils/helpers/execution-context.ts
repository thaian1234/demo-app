import { Logger } from "@nestjs/common";

/**
 * A utility class to manage background tasks without blocking the main execution flow
 */
export class ExecutionContext {
    private static logger = new Logger(ExecutionContext.name);
    private static tasks: Promise<unknown>[] = [];
    private static isShutdownHandlerRegistered = false;

    /**
     * Extends the lifetime of the application until the promise is settled
     * without blocking the current execution flow
     *
     * @param promise A promise to wait for
     */
    static waitUntil(promise: Promise<unknown>): void {
        // Add the promise to the tasks array
        this.tasks.push(
            promise.catch(error => {
                this.logger.error("Background task failed:", error);
            }),
        );

        // Register shutdown handler if not already registered
        if (!this.isShutdownHandlerRegistered) {
            this.registerShutdownHandler();
        }
    }

    /**
     * Registers a handler to ensure all background tasks complete before application shutdown
     */
    private static registerShutdownHandler(): void {
        this.isShutdownHandlerRegistered = true;

        // Handle process termination signals
        const signals = ["SIGINT", "SIGTERM", "SIGQUIT"];

        signals.forEach(signal => {
            process.on(signal, () => {
                void (async () => {
                    this.logger.log(
                        `Received ${signal}, waiting for background tasks to complete...`,
                    );

                    try {
                        // Wait for all pending tasks to complete
                        await Promise.allSettled(this.tasks);
                        this.logger.log("All background tasks completed, shutting down gracefully");
                    } catch (error) {
                        this.logger.error("Error during shutdown:", error);
                    } finally {
                        process.exit(0);
                    }
                })();
            });
        });
    }
}
