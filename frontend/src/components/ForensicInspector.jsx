import React, { useState } from 'react';
import { Upload, FileAudio, Play, Pause, AlertTriangle, ShieldCheck, ShieldAlert, Cpu, Download, CheckCircle2, Info, Activity } from 'lucide-react';

export default function ForensicInspector({ samples, onAnalysisComplete }) {
  const [selectedPreset, setSelectedPreset] = useState('cloned_cfo_arup_attack');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [callerName, setCallerName] = useState('Deepfake CFO Voice Clone');
  const [txnAmount, setTxnAmount] = useState('25600000');
  const [urgency, setUrgency] = useState('high');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef(null);

  // Run analysis on preset or file
  const runAnalysis = async (fileToAnalyze = null, presetId = null) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('caller_name', callerName);
      formData.append('txn_amount', txnAmount);
      formData.append('urgency', urgency);

      if (fileToAnalyze) {
        formData.append('file', fileToAnalyze);
      } else {
        // Fetch preset audio bytes
        const id = presetId || selectedPreset;
        const res = await fetch(`/api/samples/${id}/audio`);
        const blob = await res.blob();
        formData.append('file', blob, `${id}.wav`);
      }

      const response = await fetch('/api/analyze/file', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      setAnalysisResult(data);
      if (onAnalysisComplete) onAnalysisComplete(data);
    } catch (err) {
      console.error("Forensic analysis error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setCallerName(file.name.replace(/\.[^/.]+$/, ""));
      runAnalysis(file);
    }
  };

  const handleSelectPreset = (sample) => {
    setSelectedPreset(sample.id);
    setUploadedFile(null);
    setCallerName(sample.caller);
    setTxnAmount(String(sample.txn_amount));
    setUrgency(sample.urgency || 'normal');
    runAnalysis(null, sample.id);
  };

  // Download forensic report JSON
  const downloadReport = () => {
    if (!analysisResult) return;
    const blob = new Blob([JSON.stringify(analysisResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SwarSuraksha-Forensic-Report-${analysisResult.session_id || 'AUDIT'}.json`;
    a.click();
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px', padding: '0 24px 30px 24px' }}>
      
      {/* Left Column: File Ingestion & Presets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Presets & Scenarios */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <FileAudio size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Pre-Bundled Contact Center Test Cases</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
            Instant-load benchmark audio files evaluated against AASIST spectro-temporal protocols:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {samples.map(sample => {
              const isSelected = selectedPreset === sample.id && !uploadedFile;
              return (
                <div
                  key={sample.id}
                  onClick={() => handleSelectPreset(sample)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(2, 132, 199, 0.25)' : 'rgba(7, 11, 22, 0.5)',
                    border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.06)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '600', color: isSelected ? '#38bdf8' : '#f8fafc' }}>
                      {sample.title}
                    </span>
                    <span className={`badge ${sample.expected_threat === 'CRITICAL' ? 'badge-critical' : 'badge-authentic'}`} style={{ fontSize: '0.65rem' }}>
                      {sample.expected_threat === 'CRITICAL' ? 'Cloned Attack' : 'Authentic Voice'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                    {sample.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '6px' }}>
                    <span>Caller: {sample.caller}</span>
                    <span>Approval: ₹{Number(sample.txn_amount).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Audio Upload Dropzone */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Upload size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>Custom Audio File Forensic Ingestion</h3>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
            Upload any WAV, MP3, or WebM voice sample for instant on-device spectro-temporal breakdown:
          </p>

          <label style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 16px',
            border: '2px dashed rgba(56, 189, 248, 0.4)',
            borderRadius: '12px',
            background: 'rgba(7, 11, 22, 0.4)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'border-color 0.2s'
          }}>
            <Upload size={28} color="#38bdf8" style={{ marginBottom: '8px' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#e2e8f0' }}>
              {uploadedFile ? uploadedFile.name : 'Click to Browse or Drag Audio File Here'}
            </span>
            <span style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Supports WAV, MP3, FLAC, OGG, WebM (Auto-resampled to 16 kHz)
            </span>
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>

      </div>

      {/* Right Column: Detailed Forensic Analysis & Spectrogram */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {isAnalyzing ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <Activity className="radar-pulse" size={36} color="#38bdf8" style={{ margin: '0 auto 16px auto', display: 'block' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Running AASIST Spectro-Temporal Analysis...</h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '6px' }}>
              Evaluating high-frequency phase coherence, vocoder energy balance, and vocal fold micro-jitter.
            </p>
          </div>
        ) : analysisResult ? (
          <>
            {/* Top Verdict Card */}
            <div className="glass-panel" style={{
              padding: '20px',
              borderLeft: `5px solid ${analysisResult.theme_color}`,
              background: `linear-gradient(135deg, ${analysisResult.theme_color}18 0%, rgba(15, 23, 42, 0.8) 100%)`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {analysisResult.threat_level === 'CRITICAL' ? (
                      <ShieldAlert size={22} color="#ef4444" />
                    ) : (
                      <ShieldCheck size={22} color="#10b981" />
                    )}
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: analysisResult.theme_color }}>
                      {analysisResult.verdict_label}
                    </h2>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                    {analysisResult.prevention_protocols.recommended_action}
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: analysisResult.theme_color }}>
                    {analysisResult.risk_score_percent}%
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Clone Risk Probability
                  </span>
                </div>
              </div>

              {/* Forensic Metric Badges */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                <span className="badge badge-cyan">Latency: {analysisResult.inference_latency_ms} ms</span>
                <span className="badge badge-cyan">Duration: {analysisResult.duration_seconds}s</span>
                <span className={`badge ${analysisResult.threat_level === 'CRITICAL' ? 'badge-critical' : 'badge-authentic'}`}>
                  Confidence: {analysisResult.confidence_percent}%
                </span>
                <span className="badge badge-cyan">Framework: ONNX Edge</span>
              </div>
            </div>

            {/* Spectrogram Grid Visualizer */}
            {analysisResult.spectrogram_grid && analysisResult.spectrogram_grid.length > 0 && (
              <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={16} color="#38bdf8" />
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>Spectro-Temporal Energy Density Matrix</h4>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    20 Frequency Bands × 32 Time Frames
                  </span>
                </div>

                {/* Spectrogram Visual Heatmap */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  background: '#040712',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid rgba(56, 189, 248, 0.2)'
                }}>
                  {analysisResult.spectrogram_grid.map((row, rIdx) => (
                    <div key={rIdx} style={{ display: 'flex', gap: '2px', height: '5px' }}>
                      {row.map((val, cIdx) => {
                        // High frequencies are in upper rows
                        const isHighFreq = rIdx >= 14;
                        let cellBg = `rgba(56, 189, 248, ${Math.max(0.08, val)})`;
                        if (isHighFreq && val > 0.4 && analysisResult.threat_level === 'CRITICAL') {
                          cellBg = `rgba(239, 68, 68, ${val})`; // Highlight vocoder leak in red
                        }
                        return (
                          <div
                            key={cIdx}
                            style={{
                              flex: 1,
                              backgroundColor: cellBg,
                              borderRadius: '1px'
                            }}
                            title={`Band ${rIdx}, Frame ${cIdx}: ${(val * 100).toFixed(0)}%`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '6px' }}>
                  <span>Low Frequency (Fundamental F0)</span>
                  <span style={{ color: analysisResult.threat_level === 'CRITICAL' ? '#f87171' : '#64748b' }}>
                    High Frequency Vocoder Band (&gt;6.5 kHz)
                  </span>
                </div>
              </div>
            )}

            {/* Biomarker Diagnostic Grid */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={16} color="#38bdf8" />
                <span>AASIST Spectro-Temporal Biomarkers</span>
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ background: 'rgba(7, 11, 22, 0.6)', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Pitch Jitter (F0)</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: '700', color: analysisResult.biomarkers.jitter_percent < 0.45 ? '#f87171' : '#10b981' }}>
                    {analysisResult.biomarkers.jitter_percent}%
                  </p>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Human: 0.8% - 2.5%</span>
                </div>

                <div style={{ background: 'rgba(7, 11, 22, 0.6)', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Mean Fundamental F0</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>
                    {analysisResult.biomarkers.f0_mean_hz} Hz
                  </p>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Std: ±{analysisResult.biomarkers.f0_std_hz} Hz</span>
                </div>

                <div style={{ background: 'rgba(7, 11, 22, 0.6)', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Vocoder Artifact</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: '700', color: analysisResult.biomarkers.vocoder_artifact_score > 0.4 ? '#f87171' : '#10b981' }}>
                    {(analysisResult.biomarkers.vocoder_artifact_score * 100).toFixed(0)}%
                  </p>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>HiFi-GAN / MelGAN</span>
                </div>

                <div style={{ background: 'rgba(7, 11, 22, 0.6)', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>HF Energy Ratio</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: '700', color: analysisResult.biomarkers.hf_energy_ratio > 0.02 ? '#f87171' : '#38bdf8' }}>
                    {(analysisResult.biomarkers.hf_energy_ratio * 100).toFixed(2)}%
                  </p>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>&gt;6 kHz power ratio</span>
                </div>

                <div style={{ background: 'rgba(7, 11, 22, 0.6)', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Phase Jitter</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: '700', color: analysisResult.biomarkers.phase_jitter_index > 2.0 ? '#f87171' : '#10b981' }}>
                    {analysisResult.biomarkers.phase_jitter_index}
                  </p>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Phase continuity</span>
                </div>

                <div style={{ background: 'rgba(7, 11, 22, 0.6)', padding: '10px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Harmonic / Noise</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>
                    {analysisResult.biomarkers.hnr_db} dB
                  </p>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>HNR clarity index</span>
                </div>
              </div>

              {/* Anomalies List */}
              <div style={{ marginTop: '16px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#94a3b8' }}>Acoustic Diagnostics:</span>
                <ul style={{ listStyle: 'none', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {analysisResult.anomalies.map((anom, idx) => (
                    <li key={idx} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.8rem',
                      color: analysisResult.threat_level === 'CRITICAL' ? '#fca5a5' : '#86efac',
                      background: 'rgba(0, 0, 0, 0.25)',
                      padding: '6px 10px',
                      borderRadius: '6px'
                    }}>
                      {analysisResult.threat_level === 'CRITICAL' ? (
                        <AlertTriangle size={14} color="#ef4444" />
                      ) : (
                        <CheckCircle2 size={14} color="#10b981" />
                      )}
                      <span>{anom}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cryptographic Hash & Certificate */}
              {analysisResult.audit_block && (
                <div style={{ marginTop: '16px', background: 'rgba(6, 182, 212, 0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} color="#38bdf8" />
                      <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#38bdf8' }}>
                        Tamper-Evident SHA-256 Audit Block Linked
                      </span>
                    </div>
                    <button
                      onClick={downloadReport}
                      className="btn-cyber"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      <Download size={14} />
                      <span>Download Forensic JSON</span>
                    </button>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#94a3b8', marginTop: '6px', wordBreak: 'break-all' }}>
                    Block #{analysisResult.audit_block.index} Hash: {analysisResult.audit_block.hash}
                  </div>
                </div>
              )}

            </div>
          </>
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            <FileAudio size={42} color="#334155" style={{ margin: '0 auto 12px auto' }} />
            <p>Select a benchmark scenario from the left or upload an audio sample to inspect forensic biomarkers.</p>
          </div>
        )}

      </div>

    </div>
  );
}
