import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { useApp } from '../context/AppContext'
import { isOverdue, isDueSoon } from '../utils/dates'
import { TrendingUp, TrendingDown, AlertTriangle, Award, Users, BookOpen } from 'lucide-react'

const COLORS = ['#52B788', '#E9C46A', '#E63946', '#2D6A4F', '#D8F3DC']

export default function AnalyticsPage() {
  const { assignments, submissions, allStudents, currentUser } = useApp()

  const myAssignments = useMemo(() =>
    assignments.filter(a => a.professorId === currentUser?.id),
  [assignments, currentUser])

  // ── Metric calculations ──────────────────────────────────────

  const totalPossible    = myAssignments.length * allStudents.length
  const totalSubs        = submissions.filter(s => myAssignments.some(a => a.id === s.assignmentId)).length
  const submissionRate   = totalPossible ? Math.round((totalSubs / totalPossible) * 100) : 0
  const overdueCount     = myAssignments.filter(a => isOverdue(a.dueDate)).length
  const dueSoonCount     = myAssignments.filter(a => isDueSoon(a.dueDate)).length

  // Submission rate per assignment (for bar chart)
  const assignmentRates = myAssignments.map(a => {
    const subs = submissions.filter(s => s.assignmentId === a.id).length
    return {
      name: a.title.length > 16 ? a.title.slice(0, 16) + '…' : a.title,
      rate: allStudents.length ? Math.round((subs / allStudents.length) * 100) : 0,
      submitted: subs,
      total: allStudents.length,
      subject: a.subject,
    }
  }).sort((a, b) => b.rate - a.rate)

  // Subject-level breakdown (for radar)
  const subjects = ['Maths', 'Physics', 'Literature']
  const subjectData = subjects.map(subject => {
    const subA = myAssignments.filter(a => a.subject === subject)
    const subS = submissions.filter(s => subA.some(a => a.id === s.assignmentId)).length
    const possible = subA.length * allStudents.length
    return {
      subject,
      rate: possible ? Math.round((subS / possible) * 100) : 0,
      assignments: subA.length,
      submitted: subS,
    }
  })

  // Student leaderboard — on-time submissions per student
  const leaderboard = useMemo(() => {
    return allStudents.map(student => {
      const studentSubs = submissions.filter(s => s.studentId === student.id && myAssignments.some(a => a.id === s.assignmentId))
      const onTime = studentSubs.filter(s => {
        const assignment = myAssignments.find(a => a.id === s.assignmentId)
        return assignment && new Date(s.submittedAt) <= new Date(assignment.dueDate)
      })
      const total = myAssignments.length
      const rate  = total ? Math.round((studentSubs.length / total) * 100) : 0
      return {
        ...student,
        submitted: studentSubs.length,
        onTime: onTime.length,
        total,
        rate,
      }
    }).sort((a, b) => b.submitted - a.submitted)
  }, [allStudents, submissions, myAssignments])

  // Submission timeline — how many were submitted per day over last 14 days
  const timeline = useMemo(() => {
    const days = []
    for (let i = 13; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().slice(0, 10)
      const count = submissions.filter(s => {
        return myAssignments.some(a => a.id === s.assignmentId) &&
          s.submittedAt.slice(0, 10) === dateStr
      }).length
      days.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        submissions: count,
      })
    }
    return days
  }, [submissions, myAssignments])

  // Submission status breakdown (pie)
  const submitted   = totalSubs
  const notSubmitted = totalPossible - totalSubs
  const pieData = [
    { name: 'Submitted',     value: submitted },
    { name: 'Not Submitted', value: notSubmitted },
  ]

  // Insights — actionable text
  const lowestSubject = [...subjectData].sort((a, b) => a.rate - b.rate)[0]
  const highestSubject = [...subjectData].sort((a, b) => b.rate - a.rate)[0]
  const atRiskStudents = leaderboard.filter(s => s.rate < 50)
  const topStudent = leaderboard[0]

  const insights = [
    lowestSubject?.rate < 70 && {
      type: 'warning',
      icon: <TrendingDown size={14} strokeWidth={1.5} />,
      text: `${lowestSubject.subject} has the lowest submission rate at ${lowestSubject.rate}% — consider a reminder.`,
    },
    highestSubject?.rate >= 80 && {
      type: 'success',
      icon: <TrendingUp size={14} strokeWidth={1.5} />,
      text: `${highestSubject.subject} is performing well at ${highestSubject.rate}% submission rate.`,
    },
    atRiskStudents.length > 0 && {
      type: 'warning',
      icon: <AlertTriangle size={14} strokeWidth={1.5} />,
      text: `${atRiskStudents.length} student${atRiskStudents.length > 1 ? 's are' : ' is'} at risk with under 50% submission rate: ${atRiskStudents.slice(0, 2).map(s => s.name.split(' ')[0]).join(', ')}${atRiskStudents.length > 2 ? ` +${atRiskStudents.length - 2} more` : ''}.`,
    },
    overdueCount > 0 && {
      type: 'warning',
      icon: <AlertTriangle size={14} strokeWidth={1.5} />,
      text: `${overdueCount} assignment${overdueCount > 1 ? 's are' : ' is'} past the deadline with pending submissions.`,
    },
    topStudent?.submitted > 0 && {
      type: 'success',
      icon: <Award size={14} strokeWidth={1.5} />,
      text: `Top performer: ${topStudent.name} with ${topStudent.submitted}/${topStudent.total} submissions completed.`,
    },
  ].filter(Boolean)

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="font-serif text-2xl text-ink dark:text-cream">Analytics</h2>
        <p className="font-sans text-sm text-ink/40 dark:text-cream/50">
          Actionable insights for {currentUser?.name}
        </p>
      </motion.div>

      {/* ── KPI row ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        <KPI label="Class Rate"    value={`${submissionRate}%`} sub="overall submissions"      color="forest" icon={<TrendingUp size={15} strokeWidth={1.5} />} />
        <KPI label="Total Subs"    value={totalSubs}            sub={`of ${totalPossible} possible`} color="forest" icon={<BookOpen size={15} strokeWidth={1.5} />} />
        <KPI label="At Risk"       value={atRiskStudents.length} sub="students under 50%"     color={atRiskStudents.length > 0 ? 'coral' : 'forest'} icon={<Users size={15} strokeWidth={1.5} />} />
        <KPI label="Overdue"       value={overdueCount}          sub="assignments past due"   color={overdueCount > 0 ? 'coral' : 'forest'} icon={<AlertTriangle size={15} strokeWidth={1.5} />} />
      </motion.div>

      {/* ── Insights ── */}
      {insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-2"
        >
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/40">
            Insights
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {insights.map((insight, i) => (
              <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm
                ${insight.type === 'warning'
                  ? 'bg-gold-pale dark:bg-gold/8 border-gold/30 text-gold-dark dark:text-gold'
                  : 'bg-forest-pale dark:bg-forest/8 border-forest-mid/20 text-forest dark:text-forest-mid'
                }
              `}>
                <span className="mt-0.5 flex-shrink-0">{insight.icon}</span>
                <p className="font-sans text-xs leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Row 1: Submission rate bar + Pie ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Bar chart — submission rate per assignment */}
        <div className="lg:col-span-2 bg-cream dark:bg-cream/5 border border-cream-border dark:border-cream/10 rounded-xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/40 mb-1">
            Submission Rate per Assignment
          </p>
          <p className="font-sans text-xs text-ink/40 dark:text-cream/40 mb-4">
            % of students who submitted each assignment
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={assignmentRates} barSize={28}>
              <XAxis dataKey="name" tick={{ fontFamily: 'DM Mono', fontSize: 9, fill: 'rgba(26,26,20,0.4)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontFamily: 'DM Mono', fontSize: 9, fill: 'rgba(26,26,20,0.4)' }} axisLine={false} tickLine={false} width={32} />
              <Tooltip
                formatter={(v) => [`${v}%`, 'Rate']}
                contentStyle={{ background: '#F5F2EA', border: '1px solid #D9D3C0', borderRadius: 10, fontFamily: 'DM Mono', fontSize: 11 }}
                cursor={{ fill: 'rgba(26,26,20,0.04)' }}
              />
              <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                {assignmentRates.map((entry, i) => (
                  <Cell key={i} fill={entry.rate >= 70 ? '#52B788' : entry.rate >= 40 ? '#E9C46A' : '#E63946'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="font-mono text-[9px] text-ink/25 dark:text-cream/25 mt-2">
            Green ≥70% · Yellow 40–69% · Red &lt;40%
          </p>
        </div>

        {/* Pie chart — overall split */}
        <div className="bg-cream dark:bg-cream/5 border border-cream-border dark:border-cream/10 rounded-xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/40 mb-1">
            Overall Status
          </p>
          <p className="font-sans text-xs text-ink/40 dark:text-cream/40 mb-4">
            Across all assignments
          </p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={68} paddingAngle={3} dataKey="value">
                <Cell fill="#52B788" />
                <Cell fill="#EDE8DA" />
              </Pie>
              <Tooltip
                contentStyle={{ background: '#F5F2EA', border: '1px solid #D9D3C0', borderRadius: 10, fontFamily: 'DM Mono', fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-forest-mid flex-shrink-0" />
              <span className="font-mono text-[10px] text-ink/50 dark:text-cream/50">Submitted: {submitted}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cream-dark border border-cream-border flex-shrink-0" />
              <span className="font-mono text-[10px] text-ink/50 dark:text-cream/50">Pending: {notSubmitted}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Row 2: Timeline + Subject radar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Line chart — submission activity */}
        <div className="bg-cream dark:bg-cream/5 border border-cream-border dark:border-cream/10 rounded-xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/40 mb-1">
            Submission Activity
          </p>
          <p className="font-sans text-xs text-ink/40 dark:text-cream/40 mb-4">
            Submissions logged over the last 14 days
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,20,0.06)" />
              <XAxis dataKey="date" tick={{ fontFamily: 'DM Mono', fontSize: 9, fill: 'rgba(26,26,20,0.4)' }} axisLine={false} tickLine={false} interval={2} />
              <YAxis allowDecimals={false} tick={{ fontFamily: 'DM Mono', fontSize: 9, fill: 'rgba(26,26,20,0.4)' }} axisLine={false} tickLine={false} width={20} />
              <Tooltip
                contentStyle={{ background: '#F5F2EA', border: '1px solid #D9D3C0', borderRadius: 10, fontFamily: 'DM Mono', fontSize: 11 }}
                cursor={{ stroke: 'rgba(26,26,20,0.1)' }}
              />
              <Line type="monotone" dataKey="submissions" stroke="#52B788" strokeWidth={2} dot={{ fill: '#52B788', r: 3 }} activeDot={{ r: 5 }} name="Submissions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar — subject performance */}
        <div className="bg-cream dark:bg-cream/5 border border-cream-border dark:border-cream/10 rounded-xl p-5">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/40 mb-1">
            Subject Performance
          </p>
          <p className="font-sans text-xs text-ink/40 dark:text-cream/40 mb-4">
            Submission rate by subject area
          </p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={subjectData}>
              <PolarGrid stroke="rgba(26,26,20,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontFamily: 'DM Mono', fontSize: 10, fill: 'rgba(26,26,20,0.5)' }} />
              <Radar name="Rate" dataKey="rate" stroke="#52B788" fill="#52B788" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip
                formatter={(v) => [`${v}%`, 'Submission Rate']}
                contentStyle={{ background: '#F5F2EA', border: '1px solid #D9D3C0', borderRadius: 10, fontFamily: 'DM Mono', fontSize: 11 }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* ── Student Leaderboard ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="bg-cream dark:bg-cream/5 border border-cream-border dark:border-cream/10 rounded-xl p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/40">
              Student Leaderboard
            </p>
            <p className="font-sans text-xs text-ink/40 dark:text-cream/50 mt-0.5">
              Ranked by submissions completed · flags at-risk students
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {leaderboard.map((student, index) => {
            const isAtRisk = student.rate < 50
            const isTop    = index === 0
            return (
              <div key={student.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-colors
                ${isAtRisk
                  ? 'bg-coral-pale dark:bg-coral/8 border-coral/15'
                  : isTop
                  ? 'bg-forest-pale dark:bg-forest/8 border-forest-mid/20'
                  : 'bg-transparent border-cream-border dark:border-cream/8'
                }
              `}>
                {/* Rank */}
                <span className={`font-serif text-sm w-5 text-center flex-shrink-0
                  ${index === 0 ? 'text-gold-dark dark:text-gold' : 'text-ink/30 dark:text-cream/30'}
                `}>
                  {index + 1}
                </span>

                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] font-medium flex-shrink-0
                  ${isAtRisk ? 'bg-coral-pale dark:bg-coral/20 text-coral' :
                    isTop    ? 'bg-forest-light dark:bg-forest/20 text-forest dark:text-forest-mid' :
                    'bg-cream-dark dark:bg-cream/10 text-ink/50 dark:text-cream/50'}
                `}>
                  {student.avatar}
                </div>

                {/* Name + subject */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-sans text-sm font-medium text-ink dark:text-cream truncate">
                      {student.name}
                    </p>
                    {isTop && <span className="font-mono text-[9px] text-gold-dark dark:text-gold bg-gold-pale dark:bg-gold/10 px-1.5 py-0.5 rounded-full border border-gold/20 flex-shrink-0">Top</span>}
                    {isAtRisk && <span className="font-mono text-[9px] text-coral bg-coral-pale dark:bg-coral/10 px-1.5 py-0.5 rounded-full border border-coral/20 flex-shrink-0">At Risk</span>}
                  </div>
                  <p className="font-mono text-[10px] text-ink/40 dark:text-cream/50">{student.subject}</p>
                </div>

                {/* Progress bar */}
                <div className="w-24 space-y-0.5 flex-shrink-0">
                  <div className="h-1.5 bg-cream-dark dark:bg-cream/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full progress-fill ${isAtRisk ? 'bg-coral' : 'bg-forest-mid'}`}
                      style={{ width: `${student.rate}%` }}
                    />
                  </div>
                  <p className="font-mono text-[9px] text-ink/30 dark:text-cream/30 text-right">
                    {student.submitted}/{student.total}
                  </p>
                </div>

                {/* Rate */}
                <span className={`font-serif text-lg flex-shrink-0 w-12 text-right
                  ${isAtRisk ? 'text-coral' : 'text-forest-mid'}
                `}>
                  {student.rate}%
                </span>
              </div>
            )
          })}
        </div>
      </motion.div>

    </div>
  )
}

const kpiColorMap = {
  forest: { bg: 'bg-forest-pale dark:bg-forest/10', icon: 'text-forest-mid', value: 'text-forest dark:text-forest-mid' },
  gold:   { bg: 'bg-gold-pale dark:bg-gold/10',     icon: 'text-gold-dark dark:text-gold', value: 'text-gold-dark dark:text-gold' },
  coral:  { bg: 'bg-coral-pale dark:bg-coral/10',   icon: 'text-coral', value: 'text-coral' },
}

function KPI({ label, value, sub, color, icon }) {
  const c = kpiColorMap[color] ?? kpiColorMap.forest
  return (
    <div className="bg-cream dark:bg-cream/5 border border-cream-border dark:border-cream/10 rounded-xl p-4 space-y-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.bg}`}>
        <span className={c.icon}>{icon}</span>
      </div>
      <div>
        <p className={`font-serif text-2xl ${c.value}`}>{value}</p>
        <p className="font-mono text-[10px] uppercase tracking-widest text-ink/30 dark:text-cream/40">{label}</p>
        <p className="font-sans text-[11px] text-ink/30 dark:text-cream/30 mt-0.5">{sub}</p>
      </div>
    </div>
  )
}