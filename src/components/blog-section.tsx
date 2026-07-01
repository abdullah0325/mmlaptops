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

    const cardWidth = scrollEl.clientWidth / 2.5
    scrollEl.scrollBy({ left: -cardWidth, behavior: "smooth" })
  }, [])

  const scrollRight = useCallback(() => {
    const scrollEl = scrollRef.current
    if (!scrollEl) return

    const cardWidth = scrollEl.clientWidth / 2.5
    scrollEl.scrollBy({ left: cardWidth, behavior: "smooth" })
  }, [])

  /**
   * Auto-advance: scroll to show next set of articles every 5 seconds
   */
  useEffect(() => {
    if (articles.length <= 3 || isPaused) return

    const timer = window.setInterval(() => {
      const scrollEl = scrollRef.current
      if (!scrollEl) return

      const { scrollLeft, scrollWidth, clientWidth } = scrollEl
      const maxScroll = scrollWidth - clientWidth

      if (scrollLeft >= maxScroll - 10) {
        // Reset to beginning
        scrollEl.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        const cardWidth = clientWidth / 2.5
        scrollEl.scrollBy({ left: cardWidth, behavior: "smooth" })
      }
    }, AUTOPLAY_MS)

    return () => window.clearInterval(timer)
  }, [isPaused, articles.length])

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            Latest Articles
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-lg">
            Helpful reads and insights about laptops, gaming, and tech accessories.
          </p>
        </div>

        {/* Horizontal scrollable carousel */}
        <div className="relative mt-12">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory gap-4 sm:gap-5"
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
                  className="flex min-w-[300px] max-w-[300px] sm:min-w-[280px] sm:max-w-[280px] md:min-w-[300px] md:max-w-[300px] lg:min-w-[280px] lg:max-w-[280px] xl:min-w-[300px] xl:max-w-[300px] flex-shrink-0 snap-start items-stretch"
                >
                  <div className="group relative w-full overflow-hidden rounded-xl bg-background shadow-sm transition-shadow hover:shadow-md flex flex-col">
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-gray-50">
                      {article.image?.url ? (
                        <Image
                          src={article.image.url}
                          alt={article.image.altText || article.title}
                          fill
                          className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                          sizes="(min-width: 1280px) 300px, (min-width: 1024px) 280px, (min-width: 768px) 300px, (min-width: 640px) 280px, 300px"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="p-3.5 sm:p-4 flex-1 flex flex-col">
                      <time className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : ""}
                      </time>

                      <h3 className="mt-1.5 text-sm sm:text-base font-semibold leading-snug line-clamp-2">
                        <Link
                          href={`/blogs/${article.blogHandle}/${article.handle}`}
                          className="hover:text-primary transition-colors"
                        >
                          {article.title}
                        </Link>
                      </h3>

                      <p className="mt-1.5 line-clamp-2 text-sm sm:text-base text-muted-foreground flex-1 leading-relaxed">
                        {text}
                      </p>

                      <Link
                        href={`/blogs/${article.blogHandle}/${article.handle}`}
                        className="mt-2.5 inline-flex items-center gap-1.5 text-sm sm:text-base font-medium text-primary hover:underline"
                      >
                        Read Article <ArrowRight className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Navigation arrows */}
          {articles.length > 3 && (
            <>
              {showLeftArrow && (
                <button
                  type="button"
                  onClick={scrollLeft}
                  aria-label="Scroll left"
                  className="group absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 -ml-2"
                >
                  <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-slate-800 transition-transform duration-300 group-hover:-translate-x-0.5" />
                </button>
              )}

              {showRightArrow && (
                <button
                  type="button"
                  onClick={scrollRight}
                  aria-label="Scroll right"
                  className="group absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 -mr-2"
                >
                  <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-slate-800 transition-transform duration-300 group-hover:translate-x-0.5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-base font-medium text-primary hover:underline"
          >
            View all posts <ArrowRight className="h-4.5 w-4.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}