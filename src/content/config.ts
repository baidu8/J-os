// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    description: z.string(),
    slug: z.string().optional(),
    category: z.string().default("未分类"), // 👈 添加这一行，默认值为“未分类”
  }),
});

export const collections = { blog };