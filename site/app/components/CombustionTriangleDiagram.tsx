'use client';

import React, { useState } from 'react';

interface ElementInfo {
  id: string;
  name: string;
  enName: string;
  color: string;
  description: string;
  examples: string;
  extinguishMethod: string;
  extinguishDetail: string;
}

const ELEMENTS: Record<string, ElementInfo> = {
  fuel: {
    id: 'fuel',
    name: '可燃物',
    enName: 'Fuel',
    color: '#245bdd',
    description: '燃える物質そのもの。酸化されやすい炭化水素化合物など。',
    examples: 'ガソリン、灯油、軽油、重油、木材、紙など',
    extinguishMethod: '除去消火',
    extinguishDetail: '燃料の元栓を閉める、周囲の可燃物を移動・撤去して燃え広がりを防ぐ。',
  },
  oxygen: {
    id: 'oxygen',
    name: '酸素供給源',
    enName: 'Oxygen',
    color: '#173052',
    description: '酸化反応を助ける物質。通常は空気中の酸素（約21%）がこれにあたる。',
    examples: '空気（酸素）、酸化剤（第1類・第6類危険物など）',
    extinguishMethod: '窒息消火',
    extinguishDetail: '泡・粉末・二酸化炭素等で液面を覆い、空気中の酸素濃度を約15%以下に低下させて火を消す。',
  },
  heat: {
    id: 'heat',
    name: '点火源',
    enName: 'Heat / Ignition',
    color: '#d9383a',
    description: '燃焼を開始・継続させるための熱エネルギー。',
    examples: '裸火、静電気放電の火花、摩擦熱、高温の金属面など',
    extinguishMethod: '冷却消火',
    extinguishDetail: '熱を奪い、物質の発火温度（または引火点）未満に冷却して燃焼を停止させる。※油火災には棒状注水不可。',
  },
};

export function CombustionTriangleDiagram() {
  const [selectedId, setSelectedId] = useState<string>('fuel');
  const current = ELEMENTS[selectedId];

  return (
    <div className="my-6 rounded-xl border border-[#d4e0f0] bg-white p-5 shadow-xs">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2f9] pb-3">
        <div>
          <h4 className="text-base font-bold text-[#173052]">【機能図解】燃焼の三要素と消火の対応関係</h4>
          <p className="text-xs text-[#4a5d78]">
            要素をクリックすると、対応する消火原理（除去・窒息・冷却）と具体策が表示されます。
          </p>
        </div>
        <span className="rounded-md bg-[#e5edf8] px-2.5 py-1 text-xs font-semibold text-[#245bdd]">
          相互成立条件
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-center">
        {/* SVG Triangle Diagram */}
        <div className="flex justify-center p-2">
          <svg viewBox="0 0 300 270" className="w-full max-w-[260px] h-auto drop-shadow-xs" aria-label="燃焼の三要素の三角形図">
            {/* Background Triangle fill */}
            <polygon
              points="150,30 40,220 260,220"
              fill="#f2f5fa"
              stroke="#d4e0f0"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Center Label */}
            <text x="150" y="145" textAnchor="middle" fill="#173052" fontSize="16" fontWeight="bold">
              燃焼
            </text>
            <text x="150" y="165" textAnchor="middle" fill="#4a5d78" fontSize="11">
              (熱と光を伴う酸化)
            </text>

            {/* Top Node: 点火源 */}
            <g
              className="cursor-pointer transition-transform"
              onClick={() => setSelectedId('heat')}
              tabIndex={0}
              role="button"
              aria-label="点火源を選択"
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedId('heat')}
            >
              <circle
                cx="150"
                cy="30"
                r="30"
                fill={selectedId === 'heat' ? '#d9383a' : '#fff'}
                stroke="#d9383a"
                strokeWidth={selectedId === 'heat' ? '4' : '2'}
              />
              <text
                x="150"
                y="35"
                textAnchor="middle"
                fill={selectedId === 'heat' ? '#fff' : '#d9383a'}
                fontSize="12"
                fontWeight="bold"
              >
                点火源
              </text>
            </g>

            {/* Bottom-Left Node: 可燃物 */}
            <g
              className="cursor-pointer transition-transform"
              onClick={() => setSelectedId('fuel')}
              tabIndex={0}
              role="button"
              aria-label="可燃物を選択"
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedId('fuel')}
            >
              <circle
                cx="40"
                cy="220"
                r="30"
                fill={selectedId === 'fuel' ? '#245bdd' : '#fff'}
                stroke="#245bdd"
                strokeWidth={selectedId === 'fuel' ? '4' : '2'}
              />
              <text
                x="40"
                y="225"
                textAnchor="middle"
                fill={selectedId === 'fuel' ? '#fff' : '#245bdd'}
                fontSize="12"
                fontWeight="bold"
              >
                可燃物
              </text>
            </g>

            {/* Bottom-Right Node: 酸素供給源 */}
            <g
              className="cursor-pointer transition-transform"
              onClick={() => setSelectedId('oxygen')}
              tabIndex={0}
              role="button"
              aria-label="酸素供給源を選択"
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedId('oxygen')}
            >
              <circle
                cx="260"
                cy="220"
                r="30"
                fill={selectedId === 'oxygen' ? '#173052' : '#fff'}
                stroke="#173052"
                strokeWidth={selectedId === 'oxygen' ? '4' : '2'}
              />
              <text
                x="260"
                y="225"
                textAnchor="middle"
                fill={selectedId === 'oxygen' ? '#fff' : '#173052'}
                fontSize="11"
                fontWeight="bold"
              >
                酸素供給源
              </text>
            </g>
          </svg>
        </div>

        {/* Dynamic Detail Card */}
        <div className="rounded-lg bg-[#f8fafc] border border-[#d4e0f0] p-4 text-sm">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className="font-bold text-base px-2.5 py-0.5 rounded text-white"
              style={{ backgroundColor: current.color }}
            >
              {current.name}（{current.enName}）
            </span >
            <span className="text-xs font-bold text-[#173052] bg-[#f4c84b]/30 px-2 py-0.5 rounded">
              対応する消火：{current.extinguishMethod}
            </span>
          </div>

          <p className="text-[#173052] font-medium mb-2 leading-relaxed">
            {current.description}
          </p>

          <div className="space-y-2 text-xs border-t border-[#edf2f9] pt-2">
            <div>
              <span className="font-bold text-[#4a5d78]">身近な例：</span>
              <span className="text-[#173052] ml-1">{current.examples}</span>
            </div>
            <div>
              <span className="font-bold text-[#d9383a]">この要素を断つ消火法：</span>
              <span className="text-[#173052] ml-1">{current.extinguishDetail}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
