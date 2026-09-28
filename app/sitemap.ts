import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://openstacker.vercel.app";

  // Fetch all tool slugs
  const { data: tools } = await supabase.from("tools").select("slug, updated_at");
  
  // Fetch all category slugs
  const { data: categories } = await supabase.from("categories").select("slug");

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/directory`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic /alternatives/[slug] routes for proprietary tools
  const alternativeRoutes: MetadataRoute.Sitemap = (tools || []).map((tool) => ({
    url: `${baseUrl}/alternatives/${tool.slug}`,
    lastModified: new Date(tool.updated_at || Date.now()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic /categories/[slug] routes
  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map((cat) => ({
    url: `${baseUrl}/categories/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...alternativeRoutes, ...categoryRoutes];
}