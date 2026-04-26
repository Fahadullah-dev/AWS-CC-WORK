import { useState, useEffect, useRef } from 'react'
import { validateCheckin } from '../lib/supabase'
import jsQR from 'jsqr'

export default function Checkin({ user }) {
  const [status, setStatus] = useState('idle') 
  const [result, setResult] = useState(null)
  const [errMsg, setErrMsg] = useState('')
  const videoRef = useRef()
  const canvasRef = useRef()
  const scanInterval = useRef()

  async function startScan() {
    setStatus('scanning')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      videoRef.current.srcObject = stream
      videoRef.current.play()

      scanInterval.current = setInterval(() => {
        const video = videoRef.current
        const canvas = canvasRef.current
        if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        if (code?.data) {
          clearInterval(scanInterval.current)
          stopCamera(stream)
          handleToken(code.data)
        }
      }, 200)
    } catch (err) {
      setStatus('error')
      setErrMsg('camera access denied.')
    }
  }

  function stopCamera(stream) {
    stream?.getTracks().forEach(t => t.stop())
    if (scanInterval.current) clearInterval(scanInterval.current)
  }

  async function handleToken(token) {
    setStatus('validating')
    const res = await validateCheckin(token)
    if (res.error) {
      setStatus('error')
      setErrMsg(res.error)
    } else {
      setStatus('success')
      setResult(res)
    }
  }

  useEffect(() => () => clearInterval(scanInterval.current), [])

  return (
    <div className="page-wrap" style={{ color: '#0f172a' }}>
      <div className="page-header">
        {/* FIXED: Dark Title */}
        <h2 style={{ color: '#0f172a', fontWeight: '900' }}>check in</h2>
        <span className="muted">scan QR for stamp</span>
      </div>

      {status === 'idle' && (
        <div className="checkin-idle">
          <div className="qr-placeholder">📷</div>
          <p className="muted">scan the event QR code provided by the captain.</p>
          <button className="btn-primary" onClick={startScan}>scan QR code</button>
        </div>
      )}

      {status === 'scanning' && (
        <div className="scanner-wrap">
          <video ref={videoRef} className="scanner-video" muted playsInline />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div className="scan-overlay"><div className="scan-box" /></div>
        </div>
      )}

      {status === 'success' && result && (
        <div className="checkin-success">
          <div className="stamp-anim">{result.event_emoji || '☁️'}</div>
          <h3 style={{ color: '#0f172a' }}>stamped!</h3>
          <div className="success-event" style={{ color: '#0f172a' }}>{result.event_name}</div>
          <div className="success-xp">+{result.xp_gained} XP</div>
          <button className="btn-primary" onClick={() => setStatus('idle')}>scan another</button>
        </div>
      )}
    </div>
  )
}