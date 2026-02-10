import Header from "@/components/Header";
import Link from "next/link";

export default function WeeklyPassPage() {
    return (
        <>
            <Header />
            <main className="main-content">
                <section className="weekly-pass">
                    <div className="section-header">
                        <h2 className="section-title">週間パス</h2>
                        <p className="section-subtitle">Weekly Reading Pass</p>
                    </div>

                    <div className="pass-card">
                        <h2><svg width="20" height="20" viewBox="0 0 24 24" fill="var(--sakura-pink)" stroke="none" style={{ verticalAlign: 'middle', marginRight: 8 }}><path d="M12 2C9.5 5 7 8 7 11a5 5 0 0 0 10 0c0-3-2.5-6-5-9z" /><path d="M12 2C14.5 5 17 8 17 11" opacity="0.5" /></svg>週間パス</h2>
                        <p className="jp-sub">Weekly Pass</p>

                        <div className="pass-price">
                            <span className="amount">1</span>
                            <span className="currency">USDC</span>
                            <span className="period">/ week</span>
                        </div>

                        <ul className="pass-features">
                            <li>
                                <span className="check">✓</span>
                                Unlimited reading for 7 days — 7日間読み放題
                            </li>
                            <li>
                                <span className="check">✓</span>
                                Access all current chapters — 全チャプターアクセス
                            </li>
                            <li>
                                <span className="check">✓</span>
                                Weekly chapter updates — 毎週新章更新
                            </li>
                            <li>
                                <span className="check">✓</span>
                                NFT proof of ownership — NFT所有証明
                            </li>
                            <li>
                                <span className="check">✓</span>
                                Support creators directly — クリエイター直接支援
                            </li>
                        </ul>

                        <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg> パスを購入 — Purchase Weekly Pass
                        </button>
                        <p
                            style={{
                                fontSize: 11,
                                color: "var(--text-muted)",
                                marginTop: 12,
                            }}
                        >
                            Requires a connected Solana wallet with USDC balance
                        </p>
                    </div>

                    {/* Alternative: Per-chapter */}
                    <div
                        style={{
                            maxWidth: 500,
                            margin: "32px auto 0",
                            padding: 24,
                            borderRadius: "var(--radius-lg)",
                            background: "var(--bg-card)",
                            border: "1px solid var(--border-subtle)",
                            textAlign: "center",
                        }}
                    >
                        <p style={{ fontFamily: "var(--font-jp)", fontSize: 16, marginBottom: 8 }}>
                            単話購入
                        </p>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 4 }}>
                            Or pay per chapter — <strong>0.1 USDC</strong> each
                        </p>
                        <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
                            Best for casual readers — カジュアルリーダー向け
                        </p>
                    </div>

                    {/* How it works */}
                    <div
                        style={{
                            maxWidth: 600,
                            margin: "60px auto 0",
                            textAlign: "left",
                        }}
                    >
                        <h3
                            style={{
                                fontFamily: "var(--font-jp)",
                                fontSize: 20,
                                textAlign: "center",
                                marginBottom: 32,
                            }}
                        >
                            購入フロー — Payment Flow
                        </h3>
                        {[
                            { step: "01", jp: "ウォレット接続", en: "Connect your Solana wallet (Phantom recommended)" },
                            { step: "02", jp: "パス選択", en: "Choose Weekly Pass or Pay-per-chapter" },
                            { step: "03", jp: "USDC支払い", en: "Sign USDC payment transaction" },
                            { step: "04", jp: "NFT発行", en: "Receive your Weekly Pass NFT automatically" },
                            { step: "05", jp: "読書開始", en: "Start reading all available chapters instantly" },
                        ].map((item) => (
                            <div
                                key={item.step}
                                style={{
                                    display: "flex",
                                    gap: 16,
                                    marginBottom: 16,
                                    alignItems: "flex-start",
                                    padding: 16,
                                    borderRadius: "var(--radius-md)",
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border-subtle)",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "var(--font-jp)",
                                        fontSize: 24,
                                        fontWeight: 700,
                                        color: "var(--sakura-pink)",
                                        minWidth: 40,
                                    }}
                                >
                                    {item.step}
                                </span>
                                <div>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-jp)",
                                            fontSize: 14,
                                            marginBottom: 2,
                                        }}
                                    >
                                        {item.jp}
                                    </p>
                                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                                        {item.en}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
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
