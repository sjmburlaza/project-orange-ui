import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env['CI'];
const e2eHost = 'localhost';
const e2ePort = Number(process.env['E2E_PORT'] ?? 4300);
const e2eBaseUrl = `http://${e2eHost}:${e2ePort}`;
const e2eAdminPort = Number(process.env['E2E_ADMIN_PORT'] ?? 4301);
const e2eAdminBaseUrl =
  process.env['E2E_ADMIN_BASE_URL'] ?? `http://${e2eHost}:${e2eAdminPort}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: e2eBaseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: [
    {
      command: `npm run start:e2e -- --host ${e2eHost} --port ${e2ePort}`,
      url: e2eBaseUrl,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
    {
      command:
        `npm run ng -- serve project-orange-admin --host ${e2eHost} --port ${e2eAdminPort}`,
      url: e2eAdminBaseUrl,
      reuseExistingServer: !isCI,
      timeout: 120_000,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
