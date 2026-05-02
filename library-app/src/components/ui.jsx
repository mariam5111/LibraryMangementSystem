// Shared primitive components

const STATUS_COLOR = {
  ACTIVE: 'bg-green-100 text-green-800',
  RETURNED: 'bg-gray-100 text-gray-700',
  OVERDUE: 'bg-red-100 text-red-800',
  REQUESTED: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-700',
  LATE: 'bg-amber-100 text-amber-800',
  PENDING: 'bg-amber-100 text-amber-800',
};

export function Badge({ text }) {
  const cls = STATUS_COLOR[text] || 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${cls}`}>
      {text || '—'}
    </span>
  );
}

export function RoleBadges({ roles }) {
  const cls = r =>
    r.includes('ADMIN') ? 'bg-amber-100 text-amber-800' :
    r.includes('LIBRARIAN') ? 'bg-blue-100 text-blue-800' :
    'bg-green-100 text-green-800';
  return (
    <>
      {(roles || []).map(r => (
        <span key={r} className={`inline-block text-[11px] px-2 py-0.5 rounded-full font-medium mr-1 ${cls(r)}`}>
          {r.replace('ROLE_', '')}
        </span>
      ))}
    </>
  );
}

export function Mono({ text }) {
  return (
    <span className="font-mono text-[11px] text-gray-400">
      {(text || '').slice(0, 12)}…
    </span>
  );
}

export function StatCard({ label, value, tone }) {
  const valCls = tone === 'warn' ? 'text-amber-700' : tone === 'good' ? 'text-green-800' : 'text-[#1a1a1a]';
  return (
    <div className="bg-white border border-[#e8e6e0] rounded-xl p-4 hover:shadow-md transition-shadow">
      <div className="text-xs text-gray-400 mb-1.5">{label}</div>
      {value == null
        ? <div className="shimmer h-7 w-14 rounded" />
        : <div className={`text-2xl font-semibold tracking-tight ${valCls}`}>{value}</div>
      }
    </div>
  );
}

export function StatGrid({ stats }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 mb-6">
      {stats.map(s => <StatCard key={s.label} {...s} />)}
    </div>
  );
}

export function DataTable({ columns, rows, loading, empty = 'No data', actions }) {
  if (loading) return <div className="text-center py-12 text-gray-400 text-sm">Loading…</div>;
  if (!rows || !rows.length) return <div className="text-center py-12 text-gray-400 text-sm">{empty}</div>;
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key} className="text-left px-3 py-2 border-b border-[#e8e6e0] text-gray-400 font-medium text-xs tracking-wide whitespace-nowrap">
                {c.label}
              </th>
            ))}
            {actions && <th className="text-left px-3 py-2 border-b border-[#e8e6e0] text-gray-400 font-medium text-xs">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id || i} className="hover:bg-[#fafaf8]">
              {columns.map(c => (
                <td key={c.key} className="px-3 py-2 border-b border-[#f0ede6] align-middle last:border-0">
                  {c.render ? c.render(row[c.key], row) : (row[c.key] ?? '—')}
                </td>
              ))}
              {actions && (
                <td className="px-3 py-2 border-b border-[#f0ede6] align-middle last:border-0">
                  <div className="flex gap-1.5 flex-wrap">{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SectionTitle({ children }) {
  return <div className="text-[15px] font-semibold mb-5 tracking-tight">{children}</div>;
}

export function Card({ children }) {
  return (
    <div className="bg-white border border-[#e8e6e0] rounded-xl p-5 mb-4">
      {children}
    </div>
  );
}

export function Msg({ msg }) {
  if (!msg) return null;
  const cls = msg.type === 'error'
    ? 'bg-red-50 text-red-800 border border-red-200'
    : 'bg-green-50 text-green-800 border border-green-200';
  return <div className={`px-3 py-2 rounded-md text-sm mb-4 ${cls}`}>{msg.text}</div>;
}

// Buttons
export function Btn({ onClick, children, variant = 'default', size = 'md', className = '', disabled }) {
  const base = 'inline-flex items-center gap-1.5 rounded-md border cursor-pointer transition-all active:scale-[.98] font-[inherit] disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { md: 'px-3.5 py-1.5 text-sm', sm: 'px-2.5 py-1 text-xs', xs: 'px-2 py-0.5 text-[11px]' };
  const variants = {
    default: 'bg-white border-[#ddd] text-[#1a1a1a] hover:bg-[#f5f4f1] hover:border-[#bbb]',
    primary: 'bg-[#1a1a1a] border-[#1a1a1a] text-white hover:bg-[#333]',
    success: 'bg-green-800 border-green-800 text-white hover:bg-green-700',
    danger: 'bg-white border-red-200 text-red-800 hover:bg-red-50',
    warn: 'bg-white border-amber-200 text-amber-800 hover:bg-amber-50',
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}
