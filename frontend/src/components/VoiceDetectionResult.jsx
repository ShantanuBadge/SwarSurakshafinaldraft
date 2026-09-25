import React from 'react';
import { UserCheck, Bot, Sparkles, Activity, Mic, ShieldAlert, CheckCircle2, AlertTriangle, Layers, Clock } from 'lucide-react';

export default function VoiceDetectionResult({ result, isStreaming }) {
  if (!result) return null;

  const isCritical = result.threat_level === 'CRITICAL' || result.risk_score_percent >= 60;
  const isElevated = result.threat_level === 'ELEVATED' || (result.risk_score_percent >= 35 && result.risk_score_percent < 60);
  const isHuman = !isCritical && !isElevated;

  const aiScore = result.risk_score_percent;
  const humanScore = Math.max(0, 100 - aiScore);

  return (
    <div className="human-card" style={{ padding: '28px', marginTop: '24px' }}>
      
      {/* Top Banner: Big Friendly Verdict */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        padding: '20px 24px',
        borderRadius: '16px',
        background: isCritical
          ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.16) 0%, rgba(18, 24, 43, 0.6) 100%)'
          : isElevated
          ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(18, 24, 43, 0.6) 100%)'
          : 'linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(18, 24, 43, 0.6) 100%)',
        border: `1px solid ${isCritical ? 'rgba(244, 63, 94, 0.4)' : isElevated ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
      }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '16px',
            background: isCritical ? '#f43f5e' : isElevated ? '#f59e0b' : '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 24px ${isCritical ? 'rgba(244, 63, 94, 0.4)' : isElevated ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
          }}>
            {isCritical ? (
              <Bot size={28} color="#ffffff" />
            ) : isElevated ? (
              <AlertTriangle size={28} color="#ffffff" />
            ) : (
              <UserCheck size={28} color="#ffffff" />
            )}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: isCritical ? '#fb7185' : isElevated ? '#fbbf24' : '#34d399' }}>
                {isCritical
                  ? 'AI Voice Clone Detected'
                  : isElevated
                  ? 'Synthetic Voice Artifacts Flagged'
                  : 'Natural Human Voice Verified'}
              </h2>
              {isStreaming && (
                <span className="pill-badge pill-human" style={{ fontSize: '0.7rem' }}>
                  Live Updating
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '4px' }}>
              {isCritical
                ? 'Synthesized speech patterns detected: rigid vocal fold vibrations & high-frequency vocoder leakage.'
                : isElevated
                ? 'Acoustic anomalies detected: voice may be synthesized, compressed, or heavily pitch-corrected.'
                : 'Organic human speech: natural breathing pauses, authentic vocal tremor, and dynamic pitch intonation.'}
            </p>
          </div>
        </div>

        {/* Speed / Latency Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.8rem', background: 'rgba(0, 0, 0, 0.25)', padding: '6px 14px', borderRadius: '20px' }}>
          <Clock size={14} color="#38bdf8" />
          <span>Analysis Speed: {result.inference_latency_ms || '14.2'} ms (Edge On-Device)</span>
        </div>

      </div>

      {/* Dual Human vs AI Likeness Meter */}
      <div style={{ marginTop: '24px', background: 'rgba(10, 14, 26, 0.5)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#34d399' }}>
              👤 Human Likeness: {humanScore}%
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fb7185' }}>
              🤖 AI Clone Probability: {aiScore}%
            </span>
          </div>
        </div>

        {/* Smooth Split Progress Bar */}
        <div style={{ width: '100%', height: '14px', background: 'rgba(244, 63, 94, 0.35)', borderRadius: '9999px', overflow: 'hidden', display: 'flex' }}>
          <div
            style={{
              width: `${humanScore}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #059669 0%, #10b981 100%)',
              transition: 'width 0.4s ease'
            }}
          />
          <div
            style={{
              width: `${aiScore}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #f43f5e 0%, #e11d48 100%)',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* 4 Core Voice Biomarkers Grid */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color="#38bdf8" />
          <span>Vocal Biomarkers & Acoustic Diagnostics</span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          
          {/* Biomarker 1: Vocal Fold Jitter */}
          <div style={{ background: 'rgba(10, 14, 26, 0.5)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Vocal Fold Tremor (Jitter)</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Human: 0.8% - 2.5%</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '6px', color: result.biomarkers.jitter_percent < 0.45 ? '#fb7185' : '#34d399' }}>
              {result.biomarkers.jitter_percent}%
            </div>
            <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>
              {result.biomarkers.jitter_percent < 0.45
                ? '⚠️ Artificially flat micro-pitch (Typical of TTS models)'
                : '✓ Organic micro-fluctuation of natural vocal cords'}
            </p>
          </div>

          {/* Biomarker 2: Pitch Dynamics (F0) */}
          <div style={{ background: 'rgba(10, 14, 26, 0.5)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Pitch Modulation ($F_0$)</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Std: ±{result.biomarkers.f0_std_hz} Hz</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '6px', color: '#f8fafc' }}>
              {result.biomarkers.f0_mean_hz} Hz
            </div>
            <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>
              {result.biomarkers.f0_std_hz < 10.0
                ? '⚠️ Monotonic, flat speech intonation'
                : '✓ Natural conversational rising & falling intonation'}
            </p>
          </div>

          {/* Biomarker 3: Neural Vocoder Artifacts */}
          <div style={{ background: 'rgba(10, 14, 26, 0.5)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Vocoder Synthesis Leak</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>&gt;6.5 kHz Band</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '6px', color: result.biomarkers.vocoder_artifact_score > 0.4 ? '#fb7185' : '#34d399' }}>
              {(result.biomarkers.vocoder_artifact_score * 100).toFixed(0)}%
            </div>
            <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>
              {result.biomarkers.vocoder_artifact_score > 0.4
                ? '⚠️ Neural vocoder high-frequency harmonics present'
                : '✓ Clean biological vocal tract resonance'}
            </p>
          </div>

          {/* Biomarker 4: Phase Coherence */}
          <div style={{ background: 'rgba(10, 14, 26, 0.5)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Phase Transition Continuity</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>STFT Index</span>
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', marginTop: '6px', color: result.biomarkers.phase_jitter_index > 2.0 ? '#fb7185' : '#34d399' }}>
              {result.biomarkers.phase_jitter_index}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '4px' }}>
              {result.biomarkers.phase_jitter_index > 2.0
                ? '⚠️ Synthetic phase discontinuities detected'
                : '✓ Smooth, continuous physical acoustic wave'}
            </p>
          </div>

        </div>
      </div>

      {/* Visual Spectrogram Heatmap */}
      {result.spectrogram_grid && result.spectrogram_grid.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#94a3b8' }}>
              Frequency Spectrogram Heatmap (Audio Density over Time):
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              {isCritical ? '🔴 Red bands indicate vocoder synthesis overtone leaks' : '🟢 Natural smooth frequency decay'}
            </span>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            background: '#050711',
            padding: '10px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)'
          }}>
            {result.spectrogram_grid.map((row, rIdx) => (
              <div key={rIdx} style={{ display: 'flex', gap: '2px', height: '6px' }}>
                {row.map((val, cIdx) => {
                  const isHighFreq = rIdx >= 14;
                  let color = `rgba(56, 189, 248, ${Math.max(0.06, val)})`;
                  if (isCritical && isHighFreq && val > 0.35) {
                    color = `rgba(244, 63, 94, ${val})`;
                  }
                  return (
                    <div
                      key={cIdx}
                      style={{
                        flex: 1,
                        backgroundColor: color,
                        borderRadius: '1px'
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '6px' }}>
            <span>Low Frequencies (Vocal Pitch F0)</span>
            <span>High Frequencies (&gt;6.5 kHz Vocoder Range)</span>
          </div>
        </div>
      )}

      {/* Acoustic Explanations List */}
      <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#94a3b8' }}>
          Key Audio Observations:
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          {result.anomalies.map((anom, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.85rem',
              color: isCritical ? '#fca5a5' : '#a7f3d0',
              background: 'rgba(10, 14, 26, 0.4)',
              padding: '8px 12px',
              borderRadius: '8px'
            }}>
              {isCritical ? <AlertTriangle size={15} color="#f43f5e" /> : <CheckCircle2 size={15} color="#10b981" />}
              <span>{anom}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
