const CALLS = [
  'Customer objections',
  'Talk tracks',
  'Meeting behavior',
  'Competitive mentions',
  'Call outcomes',
  'Rep coaching moments',
]

const ORG = [
  'RevOps friction',
  'Product gaps',
  'Marketing and content gaps',
  'Pricing and packaging',
  'Internal handoffs',
  'Partnerships',
  'Tool and admin burden',
  'Enablement',
]

export default function ConversationVsOrganization() {
  return (
    <section className="landing-section bg-su-paper">
      <div className="landing-container">
        <h2 className="landing-statement mx-auto max-w-4xl text-center text-su-text">
          Gong listens to your calls. SellerUnblocked listens to your sales organization.
        </h2>
        <p className="landing-body-lg mx-auto mt-8 max-w-[44rem] text-center text-su-secondary">
          Conversation intelligence helps teams understand what happens in customer conversations. SellerUnblocked
          reveals what is happening <strong className="font-semibold text-su-text">around</strong> sellers — the internal
          processes, tools, product gaps, marketing needs, support systems, pricing issues, and organizational friction
          that determine whether they can win. UnblockedAI continuously turns those signals into themes, root causes,
          priorities, and evidence-backed actions for the teams that can fix them.
        </p>
        <div className="mt-14 grid gap-4 lg:grid-cols-2 lg:gap-6">
          <article className="landing-card p-7 sm:p-9">
            <p className="landing-mono text-su-muted">Customer conversation intelligence</p>
            <h3 className="landing-h3 mt-4 text-su-text">What happens in the conversation</h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {CALLS.map((item) => (
                <li key={item} className="border-t border-su-text/10 pt-3 text-sm text-su-text">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm font-medium text-su-secondary">Understand the conversation.</p>
          </article>
          <article className="landing-card border-su-blue/50 p-7 sm:p-9">
            <p className="landing-mono text-su-blueText">SellerUnblocked</p>
            <h3 className="landing-h3 mt-4 text-su-text">What happens around the seller</h3>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {ORG.map((item) => (
                <li key={item} className="border-t border-su-text/10 pt-3 text-sm text-su-text">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm font-medium text-su-text">Understand the environment producing the outcome.</p>
          </article>
        </div>
      </div>
    </section>
  )
}
