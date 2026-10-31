export default function DemoLabel({ light = false, className = '' }: { light?: boolean; className?: string }) {
  return (
    <span className={`landing-demo-label ${light ? 'text-white/75' : 'text-su-muted'} ${className}`}>Illustrative data</span>
  )
}
