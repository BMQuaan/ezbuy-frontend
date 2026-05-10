import { X } from "lucide-react";

export function  Modal({
  open, onClose, children, title,
}: {
  open: boolean; onClose: () => void; children: React.ReactNode; title: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-5">{children}</div>
        </div>
      </div>
    </div>
  );
}