const LEADERSHIP = ['Identify the systemic issue', 'Assign an owner', 'Execute the intervention', 'Track whether it improved']
const SELLER = ['Private focus area', 'Approved resource', 'Practice and preparation', 'Optional manager share']
const KIT = ['CFO ROI template', 'Pricing approval playbook', 'Objection practice', 'Proposal-stage checklist']

export default function SellerSupport() {
  return (
    <section className="landing-section bg-su-paper">
      <div className="landing-container">
        <div className="max-w-[44rem]">
          <h2 className="landing-h2 text-su-text">Fix the system. Help the seller.</h2>
          <p className="landing-body-lg mt-5 text-su-secondary">
            Some friction requires organizational change. Some can be reduced immediately. While leaders work on
            systemic issues, SellerUnblocked can privately connect sellers with the resources, practice, and guidance
            relevant to the friction they are experiencing.
          </p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <article className="landing-card p-6 sm:p-7">
            <h3 className="text-base font-semibold text-su-text">Leadership pathway</h3>
            <ol className="mt-5 space-y-3">
              {LEADERSHIP.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm text-su-text">
                  <span className="landing-mono text-su-blueText">{String(index + 1).padStart(2, '0')}</span>
                  {step}
                </li>
              ))}
            </ol>
          </article>
          <article className="landing-card p-6 sm:p-7">
            <h3 className="text-base font-semibold text-su-text">Seller pathway</h3>
            <ol className="mt-5 space-y-3">
              {SELLER.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm text-su-text">
                  <span className="landing-mono text-su-blueText">{String(index + 1).padStart(2, '0')}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-su-text/10 pt-4 text-sm font-medium text-su-text">
              Leadership gets patterns. Sellers get personal help.
            </p>
          </article>
          <article className="landing-card bg-su-ink p-6 text-white sm:p-7">
            <p className="landing-mono text-su-blueBright">Illustrative</p>
            <h3 className="mt-3 text-base font-semibold">Your support kit</h3>
            <p className="mt-2 text-sm text-white/70">Focus: Pricing confidence</p>
            <ul className="mt-5 space-y-3">
              {KIT.map((item) => (
                <li key={item} className="border-t border-white/10 pt-3 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}
