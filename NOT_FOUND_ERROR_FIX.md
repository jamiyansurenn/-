# NOT_FOUND Error Fix - Comprehensive Guide

## 1. The Fix ✅

**What was changed:**
Added `export const dynamic = 'force-dynamic';` to all dynamic route pages:
- `frontend/app/projects/[slug]/page.tsx`
- `frontend/app/services/[slug]/page.tsx`
- `frontend/app/news/[slug]/page.tsx`

**Why this fixes the error:**
This configuration explicitly tells Next.js to render these pages dynamically (on-demand) instead of attempting static generation at build time. This prevents build errors when the API is unavailable or when `notFound()` is called during build.

---

## 2. Root Cause Analysis 🔍

### What was the code actually doing vs. what it needed to do?

**What it was doing:**
- Next.js 14 App Router was attempting to statically generate dynamic routes at build time
- During build, the code tried to fetch data from your API for each dynamic route
- If the API wasn't available or returned 404, `notFound()` was called
- Calling `notFound()` during static generation caused the build to fail with NOT_FOUND errors

**What it needed to do:**
- These routes should be rendered dynamically (on-demand) when users visit them
- The API calls should happen at request time, not build time
- Only then can `notFound()` properly handle missing content at runtime

### What conditions triggered this specific error?

1. **Build-time static generation attempt**: Next.js tried to pre-generate pages during `npm run build`
2. **API unavailability**: Your backend API (`NEXT_PUBLIC_API_URL`) might not be available during build
3. **404 responses**: If API returned 404 for a slug, `notFound()` was called during build
4. **Missing configuration**: No explicit `dynamic` or `generateStaticParams` configuration existed

### What misconception or oversight led to this?

**Misconception:**
- Assuming Next.js would automatically handle dynamic routes correctly without configuration
- Not understanding the difference between static generation (build-time) and dynamic rendering (request-time)

**Oversight:**
- Missing route segment configuration (`dynamic`, `dynamicParams`, or `generateStaticParams`)
- Not considering that APIs might not be available during build phase
- Not accounting for how `notFound()` behaves differently during build vs. runtime

---

## 3. Teaching the Concept 📚

### Why does this error exist and what is it protecting you from?

**Purpose of NOT_FOUND error:**
- Prevents incomplete or broken static pages from being generated
- Ensures build integrity - if a page can't be generated properly, fail fast
- Protects against deploying pages with missing data or broken dependencies

**What it's protecting you from:**
- Deploying pages that look correct but have missing content
- Creating broken static assets that users can access
- Silent failures that only show up in production

### What's the correct mental model for this concept?

**Next.js Rendering Strategies:**

1. **Static Generation (default for App Router):**
   - Pages are generated at **build time**
   - HTML is pre-rendered and can be cached
   - Fast for users, but requires data to be available at build time
   - Use when: Content doesn't change often, data is available at build

2. **Dynamic Rendering (on-demand):**
   - Pages are generated at **request time**
   - HTML is created when user visits the page
   - Slower per request, but always fresh
   - Use when: Content changes frequently, API not available at build time

3. **Incremental Static Regeneration (ISR):**
   - Pages are generated at build time
   - Can be revalidated periodically or on-demand
   - Best of both worlds
   - Use when: Content changes occasionally, but you want static performance

**Route Segment Config (Next.js 14 App Router):**

```typescript
// Force dynamic rendering (what we used)
export const dynamic = 'force-dynamic';

// Allow dynamic params not in generateStaticParams
export const dynamicParams = true; // default

// Revalidate time (for ISR)
export const revalidate = 60; // seconds

// Generate static params (for static generation)
export async function generateStaticParams() {
  return [{ slug: 'example-1' }, { slug: 'example-2' }];
}
```

### How does this fit into the broader framework/language design?

**Next.js Design Philosophy:**
- **Build-time optimization**: Generate as much as possible during build for performance
- **Developer experience**: Sensible defaults that work for most cases
- **Flexibility**: Configuration options for edge cases
- **Performance**: Balance between build-time and runtime rendering

**Why App Router is different from Pages Router:**
- Pages Router: Explicit `getStaticProps`, `getServerSideProps`, `getStaticPaths`
- App Router: File-based routing with route segment config exports
- More declarative and less boilerplate
- Better TypeScript support

**The Trade-off:**
- **Static Generation**: Fast for users, but requires data at build time
- **Dynamic Rendering**: Slower per request, but always works, always fresh
- **ISR**: Hybrid approach, requires more setup

---

## 4. Warning Signs 🚨

### What should I look out for that might cause this again?

**Code Smells:**
1. ✅ Dynamic routes `[slug]` or `[id]` without `generateStaticParams` or `dynamic` config
2. ✅ API calls in page components that might fail during build
3. ✅ `notFound()` calls that could execute during build time
4. ✅ Missing environment variables during build (API URLs, keys)
5. ✅ Build errors mentioning "NOT_FOUND" or "Failed to generate page"

**Patterns to watch for:**
- ❌ Using `async` page components that fetch data without route config
- ❌ Assuming APIs are always available during build
- ❌ Not distinguishing between build-time and runtime behavior
- ❌ Missing error boundaries for API failures

**Red Flags:**
- "Error occurred prerendering page"
- "Failed to generate static page"
- Build succeeds but deployment fails
- Errors only in production, not development

### Are there similar mistakes I might make in related scenarios?

