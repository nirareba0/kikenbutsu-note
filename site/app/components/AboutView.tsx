'use client';

import React from 'react';
import { Info, ExternalLink, ShieldCheck, AlertCircle } from 'lucide-react';

export function AboutView() {
  const otherClasses = [
    { code: '甲種', title: '甲種 危険物取扱者', status: '準備中', desc: '全類（第1〜6類）の危険物の取扱い・立会い（実務経験・学歴要件あり）' },
    { code: '乙1', title: '乙種 第1類', status: '準備中', desc: '酸化性固体（塩素酸塩類、過塩素酸塩類など）' },
    { code: '乙2', title: '乙種 第2類', status: '準備中', desc: '可燃性固体（硫黄、赤リン、鉄粉など）' },
    { code: '乙3', title: '乙種 第3類', status: '準備中', desc: '自然発火性物質及び禁水性物質（カリウム、ナトリウムなど）' },
    { code: '乙4', title: '乙種 第4類', status: '準備中', desc: '引火性液体全般（ガソリン、アルコール、引火性液体すべて）' },
    { code: '乙5', title: '乙種 第5類', status: '準備中', desc: '自己反応性物質（ニトロ化合物など）' },
    { code: '乙6', title: '乙種 第6類', status: '準備中', desc: '酸化性液体（過塩素酸、過酸化水素など）' },
  ];

  const primarySources = [
    {
      title: '一般財団法人 消防試験研究センター（試験科目・出題数・免除基準）',
      url: 'https://www.shoubo-shiken.or.jp/kikenbutsu/annai/subject.html',
      description: '丙種危険物取扱者試験の出題科目（法令10・燃焼消火5・性消10問）、四肢択一形式、免除なし75分、科目別各60%基準を確認（2026-09-12確認）。',
    },
    {
      title: 'e-Gov法令検索 消防法（第13条 危険物取扱者の権限・立会い制限）',
      url: 'https://laws.e-gov.go.jp/law/323AC0000000186',
      description: '丙種危険物取扱者は特定危険物を自ら取り扱うことのみができ、無資格者の作業に対する立会い権限を持たない旨の根拠法令。',
    },
    {
      title: 'e-Gov法令検索 危険物の規制に関する政令（第30条の2 丙種の取扱範囲）',
      url: 'https://laws.e-gov.go.jp/law/334CO0000000306',
      description: '丙種の取扱範囲（ガソリン、灯油、軽油、第3石油類の重油・潤滑油・引火点130℃以上のもの、第4石油類、動植物油類）を規定。',
    },
    {
      title: '総務省消防庁 危険物規制政令 別表第3（指定数量表）',
      url: 'https://www.fdma.go.jp/laws/item/laws008_01_db_tourokutetsuzuki.pdf',
      description: 'ガソリン200L、灯油1,000L、軽油1,000L、重油2,000L、動植物油類10,000L等の法定指定数量基準。',
    },
  ];

  return (
    <div className="py-6 space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-[#173052]">本サイトについて・免責事項</h2>
        <p className="text-sm text-[#4a5d78] mt-1">
          『危険物ノート』の制作方針、提供区分、一次資料、免責事項をご案内します。
        </p>
      </div>

      {/* オリジナル教材・校閲前明記（受入要件6） */}
      <div className="rounded-xl border border-[#d4e0f0] bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#245bdd] shrink-0 mt-0.5" />
          <div className="space-y-2">
            <h3 className="text-base font-bold text-[#173052]">
              教材の性格および免責事項
            </h3>
            <p className="text-sm text-[#173052] leading-relaxed">
              本サイトに掲載されている解説テキストおよび問題は、<strong>学習用のオリジナル教材</strong>です。<strong>専門家による校閲前の版</strong>となっております。
            </p>
            <p className="text-xs text-[#4a5d78] leading-relaxed">
              法令・政令等の一次資料を十分に確認して制作しておりますが、法令の全範囲を網羅するものではなく、試験の合格を保証するものではありません。実際の試験対策にあたっては、消防試験研究センターの公式告示や最新の法令条文をあわせてご参照ください。また、危険な実験手順等の記載は行っておらず、試験制度上の理論と概念の解説に特化しています。
            </p>
          </div>
        </div>
      </div>

      {/* 丙種先行版と他区分の状況 */}
      <div className="rounded-xl border border-[#d4e0f0] bg-white p-6 shadow-xs space-y-4">
        <div className="border-b border-[#edf2f9] pb-3">
          <span className="text-xs font-bold text-[#245bdd] uppercase tracking-wider block">
            提供ステータス
          </span>
          <h3 className="text-base font-bold text-[#173052] mt-0.5">
            資格区分ごとの収録状況
          </h3>
        </div>

        {/* 丙種 */}
        <div className="rounded-lg border border-[#245bdd] bg-[#e5edf8]/40 p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-[#173052]">丙種 危険物取扱者</span>
              <span className="bg-[#245bdd] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                先行版・収録単元から学べます
              </span>
            </div>
            <p className="text-xs text-[#4a5d78] mt-1">
              免除なし・四肢択一25問（法令10/燃焼消火5/性質消火10）、75分模試、9単元教科書を提供中。
            </p>
          </div>
        </div>

        {/* 甲種・乙種全6類（準備中・架空カウントなし） */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {otherClasses.map((item) => (
            <div
              key={item.code}
              className="rounded-lg border border-[#edf2f9] bg-[#f8fafc] p-3.5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-[#4a5d78]">{item.title}</span>
                <span className="bg-[#edf2f9] text-[#4a5d78] text-[10px] font-semibold px-2 py-0.5 rounded">
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-[#4a5d78] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 一次資料への参照リスト */}
      <div className="rounded-xl border border-[#d4e0f0] bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#173052] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#245bdd]" />
          <span>確認済み一次資料（法令・基準）</span>
        </h3>

        <div className="divide-y divide-[#edf2f9]">
          {primarySources.map((src, i) => (
            <div key={i} className="py-3 text-xs space-y-1">
              <div className="flex items-center gap-2">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#245bdd] hover:underline inline-flex items-center gap-1 text-sm"
                >
                  <span>{src.title}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-[#4a5d78] leading-relaxed pl-1">
                {src.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
