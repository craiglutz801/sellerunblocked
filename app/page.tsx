import AskUnblockedAI from '@/components/landing/AskUnblockedAI'
import ConversationVsOrganization from '@/components/landing/ConversationVsOrganization'
import FAQ from '@/components/landing/FAQ'
import FinalCTA from '@/components/landing/FinalCTA'
import Footer from '@/components/landing/Footer'
import FrictionUniverse from '@/components/landing/FrictionUniverse'
import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import MeasureImprovement from '@/components/landing/MeasureImprovement'
import SellerSupport from '@/components/landing/SellerSupport'
import SignalToAction from '@/components/landing/SignalToAction'
import SmartListening from '@/components/landing/SmartListening'
import TopPriorities from '@/components/landing/TopPriorities'
import TrustModel from '@/components/landing/TrustModel'
import UnblockedAIEngine from '@/components/landing/UnblockedAIEngine'
import WhoItsForV2 from '@/components/landing/WhoItsForV2'

export default function Home() {
  return (
    <div className="landing-root">
      <Header />
      <main id="main">
        <Hero />
        <ConversationVsOrganization />
        <FrictionUniverse />
        <UnblockedAIEngine />
        <TopPriorities />
        <AskUnblockedAI />
        <SmartListening />
        <SignalToAction />
        <SellerSupport />
        <TrustModel />
        <MeasureImprovement />
        <WhoItsForV2 />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
