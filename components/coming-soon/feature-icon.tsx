import { Cpu, Globe, Layers, Lock, Rocket, ShieldCheck, Sparkles, Zap, type LucideProps } from "lucide-react"
import type { FeatureIcon as FeatureIconName } from "@/lib/schema"

const ICONS = {
  sparkles: Sparkles,
  zap: Zap,
  shield: ShieldCheck,
  globe: Globe,
  cpu: Cpu,
  rocket: Rocket,
  layers: Layers,
  lock: Lock,
} satisfies Record<FeatureIconName, React.ComponentType<LucideProps>>

export function FeatureIcon({ name, ...props }: { name: FeatureIconName } & LucideProps) {
  const Icon = ICONS[name] ?? Sparkles
  return <Icon aria-hidden strokeWidth={1.4} {...props} />
}
