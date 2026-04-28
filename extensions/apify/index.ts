import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createApifyWebSearchProvider } from "./src/apify-search-provider.js";

export default definePluginEntry({
  id: "apify",
  name: "Apify Plugin",
  description: "Apify RAG Web Browser web search provider",
  register(api) {
    api.registerWebSearchProvider(createApifyWebSearchProvider());
  },
});
