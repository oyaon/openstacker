export interface Tool {
  id: string;
  name: string;
  category: string;
  monthlyCostPerUser: number;
  pricingType: "per_user" | "flat";
  alternative: {
    name: string;
    cost: number;
    url: string;
  };
  icon: string;
}

export const tools: Tool[] = [
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    monthlyCostPerUser: 8.75,
    pricingType: "per_user",
    alternative: { name: "Mattermost", cost: 0, url: "https://mattermost.com" },
    icon: "💬",
  },
  {
    id: "zoom",
    name: "Zoom",
    category: "Communication",
    monthlyCostPerUser: 14.99,
    pricingType: "per_user",
    alternative: { name: "Jitsi Meet", cost: 0, url: "https://jitsi.org" },
    icon: "📹",
  },
  {
    id: "notion",
    name: "Notion",
    category: "Productivity",
    monthlyCostPerUser: 10,
    pricingType: "per_user",
    alternative: { name: "AppFlowy", cost: 0, url: "https://appflowy.io" },
    icon: "📝",
  },
  {
    id: "airtable",
    name: "Airtable",
    category: "Database",
    monthlyCostPerUser: 20,
    pricingType: "per_user",
    alternative: { name: "NocoDB", cost: 0, url: "https://nocodb.com" },
    icon: "🗄️",
  },
  {
    id: "zapier",
    name: "Zapier",
    category: "Automation",
    monthlyCostPerUser: 29.99,
    pricingType: "flat",
    alternative: { name: "n8n", cost: 0, url: "https://n8n.io" },
    icon: "⚡",
  },
  {
    id: "jira",
    name: "Jira",
    category: "Project Management",
    monthlyCostPerUser: 7.75,
    pricingType: "per_user",
    alternative: { name: "Plane", cost: 0, url: "https://plane.so" },
    icon: "🎯",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    monthlyCostPerUser: 25,
    pricingType: "per_user",
    alternative: { name: "Twenty CRM", cost: 0, url: "https://twenty.com" },
    icon: "🤝",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "Marketing",
    monthlyCostPerUser: 50,
    pricingType: "flat",
    alternative: { name: "Mautic", cost: 0, url: "https://mautic.org" },
    icon: "📣",
  },
  {
    id: "intercom",
    name: "Intercom",
    category: "Support",
    monthlyCostPerUser: 39,
    pricingType: "flat",
    alternative: { name: "Chatwoot", cost: 0, url: "https://chatwoot.com" },
    icon: "🎧",
  },
  {
    id: "figma",
    name: "Figma",
    category: "Design",
    monthlyCostPerUser: 15,
    pricingType: "per_user",
    alternative: { name: "Penpot", cost: 0, url: "https://penpot.app" },
    icon: "🎨",
  },
];