**Similar Issues:**

1. **Missing `generateStaticParams` for static generation:**
   ```typescript
   // ❌ Missing - will fail if trying static generation
   export default async function Page({ params }) { ... }
   
   // ✅ Correct - provides params for static generation
   export async function generateStaticParams() {
     return [{ slug: 'example' }];
   }
   ```

2. **API routes that don't exist:**
   - Creating links to `/api/endpoint` without creating `app/api/endpoint/route.ts`
   - Results in 404 errors

3. **Missing metadata exports:**
   - Not exporting `metadata` or `generateMetadata` for SEO
   - Not critical, but a related oversight

4. **Environment variable issues:**
   - Using `process.env.VAR` instead of `process.env.NEXT_PUBLIC_VAR` for client-side
   - Missing variables during build

**What code smells or patterns indicate this issue?**

```typescript
// ⚠️ Warning: Dynamic route without config
// File: app/posts/[slug]/page.tsx
export default async function PostPage({ params }) {
  const data = await fetchData(params.slug); // Could fail at build time
  if (!data) notFound(); // Problematic during build
  return <div>{data.title}</div>;
}

// ✅ Better: Explicit dynamic rendering
export const dynamic = 'force-dynamic';
export default async function PostPage({ params }) {
  const data = await fetchData(params.slug);
  if (!data) notFound(); // Safe - runs at request time
  return <div>{data.title}</div>;
}

// ✅ Alternative: Static generation with generateStaticParams
export async function generateStaticParams() {
  const posts = await fetchAllPosts();
  return posts.map(post => ({ slug: post.slug }));
}
export default async function PostPage({ params }) {
  const data = await fetchData(params.slug);
  if (!data) notFound();
  return <div>{data.title}</div>;
}
```

---

## 5. Alternatives & Trade-offs 🔄

### Alternative 1: Static Generation with `generateStaticParams`

**When to use:**
- You have a known, finite set of slugs
- Content doesn't change frequently
- You want maximum performance (pre-rendered pages)

**Implementation:**
```typescript
export async function generateStaticParams() {
  const projects = await getProjects(); // Fetch all slugs at build time
  return projects.map(project => ({
    slug: project.slug,
  }));
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProjectBySlug(params.slug);
  if (!project.data) notFound();
  return <div>{project.data.title}</div>;
}
```

**Trade-offs:**
- ✅ Fastest for users (pre-rendered)
- ✅ Better SEO (fully static HTML)
- ✅ Lower server load
- ❌ Requires all slugs to be known at build time
- ❌ Rebuild needed when new content is added
- ❌ Build time increases with number of pages

### Alternative 2: Incremental Static Regeneration (ISR)

**When to use:**
- You want static performance but dynamic content
- Content changes occasionally
- You're okay with slightly stale content

**Implementation:**
```typescript
export const revalidate = 3600; // Revalidate every hour

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(project => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({ params }) {
  const project = await getProjectBySlug(params.slug);
  if (!project.data) notFound();
  return <div>{project.data.title}</div>;
}
```

**Trade-offs:**
- ✅ Fast (static after first request)
- ✅ Updates automatically on schedule
- ✅ Works for new slugs (on-demand generation)
- ❌ More complex setup
- ❌ Slightly stale content possible
- ❌ Requires understanding revalidation

### Alternative 3: Dynamic Rendering (What We Chose) ⭐

**When to use:**
- Content changes frequently
- API not available at build time
- Unknown or infinite number of slugs
- Simplicity is priority

**Implementation:**
```typescript
export const dynamic = 'force-dynamic';

export default async function ProjectDetailPage({ params }) {
  const project = await getProjectBySlug(params.slug);
  if (!project.data) notFound();
  return <div>{project.data.title}</div>;
}
```

**Trade-offs:**
- ✅ Simplest implementation
- ✅ Always fresh content
- ✅ Works with any number of slugs
- ✅ No build-time dependencies
- ❌ Slower per request (no pre-rendering)
- ❌ Higher server load
- ❌ Requires API to be available at runtime

### Alternative 4: Hybrid Approach

**When to use:**
- You have popular pages and long-tail pages
- Want to optimize common pages while supporting all pages

**Implementation:**
```typescript
export async function generateStaticParams() {
  // Only generate popular/featured pages statically
  const featuredProjects = await getProjects({ featured: true });
  return featuredProjects.map(project => ({ slug: project.slug }));
}

export const dynamicParams = true; // Allow dynamic generation for others

export default async function ProjectDetailPage({ params }) {
  const project = await getProjectBySlug(params.slug);
  if (!project.data) notFound();
  return <div>{project.data.title}</div>;
}
```

**Trade-offs:**
- ✅ Best of both worlds
- ✅ Popular pages are fast
- ✅ All pages still accessible
- ❌ More complex logic
- ❌ Need to decide what to pre-generate

---

## Summary

**The fix:** Added `export const dynamic = 'force-dynamic';` to dynamic route pages.

**Why it works:** Forces Next.js to render pages on-demand (at request time) instead of trying to generate them at build time, preventing build failures when APIs are unavailable or return 404.

**When to reconsider:** If you have a known set of pages and want better performance, consider `generateStaticParams` for static generation or ISR for a hybrid approach.

**Key takeaway:** In Next.js App Router, dynamic routes need explicit configuration. Choose based on your data availability, content update frequency, and performance requirements.
