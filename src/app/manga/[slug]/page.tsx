import Header from "@/components/Header";
import Link from "next/link";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

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

function getCatalog(): Catalog {
    const catalogPath = path.join(process.cwd(), "public", "manga", "catalog.json");
    if (!fs.existsSync(catalogPath)) return { series: [] };
    return JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
}

export async function generateStaticParams() {
    const catalog = getCatalog();
    return catalog.series.map((s) => ({ slug: s.slug }));
}

export default async function SeriesPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const catalog = getCatalog();
    const series = catalog.series.find((s) => s.slug === slug);

    if (!series) {
        notFound();
    }

    const totalPages = series.chapters.reduce((sum, ch) => sum + ch.pageCount, 0);

    return (
        <>
            <Header />
            <main className="main-content">
                {/* Hero Banner */}
                <div className="series-hero">
                    <div className="series-hero-bg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={series.cover} alt="" />
                    </div>
                    <div className="series-hero-content">
                        <div className="series-cover">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={series.cover} alt={series.title} />
                        </div>
                        <div className="series-info">
                            <h1>{series.title}</h1>
                            <div className="genre-tags">
                                {series.genres.map((g) => (
                                    <span key={g} className="genre-tag">{g}</span>
                                ))}
                            </div>
                            <p className="series-synopsis">{series.synopsis}</p>
                            <div style={{ display: "flex", gap: 24, marginBottom: 16, flexWrap: "wrap" }}>
                                <div>
                                    <span style={{ fontSize: 20, fontWeight: 700, color: "var(--sakura-pink)" }}>
                                        {series.chapters.length}
                                    </span>
                                    <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 4 }}>
                                        章 Chapters
                                    </span>
                                </div>
                                <div>
                                    <span style={{ fontSize: 20, fontWeight: 700, color: "var(--purple-accent)" }}>
                                        {totalPages}
                                    </span>
                                    <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 4 }}>
                                        ページ Pages
                                    </span>
                                </div>
                            </div>
                            <div className="series-actions">
                                <Link
                                    href={`/manga/${slug}/${series.chapters[0]?.number}`}
                                    className="btn-primary"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg> 読む — Read Now
                                </Link>
                                <button className="btn-secondary">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg> 週間パスで解放 — Unlock with Pass
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chapter List */}
                <div className="chapter-list">
                    <div className="chapter-list-header">
                        <h2 className="chapter-list-title">
                            Chapters <span className="jp">チャプター一覧</span>
                        </h2>
                    </div>

                    {series.chapters.map((chapter) => (
                        <Link
                            key={chapter.number}
                            href={`/manga/${slug}/${chapter.number}`}
                            className="chapter-item"
                        >
                            <div className="chapter-item-left">
                                <span className="chapter-number">#{chapter.number}</span>
                                <div>
                                    <div className="chapter-title">
                                        Chapter {chapter.number}
                                    </div>
                                    <div className="chapter-pages">{chapter.pageCount} pages</div>
                                </div>
                            </div>
                            <span className="chapter-read-btn">読む Read</span>
                        </Link>
                    ))}
                </div>

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
