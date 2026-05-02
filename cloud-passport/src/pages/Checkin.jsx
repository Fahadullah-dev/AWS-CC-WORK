import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { generateClient } from 'aws-amplify/api';
import { createAttendance, updateUser } from '../graphql/mutations';
import { getEvent, getUser, listAttendances } from '../graphql/queries';

export default function Checkin({ user }) {
  const client = generateClient();
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('SENSORS OFFLINE');
  const scannerRef = useRef(null);
  
  const userId = user?.userId;

  useEffect(() => {
    if (scanning) {
      scannerRef.current = new Html5Qrcode("qr-reader");
      
      scannerRef.current.start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          stopScanner();
          processScannedCode(decodedText);
        },
        (errorMessage) => { /* Silently ignore read errors while aiming */ }
      ).catch(err => {
        console.error("Camera access failed", err);
        setScanStatus("ERROR: CAMERA ACCESS DENIED");
        setScanning(false);
      });
    }

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [scanning]);

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      await scannerRef.current.stop();
    }
    setScanning(false);
    setScanStatus('SENSORS OFFLINE');
  };

  async function processScannedCode(text) {
    setScanStatus("ANALYZING PAYLOAD...");
    
    try {
      const data = JSON.parse(text);
      const currentTime = Date.now();
      const timeDifference = currentTime - data.timestamp;

      if (timeDifference > 15000) {
        setScanStatus("CODE EXPIRED: RE-SCAN PROJECTOR");
        return;
      }

      setScanStatus("SYNCING WITH DATABASE...");

      const attendanceCheck = await client.graphql({
        query: listAttendances,
        variables: { filter: { userID: { eq: userId }, eventID: { eq: data.eventId } } }
      });

      if (attendanceCheck.data.listAttendances.items.length > 0) {
        setScanStatus("ERROR: REWARD ALREADY CLAIMED");
        return;
      }

      const eventRes = await client.graphql({ query: getEvent, variables: { id: data.eventId } });
      const eventData = eventRes.data.getEvent;
      
      if (!eventData) {
        setScanStatus("ERROR: EVENT NOT FOUND");
        return;
      }

      const userProfileRes = await client.graphql({ query: getUser, variables: { id: userId } });
      const userProfile = userProfileRes.data.getUser;
      
      const newXp = (userProfile.xp || 0) + eventData.xp_reward;
      
      let newTier = "EXPLORER";
      if (newXp >= 21000) newTier = "BUILDER";
      if (newXp >= 41000) newTier = "ARCHITECT";
      if (newXp >= 81000) newTier = "MASTER";

      await Promise.all([
        client.graphql({ 
          query: createAttendance, 
          variables: { input: { eventID: data.eventId, userID: userId } } 
        }),
        client.graphql({
          query: updateUser,
          variables: { input: { id: userId, xp: newXp, tier: newTier } }
        })
      ]);

      setScanStatus(`SUCCESS: +${eventData.xp_reward} XP UNLOCKED!`);

    } catch (e) {
      console.error(e);
      setScanStatus("ERROR: INVALID PAYLOAD FORMAT");
    }
  }

  return (
  <div style={{ backgroundColor: 'white', padding: '25px', color: 'black', boxSizing: 'border-box' }}>
    <h2 style={{ marginTop: 0, fontWeight: '900', fontSize: '18px', borderBottom: '4px solid black', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img src="/icons/logo.svg" alt="Cloud" style={{ height: '24px', objectFit: 'contain' }} />
        [ QR SCANNER ]
      </h2>

      <div style={{ marginTop: '20px' }}>
        <div style={{ 
          width: '100%', aspectRatio: '1/1', backgroundColor: '#000', 
          border: '4px solid black', position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box'
        }}>
          <div style={{ position: 'absolute', top: '15px', left: '15px', width: '25px', height: '25px', borderTop: '4px solid #FF9900', borderLeft: '4px solid #FF9900', zIndex: 10 }}></div>
          <div style={{ position: 'absolute', top: '15px', right: '15px', width: '25px', height: '25px', borderTop: '4px solid #FF9900', borderRight: '4px solid #FF9900', zIndex: 10 }}></div>
          <div style={{ position: 'absolute', bottom: '15px', left: '15px', width: '25px', height: '25px', borderBottom: '4px solid #FF9900', borderLeft: '4px solid #FF9900', zIndex: 10 }}></div>
          <div style={{ position: 'absolute', bottom: '15px', right: '15px', width: '25px', height: '25px', borderBottom: '4px solid #FF9900', borderRight: '4px solid #FF9900', zIndex: 10 }}></div>

          <div id="qr-reader" style={{ width: '100%', height: '100%', display: scanning ? 'block' : 'none' }}></div>

          {!scanning && (
            <div style={{ textAlign: 'center', zIndex: 5, padding: '20px' }}>
              <button onClick={() => { setScanning(true); setScanStatus("CALIBRATING OPTICS..."); }}
                style={{ backgroundColor: '#FF9900', color: 'black', border: '3px solid black', padding: '12px 20px', fontWeight: '900', fontSize: '12px', cursor: 'pointer', boxShadow: '4px 4px 0px white', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
                <img src="/icons/camera.png" alt="Camera" style={{ width: '16px', height: '16px' }} />
                ACTIVATE CAMERA
              </button>
            </div>
          )}
        </div>

        {scanning && (
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <button onClick={stopScanner}
                style={{ backgroundColor: '#ef4444', color: 'white', border: '3px solid black', padding: '10px 20px', fontWeight: '900', fontSize: '12px', cursor: 'pointer', boxShadow: '4px 4px 0px black' }}>
                CLOSE CAMERA
              </button>
            </div>
        )}

        <div style={{ marginTop: '20px', padding: '12px', backgroundColor: scanStatus.includes('SUCCESS') ? '#10b981' : scanStatus.includes('ERROR') || scanStatus.includes('EXPIRED') ? '#ef4444' : '#f0f0f0', border: '3px solid black', color: scanStatus.includes('SUCCESS') || scanStatus.includes('ERROR') || scanStatus.includes('EXPIRED') ? 'white' : 'black', textAlign: 'center', fontWeight: '900', fontSize: '11px', letterSpacing: '1px', wordWrap: 'break-word' }}>
          STATUS: {scanStatus}
        </div>
      </div>
    </div>
  );
}