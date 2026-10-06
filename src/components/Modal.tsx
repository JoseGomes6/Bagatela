import { useEffect, useRef, type ReactNode } from "react";

/** Caixa de diálogo nativa (<dialog>): abre/fecha conforme `open`; fecha ao clicar fora ou com Esc. */
export function Modal({ id, open, onClose, labelledBy, children }: { id?: string; open: boolean; onClose: () => void; labelledBy: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open && typeof d.showModal === "function") d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      className="dlg"
      id={id}
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </dialog>
  );
}
