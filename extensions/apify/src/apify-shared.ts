export const APIFY_PLUGIN_ID = "apify";
export const APIFY_ENV_VARS: string[] = ["APIFY_API_KEY"];
export const APIFY_CREDENTIAL_PATH = "plugins.entries.apify.config.apiKey";
export const APIFY_CREDENTIAL_LABEL = "Apify API token";
export const APIFY_PLACEHOLDER = "apify_...";
export const APIFY_SIGNUP_URL = "https://apify.com/";

export const APIFY_INTEGRATION_HEADERS = {
  "x-apify-integration-platform": "openclaw",
  "x-apify-integration-ai-tool": "true",
} as const;

export const APIFY_SEARCH_LABEL = "Apify RAG Web Browser";
export const APIFY_SEARCH_HINT =
  "Headless-rendered search results with full page content extraction.";
export const APIFY_SEARCH_DOCS_URL = "https://apify.com/apify/rag-web-browser";
export const APIFY_SEARCH_AUTO_DETECT_ORDER = 60;

export function resolveApifyPluginApiKey(config: unknown): unknown {
  return (
    config as {
      plugins?: { entries?: { apify?: { config?: { apiKey?: unknown } } } };
    }
  )?.plugins?.entries?.apify?.config?.apiKey;
}
