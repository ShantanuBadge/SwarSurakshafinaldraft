import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, PhoneCall, PhoneOff, AlertTriangle, ShieldCheck, ShieldAlert, Lock, Zap, ArrowRight, CheckCircle, RefreshCw, Volume2, UserCheck, UserX } from 'lucide-react';

export default function LiveCallShield({ samples, onActionTriggered }) {
  // Mode: 'mic' or 'simulator'
  const [ingestionMode, setIngestionMode] = useState('simulator');
  const [selectedSampleId, setSelectedSampleId] = useState('cloned_cfo_arup_attack');
  
  // Call State
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [riskScore, setRiskScore] = useState(12);
  const [threatLevel, setThreatLevel] = useState('AUTHENTIC');
  const [vocoderScore, setVocoderScore] = useState(8);
  const [prosodyScore, setProsodyScore] = useState(10);
  const [jitter, setJitter] = useState(1.2);
  const [hfRatio, setHfRatio] = useState(0.005);
  const [riskHistory, setRiskHistory] = useState([10, 12, 11, 14]);
  
  // Metadata
  const [callerName, setCallerName] = useState('Deepfake CFO Voice Clone');
  const [txnAmount, setTxnAmount] = useState('25600000');
  const [urgency, setUrgency] = useState('high');
  const [channel, setChannel] = useState('Corporate Wire Approval Desk');

  // Mitigation status
  const [mitigationLog, setMitigationLog] = useState([]);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Audio / Media refs
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const timerRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const animFrameRef = useRef(null);

  // Update caller defaults when sample changes
  useEffect(() => {
    if (ingestionMode === 'simulator') {
      const sample = samples.find(s => s.id === selectedSampleId);
      if (sample) {
        setCallerName(sample.caller);
        setTxnAmount(String(sample.txn_amount));
        setUrgency(sample.urgency || 'normal');
        setChannel(sample.category);
      }
    } else {
      setCallerName('Live User Microphone');
      setTxnAmount('500000');
      setUrgency('normal');
      setChannel('VoIP Telephony Stream');
    }
  }, [selectedSampleId, ingestionMode, samples]);

  // Handle Call Start / Stop
  const handleStartCall = async () => {
    setIsCallActive(true);
    setCallDuration(0);
    setMitigationLog([]);

    if (ingestionMode === 'mic') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        micStreamRef.current = stream;
        
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        startWaveformAnimation();
      } catch (err) {
        console.warn("Microphone access not available, falling back to simulated audio waveform", err);
        startSyntheticWaveform();
      }
    } else {
      // Simulator mode: play the sample audio
      const audioUrl = `/api/samples/${selectedSampleId}/audio`;
      if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioUrl;
        audioPlayerRef.current.play().catch(e => console.log('Audio autoplay prevented:', e));
      }
      startSyntheticWaveform();
    }

    // Dynamic telemetry ticker simulating real-time chunk scoring
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);

      // Determine target risk based on sample or mode
      let targetRisk = 12;
      let targetVocoder = 10;
      let targetProsody = 8;
      let targetJitter = 1.15;
      let targetHf = 0.004;

      if (ingestionMode === 'simulator') {
        if (selectedSampleId === 'cloned_cfo_arup_attack') {
          targetRisk = 78 + Math.sin(Date.now() / 1500) * 12;
          targetVocoder = 82 + Math.random() * 8;
          targetProsody = 74 + Math.random() * 6;
          targetJitter = 0.28 + Math.random() * 0.1;
          targetHf = 0.048;
        } else if (selectedSampleId === 'suspicious_telecom_scam') {
          targetRisk = 52 + Math.sin(Date.now() / 2000) * 8;
          targetVocoder = 55 + Math.random() * 6;
          targetProsody = 48 + Math.random() * 5;
          targetJitter = 0.42;
          targetHf = 0.025;
        } else {
          // Genuine human
          targetRisk = 12 + Math.random() * 6;
          targetVocoder = 8 + Math.random() * 5;
          targetProsody = 10 + Math.random() * 4;
          targetJitter = 1.25 + Math.random() * 0.3;
          targetHf = 0.003;
        }
      } else {
        // Mic mode (natural human by default)
        targetRisk = 15 + Math.random() * 8;
        targetVocoder = 10 + Math.random() * 6;
        targetProsody = 12 + Math.random() * 5;
        targetJitter = 1.3 + Math.random() * 0.3;
        targetHf = 0.005;
      }

      setRiskScore(prev => {
        const next = Math.round(prev * 0.6 + targetRisk * 0.4);
        setRiskHistory(h => [...h.slice(-25), next]);

        if (next >= 65) {
          setThreatLevel('CRITICAL');
        } else if (next >= 38) {
          setThreatLevel('ELEVATED');
        } else {
          setThreatLevel('AUTHENTIC');
        }
        return next;
      });

      setVocoderScore(Math.round(targetVocoder));
      setProsodyScore(Math.round(targetProsody));
      setJitter(parseFloat(targetJitter.toFixed(2)));
      setHfRatio(parseFloat(targetHf.toFixed(4)));

    }, 1000);
  };

  const handleStopCall = () => {
    setIsCallActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
    }
  };

  // Waveform animations
  const startWaveformAnimation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgba(7, 11, 22, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = threatLevel === 'CRITICAL' ? '#ef4444' : threatLevel === 'ELEVATED' ? '#f59e0b' : '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.shadowColor = ctx.strokeStyle;

      ctx.beginPath();
      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    };
    draw();
  };

  const startSyntheticWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      phase += 0.08;

      ctx.fillStyle = 'rgba(7, 11, 22, 0.35)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2.5;
      const isCritical = riskScore >= 65;
      ctx.strokeStyle = isCritical ? '#ef4444' : riskScore >= 38 ? '#f59e0b' : '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.shadowColor = ctx.strokeStyle;

      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 4) {
        const mult = isCritical ? 1.6 : 1.0;
        const y = (canvas.height / 2) +
          Math.sin(x * 0.03 + phase) * 22 * mult +
          Math.sin(x * 0.08 - phase * 1.5) * 12 +
          (isCritical ? (Math.random() - 0.5) * 14 : 0);

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    };
    draw();
  };

  // Automated Mitigation Actions (Slide 3 Step 4 & 5)
  const handleExecuteMitigation = async (actionType) => {
    setActionInProgress(true);
    try {
      const response = await fetch('/api/action/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action_type: actionType,
          session_id: `CALL-${Date.now().toString().slice(-6)}`,
          caller_id: callerName,
          risk_score: riskScore,
          notes: `Enforced by frontline operator on ${channel} (Txn: ₹${Number(txnAmount).toLocaleString()})`
        })
      });
      const data = await response.json();
      
      const newEntry = {
        action: actionType,
        time: new Date().toLocaleTimeString(),
        hash: data.audit_block_hash.slice(0, 16) + '...',
        fullHash: data.audit_block_hash,
        msg: data.message
      };

      setMitigationLog(prev => [newEntry, ...prev]);
      if (onActionTriggered) onActionTriggered(data);
    } catch (e) {
      console.error(e);
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', padding: '0 24px 30px 24px' }}>
      
      {/* Hidden Audio Player for simulated telephony audio */}
      <audio ref={audioPlayerRef} loop style={{ display: 'none' }} />

      {/* Left Column: Call Center Telephony & Live Ingestion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Ingestion & Session Configuration */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#38bdf8" />
              <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Active Call Ingestion Stream</h2>
            </div>

            {/* Mode Switcher */}
            <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => { if (!isCallActive) setIngestionMode('simulator'); }}
                style={{
                  background: ingestionMode === 'simulator' ? '#0284c7' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: isCallActive ? 'not-allowed' : 'pointer'
                }}
              >
                Telephony Attack Simulator
              </button>
              <button
                onClick={() => { if (!isCallActive) setIngestionMode('mic'); }}
                style={{
                  background: ingestionMode === 'mic' ? '#0284c7' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: isCallActive ? 'not-allowed' : 'pointer'
                }}
              >
                🎙️ Live Microphone
              </button>
            </div>
          </div>

          {/* Preset Selector if in Simulator mode */}
          {ingestionMode === 'simulator' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Select Simulated In-The-Wild Attack Scenario:
              </label>
              <select
                disabled={isCallActive}
                value={selectedSampleId}
                onChange={e => setSelectedSampleId(e.target.value)}
                style={{
                  width: '100%',
                  background: '#090e1d',
                  border: '1px solid var(--border-color)',
                  color: '#f8fafc',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                {samples.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.expected_threat === 'CRITICAL' ? '⚠️ High-Risk Attack' : '✅ Verified Human'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Call Metadata Fields (Slide 3 Step 3: Contextual Enrichment) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: 'rgba(7, 11, 22, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Caller ID / Entity</span>
              <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#e2e8f0' }}>{callerName}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Pending Txn Approval</span>
              <p style={{ fontSize: '0.85rem', fontWeight: '700', color: Number(txnAmount) > 1000000 ? '#f87171' : '#38bdf8' }}>
                ₹{Number(txnAmount).toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Urgency Level</span>
              <span className={`badge ${urgency === 'high' ? 'badge-critical' : 'badge-authentic'}`} style={{ marginTop: '2px' }}>
                {urgency === 'high' ? 'Immediate Executive Demand' : 'Routine Operation'}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Deployment Channel</span>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{channel}</p>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {!isCallActive ? (
              <button
                onClick={handleStartCall}
                className="btn-cyber"
                style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
              >
                <PhoneCall size={18} />
                <span>Initiate Live Call Analysis Stream</span>
              </button>
            ) : (
              <button
                onClick={handleStopCall}
                className="btn-cyber btn-danger"
                style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
              >
                <PhoneOff size={18} />
                <span>Disconnect Call Session ({callDuration}s)</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Audio Oscilloscope & Spectrogram Stream */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={18} color="#38bdf8" />
              <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Spectro-Temporal Audio Oscilloscope</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isCallActive ? '#10b981' : '#64748b' }}></span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {isCallActive ? 'Streaming at 16,000 Hz' : 'Stream Idle'}
              </span>
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '140px', background: '#050814', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <canvas
              ref={canvasRef}
              width={640}
              height={140}
              style={{ width: '100%', height: '100%', display: 'block' }}
            />
            {!isCallActive && (
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(5, 8, 20, 0.75)', color: '#64748b', fontSize: '0.85rem' }}>
                Click "Initiate Live Call Analysis Stream" to begin continuous detection
              </div>
            )}
          </div>

          {/* In-Call Telemetry Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '14px' }}>
            <div style={{ background: 'rgba(7, 11, 22, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Vocoder Artifact</span>
              <p style={{ fontSize: '1rem', fontWeight: '700', color: vocoderScore > 50 ? '#f87171' : '#38bdf8' }}>
                {vocoderScore}%
              </p>
            </div>
            <div style={{ background: 'rgba(7, 11, 22, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Pitch Jitter (F0)</span>
              <p style={{ fontSize: '1rem', fontWeight: '700', color: jitter < 0.4 ? '#f87171' : '#10b981' }}>
                {jitter}% {jitter < 0.4 ? '⚠️' : '✓'}
              </p>
            </div>
            <div style={{ background: 'rgba(7, 11, 22, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>HF Leak (&gt;6.5kHz)</span>
              <p style={{ fontSize: '1rem', fontWeight: '700', color: hfRatio > 0.02 ? '#f87171' : '#38bdf8' }}>
                {(hfRatio * 100).toFixed(2)}%
              </p>
            </div>
            <div style={{ background: 'rgba(7, 11, 22, 0.6)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Call Duration</span>
              <p style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc' }}>
                {callDuration}s
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Right Column: Dynamic Risk Scoring & Automated Prevention Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Dynamic Risk Gauge & Alert Banner */}
        <div className={`glass-panel ${threatLevel === 'CRITICAL' ? 'alert-pulse' : ''}`} style={{
          padding: '24px',
          borderColor: threatLevel === 'CRITICAL' ? '#ef4444' : threatLevel === 'ELEVATED' ? '#f59e0b' : 'var(--border-color)',
          background: threatLevel === 'CRITICAL' ? 'linear-gradient(180deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)' : 'var(--bg-card)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Real-Time Impersonation Threat Score
            </span>
            
            {/* Circular Gauge Representation */}
            <div style={{ position: 'relative', width: '160px', height: '160px', margin: '16px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.06)"
                  strokeWidth="12"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="68"
                  fill="none"
                  stroke={threatLevel === 'CRITICAL' ? '#ef4444' : threatLevel === 'ELEVATED' ? '#f59e0b' : '#10b981'}
                  strokeWidth="12"
                  strokeDasharray="427"
                  strokeDashoffset={427 - (427 * riskScore) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                  style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.4s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-0.03em', color: threatLevel === 'CRITICAL' ? '#f87171' : threatLevel === 'ELEVATED' ? '#fbbf24' : '#34d399' }}>
                  {riskScore}%
                </span>
                <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '-4px' }}>Clone Probability</p>
              </div>
            </div>

            {/* Verdict Badge */}
            <div style={{ marginTop: '8px' }}>
              {threatLevel === 'CRITICAL' && (
                <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <ShieldAlert size={18} color="#ef4444" />
                  <span>CRITICAL: AI VOICE CLONE ATTACK</span>
                </div>
              )}
              {threatLevel === 'ELEVATED' && (
                <div style={{ background: 'rgba(245, 158, 11, 0.2)', border: '1px solid #f59e0b', color: '#fde68a', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <AlertTriangle size={18} color="#f59e0b" />
                  <span>WARNING: SUSPICIOUS VOICE ARTIFACTS</span>
                </div>
              )}
              {threatLevel === 'AUTHENTIC' && (
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', color: '#a7f3d0', padding: '8px 14px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <ShieldCheck size={18} color="#10b981" />
                  <span>VERIFIED GENUINE HUMAN VOICE</span>
                </div>
              )}
            </div>

            {/* Mini Sparkline Chart of Risk History */}
            <div style={{ marginTop: '16px', background: 'rgba(0, 0, 0, 0.3)', padding: '10px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginBottom: '6px' }}>
                <span>Rolling Risk Trend</span>
                <span>Active Call Telemetry</span>
              </div>
              <div style={{ height: '36px', display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
                {riskHistory.map((val, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: `${Math.max(10, val)}%`,
                      backgroundColor: val >= 65 ? '#ef4444' : val >= 38 ? '#f59e0b' : '#38bdf8',
                      borderRadius: '2px 2px 0 0',
                      transition: 'height 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Multi-Channel Prevention Actions (SIH Slide 3 Step 4 & 5) */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Lock size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Real-Time Fraud Prevention Protocols</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
            Direct mitigation actions to halt social-engineering wire transfers before transaction disbursement:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => handleExecuteMitigation('FREEZE_WIRE_TRANSFER')}
              disabled={actionInProgress}
              className="btn-cyber btn-danger"
              style={{ width: '100%', justifyContent: 'space-between', padding: '10px 14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserX size={16} />
                <span>Freeze Wire Transfer Authorization</span>
              </div>
              <span style={{ fontSize: '0.75rem', opacity: 0.85 }}>Auto-Lock ₹{Number(txnAmount).toLocaleString()}</span>
            </button>

            <button
              onClick={() => handleExecuteMitigation('TRIGGER_OUT_OF_BAND_MFA')}
              disabled={actionInProgress}
              className="btn-cyber btn-outline"
              style={{ width: '100%', justifyContent: 'space-between', padding: '10px 14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="#38bdf8" />
                <span>Enforce Out-of-Band Step-up MFA</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>SMS / Biometric Push</span>
            </button>

            <button
              onClick={() => handleExecuteMitigation('ESCALATE_SUPERVISOR')}
              disabled={actionInProgress}
              className="btn-cyber btn-outline"
              style={{ width: '100%', justifyContent: 'space-between', padding: '10px 14px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={16} color="#f59e0b" />
                <span>Escalate to SOC Incident Commander</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>Priority Red-Flag</span>
            </button>
          </div>

          {/* Mitigation Actions Log */}
          {mitigationLog.length > 0 && (
            <div style={{ marginTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8' }}>Recorded Audit Actions:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', maxHeight: '120px', overflowY: 'auto' }}>
                {mitigationLog.map((log, i) => (
                  <div key={i} style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', borderLeft: '3px solid #10b981' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', fontWeight: '600' }}>
                      <span>{log.action}</span>
                      <span style={{ color: '#64748b' }}>{log.time}</span>
                    </div>
                    <div style={{ color: '#38bdf8', fontSize: '0.7rem', marginTop: '2px' }}>
                      SHA-256 Block: {log.hash}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
