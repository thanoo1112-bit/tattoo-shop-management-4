"use client";

import { useState, useEffect } from "react";
import { X, Save, Clock, AlertTriangle } from "lucide-react";
import { getClientAppointments, updateClientMedicalInfo } from "./actions";

export default function ClientModal({ client }: { client: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState(client.medical_history || "");
  const [notes, setNotes] = useState(client.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoadingHistory(true);
      getClientAppointments(client.email).then((data) => {
        setAppointments(data);
        setIsLoadingHistory(false);
      });
    }
  }, [isOpen, client.email]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateClientMedicalInfo(client.id, medicalHistory, notes);
    setIsSaving(false);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider transition-colors border border-border-dark"
      >
        จัดการ (Manage)
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background-dark border border-border-dark max-w-3xl w-full max-h-[90vh] overflow-y-auto raw-panel shadow-2xl relative animate-fade-in text-left">
            
            {/* Header */}
            <div className="p-6 border-b border-border-dark flex justify-between items-center sticky top-0 bg-background-dark/95 backdrop-blur z-10">
              <div>
                <h2 className="text-xl font-gothic tracking-widest uppercase">{client.name}</h2>
                <p className="text-sm text-text-secondary">{client.email} | {client.phone}</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-text-secondary hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Editable Info */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-red-400 mb-2">
                    <AlertTriangle size={16} /> ประวัติสุขภาพ / แพ้ยา
                  </label>
                  <textarea
                    value={medicalHistory}
                    onChange={(e) => setMedicalHistory(e.target.value)}
                    placeholder="เช่น แพ้ยาชา, โรคประจำตัว, ฯลฯ"
                    className="w-full h-32 bg-black border border-border-dark p-3 text-sm focus:outline-none focus:border-red-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest text-text-secondary mb-2">
                    บันทึกเพิ่มเติม (Notes)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ความชอบส่วนตัว, ลักษณะผิวหนัง, ฯลฯ"
                    className="w-full h-32 bg-black border border-border-dark p-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Save size={18} />
                  {isSaving ? "Saving..." : "บันทึกข้อมูล (Save)"}
                </button>
              </div>

              {/* Right Column: Appointment History */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-text-secondary mb-4 pb-2 border-b border-border-dark">
                  <Clock size={16} /> ประวัติการสัก (History)
                </label>
                
                {isLoadingHistory ? (
                  <div className="text-center py-8 text-text-secondary text-sm animate-pulse">
                    กำลังโหลดข้อมูล...
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((app) => (
                      <div key={app.id} className="p-4 bg-black/50 border border-border-dark/50 rounded-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div className="text-sm font-bold">{new Date(app.created_at).toLocaleDateString()}</div>
                          <div className="text-[10px] px-2 py-1 bg-white/10 uppercase tracking-widest">{app.status}</div>
                        </div>
                        <div className="text-xs text-text-secondary mb-1">
                          <span className="text-white">ช่างสัก:</span> {app.artists?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-text-secondary">
                          <span className="text-white">รายละเอียด:</span> {app.details || "ไม่มีข้อมูล"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-text-secondary text-sm">
                    ไม่พบประวัติการสัก
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
