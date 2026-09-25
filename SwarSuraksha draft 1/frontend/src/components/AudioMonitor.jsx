function AudioMonitor({
  isRecording,
  onStart,
  onStop,
  waveformRef
}) {
  return (
    <div className="panel audio-panel">

      <div className="panel-header">
        <div>
          <div className="panel-title">
            LIVE AUDIO MONITOR
          </div>

          <div className="panel-subtitle">
            Real-time voice analysis
          </div>
        </div>

        <div
          className={
            isRecording
              ? "live-indicator active"
              : "live-indicator"
          }
        >
          <span></span>

          {isRecording ? "LIVE" : "IDLE"}
        </div>
      </div>

      <canvas
        ref={waveformRef}
        className="waveform"
      />

      <div className="audio-controls">

        {!isRecording ? (
          <button
            className="primary-button"
            onClick={onStart}
          >
            Start Monitoring
          </button>
        ) : (
          <button
            className="danger-button"
            onClick={onStop}
          >
            Stop Monitoring
          </button>
        )}

      </div>

    </div>
  );
}

export default AudioMonitor;
