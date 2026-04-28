import type { WebFetchProviderPlugin } from "openclaw/plugin-sdk/provider-web-fetch-contract";

type ApifyFetchProviderSharedFields = Omit<
  WebFetchProviderPlugin,
  "applySelectionConfig" | "createTool"
>;

function ensureRecord(target: Record<string, unknown>, key: string): Record<string, unknown> {
  const current = target[key];
  if (current && typeof current === "object" && !Array.isArray(current)) {
    return current as Record<string, unknown>;
  }
  const next: Record<string, unknown> = {};
  target[key] = next;
  return next;
}

export const APIFY_FETCH_PROVIDER_SHARED = {
  id: "apify",
  label: "Apify Website Content Crawler",
  hint: "Fetch pages with full JS rendering and anti-bot protection using Apify.",
  credentialLabel: "Apify API token",
  envVars: ["APIFY_API_KEY"],
  placeholder: "apify_...",
  signupUrl: "https://apify.com/",
  docsUrl: "https://apify.com/apify/website-content-crawler",
  autoDetectOrder: 50,
  credentialPath: "plugins.entries.apify.config.apiKey",
  inactiveSecretPaths: [
    "plugins.entries.apify.config.apiKey",
    "plugins.entries.apify.config.webFetch.apiKey",
    "plugins.entries.apify.config.webSearch.apiKey",
  ],
  getCredentialValue: (_fetchConfig?: Record<string, unknown>) => undefined,
  setCredentialValue: (_fetchConfigTarget: Record<string, unknown>, _value: unknown) => {},
  getConfiguredCredentialValue: (config) =>
    (config?.plugins?.entries?.apify?.config as { apiKey?: unknown } | undefined)?.apiKey,
  setConfiguredCredentialValue: (configTarget, value) => {
    const plugins = ensureRecord(configTarget as unknown as Record<string, unknown>, "plugins");
    const entries = ensureRecord(plugins, "entries");
    const apifyEntry = ensureRecord(entries, "apify");
    const pluginConfig = ensureRecord(apifyEntry, "config");
    pluginConfig.apiKey = value;
  },
} satisfies ApifyFetchProviderSharedFields;
