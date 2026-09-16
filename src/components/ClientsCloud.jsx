import React from 'react';

export default function ClientsCloud({ clients }) {
  if (!clients || clients.length === 0) return null;

  return (
    <section className="clients-section" id="clientsSection">
      <div className="container">
        <p className="clients-label">Collaborated with Artists & Brands</p>
        <div className="clients-cloud">
          {clients.map((client, idx) => (
            <span key={idx} className="client-tag">
              {client}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
