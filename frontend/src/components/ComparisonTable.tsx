interface Props {
  data: any[];
}

export default function ComparisonTable({ data }: Props) {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-2 text-left">
        <thead>
          <tr className="text-xs uppercase tracking-wider text-slate-400">
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Examples</th>
            <th className="px-4 py-2">Deployment</th>
            <th className="px-4 py-2">Limitations</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, idx) => (
            <tr
              key={idx}
              className="glass-card transition hover:bg-white/5"
            >
              <td className="px-4 py-3 font-semibold text-indigo-300">
                {item.model_type}
              </td>

              <td className="px-4 py-3 text-slate-300">
                <div className="flex flex-wrap gap-2">
                  {item.examples.map((ex: string, i: number) => (
                    <span
                      key={i}
                      className="rounded-md bg-indigo-500/10 px-2 py-1 text-xs text-indigo-300"
                    >
                      {ex}
                    </span>
                  ))}
                </div>
              </td>

              <td className="px-4 py-3 text-slate-300">
                {item.deployment}
              </td>

              <td className="px-4 py-3 text-slate-400 leading-relaxed">
                {item.limitations}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
