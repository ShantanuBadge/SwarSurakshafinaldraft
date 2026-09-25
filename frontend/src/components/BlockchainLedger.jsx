import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Link2, Download, Copy, Check } from 'lucide-react';

export default function BlockchainLedger() {
  const [blocks, setBlocks] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedHash, setCopiedHash] = useState(null);

  const fetchBlocks = async () => {
    try {
      const res = await fetch('/api/ledger/blocks');
      const data = await res.json();
      setBlocks(data);
    } catch (err) {
      console.error("Failed to fetch blocks", err);
    }
  };

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch('/api/ledger/verify');
      const data = await res.json();
      setVerificationResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
    handleVerifyChain();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const exportLedger = () => {
    const blob = new Blob([JSON.stringify(blocks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SwarSuraksha-Tamper-Proof-Ledger-${Date.now()}.json`;
    a.click();
  };

  return (
    <div style={{ padding: '0 24px 30px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header & Verification Bar */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Lock size={20} color="#38bdf8" />
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>
                Blockchain Tamper-Evident Security Audit Ledger
              </h2>
              <span className="badge badge-cyan">SIH Theme: Blockchain & Cybersecurity</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
              Cryptographically chained SHA-256 Merkle blocks recording every voice clone detection verdict and mitigation action.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={handleVerifyChain}
              disabled={isVerifying}
              className="btn-cyber btn-outline"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <RefreshCw size={14} className={isVerifying ? 'radar-pulse' : ''} />
              <span>Verify Chain Integrity</span>
            </button>
            <button
              onClick={exportLedger}
              className="btn-cyber"
              style={{ padding: '8px 14px', fontSize: '0.85rem' }}
            >
              <Download size={14} />
              <span>Export Audit Ledger</span>
            </button>
          </div>
        </div>

        {/* Verification Status Banner */}
        {verificationResult && (
          <div style={{
            marginTop: '16px',
            background: verificationResult.is_valid ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            border: `1px solid ${verificationResult.is_valid ? 'rgba(16, 185, 129, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
            padding: '12px 16px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {verificationResult.is_valid ? (
                <ShieldCheck size={20} color="#10b981" />
              ) : (
                <AlertTriangle size={20} color="#ef4444" />
              )}
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: verificationResult.is_valid ? '#34d399' : '#f87171' }}>
                  {verificationResult.is_valid ? 'Cryptographic Chain Integrity Verified: All Blocks Untampered' : 'CRITICAL INTEGRITY FAILURE'}
                </span>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Total Blocks Chained: {verificationResult.total_blocks} | Merkle Root Hash: {verificationResult.latest_hash.slice(0, 24)}...
                </p>
              </div>
            </div>

            <span className="badge badge-authentic" style={{ fontSize: '0.7rem' }}>
              RBI / CERT-In Non-Repudiation Ready
            </span>
          </div>
        )}
      </div>

      {/* Blocks Chain List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {blocks.map((block, idx) => {
          const isCritical = block.risk_score >= 60 || block.verdict.includes('CLONE');
          return (
            <div
              key={block.index}
              className="glass-panel"
              style={{
                padding: '16px 20px',
                borderLeft: `4px solid ${isCritical ? '#ef4444' : block.index === 0 ? '#38bdf8' : '#10b981'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                
                {/* Block Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    background: 'rgba(7, 11, 22, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-color)',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    color: '#38bdf8'
                  }}>
                    #{block.index}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: '700', color: '#f8fafc' }}>
                        {block.session_id}
                      </span>
                      <span className={`badge ${isCritical ? 'badge-critical' : 'badge-authentic'}`} style={{ fontSize: '0.65rem' }}>
                        {block.verdict.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Caller: <strong style={{ color: '#e2e8f0' }}>{block.caller_id}</strong> • Timestamp: {new Date(block.timestamp * 1000).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Risk Score */}
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: isCritical ? '#f87171' : '#34d399' }}>
                    {block.risk_score}%
                  </span>
                  <p style={{ fontSize: '0.7rem', color: '#64748b' }}>Assessed Risk</p>
                </div>
              </div>

              {/* Action Taken */}
              <div style={{ marginTop: '10px', background: 'rgba(7, 11, 22, 0.4)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.75rem', color: '#cbd5e1' }}>
                <strong style={{ color: '#38bdf8' }}>Enforced Action:</strong> {block.prevention_action}
              </div>

              {/* Hashes Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px', marginTop: '10px', fontSize: '0.7rem', fontFamily: 'monospace', color: '#94a3b8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 0, 0, 0.3)', padding: '6px 10px', borderRadius: '6px', overflow: 'hidden' }}>
                  <span style={{ color: '#64748b' }}>Prev Hash:</span>
                  <span style={{ color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {block.previous_hash.slice(0, 28)}...
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0, 0, 0, 0.3)', padding: '6px 10px', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                    <span style={{ color: '#38bdf8' }}>Block Hash:</span>
                    <span style={{ color: '#38bdf8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {block.hash.slice(0, 24)}...
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(block.hash)}
                    style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '2px' }}
                    title="Copy full SHA-256 hash"
                  >
                    {copiedHash === block.hash ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
