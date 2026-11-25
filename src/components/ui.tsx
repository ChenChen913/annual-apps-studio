import type { ReactNode } from 'react'

type RangeFieldProps = {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  suffix?: string
  hint?: string
}

export function RangeField({ label, value, min, max, onChange, suffix, hint }: RangeFieldProps) {
  const progress = ((value - min) / (max - min)) * 100
  return (
    <label className="field">
      <span className="field-label">
        <span>{label}</span>
        <strong>
          {value}
          {suffix}
        </strong>
      </span>
      <input
        className="range"
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{
          background: `linear-gradient(90deg, var(--accent) 0%, var(--accent) ${progress}%, #dfe5df ${progress}%, #dfe5df 100%)`,
        }}
      />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}

export function SectionTitle({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <h2 className="section-title">
      {icon}
      {children}
    </h2>
  )
}
