import {
  createWebSearchProviderContractFields,
  type WebSearchProviderPlugin,
} from "openclaw/plugin-sdk/provider-web-search-contract";

export function createApifyWebSearchProvider(): WebSearchProviderPlugin {
  const credentialPath = "plugins.entries.apify.config.apiKey";

  return {
    id: "apify",
    label: "Apify RAG Web Browser",
    hint: "Headless-rendered search results with full page content extraction.",
    onboardingScopes: ["text-inference"],
    requiresCredential: true,
    envVars: ["APIFY_API_KEY"],
    placeholder: "apify_...",
    signupUrl: "https://apify.com/",
    docsUrl: "https://apify.com/apify/rag-web-browser",
    autoDetectOrder: 60,
    credentialPath,
    ...createWebSearchProviderContractFields({
      credentialPath,
      searchCredential: { type: "top-level" },
      configuredCredential: { pluginId: "apify" },
      selectionPluginId: "apify",
    }),
    createTool: () => null,
  };
}
