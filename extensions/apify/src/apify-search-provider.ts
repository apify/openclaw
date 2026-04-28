import type {
  SearchConfigRecord,
  WebSearchProviderPlugin,
} from "openclaw/plugin-sdk/provider-web-search";
import {
  mergeScopedSearchConfig,
  resolveProviderWebSearchPluginConfig,
} from "openclaw/plugin-sdk/provider-web-search";
import { createWebSearchProviderContractFields } from "openclaw/plugin-sdk/provider-web-search-config-contract";

const APIFY_SEARCH_CREDENTIAL_PATH = "plugins.entries.apify.config.webSearch.apiKey";

type ApifySearchRuntime = typeof import("./apify-search-runtime.js");
let runtimePromise: Promise<ApifySearchRuntime> | undefined;
const loadRuntime = () => (runtimePromise ??= import("./apify-search-runtime.js"));

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
} satisfies Record<string, unknown>;

export function createApifyWebSearchProvider(): WebSearchProviderPlugin {
  return {
    id: "apify",
    label: "Apify RAG Web Browser",
    hint: "Headless-rendered search results with full page content extraction.",
    onboardingScopes: ["text-inference"],
    requiresCredential: true,
    envVars: ["APIFY_API_KEY"],
    placeholder: "apx_...",
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
      const searchConfig: SearchConfigRecord | undefined = mergeScopedSearchConfig(
        ctx.searchConfig,
        "apify",
        resolveProviderWebSearchPluginConfig(ctx.config, "apify"),
        { mirrorApiKeyToTopLevel: true },
      );
      return {
        description:
          "Search the web using Apify RAG Web Browser. Returns headless-rendered pages with full markdown content — better for JS-heavy sites than pure link-list search.",
        parameters: ApifySearchSchema,
        execute: async (args) => {
          const { executeApifySearch } = await loadRuntime();
          return executeApifySearch(args, searchConfig);
        },
      };
    },
  };
}
