import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'
import { useApp } from '../../context/AppContext'

export default function SubmissionChart({ assignments, submissions, students }) {
  const data = assignments.slice(0, 6).map((a) => {
    const subs = submissions.filter((s) => s.assignmentId === a.id).length
    return {
      name: a.title.length > 18 ? a.title.slice(0, 18) + '…' : a.title,
      submitted: subs,
      total: students.length,
    }
  })

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barGap={4}>
        <XAxis
          dataKey="name"
          tick={{ fontFamily: 'DM Mono', fontSize: 9, fill: 'rgba(26,26,20,0.4)' }}
          axisLine={false} tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontFamily: 'DM Mono', fontSize: 9, fill: 'rgba(26,26,20,0.4)' }}
          axisLine={false} tickLine={false}
          width={24}
        />
        <Tooltip
          contentStyle={{
            background: '#F5F2EA',
            border: '1px solid #D9D3C0',
            borderRadius: 10,
            fontFamily: 'DM Mono',
            fontSize: 11,
          }}
          cursor={{ fill: 'rgba(26,26,20,0.04)' }}
        />
        <Bar dataKey="total" fill="#EDE8DA" radius={[4, 4, 0, 0]} name="Total" />
        <Bar dataKey="submitted" fill="#52B788" radius={[4, 4, 0, 0]} name="Submitted" />
      </BarChart>
    </ResponsiveContainer>
  )
}