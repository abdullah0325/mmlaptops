"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "@esmate/shadcn/pkgs/lucide-react"

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

const AUTOPLAY_MS = 5000

export default function BlogSection({ articles: initialArticles }: BlogSectionProps) {
  const articles = initialArticles || []
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  if (!articles.length) return null

  const checkScrollPosition = useCallback(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollEl
    setShowLeftArrow(scrollLeft > 10)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
  }, [])

  useEffect(() => {
    checkScrollPosition()
    window.addEventListener("resize", checkScrollPosition)
    return () => window.removeEventListener("resize", checkScrollPosition)
  }, [checkScrollPosition])

  const scrollLeft = useCallback(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const cardWidth = scrollEl.clientWidth / 2
    scrollEl.scrollBy({ left: -cardWidth, behavior: "smooth" })
  }, [])

  const scrollRight = useCallback(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const cardWidth = scrollEl.clientWidth / 2
    scrollEl.scrollBy({ left: cardWidth, behavior: "smooth" })
  }, [])

  /**
   * Auto-advance: scroll to show next pair of articles every 5 seconds
   */
  useEffect(() => {
    if (articles.length <= 2 || isPaused) return

    const timer = window.setInterval(() => {
      const scrollEl = scrollRef.current
      if (!scrollEl) return

      const { scrollLeft, scrollWidth, clientWidth } = scrollEl
      const maxScroll = scrollWidth - clientWidth

      if (scrollLeft >= maxScroll - 10) {
        // Reset to beginning
        scrollEl.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        const cardWidth = clientWidth / 2
        scrollEl.scrollBy({ left: cardWidth, behavior: "smooth" })
      }
    }, AUTOPLAY_MS)

    return () => window.clearInterval(timer)
  }, [isPaused, articles.length])

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

        {/* Horizontal scrollable carousel showing 2 items at a time */}
        <div className="relative mt-14">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
            style={{ scrollSnapType: "x mandatory", scrollBehavior: "smooth" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onScroll={checkScrollPosition}
          >
            {articles.map((article) => {
              const text = article.content?.replace(/<[^>]+>/g, "").trim() ?? ""

              return (
                <div
                  key={article.id}
                  className="flex min-w-[calc(50%-0.75rem)] flex-shrink-0 snap-start items-stretch px-1.5"
                >
                  <div className="group relative w-full overflow-hidden rounded-xl bg-background shadow-sm transition-shadow hover:shadow-md">
                    {/* Image: object-contain keeps the full image visible, no heavy crop */}
                    <div className="relative aspect-[16/10] bg-gray-50">
                      {article.image?.url ? (
                        <Image
                          src={article.image.url}
                          alt={article.image.altText || article.title}
                          fill
                          className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                          sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="p-4 sm:p-5">
                      <time className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : ""}
                      </time>

                      <h3 className="mt-2 text-lg sm:text-xl font-semibold leading-tight">
                        <Link
                          href={`/blogs/${article.blogHandle}/${article.handle}`}
                          className="hover:text-primary"
                        >
                          {article.title}
                        </Link>
                      </h3>

                      <p className="mt-2 line-clamp-2 text-xs sm:text-sm text-muted-foreground">
                        {text}
                      </p>

                      <Link
                        href={`/blogs/${article.blogHandle}/${article.handle}`}
                        className="mt-3 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-primary"
                      >
                        Read article <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation arrows */}
          {articles.length > 2 && (
            <>
              {showLeftArrow && (
                <button
                  type="button"
                  onClick={scrollLeft}
                  aria-label="Scroll left"
                  className="group absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
                >
                  <ChevronLeft className="h-6 w-6 text-slate-800 transition-transform duration-300 group-hover:-translate-x-0.5" />
                </button>
              )}

              {showRightArrow && (
                <button
                  type="button"
                  onClick={scrollRight}
                  aria-label="Scroll right"
                  className="group absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
                >
                  <ChevronRight className="h-6 w-6 text-slate-800 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              )}
            </>
          )}
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
