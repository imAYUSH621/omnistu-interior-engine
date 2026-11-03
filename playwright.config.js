import { defineConfig } from '@playwright/test';
export default defineConfig({
 testDir: './e2e', fullyParallel: false, workers: 1,
 use: { baseURL: 'http://127.0.0.1:3000', headless: true,
   launchOptions: { ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}), args: ['--no-sandbox'] } },
 webServer: { command: 'npm run dev -- --host 127.0.0.1', url: 'http://127.0.0.1:3000', reuseExistingServer: false },
 reporter: [['list'], ['json', { outputFile: 'test-results/local-acceptance.json' }]],
});
