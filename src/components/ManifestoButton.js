"use client";

import { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function ManifestoButton({ orderId }) {
  const blueprintRef = useRef(null);

  const downloadManifesto = async () => {
    if (!blueprintRef.current) return;

    try {
      const element = blueprintRef.current;
      if (!element) throw new Error("Capture element not found");

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`THE_DIECAST_STORE_MANIFESTO_${orderId.substring(0, 8)}.pdf`);
    } catch (err) {
      console.error("PDF Generation failed:", err);
    }
  };

  return (
    <>
      <button 
        onClick={downloadManifesto}
        className="flex items-center gap-2 font-mono text-[9px] font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-colors mt-2"
      >
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Manifesto.pdf
      </button>

      {/* Hidden Blueprint for Capture */}
      <div className="fixed left-[-9999px] top-0 pointer-events-none">
        <div ref={blueprintRef} className="w-[800px] overflow-hidden" style={{ backgroundColor: '#ffffff', borderStyle: 'solid', borderWidth: '1px', borderColor: '#e5e7eb' }}>
          <div className="p-4 flex justify-between items-center" style={{ backgroundColor: '#000000' }}>
            <span className="text-[8px] font-mono uppercase tracking-[0.3em]" style={{ color: '#999999' }}>Technical_Manifesto_v1.0</span>
            <div className="flex gap-1">
              <div className="w-1 h-1" style={{ backgroundColor: '#444444' }} />
              <div className="w-1 h-1" style={{ backgroundColor: '#444444' }} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-px" style={{ backgroundColor: '#eeeeee' }}>
            <div className="p-8" style={{ backgroundColor: '#ffffff' }}>
              <p className="text-[9px] font-mono uppercase tracking-widest mb-3 italic" style={{ color: '#888888' }}>Reference_ID</p>
              <p className="text-lg font-mono font-bold truncate" style={{ color: '#000000' }}>{orderId}</p>
            </div>
            <div className="p-8 border-l" style={{ backgroundColor: '#ffffff', borderLeftStyle: 'solid', borderLeftWidth: '1px', borderLeftColor: '#eeeeee' }}>
              <p className="text-[9px] font-mono uppercase tracking-widest mb-3 italic" style={{ color: '#888888' }}>Vault_Status</p>
              <p className="text-lg font-black italic uppercase" style={{ color: '#000000' }}>SECURED</p>
            </div>
          </div>
          
          <div className="p-8 border-t" style={{ borderTopStyle: 'solid', borderTopWidth: '1px', borderTopColor: '#eeeeee', backgroundColor: '#f9f9f9' }}>
            <p className="text-[9px] font-mono uppercase tracking-widest mb-2 italic" style={{ color: '#888888' }}>Curator_Note</p>
            <p className="text-[11px] leading-relaxed font-medium" style={{ color: '#222222' }}>
              This exhibit has been officially processed and allocated to your private vault. 
              The engineering specifications and provenance of this model have been verified 
              against the Curated_Diecast_Exhibition standards.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}