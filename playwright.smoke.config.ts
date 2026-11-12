import { defineConfig, devices } from '@playwright/test'
import config from './playwright.config'

const baseURL = 'http://127.0.0.1:4173/terraforming-mars-setup/'
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH

export default defineConfig({
  ...config,
  testMatch: 'deployment.spec.ts',
  testIgnore: [],
  use: { ...config.use, baseURL },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(chromiumPath
          ? { launchOptions: { executablePath: chromiumPath } }
          : {}),
      },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: baseURL,
    reuseExistingServer: false,
  },
})
