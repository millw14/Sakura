"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [connecting, setConnecting] = useState(false);

    const connectWallet = async () => {
        try {
            setConnecting(true);
            // Check if Phantom is installed
            const provider = (window as unknown as { solana?: { isPhantom: boolean; connect: () => Promise<{ publicKey: { toString: () => string } }> } }).solana;
            if (provider?.isPhantom) {
                const response = await provider.connect();
                const address = response.publicKey.toString();
                setWalletAddress(address);
            } else {
                window.open("https://phantom.app/", "_blank");
            }
        } catch (err) {
            console.error("Wallet connection failed:", err);
        } finally {
            setConnecting(false);
        }
    };

    const disconnectWallet = () => {
        setWalletAddress(null);
    };

    const truncateAddress = (addr: string) =>
        `${addr.slice(0, 4)}...${addr.slice(-4)}`;

    return (
        <header className="header">
            <Link href="/" className="header-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/sakura.png" alt="Sakura" />
                <div className="header-logo-text">
                    <span className="jp">桜 Sakura</span>
                    <span className="en">Manga × Solana</span>
                </div>
            </Link>

            <nav className="header-nav">
                <Link href="/">
                    Home
                    <span className="jp-label">ホーム</span>
                </Link>
                <Link href="/manga">
                    Browse
                    <span className="jp-label">マンガ</span>
                </Link>
                <Link href="/pass">
                    Weekly Pass
                    <span className="jp-label">週間パス</span>
                </Link>

                {walletAddress ? (
                    <button
                        className="wallet-btn wallet-connected"
                        onClick={disconnectWallet}
                    >
                        <span className="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><circle cx="18" cy="16" r="1" /></svg></span>
                        {truncateAddress(walletAddress)}
                    </button>
                ) : (
                    <button
                        className="wallet-btn"
                        onClick={connectWallet}
                        disabled={connecting}
                    >
                        <span className="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4" /><path d="M4 6v12c0 1.1.9 2 2 2h14v-4" /><circle cx="18" cy="16" r="1" /></svg></span>
                        {connecting ? "接続中..." : "Connect Wallet"}
                    </button>
                )}
            </nav>
        </header>
    );
}
