'use client';

import React from 'react';

interface MascotAdviceProps {
  lessonId: string;
}

const ADVICE_MAP: Record<string, { speech: string; tip: string }> = {
  'law-01-heishu-scope': {
    speech: 'やっほー！丙種で一番狙われるのは「アルコール」と「立会い」だよ！',
    tip: 'テストで「丙種は消毒用エタノールを扱える」「無資格のバイトに立会いできる」って出たら即バツ❌にしてね！',
  },
  'law-02-designated-quantity': {
    speech: '指定数量の数字はドラム缶（200L）でイメージすると一発で覚えられるよ！',
    tip: 'ガソリン200（1本）、灯油軽油1000（5本）、重油2000（10本）！倍数の足し算（0.5＋0.6＝1.1倍で規制対象）は計算問題のド定番だよ💡',
  },
  'law-03-facility-and-procedures': {
    speech: '看板の色あて問題はサービス問題！色と文字の組み合わせを焼きつけよう！',
    tip: '火気厳禁は「赤地に白文字」、給油中エンジン停止は「黄地に黒文字」！引っ越して住所が変わっただけなら免状の書換えは不要なのも頻出だよ🔍',
  },
  'comb-01-three-elements': {
    speech: '火を消すには、三角形（燃えるもの・酸素・火種）のどれか1つを壊せばOK！',
    tip: '油火災に水をかけると油が浮いて火の海になっちゃう（絶対NG）！泡や粉末、二酸化炭素で酸素を断つ「窒息消火」が鉄則だよ🔥',
  },
  'comb-02-flash-ignition-limits': {
    speech: '引火点と発火点の「逆転現象」に気をつけて！試験最大の落とし穴だよ！',
    tip: '火を近づけてつく「引火点」はガソリン（-40℃以下）が極低だけど、火なしで勝手に燃え出す「発火点」は軽油（約220℃）の方がガソリン（約300℃）より低くて危ないよ❄️',
  },
  'comb-03-static-electricity': {
    speech: 'スタンドで給油前にタッチする黒いシート、あれ実は大爆発を防いでるんだよ！',
    tip: '油は電気を通さないから摩擦で静電気がたまりやすい！「アース」「湿度75%」「ゆっくり注ぐ」「静置時間」の5拍子で火花を防ごう⚡️',
  },
  'prop-01-fourth-class-common': {
    speech: '「水より軽くて水に浮く」「蒸気は空気より重くて床にたまる」！',
    tip: '蒸気は空気より重いから天井にはいかないよ！換気口は必ず「床に近い低い位置」！水消火も油が浮いて広がるから絶対ダメ🧯',
  },
  'prop-02-gasoline-kerosene-diesel': {
    speech: 'ガソリンがオレンジ色なのは、灯油と間違えて大火事にならないため！',
    tip: 'ガソリンを灯油用の赤いポリタンクに入れちゃダメ（静電気で爆発の恐れ・金属缶を使う）！軽油の発火点（約220℃）が低いのも要チェック🚗',
  },
  'prop-03-heavy-lubricant-animal-veg': {
    speech: '天ぷら油やアマニ油がついた布、そのままゴミ箱に丸めて捨てると勝手に火が出るよ！',
    tip: '乾性油は空気中の酸素と反応して熱（酸化熱）を出すよ！布を丸めると熱がこもって「自然発火」するから、水に浸して金属ゴミ箱に捨てよう✨',
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
          src="./assets/mascot.jpg"
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
