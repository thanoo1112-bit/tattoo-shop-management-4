export default function ClientsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-gothic tracking-widest uppercase">รายชื่อลูกค้า (Clients)</h1>
        <p className="text-text-secondary text-sm mt-1">ฐานข้อมูลและประวัติการสักของลูกค้า</p>
      </div>
      <div className="raw-panel p-12 text-center text-text-secondary border-dashed">
        <p className="font-gothic text-xl tracking-widest uppercase">Coming Soon</p>
        <p className="text-sm mt-2">หน้านี้กำลังอยู่ระหว่างการพัฒนา (ระบบเชื่อมต่อฐานข้อมูล)</p>
      </div>
    </div>
  );
}
