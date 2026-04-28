import type {
  SearchConfigRecord,
  WebSearchProviderPlugin,
} from "openclaw/plugin-sdk/provider-web-search";
import {
  mergeScopedSearchConfig,
  resolveProviderWebSearchPluginConfig,
} from "openclaw/plugin-sdk/provider-web-search";
import { createWebSearchProviderContractFields } from "openclaw/plugin-sdk/provider-web-search-config-contract";

const APIFY_SEARCH_CREDENTIAL_PATH = "plugins.entries.apify.config.apiKey";

type ApifySearchRuntime = typeof import("./apify-search-runtime.js");

let apifySearchRuntimePromise: Promise<ApifySearchRuntime> | undefined;

function loadApifySearchRuntime(): Promise<ApifySearchRuntime> {
  apifySearchRuntimePromise ??= import("./apify-search-runtime.js");
  return apifySearchRuntimePromise;
}

const ApifySearchSchema = {
  type: "object",
  properties: {
    query: { type: "string", description: "Search query string." },
    count: {
      type: "number",
      description: "Number of results (1-10). Default: 5.",
      minimum: 1,
      maximum: 10,
    },
  },
  required: ["query"],
  additionalProperties: false,
} satisfies Record<string, unknown>;

export function createApifyWebSearchProvider(): WebSearchProviderPlugin {
  return {
    id: "apify",
    label: "Apify RAG Web Browser",
    hint: "Headless-rendered search results with full page content extraction.",
    onboardingScopes: ["text-inference"],
    requiresCredential: true,
    credentialLabel: "Apify API token",
    envVars: ["APIFY_API_KEY"],
    placeholder: "apify_...",
    signupUrl: "https://apify.com/",
    docsUrl: "https://apify.com/apify/rag-web-browser",
    autoDetectOrder: 60,
    credentialPath: APIFY_SEARCH_CREDENTIAL_PATH,
    ...createWebSearchProviderContractFields({
      credentialPath: APIFY_SEARCH_CREDENTIAL_PATH,
      searchCredential: { type: "top-level" },
      configuredCredential: { pluginId: "apify" },
    }),
    createTool: (ctx) => {
      const pluginWebSearchConfig = resolveProviderWebSearchPluginConfig(ctx.config, "apify");
      const sharedApiKey = (
        ctx.config as {
          plugins?: { entries?: { apify?: { config?: { apiKey?: unknown } } } };
        }
      )?.plugins?.entries?.apify?.config?.apiKey;
      const searchConfig: SearchConfigRecord | undefined = mergeScopedSearchConfig(
        ctx.searchConfig,
        "apify",
        pluginWebSearchConfig?.apiKey != null
          ? pluginWebSearchConfig
          : { ...pluginWebSearchConfig, apiKey: sharedApiKey },
        { mirrorApiKeyToTopLevel: true },
      );
      return {
        description:
          "Search the web using Apify RAG Web Browser. Returns headless-rendered pages with full markdown content — better for JS-heavy sites than pure link-list search.",
        parameters: ApifySearchSchema,
        execute: async (args) => {
          const { executeApifySearch } = await loadApifySearchRuntime();
          return executeApifySearch(args, searchConfig);
        },
      };
    },
  };
}
