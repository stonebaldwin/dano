import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type BlogPostMeta = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  locationFocus?: string[];
};

export type BlogPost = BlogPostMeta & {
  contentHtml: string;
};

const postsDirectory = path.join(process.cwd(), "content/posts");

export function getSortedPostMeta(): BlogPostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory);
  const posts = files
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: String(data.title ?? slug),
        excerpt: String(data.excerpt ?? ""),
        publishedAt: String(data.publishedAt ?? new Date().toISOString()),
        locationFocus: Array.isArray(data.locationFocus)
          ? data.locationFocus.map(String)
          : undefined
      };
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);

  return {
    slug,
    title: String(data.title ?? slug),
    excerpt: String(data.excerpt ?? ""),
    publishedAt: String(data.publishedAt ?? new Date().toISOString()),
    locationFocus: Array.isArray(data.locationFocus)
      ? data.locationFocus.map(String)
      : undefined,
    contentHtml: processedContent.toString()
  };
}

// CMS integration seam: swap this function to pull from Sanity/Contentful/etc.
export async function getPostsForPublicSite(): Promise<BlogPostMeta[]> {
  return getSortedPostMeta();
}
