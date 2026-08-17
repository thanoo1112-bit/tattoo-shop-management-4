"use client";

import { updateAppointmentStatus } from "./actions";
import { useState } from "react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
  deposit_paid: "bg-purple-500/20 text-purple-400 border-purple-500/50",
  approved: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  completed: "bg-green-500/20 text-green-400 border-green-500/50",
  rejected: "bg-red-500/20 text-red-400 border-red-500/50",
};

export default function AppointmentRow({ app }: { app: any }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showImage, setShowImage] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    await updateAppointmentStatus(app.id, newStatus);
    setIsUpdating(false);
  };

  return (
    <>
      <tr className="border-b border-border-dark/50 last:border-b-0 hover:bg-white/5 transition-colors">
        <td className="p-4 font-bold text-sm">
          {app.guest_name}
          <div className="text-[10px] text-text-secondary font-normal mt-1">{app.guest_email}</div>
          <div className="text-[10px] text-text-secondary font-normal">{app.guest_phone}</div>
        </td>
        <td className="p-4 text-xs text-text-secondary">{app.artists?.name || "Unknown"}</td>
        <td className="p-4 text-xs max-w-[250px]">
          <div className="truncate"><span className="text-text-secondary">Style:</span> {app.style || "-"}</div>
          <div className="truncate"><span className="text-text-secondary">Place:</span> {app.placement || "-"}</div>
          <div className="truncate">
            <span className="text-text-secondary">Size:</span> กว้าง {app.size_w || (app.size_cm ? app.size_cm.split('x')[0] : "-")} x ยาว {app.size_h || (app.size_cm ? app.size_cm.split('x')[1] : "-")} ซม. {app.size_tier ? `[${app.size_tier}]` : ''}
          </div>
          {app.estimated_price_range && (
            <div className="text-accent-silver font-bold mt-1">ราคาประเมิน: {app.estimated_price_range}</div>
          )}
          <div className="mt-2 flex gap-2 flex-wrap">
            {app.reference_image_url && (
              <button onClick={() => setShowImage(app.reference_image_url)} className="text-[10px] bg-white/10 px-2 py-1 hover:bg-white/20 transition-colors">
                ดูแบบ (Ref)
              </button>
            )}
            {app.deposit_slip_url && (
              <button onClick={() => setShowImage(app.deposit_slip_url)} className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-1 hover:bg-emerald-500/40 transition-colors">
                ดูสลิป (Slip)
              </button>
            )}
          </div>
        </td>
        <td className="p-4 text-xs">{app.preferred_date ? new Date(app.preferred_date).toLocaleDateString() : "N/A"}</td>
        <td className="p-4">
          <span className={`text-[10px] uppercase tracking-widest px-2 py-1 border rounded-none font-bold ${STATUS_COLORS[app.status] || "bg-gray-500/20"}`}>
            {app.status.replace("_", " ")}
          </span>
        </td>
        <td className="p-4 text-right">
          <select 
            disabled={isUpdating}
            value={app.status} 
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-black border border-border-dark text-xs p-1 rounded-sm focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </td>
      </tr>

      {/* Image Modal */}
      {showImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setShowImage(null)}>
          <div className="relative max-w-3xl w-full max-h-[90vh] flex flex-col items-center">
            <button className="absolute -top-10 right-0 text-white hover:text-red-400" onClick={() => setShowImage(null)}>CLOSE [X]</button>
            <img src={showImage} alt="Attachment" className="max-w-full max-h-[85vh] object-contain border border-border-dark" />
          </div>
        </div>
      )}
    </>
  );
}
