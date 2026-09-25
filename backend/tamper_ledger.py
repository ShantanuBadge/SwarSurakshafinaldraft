"""
SwarSuraksha (स्वर सुरक्षा) - Blockchain & Tamper-Evident Security Audit Ledger
SIH 2026 Theme: Blockchain & Cybersecurity
Maintains an immutable cryptographic chain of voice verification verdicts and forensic proofs.
"""

import time
import json
import hashlib
from typing import List, Dict, Any, Optional


class AuditBlock:
    def __init__(self, index: int, timestamp: float, session_id: str, caller_id: str,
                 risk_score: float, verdict: str, prevention_action: str,
                 acoustic_fingerprint: str, previous_hash: str):
        self.index = index
        self.timestamp = timestamp
        self.session_id = session_id
        self.caller_id = caller_id
        self.risk_score = risk_score
        self.verdict = verdict
        self.prevention_action = prevention_action
        self.acoustic_fingerprint = acoustic_fingerprint
        self.previous_hash = previous_hash
        self.hash = self.compute_hash()

    def compute_hash(self) -> str:
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "session_id": self.session_id,
            "caller_id": self.caller_id,
            "risk_score": self.risk_score,
            "verdict": self.verdict,
            "prevention_action": self.prevention_action,
            "acoustic_fingerprint": self.acoustic_fingerprint,
            "previous_hash": self.previous_hash
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode('utf-8')).hexdigest()

    def to_dict(self) -> Dict[str, Any]:
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "session_id": self.session_id,
            "caller_id": self.caller_id,
            "risk_score": self.risk_score,
            "verdict": self.verdict,
            "prevention_action": self.prevention_action,
            "acoustic_fingerprint": self.acoustic_fingerprint,
            "previous_hash": self.previous_hash,
            "hash": self.hash
        }


class TamperProofAuditLedger:
    def __init__(self):
        self.chain: List[AuditBlock] = []
        self.create_genesis_block()

    def create_genesis_block(self):
        genesis = AuditBlock(
            index=0,
            timestamp=time.time() - 3600,
            session_id="GENESIS-SWARSURAKSHA-001",
            caller_id="SYSTEM_INIT",
            risk_score=0.0,
            verdict="GENESIS_INITIALIZED",
            prevention_action="SECURE_AUDIT_LEDGER_ONLINE",
            acoustic_fingerprint="0000000000000000000000000000000000000000000000000000000000000000",
            previous_hash="0" * 64
        )
        self.chain.append(genesis)

    def add_audit_record(self, session_id: str, caller_id: str, risk_score: float,
                         verdict: str, prevention_action: str, raw_audio_bytes: Optional[bytes] = None) -> AuditBlock:
        prev_block = self.chain[-1]
        fingerprint = hashlib.sha256(raw_audio_bytes or str(time.time()).encode()).hexdigest()
        
        new_block = AuditBlock(
            index=len(self.chain),
            timestamp=time.time(),
            session_id=session_id,
            caller_id=caller_id,
            risk_score=risk_score,
            verdict=verdict,
            prevention_action=prevention_action,
            acoustic_fingerprint=fingerprint,
            previous_hash=prev_block.hash
        )
        self.chain.append(new_block)
        return new_block

    def verify_chain_integrity(self) -> Dict[str, Any]:
        """Validates cryptographic integrity of all audit blocks"""
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            prev = self.chain[i-1]

            if current.previous_hash != prev.hash:
                return {
                    "is_valid": False,
                    "error": f"Broken chain link at block {i}: previous_hash mismatch",
                    "compromised_block_index": i
                }

            if current.compute_hash() != current.hash:
                return {
                    "is_valid": False,
                    "error": f"Tampered block detected at index {i}: hash recalculation mismatch",
                    "compromised_block_index": i
                }

        return {
            "is_valid": True,
            "total_blocks": len(self.chain),
            "latest_hash": self.chain[-1].hash,
            "status": "SECURE_AND_VERIFIED"
        }

    def get_blocks(self, limit: int = 50) -> List[Dict[str, Any]]:
        return [b.to_dict() for b in self.chain[-limit:]]


# Global ledger instance
audit_ledger = TamperProofAuditLedger()
