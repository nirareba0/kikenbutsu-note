import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '危険物ノート | 危険物取扱者 丙種 学習・演習・模試',
  description:
    '危険物取扱者 丙種（先行版）の体系的な教科書とオリジナル四肢択一問題、75分本番形式模擬試験、学習記録を備えた高品質な日本語学習アプリ。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="antialiased min-h-screen bg-[#f2f5fa] text-[#173052]">
        {children}
      </body>
    </html>
  );
}
