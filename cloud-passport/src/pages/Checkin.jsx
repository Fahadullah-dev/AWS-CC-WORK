import React, { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { generateClient } from 'aws-amplify/api';
import { createAttendance, updateUser } from '../graphql/mutations';
import { getEvent, getUser, listAttendances } from '../graphql/queries';

export default function Checkin({ user }) {
  const client = generateClient();
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('SENSORS_OFFLINE');
  
  // Get the AWS user ID
  const userId = user?.userId;

  useEffect(() => {
    let html5QrCode;
    
    if (scanning) {
      html5QrCode = new Html5Qrcode("qr-reader");
      
      html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          html5QrCode.stop();
          setScanning(false);
          processScannedCode(decodedText);
        },
        (errorMessage) => { /* Silently ignore read errors while aiming */ }
      ).catch(err => {
        console.error("Camera access failed", err);
        setScanStatus("ERROR: CAMERA_ACCESS_DENIED");
        setScanning(false);
      });
    }

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [scanning]);

  async function processScannedCode(text) {
    setScanStatus("ANALYZING_PAYLOAD...");
    
    try {
      const data = JSON.parse(text);
      const currentTime = Date.now();
      const timeDifference = currentTime - data.timestamp;

      // 1. Verify 15-second expiration rule
      if (timeDifference > 15000) {
        setScanStatus("CODE_EXPIRED: RE-SCAN_PROJECTOR");
        return;
      }

      setScanStatus("SYNCING_WITH_DATABASE...");

      // 2. Check if the user already collected this stamp (Anti-Cheating)
      const attendanceCheck = await client.graphql({
        query: listAttendances,
        variables: { filter: { userID: { eq: userId }, eventID: { eq: data.eventId } } }
      });

      if (attendanceCheck.data.listAttendances.items.length > 0) {
        setScanStatus("ERROR: REWARD_ALREADY_CLAIMED");
        return;
      }

      // 3. Get Event Details (to know how much XP to give)
      const eventRes = await client.graphql({ query: getEvent, variables: { id: data.eventId } });
      const eventData = eventRes.data.getEvent;
      
      if (!eventData) {
        setScanStatus("ERROR: EVENT_NOT_FOUND");
        return;
      }

      // 4. Get Current User Profile (to calculate new XP)
      const userProfileRes = await client.graphql({ query: getUser, variables: { id: userId } });
      const userProfile = userProfileRes.data.getUser;
      
      const newXp = (userProfile.xp || 0) + eventData.xp_reward;
      
      // Calculate new Tier based on XP
      let newTier = "Beginner";
      if (newXp >= 250) newTier = "Intermediate";
      if (newXp >= 600) newTier = "Advanced";
      if (newXp >= 1000) newTier = "Expert";

      // 5. Run the Smart Transaction (Log attendance AND update profile)
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
      setScanStatus("ERROR: INVALID_PAYLOAD_FORMAT");
    }
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', color: 'black' }}>
      <h2 style={{ marginTop: 0, fontWeight: '900', fontSize: '20px', borderBottom: '4px solid black', paddingBottom: '15px' }}>
        [ QR_SCANNER_INIT ]
      </h2>

      <div style={{ marginTop: '20px' }}>
        <div style={{ 
          width: '100%', aspectRatio: '1/1', backgroundColor: '#000', 
          border: '4px solid black', position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ position: 'absolute', top: '20px', left: '20px', width: '30px', height: '30px', borderTop: '6px solid #FF9900', borderLeft: '6px solid #FF9900', zIndex: 10 }}></div>
          <div style={{ position: 'absolute', top: '20px', right: '20px', width: '30px', height: '30px', borderTop: '6px solid #FF9900', borderRight: '6px solid #FF9900', zIndex: 10 }}></div>
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '30px', height: '30px', borderBottom: '6px solid #FF9900', borderLeft: '6px solid #FF9900', zIndex: 10 }}></div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '30px', height: '30px', borderBottom: '6px solid #FF9900', borderRight: '6px solid #FF9900', zIndex: 10 }}></div>

          <div id="qr-reader" style={{ width: '100%', height: '100%', display: scanning ? 'block' : 'none' }}></div>

          {!scanning && (
            <div style={{ textAlign: 'center', zIndex: 5 }}>
              <button onClick={() => { setScanning(true); setScanStatus("CALIBRATING_OPTICS..."); }}
                style={{ backgroundColor: '#FF9900', color: 'black', border: '3px solid black', padding: '12px 24px', fontWeight: '900', fontSize: '14px', cursor: 'pointer', boxShadow: '4px 4px 0px white', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 auto' }}>
                <img src="/icons/camera.png" alt="Camera" style={{ width: '20px', height: '20px' }} />
                ACTIVATE_CAMERA
              </button>
            </div>
          )}
        </div>

        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: scanStatus.includes('SUCCESS') ? '#10b981' : scanStatus.includes('ERROR') || scanStatus.includes('EXPIRED') ? '#ef4444' : '#f0f0f0', border: '3px solid black', color: scanStatus.includes('SUCCESS') || scanStatus.includes('ERROR') || scanStatus.includes('EXPIRED') ? 'white' : 'black', textAlign: 'center', fontWeight: '900', fontSize: '12px', letterSpacing: '1px' }}>
          STATUS: {scanStatus}
        </div>
      </div>
    </div>
  );
}