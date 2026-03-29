export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: '总用户', value: '1,234' },
          { label: '今日新增', value: '32' },
          { label: '中奖记录', value: '128' },
          { label: '系统开关', value: '已开启' },
        ].map((item) => (
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">运营概览</h2>
        <p className="mt-3 text-slate-600">这里可以展示最近的用户趋势、抽奖统计、以及系统健康信息。</p>
      </div>
    </div>
  )
}
