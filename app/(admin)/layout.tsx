import { AdminGuard } from "../components/AdminGuard";
import { AdminNavigation } from "../components/AdminNavigation";

export default function AdminLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <AdminGuard>
   <AdminNavigation />
   {children}
  </AdminGuard>
 );
}
