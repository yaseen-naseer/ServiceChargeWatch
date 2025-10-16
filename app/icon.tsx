import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 512,
  height: 512,
}

export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 220,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '25%',
          position: 'relative',
        }}
      >
        SC
        {/* Currency symbol decoration */}
        <div
          style={{
            position: 'absolute',
            top: '60px',
            right: '60px',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
          }}
        >
          $
        </div>
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}
