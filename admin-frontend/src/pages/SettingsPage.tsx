import { useState } from 'react'

export function SettingsPage() {
  const [lotteryEnabled, setLotteryEnabled] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">系统设置</h2>
        <p className="mt-2 text-slate-500">配置抽奖开关和系统运行状态。</p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">抽奖开关</h3>
            <p className="mt-2 text-slate-500">开启后用户可以继续参与抽奖活动。</p>
          </div>
          <label className="inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-5 py-3">
            <input
              type="checkbox"
              checked={lotteryEnabled}
              onChange={(event) => setLotteryEnabled(event.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-slate-950"
            />
            <span className="text-sm font-medium text-slate-900">
              {lotteryEnabled ? '已开启' : '已关闭'}
            </span>
          </label>
        </div>
      </div>
    </div>
  )
}
