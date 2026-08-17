import { getClients } from "./actions";
import ClientModal from "./ClientModal";

export const revalidate = 0; // Disable caching

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-gothic tracking-widest uppercase">รายชื่อลูกค้า (Clients)</h1>
        <p className="text-text-secondary text-sm mt-1">ฐานข้อมูลและประวัติการสักของลูกค้า</p>
      </div>

      <div className="raw-panel p-0 overflow-hidden border border-border-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border-dark text-xs uppercase tracking-widest text-text-secondary bg-black/20">
                <th className="p-4 font-medium">ชื่อลูกค้า (Name)</th>
                <th className="p-4 font-medium">ติดต่อ (Contact)</th>
                <th className="p-4 font-medium">ประวัติสุขภาพ (Medical)</th>
                <th className="p-4 font-medium text-right">จัดการ (Action)</th>
              </tr>
            </thead>
            <tbody>
              {clients.length > 0 ? (
                clients.map((client) => {
                  const hasMedicalIssue = !!client.medical_history && client.medical_history.trim().length > 0;
                  
                  return (
                    <tr key={client.id} className="border-b border-border-dark/50 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-sm">
                        {client.name}
                      </td>
                      <td className="p-4 text-xs text-text-secondary">
                        <div className="text-white">{client.email}</div>
                        {client.phone && <div>{client.phone}</div>}
                        {client.instagram && <div className="text-blue-400">IG: {client.instagram}</div>}
                      </td>
                      <td className="p-4 text-xs">
                        {hasMedicalIssue ? (
                          <span className="bg-red-500/20 text-red-400 border border-red-500/50 px-2 py-1 text-[10px] uppercase tracking-wider font-bold">
                            ATTENTION REQUIRED
                          </span>
                        ) : (
                          <span className="text-text-secondary">ปกติ (Clear)</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <ClientModal client={client} />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-text-secondary text-sm">
                    ยังไม่มีข้อมูลลูกค้าในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
