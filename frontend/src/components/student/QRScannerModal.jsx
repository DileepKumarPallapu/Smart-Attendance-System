import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Camera, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import API from '../../services/api';

export default function QRScannerModal({ isOpen, onClose, onSuccess }) {
  const [scanResult, setScanResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let scanner;
    try {
      scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: { width: 220, height: 220 } }, false);
      scanner.render(
        async (decodedText) => {
          scanner.clear();
          await processPayload(decodedText);
        },
        (error) => {
          // Ignore scanning frame errors
        }
      );
    } catch (e) {
      console.warn('HTML5 Camera Scanner initialization note:', e);
    }

    return () => {
      if (scanner) {
        scanner.clear().catch((err) => console.error(err));
      }
    };
  }, [isOpen]);

  const processPayload = async (payload) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await API.post('/qr/scan', { qrPayload: payload });
      if (res.data.success) {
        setScanResult(res.data.message || 'Attendance Marked Successfully!');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Scanning Failed. Invalid or Expired QR Code.');
    } finally {
      setLoading(false);
    }
  };

  // Instant Test Emulator Handler (for browser desktop demo without needing a camera)
  const triggerDemoScan = async () => {
    const demoPayload = JSON.stringify({
      sessionId: 'SESS-DEMO-1001',
      token: 'demo_token_valid',
      subjectCode: 'CS401',
      className: 'CSE-4A',
      validUntil: new Date(Date.now() + 120000).toISOString(),
    });
    await processPayload(demoPayload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Scan Attendance QR</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {scanResult ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Attendance Marked!</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">{scanResult}</p>
            <button
              onClick={() => {
                setScanResult(null);
                onClose();
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <div className="py-4 space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-2xl flex items-center space-x-2 text-xs text-rose-700 dark:text-rose-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Camera feed canvas container */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900">
              <div id="reader" className="w-full"></div>
            </div>

            {/* Instant Test Emulator Button */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-center">
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">No camera attached? Use 1-Click Desktop Test:</p>
              <button
                onClick={triggerDemoScan}
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>{loading ? 'Verifying Payload...' : 'Simulate Instant QR Scan'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
