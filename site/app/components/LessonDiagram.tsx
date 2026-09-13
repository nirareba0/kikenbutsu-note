'use client';

import React from 'react';
import { CombustionTriangleDiagram } from './CombustionTriangleDiagram';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  Droplets,
  Zap,
  Thermometer,
  ShieldCheck,
  Fuel,
  Truck,
  Sparkles,
  Info,
} from 'lucide-react';

interface LessonDiagramProps {
  lessonId: string;
}

export function LessonDiagram({ lessonId }: LessonDiagramProps) {
  switch (lessonId) {
    // 1. 丙種の資格範囲
    case 'law-01-heishu-scope':
      return (
        <div className="my-6 rounded-2xl border-2 border-[#2563EB]/20 bg-gradient-to-br from-[#eff6ff] to-[#f8fafc] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-white text-xs font-black">
              図解
            </span>
            <h4 className="text-base font-black text-[#1E3A8A]">
              【一目でわかる】丙種でできること・できないこと
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* OK カード */}
            <div className="rounded-xl border-2 border-emerald-400/60 bg-emerald-50/70 p-4">
              <div className="flex items-center gap-2 text-emerald-700 font-black text-sm mb-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>自分で取り扱える！（身近な特定品目）</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-[#1e293b]">
                <div className="bg-white/90 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                  <Fuel className="w-4 h-4 text-red-500 shrink-0" />
                  <span>ガソリン</span>
                </div>
                <div className="bg-white/90 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>灯油・軽油</span>
                </div>
                <div className="bg-white/90 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                  <Fuel className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>重油</span>
                </div>
                <div className="bg-white/90 p-2 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-yellow-600 shrink-0" />
                  <span>潤滑油・動植物油</span>
                </div>
              </div>
              <p className="text-[11px] text-emerald-800 font-semibold mt-2.5">
                ※生活に身近な第4類危険物に限定して自ら作業できます。
              </p>
            </div>

            {/* NG カード */}
            <div className="rounded-xl border-2 border-rose-400/60 bg-rose-50/70 p-4">
              <div className="flex items-center gap-2 text-rose-700 font-black text-sm mb-2.5">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>丙種では絶対NG！（試験の超ひっかけ）</span>
              </div>
              <ul className="space-y-1.5 text-xs font-bold text-[#1e293b]">
                <li className="bg-white/90 p-2 rounded-lg border border-rose-200 flex items-center justify-between">
                  <span>アルコール類（消毒液・エタノール等）</span>
                  <span className="text-rose-600 font-black">取扱不可 ❌</span>
                </li>
                <li className="bg-white/90 p-2 rounded-lg border border-rose-200 flex items-center justify-between">
                  <span>特殊引火物・ベンゼン・アセトン</span>
                  <span className="text-rose-600 font-black">取扱不可 ❌</span>
                </li>
                <li className="bg-white/90 p-2 rounded-lg border border-rose-200 flex items-center justify-between">
                  <span>無資格者の作業への「立会い」</span>
                  <span className="text-rose-600 font-black">権限なし ❌</span>
                </li>
              </ul>
              <p className="text-[11px] text-rose-800 font-semibold mt-2.5">
                ※「立会い」ができるのは甲種・乙種取扱者だけ！
              </p>
            </div>
          </div>
        </div>
      );

    // 2. 指定数量と倍数計算
    case 'law-02-designated-quantity':
      return (
        <div className="my-6 rounded-2xl border-2 border-[#2563EB]/20 bg-gradient-to-br from-[#eff6ff] to-[#f8fafc] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-white text-xs font-black">
              図解
            </span>
            <h4 className="text-base font-black text-[#1E3A8A]">
              【ドラム缶でイメージ】指定数量の覚え方と倍数計算
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="rounded-xl bg-white p-3 border-2 border-red-200 text-center shadow-2xs">
              <span className="text-[11px] font-bold text-red-600 block">一番危ない！</span>
              <span className="text-sm font-black text-slate-800 block">ガソリン</span>
              <div className="my-1.5 flex justify-center items-baseline gap-0.5">
                <span className="text-2xl font-black text-red-500">200</span>
                <span className="text-xs font-bold text-slate-500">L</span>
              </div>
              <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-bold">
                🛢️ ドラム缶1本
              </span>
            </div>

            <div className="rounded-xl bg-white p-3 border-2 border-blue-200 text-center shadow-2xs">
              <span className="text-[11px] font-bold text-blue-600 block">ストーブでおなじみ</span>
              <span className="text-sm font-black text-slate-800 block">灯油・軽油</span>
              <div className="my-1.5 flex justify-center items-baseline gap-0.5">
                <span className="text-2xl font-black text-blue-500">1,000</span>
                <span className="text-xs font-bold text-slate-500">L</span>
              </div>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                🛢️ ドラム缶5本
              </span>
            </div>

            <div className="rounded-xl bg-white p-3 border-2 border-amber-200 text-center shadow-2xs">
              <span className="text-[11px] font-bold text-amber-600 block">ボイラー・船舶用</span>
              <span className="text-sm font-black text-slate-800 block">重油</span>
              <div className="my-1.5 flex justify-center items-baseline gap-0.5">
                <span className="text-2xl font-black text-amber-600">2,000</span>
                <span className="text-xs font-bold text-slate-500">L</span>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                🛢️ ドラム缶10本
              </span>
            </div>

            <div className="rounded-xl bg-white p-3 border-2 border-emerald-200 text-center shadow-2xs">
              <span className="text-[11px] font-bold text-emerald-600 block">食用油・機械油</span>
              <span className="text-sm font-black text-slate-800 block">動植物油類</span>
              <div className="my-1.5 flex justify-center items-baseline gap-0.5">
                <span className="text-2xl font-black text-emerald-600">10,000</span>
                <span className="text-xs font-bold text-slate-500">L</span>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                🛢️ ドラム缶50本
              </span>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-300 p-3.5 flex items-center justify-between text-xs text-amber-900 font-bold">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
              <span>
                <strong>倍数の公式：</strong> 合計倍数 ＝ (ガソリン÷200) ＋ (灯油÷1,000) ＋ (重油÷2,000) ...
              </span>
            </div>
            <span className="bg-amber-200/80 px-2.5 py-1 rounded-md text-[11px] shrink-0">
              合計 1.0倍以上で規制対象！
            </span>
          </div>
        </div>
      );

    // 3. 施設区分と保安管理
    case 'law-03-facility-and-procedures':
      return (
        <div className="my-6 rounded-2xl border-2 border-[#2563EB]/20 bg-gradient-to-br from-[#eff6ff] to-[#f8fafc] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-white text-xs font-black">
              図解
            </span>
            <h4 className="text-base font-black text-[#1E3A8A]">
              【街で見かける】危険物施設の3大グループ
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-white p-3.5 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                <span className="text-base">🏭</span>
                <span>製造所</span>
              </div>
              <h5 className="font-bold text-sm text-slate-800">石油コンビナート等</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                原油からガソリンやプラスチック原料などを「作り出す」施設。
              </p>
            </div>

            <div className="rounded-xl bg-white p-3.5 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                <Truck className="w-4 h-4 text-indigo-600" />
                <span>貯蔵所（7種類）</span>
              </div>
              <h5 className="font-bold text-sm text-slate-800">タンクローリー・タンク</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                危険物を安全に「蓄えておく」場所。移動タンクや地下タンクなど。
              </p>
            </div>

            <div className="rounded-xl bg-white p-3.5 border border-slate-200 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs">
                <Fuel className="w-4 h-4 text-indigo-600" />
                <span>取扱所（4種類）</span>
              </div>
              <h5 className="font-bold text-sm text-slate-800">ガソリンスタンド等</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                車に給油したり、ボイラーで燃料を「消費・販売する」場所。
              </p>
            </div>
          </div>

          {/* 看板・掲示板の配色ルール（試験の超頻出！） */}
          <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
            <span className="text-xs font-black text-slate-700 block mb-2">
              🏷️【試験で狙われる】看板・掲示板の配色ルール一覧
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
              {/* 施設標識 */}
              <div className="rounded-lg bg-white border border-slate-300 p-2 shadow-2xs">
                <span className="text-[10px] text-slate-500 block">施設標識</span>
                <div className="mt-1 bg-white border border-slate-400 py-1 px-1.5 rounded text-black font-black text-[11px]">
                  危険物取扱所
                </div>
                <span className="text-[9px] text-slate-600 block mt-1">白地に黒文字</span>
              </div>
              {/* 火気厳禁 */}
              <div className="rounded-lg bg-red-50 border border-red-200 p-2 shadow-2xs">
                <span className="text-[10px] text-red-600 block">防火標識</span>
                <div className="mt-1 bg-red-600 py-1 px-1.5 rounded text-white font-black text-[11px]">
                  火気厳禁
                </div>
                <span className="text-[9px] text-red-700 block mt-1">赤地に白文字</span>
              </div>
              {/* 給油中エンジン停止 */}
              <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-2 shadow-2xs">
                <span className="text-[10px] text-yellow-700 block">スタンド注意</span>
                <div className="mt-1 bg-yellow-400 py-1 px-1.5 rounded text-black font-black text-[11px]">
                  給油中エンジン停止
                </div>
                <span className="text-[9px] text-yellow-800 block mt-1">黄地に黒文字</span>
              </div>
              {/* タンクローリー */}
              <div className="rounded-lg bg-slate-100 border border-slate-300 p-2 shadow-2xs">
                <span className="text-[10px] text-slate-600 block">移動タンク</span>
                <div className="mt-1 bg-black py-1 px-1.5 rounded text-yellow-400 font-black text-[11px]">
                  危
                </div>
                <span className="text-[9px] text-slate-700 block mt-1">黒地に黄文字</span>
              </div>
            </div>
          </div>
        </div>
      );

    // 4. 燃焼の三要素
    case 'comb-01-three-elements':
      return <CombustionTriangleDiagram />;

    // 5. 引火点・発火点・燃焼範囲
    case 'comb-02-flash-ignition-limits':
      return (
        <div className="my-6 rounded-2xl border-2 border-[#2563EB]/20 bg-gradient-to-br from-[#eff6ff] to-[#f8fafc] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-white text-xs font-black">
              図解
            </span>
            <h4 className="text-base font-black text-[#1E3A8A]">
              【温度で比較】ガソリンと灯油の「引火点」の決定的な違い
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl bg-white p-4 border-2 border-red-300 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-red-600 text-sm">ガソリン</span>
                <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">
                  極めて危険 🔥
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-xs font-bold text-slate-500">引火点：</span>
                <span className="text-2xl font-black text-red-600">-40℃ 以下</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                真冬のスキー場（氷点下）でも常に蒸発していて、火花ひとつで爆発的に火がつきます！
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 border-2 border-blue-300 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-blue-600 text-sm">灯油・軽油</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">
                  常温では引火しにくい
                </span>
              </div>
              <div className="flex items-baseline gap-1 my-1">
                <span className="text-xs font-bold text-slate-500">引火点：</span>
                <span className="text-2xl font-black text-blue-600">40℃ / 45℃ 以上</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                常温（20℃前後）ではマッチを近づけても火はつきません。40℃以上に温まると引火します。
              </p>
            </div>
          </div>

          <div className="mt-3 rounded-lg bg-orange-50 border border-orange-200 p-3 text-xs text-orange-900 font-bold flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-orange-500 shrink-0" />
            <span>
              <strong>発火点と引火点の違い：</strong> 点火源がなくても自分で燃え出す温度が「発火点」（ガソリン約300℃、灯油約220℃）。引火点より発火点のほうがはるかに高い！
            </span>
          </div>
        </div>
      );

    // 6. 静電気と予防
    case 'comb-03-static-electricity':
      return (
        <div className="my-6 rounded-2xl border-2 border-[#2563EB]/20 bg-gradient-to-br from-[#eff6ff] to-[#f8fafc] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-white text-xs font-black">
              図解
            </span>
            <h4 className="text-base font-black text-[#1E3A8A]">
              【見えない火花】静電気災害を防ぐ4つの黄金ルール
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="rounded-xl bg-white p-3 border border-yellow-300 shadow-2xs">
              <span className="text-2xl block mb-1">⚡️</span>
              <span className="text-xs font-black text-slate-800 block">アース線（接地）</span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                電気を地面へ逃がす
              </span>
            </div>

            <div className="rounded-xl bg-white p-3 border border-blue-300 shadow-2xs">
              <span className="text-2xl block mb-1">💧</span>
              <span className="text-xs font-black text-slate-800 block">湿度 60% 以上</span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                湿気で電気を逃がす
              </span>
            </div>

            <div className="rounded-xl bg-white p-3 border border-emerald-300 shadow-2xs">
              <span className="text-2xl block mb-1">🦺</span>
              <span className="text-xs font-black text-slate-800 block">静電気防止服・靴</span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                合成繊維は静電気が溜まる
              </span>
            </div>

            <div className="rounded-xl bg-white p-3 border border-purple-300 shadow-2xs">
              <span className="text-2xl block mb-1">🐢</span>
              <span className="text-xs font-black text-slate-800 block">注入速度を落とす</span>
              <span className="text-[11px] text-slate-500 mt-1 block">
                摩擦を減らし帯電防止
              </span>
            </div>
          </div>
        </div>
      );

    // 7. 第4類危険物の共通特性
    case 'prop-01-fourth-class-common':
      return (
        <div className="my-6 rounded-2xl border-2 border-[#2563EB]/20 bg-gradient-to-br from-[#eff6ff] to-[#f8fafc] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-white text-xs font-black">
              図解
            </span>
            <h4 className="text-base font-black text-[#1E3A8A]">
              【試験の超定番】第4類危険物の3大鉄則
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-white p-4 border-2 border-red-200">
              <div className="text-xl mb-1">🌊 ❌</div>
              <h5 className="font-black text-sm text-red-600 mb-1">① 水より軽い！</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                水に浮いて広がるため、水（棒状注水）をかけると火の海が広がって大惨事になります！泡や粉末で消火。
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 border-2 border-amber-200">
              <div className="text-xl mb-1">💨 ⬇️</div>
              <h5 className="font-black text-sm text-amber-700 mb-1">② 蒸気は空気より重い！</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                気化した蒸気は天井ではなく「床や地面のくぼみ・排水溝」に溜まります。足元の火花に超警戒！
              </p>
            </div>

            <div className="rounded-xl bg-white p-4 border-2 border-blue-200">
              <div className="text-xl mb-1">⚡️ 🔋</div>
              <h5 className="font-black text-sm text-blue-600 mb-1">③ 電気を通しにくい！</h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                絶縁体なので流れると静電気がどんどん溜まり（帯電）、パチッと放電して火災原因になります。
              </p>
            </div>
          </div>
        </div>
      );

    // 8. ガソリン・灯油・軽油の比較
    case 'prop-02-gasoline-kerosene-diesel':
      return (
        <div className="my-6 rounded-2xl border-2 border-[#2563EB]/20 bg-gradient-to-br from-[#eff6ff] to-[#f8fafc] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-white text-xs font-black">
              図解
            </span>
            <h4 className="text-base font-black text-[#1E3A8A]">
              【色と性状】3大メジャー燃料 徹底比較バトル
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl bg-gradient-to-b from-orange-50 to-white p-4 border-2 border-orange-400">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-sm text-orange-700">ガソリン</span>
                <span className="text-[10px] bg-orange-200 text-orange-800 font-black px-2 py-0.5 rounded">
                  第1石油類
                </span>
              </div>
              <div className="space-y-1.5 text-xs font-bold text-slate-700">
                <p>🎨 色：<span className="text-orange-600 font-black">オレンジ赤色に着色</span></p>
                <p>🔥 引火点：<span className="text-red-600 font-black">-40℃ 以下</span></p>
                <p>⚠️ 指定数量：<span className="text-slate-900 font-black">200 L</span></p>
                <p className="text-[11px] text-slate-500 font-normal pt-1 border-t border-orange-100">
                  灯油・軽油と間違えないよう法令で赤に着色義務！
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-b from-blue-50 to-white p-4 border-2 border-blue-400">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-sm text-blue-700">灯油</span>
                <span className="text-[10px] bg-blue-200 text-blue-800 font-black px-2 py-0.5 rounded">
                  第2石油類
                </span>
              </div>
              <div className="space-y-1.5 text-xs font-bold text-slate-700">
                <p>🎨 色：<span className="text-blue-600 font-black">無色透明（水っぽい）</span></p>
                <p>🔥 引火点：<span className="text-blue-600 font-black">40℃ 以上</span></p>
                <p>⚠️ 指定数量：<span className="text-slate-900 font-black">1,000 L</span></p>
                <p className="text-[11px] text-slate-500 font-normal pt-1 border-t border-blue-100">
                  水のように澄んでいるが特有の油臭がある。
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-b from-amber-50 to-white p-4 border-2 border-amber-400">
              <div className="flex items-center justify-between mb-2">
                <span className="font-black text-sm text-amber-700">軽油</span>
                <span className="text-[10px] bg-amber-200 text-amber-800 font-black px-2 py-0.5 rounded">
                  第2石油類
                </span>
              </div>
              <div className="space-y-1.5 text-xs font-bold text-slate-700">
                <p>🎨 色：<span className="text-amber-700 font-black">淡黄色（薄い黄色）</span></p>
                <p>🔥 引火点：<span className="text-amber-700 font-black">45℃ 以上</span></p>
                <p>⚠️ 指定数量：<span className="text-slate-900 font-black">1,000 L</span></p>
                <p className="text-[11px] text-slate-500 font-normal pt-1 border-t border-amber-100">
                  トラックやバスのディーゼルエンジンの燃料！
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    // 9. 重油・潤滑油・動植物油類
    case 'prop-03-heavy-lubricant-animal-veg':
      return (
        <div className="my-6 rounded-2xl border-2 border-[#2563EB]/20 bg-gradient-to-br from-[#eff6ff] to-[#f8fafc] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-white text-xs font-black">
              図解
            </span>
            <h4 className="text-base font-black text-[#1E3A8A]">
              【自然発火の罠】天ぷら油・乾性油が勝手に燃えるメカニズム
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="rounded-xl bg-white p-4 border-2 border-rose-300">
              <div className="flex items-center gap-2 text-rose-700 font-black text-sm mb-2">
                <Flame className="w-5 h-5 text-rose-600" />
                <span>ボロ布（ウエス）の自然発火ステップ</span>
              </div>
              <ol className="space-y-1.5 text-xs font-bold text-slate-700 list-decimal list-inside">
                <li>天ぷら油やアマニ油（乾性油）を布で拭く</li>
                <li>油が空気中の酸素とじわじわ結合（酸化反応）</li>
                <li>布を山積みにすると<strong>酸化熱がこもる</strong></li>
                <li>発火点に達して<strong>火の気がないのに突然出火！</strong></li>
              </ol>
            </div>

            <div className="rounded-xl bg-emerald-50 border border-emerald-300 p-4 space-y-2">
              <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>自然発火を防ぐ対策</span>
              </span>
              <p className="text-xs text-emerald-950 leading-relaxed font-bold">
                油のついた布やゴミは、広げて放熱させるか、<strong>水を入れた蓋付き金属容器に密閉して保管</strong>すること！
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
