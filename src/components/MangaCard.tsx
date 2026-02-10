import Link from "next/link";

interface MangaCardProps {
    slug: string;
    title: string;
    cover: string;
    genres: string[];
    chapterCount: number;
    latestChapter?: number;
}

export default function MangaCard({
    slug,
    title,
    cover,
    genres,
    chapterCount,
    latestChapter,
}: MangaCardProps) {
    return (
        <Link href={`/manga/${slug}`} className="manga-card">
            <div className="manga-card-cover">
                {latestChapter && (
                    <span className="manga-card-badge">Ch. {latestChapter}</span>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cover} alt={title} loading="lazy" />
            </div>
            <div className="manga-card-info">
                <h3 className="manga-card-title">{title}</h3>
                <div className="manga-card-meta">
                    {genres[0] && <span className="manga-card-genre">{genres[0]}</span>}
                    <span>
                        {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
                    </span>
                </div>
            </div>
        </Link>
    );
}
