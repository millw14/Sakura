import Header from "@/components/Header";
import MangaCard from "@/components/MangaCard";
import Link from "next/link";
import fs from "fs";
import path from "path";

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
  if (!fs.existsSync(catalogPath)) {
    return { series: [] };
  }
  return JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
}

// Featured series that should appear on the home page
const FEATURED_SLUGS = [
  "chainsaw-man", "dandadan", "kagurabachi", "one-punch-man",
  "sakamoto-days", "blue-box", "boruto---two-blue-vortex", "jujutsu-kaisen-modulo",
  "ruridragon", "the-elusive-samurai", "ichi-the-witch", "akane-banashi",
];

export default function Home() {
  const catalog = getCatalog();
  const featured = FEATURED_SLUGS
    .map((slug) => catalog.series.find((s) => s.slug === slug))
    .filter(Boolean) as Series[];

  // Fill remaining slots with other series
  if (featured.length < 12) {
    const remaining = catalog.series
      .filter((s) => !FEATURED_SLUGS.includes(s.slug))
      .slice(0, 12 - featured.length);
    featured.push(...remaining);
  }

  return (
    <>
      <Header />
      <main className="main-content">
        {/* Hero */}
        <section className="hero">
          <div className="hero-content">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sakura.png"
              alt="Sakura Mascot"
              className="hero-mascot"
            />
            <div className="hero-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--sakura-pink)" stroke="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" /></svg>
              ソラナで動く · Powered by Solana
            </div>
            <h1 className="hero-title">桜</h1>
            <p className="hero-subtitle-jp">読む。集める。所有する。</p>
            <p className="hero-subtitle">
              The next generation manga platform. Read weekly chapters, collect
              digital passes, and truly own your manga experience — all on
              Solana.
            </p>
            <div className="hero-cta-group">
              <Link href="/manga" className="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
                マンガを読む — Browse Manga
              </Link>
              <Link href="/pass" className="btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                週間パス — Weekly Pass
              </Link>
            </div>

            <div className="stats-bar">
              <div className="stat-item">
                <div className="stat-value">{catalog.series.length}</div>
                <div className="stat-label">Series</div>
                <div className="stat-label-jp">シリーズ</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">週刊</div>
                <div className="stat-label">Weekly Updates</div>
                <div className="stat-label-jp">毎週更新</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">◎</div>
                <div className="stat-label">Solana Network</div>
                <div className="stat-label-jp">ソラナ</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Manga */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">注目のマンガ</h2>
            <p className="section-subtitle">Featured Series</p>
          </div>
          <div className="manga-grid">
            {featured.map((series) => (
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
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link href="/manga" className="btn-secondary">
              全てのマンガを見る — View All Manga →
            </Link>
          </div>
        </section>

        {/* How it Works */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title">仕組み</h2>
            <p className="section-subtitle">How Sakura Works</p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 24,
              maxWidth: 1000,
              margin: "0 auto",
            }}
          >
            {[
              {
                icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--sakura-pink)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><circle cx="18" cy="16" r="1" /></svg>,
                title: "ウォレット接続",
                en: "Connect Wallet",
                desc: "Connect your Phantom or Solflare wallet to access the platform.",
              },
              {
                icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--purple-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>,
                title: "パスを取得",
                en: "Get Weekly Pass",
                desc: "Purchase a weekly pass NFT for 1 USDC to unlock all current chapters.",
              },
              {
                icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>,
                title: "マンガを読む",
                en: "Read Manga",
                desc: "Enjoy unlimited reading with a beautiful vertical scroll reader.",
              },
            ].map((step) => (
              <div
                key={step.en}
                style={{
                  padding: 32,
                  borderRadius: "var(--radius-lg)",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-subtle)",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>{step.icon}</div>
                <h3
                  style={{
                    fontFamily: "var(--font-jp)",
                    fontSize: 20,
                    marginBottom: 4,
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    letterSpacing: 2,
                    marginBottom: 12,
                  }}
                >
                  {step.en}
                </p>
                <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <p className="footer-jp">桜 — マンガの新しい形</p>
          <p className="footer-text">
            © 2026 Sakura. Read manga on the blockchain.
          </p>
          <div className="footer-solana">
            <span className="sol-dot" />
            Built on Solana
          </div>
        </footer>
      </main>
    </>
  );
}
