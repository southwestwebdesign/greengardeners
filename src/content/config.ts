import { defineCollection, z } from 'astro:content';

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    logo: z.string().startsWith('/uploads/services/').optional(),
    summary: z.string(),
    summaryTitle: z.string(),
    h2title: z.string().optional(),
    descriptionSeo: z.string().optional(),
    extrablock1title: z.string().optional(),
    extrablock1content: z.string().optional(),
    extrablock2title: z.string().optional(),
    extrablock2content: z.string().optional(),
    order: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    pubDate: z.date(),
    description: z.string(), // Short description for previews
    author: z.string().default("The Green Gardeners"),
    image: z.object({
      url: z.string().startsWith('/uploads/blog/'),
      alt: z.string()
    }).optional(),
    tags: z.array(z.string()).default(["general"]),
    draft: z.boolean().default(false),
  }),
});

const siteInfoCollection = defineCollection({
  type: 'content', // Could be 'data' if only frontmatter is needed
  schema: z.object({
    title: z.string(), // For identifying the content block
  }),
});

export const collections = {
  services: servicesCollection,
  blog: blogCollection,
  siteInfo: siteInfoCollection,
};