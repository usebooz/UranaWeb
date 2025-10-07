import {
  setDebug,
  mountBackButton,
  restoreInitData,
  init as initSDK,
  bindThemeParamsCssVars,
  mountViewport,
  bindViewportCssVars,
  mockTelegramEnv,
  type ThemeParams,
  themeParamsState,
  retrieveLaunchParams,
  emitEvent,
  miniApp,
} from '@telegram-apps/sdk-react';

/**
 * Initializes the application and configures its dependencies.
 * Sets up Telegram SDK, validates environment variables, and configures debugging tools.
 *
 * @param options - Configuration options for initialization
 * @param options.debug - Enable debug mode for Telegram SDK
 * @param options.eruda - Enable Eruda debugging tool
 * @param options.mockForMacOS - Enable mocking for macOS Telegram client
 * @throws {Error} If required environment variables are missing
 */
export function init(options: {
  debug: boolean;
  eruda: boolean;
  mockForMacOS: boolean;
}): void {
  // Check for required environment variables
  if (!import.meta.env.VITE_URANA_API_URL) {
    throw new Error('VITE_URANA_API_URL environment variable is required');
  }
  if (!import.meta.env.VITE_SPORTS_TOURNAMENT_RPL) {
    throw new Error(
      'VITE_SPORTS_TOURNAMENT_RPL environment variable is required'
    );
  }

  // Set @telegram-apps/sdk-react debug mode and initialize it.
  setDebug(options.debug);
  initSDK();

  // Add Eruda if needed.
  options.eruda &&
    void import('eruda').then(({ default: eruda }) => {
      eruda.init();
      eruda.position({ x: window.innerWidth - 50, y: 0 });
    });

  // Telegram for macOS has a ton of bugs, including cases, when the client doesn't
  // even response to the "web_app_request_theme" method. It also generates an incorrect
  // event for the "web_app_request_safe_area" method.
  if (options.mockForMacOS) {
    let firstThemeSent = false;
    mockTelegramEnv({
      onEvent(event, next) {
        if (event[0] === 'web_app_request_theme') {
          let tp: ThemeParams = {};
          if (firstThemeSent) {
            tp = themeParamsState();
          } else {
            firstThemeSent = true;
            tp ||= retrieveLaunchParams().tgWebAppThemeParams;
          }
          return emitEvent('theme_changed', { theme_params: tp });
        }

        if (event[0] === 'web_app_request_safe_area') {
          return emitEvent('safe_area_changed', {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
          });
        }

        next();
      },
    });
  }

  // Mount all components used in the project.
  mountBackButton.ifAvailable();
  restoreInitData();

  if (miniApp.mountSync.isAvailable()) {
    miniApp.mountSync();
    bindThemeParamsCssVars();
  }

  mountViewport.isAvailable() &&
    void mountViewport().then(() => {
      bindViewportCssVars();
    });
}
