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

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    await updateAppointmentStatus(app.id, newStatus);
    setIsUpdating(false);
  };

  return (
    <tr className="border-b border-border-dark/50 last:border-b-0 hover:bg-white/5 transition-colors">
      <td className="p-4 font-bold text-sm">
        {app.guest_name}
        <div className="text-[10px] text-text-secondary font-normal mt-1">{app.guest_phone}</div>
      </td>
      <td className="p-4 text-xs text-text-secondary">{app.artists?.name || "Unknown"}</td>
      <td className="p-4 text-xs">
        {app.placement} ({app.size_cm})
        {app.slip_image_url && (
          <a href={app.slip_image_url} target="_blank" rel="noreferrer" className="block mt-1 text-blue-400 hover:underline">
            ดูสลิปมัดจำ (View Slip)
          </a>
        )}
      </td>
      <td className="p-4 text-xs">{app.preferred_date || "N/A"}</td>
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
          <option value="deposit_paid">Deposit Paid</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </td>
    </tr>
  );
}
