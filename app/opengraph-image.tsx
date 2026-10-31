import { ImageResponse } from 'next/og'

export const alt = 'SellerUnblocked — Find what’s blocking revenue.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#090c12',
          color: '#ffffff',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', fontSize: 28, fontWeight: 650, letterSpacing: -0.5 }}>SellerUnblocked</div>
            <div style={{ display: 'flex', marginTop: 10, fontSize: 18, color: 'rgba(255,255,255,0.72)' }}>
              powered by Unblocked
              <span style={{ color: '#91d4ff' }}>AI</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 48 }}>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 680 }}>
              <div style={{ display: 'flex', fontSize: 18, letterSpacing: 3, color: '#91d4ff', textTransform: 'uppercase' }}>
                AI revenue friction intelligence
              </div>
              <div style={{ display: 'flex', marginTop: 22, fontSize: 68, fontWeight: 650, letterSpacing: -2.5, lineHeight: 1.02 }}>
                Find what’s blocking revenue.
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: 360,
                border: '1px solid rgba(255,255,255,0.14)',
                borderRadius: 24,
                padding: 24,
                background: '#111720',
              }}
            >
              <div style={{ display: 'flex', fontSize: 14, color: '#91d4ff', letterSpacing: 1 }}>UNBLOCKEDAI</div>
              <div style={{ display: 'flex', marginTop: 16, fontSize: 20, fontWeight: 650, lineHeight: 1.3 }}>
                Pricing approvals are slowing late-stage enterprise deals
              </div>
              <div style={{ display: 'flex', marginTop: 14, fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                23 seller signals · Owner: RevOps
              </div>
              <div style={{ display: 'flex', marginTop: 18, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                Illustrative data
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
