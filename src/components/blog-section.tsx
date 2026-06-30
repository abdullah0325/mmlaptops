"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar } from "@esmate/shadcn/pkgs/lucide-react"

interface BlogImage {
  url: string
  altText?: string | null
}

interface Article {
  id: string
  title: string
  handle: string
  publishedAt: string
  content: string
  image?: BlogImage | null
  blogHandle: string
}

interface BlogSectionProps {
  articles?: Article[]
}

export default function BlogSection({ articles: initialArticles }: BlogSectionProps) {
  const articles = initialArticles || []

  if (!articles.length) return null

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Latest Articles
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Helpful reads and insights about laptops, gaming, and tech accessories.
          </p>
        </div>

        {/* Two-column grid on laptop/desktop */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => {
            const text = article.content?.replace(/<[^>]+>/g, "").trim() ?? ""

            return (
              <div
                key={article.id}
                className="group relative overflow-hidden rounded-2xl bg-background shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Image: object-contain keeps the full image visible, no heavy crop */}
                <div className="relative aspect-[4/3] bg-gray-50">
                  {article.image?.url ? (
                    <Image
                      src={article.image.url}
                      alt={article.image.altText || article.title}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="p-6 sm:p-8">
                  <time className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {article.publishedAt
                      ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </time>

                  <h3 className="mt-3 text-xl sm:text-2xl font-semibold leading-snug">
                    <Link
                      href={`/blogs/${article.blogHandle}/${article.handle}`}
                      className="hover:text-primary"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                    {text}
                  </p>

                  <Link
                    href={`/blogs/${article.blogHandle}/${article.handle}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary"
                  >
                    Read article <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-14 flex justify-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            View all posts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
