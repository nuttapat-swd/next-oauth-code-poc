'use client';
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

export default function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({ startOnLoad: false, theme: 'dark' });
      mermaid.render('mermaid-diagram', chart).then(({ svg }) => {
        ref.current!.innerHTML = svg;
      });
    }
  }, [chart]);

  return (
    <div
      style={{
        width: '100%',
        minWidth: '1200px',
        minHeight: '500px',
        maxWidth: '100vw',
        maxHeight: '80vh',
        overflow: 'auto',
        margin: '24px auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '32px 0',
      }}
    >
      <div ref={ref} style={{ color: '#fff', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto' }} />
      <style>{`
        .mermaid text, .mermaid tspan, .mermaid .label {
          fill: #fff !important;
          color: #fff !important;
          font-size: 36px !important;
        }
        .mermaid rect, .mermaid .actor {
          rx: 12px !important;
          ry: 12px !important;
        }
        .mermaid .messageText {
          font-size: 32px !important;
        }
        .mermaid .labelBox {
          font-size: 32px !important;
        }
        .mermaid .actor {
          font-size: 36px !important;
        }
        .mermaid svg {
          min-width: 1200px !important;
          min-height: 500px !important;
          width: 100% !important;
          height: 100% !important;
          display: block;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
} 