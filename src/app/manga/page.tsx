"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import MangaCard from "@/components/MangaCard";

interface Chapter {
    number: number;
    pageCount: number;
    path: string;
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

interface Catalog {
    series: Series[];
}

const ALL_GENRES = [
    "All", "Action", "Romance", "Comedy", "Supernatural", "Shōnen", "Adventure",
];

export default function BrowsePage() {
    const [catalog, setCatalog] = useState<Catalog | null>(null);
    const [search, setSearch] = useState("");
    const [activeGenre, setActiveGenre] = useState("All");
    const [loaded, setLoaded] = useState(false);

    // Load catalog on mount
    if (!loaded) {
        fetch("/manga/catalog.json")
            .then((r) => r.json())
            .then((data: Catalog) => {
                setCatalog(data);
                setLoaded(true);
            })
            .catch(() => setLoaded(true));
    }

    const filtered = useMemo(() => {
        if (!catalog) return [];
        let series = catalog.series;

        if (search) {
            const q = search.toLowerCase();
            series = series.filter((s) => s.title.toLowerCase().includes(q));
        }

        if (activeGenre !== "All") {
            series = series.filter((s) => s.genres.includes(activeGenre));
        }

        return series;
    }, [catalog, search, activeGenre]);

    return (
        <>
            <Header />
            <main className="main-content">
                <section className="section" style={{ paddingTop: 40 }}>
                    <div className="section-header">
                        <h2 className="section-title">マンガ一覧</h2>
                        <p className="section-subtitle">All Manga — 全{catalog?.series.length || 0}作品</p>
                    </div>

                    {/* Search */}
                    <div className="search-bar">
                        <span className="search-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" /></svg></span>
                        <input
                            type="text"
                            placeholder="マンガを検索... Search manga..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Genre Filters */}
                    <div className="genre-filters">
                        {ALL_GENRES.map((genre) => (
                            <button
                                key={genre}
                                className={`genre-chip ${activeGenre === genre ? "active" : ""}`}
                                onClick={() => setActiveGenre(genre)}
                            >
                                {genre}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    {!catalog ? (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                                gap: 24,
                                maxWidth: 1400,
                                margin: "0 auto",
                            }}
                        >
                            {Array.from({ length: 12 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="loading-skeleton"
                                    style={{ aspectRatio: "2/3", borderRadius: "var(--radius-md)" }}
                                />
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="manga-grid">
                                {filtered.map((series) => (
                                    <MangaCard
                                        key={series.slug}
                                        slug={series.slug}
                                        title={series.title}
                                        cover={series.cover}
                                        genres={series.genres}
                                        chapterCount={series.chapters.length}
                                        latestChapter={
                                            series.chapters[series.chapters.length - 1]?.number
                                        }
                                    />
                                ))}
                            </div>
                            {filtered.length === 0 && (
                                <div
                                    style={{
                                        textAlign: "center",
                                        padding: 60,
                                        color: "var(--text-muted)",
                                    }}
                                >
                                    <div style={{ fontSize: 48, marginBottom: 16 }}><svg width="48" height="48" viewBox="0 0 24 24" fill="var(--sakura-pink)" stroke="none" opacity="0.5"><path d="M12 2C9.5 5 7 8 7 11a5 5 0 0 0 10 0c0-3-2.5-6-5-9z" /></svg></div>
                                    <p style={{ fontFamily: "var(--font-jp)", fontSize: 18 }}>
                                        見つかりませんでした
                                    </p>
                                    <p style={{ fontSize: 14 }}>No manga found matching your search.</p>
                                </div>
                            )}
                        </>
                    )}
                </section>

                <footer className="footer">
                    <p className="footer-jp">桜 — マンガの新しい形</p>
                    <p className="footer-text">© 2026 Sakura. Read manga on the blockchain.</p>
                    <div className="footer-solana">
                        <span className="sol-dot" />
                        Built on Solana
                    </div>
                </footer>
            </main>
        </>
    );
}
