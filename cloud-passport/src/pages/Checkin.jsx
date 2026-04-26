import React, { useState } from 'react';

export default function Checkin() {
  const [scanning, setScanning] = useState(false);

  return (
    <div style={{ backgroundColor: 'white', padding: '30px', color: 'black' }}>
      <h2 style={{ 
        marginTop: 0, fontWeight: '900', fontSize: '20px', 
        borderBottom: '4px solid black', paddingBottom: '15px' 
      }}>
        [ QR_SCANNER_INIT ]
      </h2>

      <div style={{ marginTop: '20px' }}>
        {/* Scanner Viewfinder Area */}
        <div style={{ 
          width: '100%', aspectRatio: '1/1', backgroundColor: '#000', 
          border: '4px solid black', position: 'relative', overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {/* Decorative Corner Brackets */}
          <div style={{ position: 'absolute', top: '20px', left: '20px', width: '30px', height: '30px', borderTop: '6px solid #FF9900', borderLeft: '6px solid #FF9900' }}></div>
          <div style={{ position: 'absolute', top: '20px', right: '20px', width: '30px', height: '30px', borderTop: '6px solid #FF9900', borderRight: '6px solid #FF9900' }}></div>
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '30px', height: '30px', borderBottom: '6px solid #FF9900', borderLeft: '6px solid #FF9900' }}></div>
          <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '30px', height: '30px', borderBottom: '6px solid #FF9900', borderRight: '6px solid #FF9900' }}></div>

          {!scanning ? (
            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => setScanning(true)}
                style={{ 
                  backgroundColor: '#FF9900', color: 'black', border: '3px solid black',
                  padding: '12px 24px', fontWeight: '900', fontSize: '14px', cursor: 'pointer',
                  boxShadow: '4px 4px 0px white'
                }}
              >
                ACTIVATE_CAMERA
              </button>
              <p style={{ color: '#666', fontSize: '10px', marginTop: '15px', fontWeight: '900' }}>
                STATUS: SENSORS_OFFLINE
              </p>
            </div>
          ) : (
            <div style={{ color: '#FF9900', fontWeight: '900', fontSize: '12px', textAlign: 'center' }}>
              <div className="pulse" style={{ marginBottom: '10px' }}>● SCANNING...</div>
              <div style={{ fontSize: '10px', color: 'white' }}>ALIGN QR CODE WITHIN SENSORS</div>
            </div>
          )}
        </div>

        {/* Manual Check-in Area */}
        <div style={{ 
          marginTop: '30px', border: '3px dashed black', padding: '20px', 
          backgroundColor: '#f9f9f9', textAlign: 'center' 
        }}>
          <label style={{ fontSize: '10px', fontWeight: '900', display: 'block', marginBottom: '10px' }}>
            OR ENTER ATTENDANCE_CODE
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              placeholder="CODE_000"
              style={{ 
                flex: 1, padding: '10px', border: '2px solid black', 
                fontWeight: '900', outline: 'none' 
              }} 
            />
            <button style={{ 
              backgroundColor: 'black', color: 'white', border: '2px solid black', 
              padding: '0 20px', fontWeight: '900' 
            }}>
              SUBMIT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}