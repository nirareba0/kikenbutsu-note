'use client';

import React from 'react';

interface MascotAdviceProps {
  lessonId: string;
}

const ADVICE_MAP: Record<string, { speech: string; tip: string }> = {
  'law-01-heishu-scope': {
    speech: 'やっほー！丙種で一番狙われるのは「アルコール」と「立会い」だよ！',
    tip: 'テストで「丙種は消毒用エタノールを扱える」「アルバイトに立会いできる」って出たら即バツ❌にしてね！',
  },
  'law-02-designated-quantity': {
    speech: '指定数量の数字は呪文のように声に出して覚えよう！',
    tip: 'ガソリン200、灯油軽油1000、重油2000！倍数の足し算（0.5＋0.5＝1.0倍）は計算問題のド定番だよ💡',
  },
  'law-03-facility-and-procedures': {
    speech: '街のガソリンスタンドは「給油取扱所」って分類になるよ！',
    tip: '「危」の看板は【黄色の背景に黒い文字】！色を逆にした引っかけ問題に気をつけてね🔍',
  },
  'comb-01-three-elements': {
    speech: '火を消すには、三角形のどれか1本をちょん切ればOK！',
    tip: '可燃物を断つ＝除去消火、酸素を断つ＝窒息消火、熱を冷ます＝冷却消火！どれがどの消火器に対応するか覚えよう🔥',
  },
  'comb-02-flash-ignition-limits': {
    speech: 'ガソリンの引火点はマイナス40℃！冷蔵庫の中でも燃えちゃうよ！',
    tip: '灯油は常温（20℃）では引火しないけど、ガソリンは真冬でも引火する！この対比が超頻出だよ❄️',
  },
  'comb-03-static-electricity': {
    speech: '冬場のドアノブのバチッ！が危険物だと大爆発の原因に…😱',
    tip: '対策は「アースを取る（接地）」「湿度60%以上にする」「ゆっくり注ぐ」の3点セットで満点狙おう⚡️',
  },
  'prop-01-fourth-class-common': {
    speech: '「水より軽くて水に浮く」「蒸気は空気より重くて下に溜まる」！',
    tip: '油火災に水をかけちゃダメな理由は「水に浮いて火が広がるから」だよ！絶対頭に入れておこう🧯',
  },
  'prop-02-gasoline-kerosene-diesel': {
    speech: 'ガソリンがオレンジ色なのは、灯油と間違えて火事にならないため！',
    tip: '本物は無色透明だけど、間違えてストーブに入れないようにオレンジ赤に着色してるんだよ🚗',
  },
  'prop-03-heavy-lubricant-animal-veg': {
    speech: '天ぷら油を拭いたボロ布を丸めてゴミ箱に捨てると…勝手に火が出る！？',
    tip: '乾性油の「自然発火」は酸化熱がこもるのが原因！布は水につけて捨てるのがプロの技だよ✨',
  },
};

export function MascotAdvice({ lessonId }: MascotAdviceProps) {
  const advice = ADVICE_MAP[lessonId];
  if (!advice) return null;

  return (
    <div className="my-5 flex items-start gap-3.5 rounded-2xl border-2 border-amber-300/80 bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-yellow-50/90 p-4 shadow-xs">
      {/* Mascot Icon */}
      <div className="relative shrink-0">
        <img
          src="/assets/mascot.jpg"
          alt="ヒナタ先輩"
          className="h-14 w-14 rounded-2xl border-2 border-white object-cover shadow-sm ring-2 ring-amber-300/50"
        />
        <span className="absolute -bottom-1 -right-1 rounded-full bg-amber-500 px-1.5 py-0.2 text-[9px] font-black text-white shadow-2xs">
          先輩
        </span>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-900">ヒナタ先輩のここが出るよ！</span>
          <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-800">
            要チェック ⭐️
          </span>
        </div>
        <p className="text-sm font-bold text-slate-800 leading-snug">
          「{advice.speech}」
        </p>
        <p className="text-xs font-medium text-slate-600 leading-relaxed pt-0.5">
          {advice.tip}
        </p>
      </div>
    </div>
  );
}
