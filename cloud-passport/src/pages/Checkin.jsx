import { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';
import { generateClient } from 'aws-amplify/api';
import { getCurrentUser } from 'aws-amplify/auth';
import { getEvent, getUser, listAttendances } from '../graphql/queries';
import { createAttendance, updateUser } from '../graphql/mutations';

const client = generateClient();

export default function Checkin() {
  const [status, setStatus] = useState('idle'); 
  const [result, setResult] = useState(null);
  const [errMsg, setErrMsg] = useState('');
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanInterval = useRef(null);
  const streamRef = useRef(null); // Keeps track of the active camera stream
  const containerRef = useRef(null); // Watches if the page is visible

  // 1. Camera Control Functions
  async function startScan() {
    setStatus('scanning');
    setErrMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream; // Save the stream so we can kill it later
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      scanInterval.current = setInterval(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) return;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code?.data) {
          stopCamera();
          handleToken(code.data);
        }
      }, 200);
    } catch (err) {
      setStatus('error');
      setErrMsg('Camera access denied. Please allow camera permissions.');
    }
  }

  function stopCamera() {
    // Stop all video tracks completely
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (scanInterval.current) {
      clearInterval(scanInterval.current);
      scanInterval.current = null;
    }
  }

  // 2. Flipbook Visibility Observer (The Bug Fix!)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // If the page gets flipped away and the camera is running, kill it!
      if (!entry.isIntersecting && streamRef.current) {
        stopCamera();
        setStatus('idle');
      }
    }, { threshold: 0.1 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      stopCamera(); // Also kill it if the component unmounts entirely
    };
  }, []);

  // 3. AWS GraphQL Logic
  async function handleToken(qrText) {
    setStatus('validating');
    try {
      const { userId } = await getCurrentUser();
      const qrData = JSON.parse(qrText);
      
      const now = Date.now();
      if (now - qrData.timestamp > 15000) {
        throw new Error("QR Code Expired! Wait for the captain's screen to refresh.");
      }

      const existing = await client.graphql({
        query: listAttendances,
        variables: { filter: { userID: { eq: userId }, eventID: { eq: qrData.eventId } } }
      });

      if (existing.data.listAttendances.items.length > 0) {
        throw new Error("You already have a stamp for this event!");
      }

      const eventRes = await client.graphql({
        query: getEvent,
        variables: { id: qrData.eventId }
      });
      const event = eventRes.data.getEvent;
      if (!event) throw new Error("Event not found.");

      const userRes = await client.graphql({
        query: getUser,
        variables: { id: userId }
      });
      const userProfile = userRes.data.getUser;

      await client.graphql({
        query: createAttendance,
        variables: { input: { userID: userId, eventID: event.id, timestamp: new Date().toISOString() } }
      });

      const newXp = userProfile.xp + event.xp_reward;
      let newTier = userProfile.tier;
      if (newXp >= 1000) newTier = "Cloud Practitioner";
      if (newXp >= 2500) newTier = "Solutions Architect";

      await client.graphql({
        query: updateUser,
        variables: { input: { id: userId, xp: newXp, tier: newTier } }
      });

      setStatus('success');
      setResult({ event_emoji: event.emoji, event_name: event.name, xp_gained: event.xp_reward });

    } catch (err) {
      setStatus('error');
      setErrMsg(err.message || "Invalid QR Code format.");
    }
  }

  return (
    <div className="page-wrap" ref={containerRef} style={{ color: '#0f172a' }}>
      <div className="page-header">
        <h2 style={{ color: '#0f172a', fontWeight: '900', marginTop: 0 }}>VISA ENTRY</h2>
        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>SCAN OFFICIAL QR FOR STAMP</span>
      </div>

      {status === 'idle' && (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>📷</div>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '30px' }}>Scan the live event QR code provided by your Cloud Club Captain.</p>
          <button onClick={startScan} style={{ background: '#FF9900', color: '#111', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Activate Scanner
          </button>
        </div>
      )}

      {status === 'scanning' && (
        <div style={{ position: 'relative', width: '100%', maxWidth: '300px', margin: '20px auto', borderRadius: '12px', overflow: 'hidden', border: '4px solid #FF9900' }}>
          <video ref={videoRef} style={{ width: '100%', display: 'block' }} muted playsInline />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, boxShadow: 'inset 0 0 0 50px rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
            <div style={{ width: '200px', height: '200px', border: '2px dashed #fff', margin: 'auto', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
          </div>
          <button onClick={() => { stopCamera(); setStatus('idle'); }} style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', zIndex: 10 }}>
            Cancel
          </button>
        </div>
      )}

      {status === 'validating' && (
        <div style={{ textAlign: 'center', marginTop: '60px', color: '#FF9900', fontWeight: 'bold' }}>
          Validating against AWS Database... ⏳
        </div>
      )}

      {status === 'error' && (
        <div style={{ textAlign: 'center', marginTop: '40px', background: '#fef2f2', border: '1px solid #f87171', padding: '20px', borderRadius: '8px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>❌</div>
          <h3 style={{ color: '#b91c1c', margin: '0 0 10px 0' }}>Scan Failed</h3>
          <p style={{ color: '#991b1b', fontSize: '14px', margin: '0 0 20px 0' }}>{errMsg}</p>
          <button onClick={() => setStatus('idle')} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Try Again</button>
        </div>
      )}

      {status === 'success' && result && (
        <div style={{ textAlign: 'center', marginTop: '30px', background: '#f0fdf4', border: '1px solid #4ade80', padding: '30px', borderRadius: '12px' }}>
          <div style={{ fontSize: '60px', marginBottom: '10px', animation: 'bounce 1s infinite' }}>{result.event_emoji || '☁️'}</div>
          <h3 style={{ color: '#166534', fontSize: '24px', margin: '0 0 5px 0', fontWeight: '900' }}>STAMPED!</h3>
          <div style={{ color: '#15803d', fontWeight: 'bold', marginBottom: '15px' }}>{result.event_name}</div>
          <div style={{ display: 'inline-block', background: '#22c55e', color: 'white', padding: '6px 15px', borderRadius: '20px', fontWeight: '900', fontSize: '14px', marginBottom: '25px' }}>
            +{result.xp_gained} XP
          </div>
          <br/>
          <button onClick={() => setStatus('idle')} style={{ background: '#16a34a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Close Scanner</button>
        </div>
      )}
    </div>
  );
}