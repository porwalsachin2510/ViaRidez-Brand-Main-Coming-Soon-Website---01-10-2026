import { ComingSoon } from '@/components/coming-soon/coming-soon'
import { getSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const settings = await getSettings()
  return <ComingSoon settings={settings} live={!settings.comingSoonEnabled} />
}
