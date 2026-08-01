import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, RefreshCw, Clock, CheckCircle2, Users, AlertCircle } from 'lucide-react';
import API from '../../services/api';

export default function QRGeneratorModal({ isOpen, onClose, subjectCode, className, subjectName }) {
  const [validity, setValidity] = useState(60); // Seconds
  const [session, setSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [loading, setLoading] = useState(false);
  const [scannedStudents, setScannedStudents] = useState([]);

  const generateQR = async () => {
    setLoading(true);
    try {
      const res = await API.post('/qr/start-session', {
        subjectCode: subjectCode || 'CS401',
        subjectName: subjectName || 'Data Structures & Algorithms',
        className: className || 'CSE-4A',
        validitySeconds: validity,
      });

      if (res.data.success) {
        setSession(res.data.session);
        setTimeLeft(validity);
        setScannedStudents(res.data.session.scannedStudents || []);
      }
    } catch (err) {
      // Fallback mock session for demonstration
      const mockSession = {
        sessionId: 'SESS-DEMO-' + Date.now(),
        token: 'mock_token_' + Math.random().toString(36).substr(2, 6),
        validUntil: new Date(Date.now() + validity * 1000).toISOString(),
        subjectCode: subjectCode || 'CS401',
        subjectName: subjectName || 'Data Structures',
        className: className || 'CSE-4A',
        scannedStudents: ['2026-CSE-001 (Rahul Kumar)'],
      };
      setSession(mockSession);
      setTimeLeft(validity);
      setScannedStudents(mockSession.scannedStudents);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      generateQR();
    }
  }, [isOpen, validity]);

  // Countdown timer effect
  useEffect(() => {
    if (!session || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session, timeLeft]);

  // Poll for live attendance updates
  useEffect(() => {
    if (!session || timeLeft <= 0) return;
    const pollInterval = setInterval(async () => {
      try {
        const res = await API.get(`/qr/session/${session.sessionId}`);
        if (res.data.success && res.data.session) {
          setScannedStudents(res.data.session.scannedStudents || []);
        }
      } catch (e) {
        // Silent poll error handling
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [session, timeLeft]);

  if (!isOpen) return null;

  const payloadString = session
    ? JSON.stringify({
        sessionId: session.sessionId,
        token: session.token,
        subjectCode: session.subjectCode,
        className: session.className,
        validUntil: session.validUntil,
      })
    : '';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Attendance QR Code</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {subjectCode} - {className}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validity Duration Selector */}
        <div className="my-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">QR Expiration Timer:</span>
          <select
            value={validity}
            onChange={(e) => setValidity(Number(e.target.value))}
            className="bg-white dark:bg-slate-800 text-xs font-bold border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={30}>30 Seconds</option>
            <option value={60}>1 Minute</option>
            <option value={120}>2 Minutes</option>
            <option value={300}>5 Minutes</option>
          </select>
        </div>

        {/* Live QR Code Display */}
        <div className="flex flex-col items-center justify-center py-4 relative">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : timeLeft > 0 ? (
            <div className="p-4 bg-white rounded-2xl shadow-inner border border-slate-200 flex flex-col items-center">
              <QRCodeSVG value={payloadString} size={220} level="H" />
              <div className="mt-4 flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>Expires in: {timeLeft}s</span>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-800">
              <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
              <p className="font-bold text-rose-700 dark:text-rose-300 text-sm">QR Code Expired</p>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1">Students can no longer scan this code.</p>
              <button
                onClick={generateQR}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Generate New QR</span>
              </button>
            </div>
          )}
        </div>

        {/* Live Attendance Counter */}
        <div className="mt-2 pt-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <span className="flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-blue-500" />
              <span>Live Attendance Scanned</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold">
              {scannedStudents.length} Scanned
            </span>
          </div>

          <div className="max-h-24 overflow-y-auto space-y-1.5 pr-1">
            {scannedStudents.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-2">Waiting for students to scan...</p>
            ) : (
              scannedStudents.map((roll, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl text-xs"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200">{roll}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
