"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";

interface Chapter {
    number: number;
    pageCount: number;
    path: string;
    firstPageExt?: string;
}

interface Series {
    id: string;
    title: string;
    slug: string;
    genres: string[];
    chapters: Chapter[];
    cover: string;
    synopsis: string;
}

export default function ReaderPage() {
    const params = useParams();
    const slug = params.slug as string;
    const chapterNum = params.chapter as string;

    const [series, setSeries] = useState<Series | null>(null);
    const [pages, setPages] = useState<string[]>([]);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetch("/manga/catalog.json")
            .then((r) => r.json())
            .then((catalog) => {
                const found = catalog.series.find((s: Series) => s.slug === slug);
                if (found) {
                    setSeries(found);
                    const chapter = found.chapters.find(
                        (c: Chapter) => c.number === parseInt(chapterNum)
                    );
                    if (chapter) {
                        // Generate page URLs using actual extension from catalog
                        const ext = chapter.firstPageExt || ".jpg";
                        const urls: string[] = [];
                        for (let i = 1; i <= chapter.pageCount; i++) {
                            const padded = String(i).padStart(3, "0");
                            urls.push(`/manga/${slug}/${chapterNum}/${padded}${ext}`);
                        }
                        setPages(urls);
                    }
                }
            });
    }, [slug, chapterNum]);

    // Handle scroll for header visibility and page tracking
    const handleScroll = useCallback(() => {
        const scrollY = window.scrollY;
        setHeaderVisible(scrollY < 100);

        // Track current page
        const images = document.querySelectorAll(".reader-page");
        images.forEach((img, idx) => {
            const rect = img.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2 && rect.bottom > 0) {
                setCurrentPage(idx + 1);
            }
        });
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    // Handle image load errors (try .png extension)
    const handleImageError = (
        e: React.SyntheticEvent<HTMLImageElement>,
        pageUrl: string
    ) => {
        const target = e.currentTarget;
        if (pageUrl.endsWith(".jpg")) {
            target.src = pageUrl.replace(".jpg", ".png");
        } else if (pageUrl.endsWith(".png")) {
            target.src = pageUrl.replace(".png", ".jpeg");
        } else if (pageUrl.endsWith(".jpeg")) {
            target.src = pageUrl.replace(".jpeg", ".webp");
        }
    };

    return (
        <div className="reader">
            <div className={`reader-header ${headerVisible ? "" : "hidden"}`}>
                <Link href={`/manga/${slug}`} className="reader-back">
                    ← 戻る Back
                </Link>
                <span className="reader-title">
                    {series?.title} — Chapter {chapterNum}
                </span>
                <span className="reader-progress">
                    {currentPage} / {pages.length} ページ
                </span>
            </div>

            <div className="reader-pages">
                {pages.map((pageUrl, idx) => (
                    <div key={idx} className="reader-page">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={pageUrl}
                            alt={`Page ${idx + 1}`}
                            loading={idx < 3 ? "eager" : "lazy"}
                            onError={(e) => handleImageError(e, pageUrl)}
                        />
                    </div>
                ))}
            </div>

            {pages.length > 0 && (
                <div className="reader-end">
                    <h3>おわり — End of Chapter {chapterNum}</h3>
                    <p>次の章をお楽しみに — Stay tuned for the next chapter!</p>
                    <Link href={`/manga/${slug}`} className="btn-primary">
                        ← シリーズに戻る — Back to Series
                    </Link>
                </div>
            )}
        </div>
    );
}
