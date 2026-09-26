import Script from "next/script";

export default function Home() {
  return (
    <>
      <header>
        <div className="wrap">
          <nav>
            <a href="#top" className="logo">
              <svg className="logo-mark" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="38" r="24" fill="#E8873D" />
                <path d="M50 62 L50 90" stroke="#E8873D" strokeWidth="12" strokeLinecap="round" />
              </svg>
              Huella
            </a>
            <ul className="nav-links" id="nav-links">
              <li><a href="#sectores">Sectores</a></li>
              <li><a href="#como-funciona">Cómo funciona</a></li>
              <li><a href="#funciones">Funciones</a></li>
              <li><a href="#precio">Precio</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
            <div className="nav-cta">
              <a href="#contacto" className="btn btn-ghost">Contactar</a>
              <button className="nav-toggle" id="nav-toggle" aria-label="Abrir menú" aria-expanded="false">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <h1>Sabe dónde está, siempre.</h1>
              <p className="lead">
                Localiza vehículos, flotas y animales en tiempo real, con alertas si salen de la zona que tú
                decidas. Sin comprar el dispositivo: lo alquilas, lo usas, lo devuelves.
              </p>
              <div className="hero-ctas">
                <a href="#contacto" className="btn btn-primary" data-track="cta_hero_primary">Solicitar dispositivo</a>
                <a href="#como-funciona" className="btn btn-ghost" data-track="cta_hero_secondary">Cómo funciona</a>
              </div>
              <div className="hero-trust">
                <div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                  Sin permanencia
                </div>
                <div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                  Depósito reembolsable
                </div>
                <div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                  Cobertura 4G nacional
                </div>
              </div>
            </div>

            <div className="panel-frame">
              <div className="panel-map">
                <svg viewBox="0 0 400 290" preserveAspectRatio="none">
                  <polygon className="geo-fence" points="40,40 300,25 370,140 320,255 90,260 20,150" />
                  <path className="route-line" d="M60,220 C110,190 130,120 190,110 C250,100 260,60 330,50" />
                  <circle className="live-ring" cx="330" cy="50" r="6" />
                  <circle className="live-dot" cx="330" cy="50" r="6" />
                </svg>
                <div className="status-card">
                  <div className="status-online"><span className="dot" />En línea</div>
                  <div className="status-row"><span className="status-label">Lat / Lon</span><span className="status-val" id="hero-coords">41.1968, -3.5742</span></div>
                  <div className="status-row"><span className="status-label">Velocidad</span><span className="status-val">42 km/h</span></div>
                  <div className="status-row"><span className="status-label">Batería</span><span className="status-val">86%</span></div>
                </div>
              </div>
              <div className="panel-meta">
                <div className="device-chip">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="7" rx="1" />
                    <path d="M5 11V8a2 2 0 012-2h10a2 2 0 012 2v3" />
                  </svg>
                  Furgoneta 04 — Reparto Centro
                </div>
                <div className="device-chip">Actualizado hace 6s</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTORES */}
        <section className="sectors" id="sectores">
          <div className="wrap">
            <div className="section-head">
              <h2>Un mismo sistema, cuatro formas de usarlo</h2>
              <p>La app se adapta a lo que estés localizando. Elige tu caso.</p>
            </div>

            <div className="tabs" role="tablist">
              <button className="tab-btn active" data-tab="taxis" role="tab" aria-selected="true">Taxis</button>
              <button className="tab-btn" data-tab="reparto" role="tab" aria-selected="false">Furgonetas de reparto</button>
              <button className="tab-btn" data-tab="alquiler" role="tab" aria-selected="false">Alquiler de vehículos</button>
              <button className="tab-btn" data-tab="ganado" role="tab" aria-selected="false">Ganado y mascotas</button>
            </div>

            <div className="tab-panel active" data-panel="taxis">
              <div>
                <h3>Control de rutas y kilometraje</h3>
                <p>Registra cada trayecto para justificar gastos ante Hacienda y ten un historial completo de tu actividad diaria.</p>
                <ul className="tab-list">
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Historial de rutas exportable</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Distancia recorrida por día o mes</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Alerta de seguridad si el vehículo se desvía de zonas habituales</li>
                </ul>
              </div>
              <div className="tab-visual">
                <div className="stat"><span className="stat-num">312 km</span><span className="stat-label">recorridos esta semana</span></div>
                <div className="stat"><span className="stat-num">18</span><span className="stat-label">trayectos registrados hoy</span></div>
                <div className="stat"><span className="stat-num">1</span><span className="stat-label">vehículo bajo seguimiento</span></div>
              </div>
            </div>

            <div className="tab-panel" data-panel="reparto">
              <div>
                <h3>Visibilidad de toda la flota</h3>
                <p>Ve dónde está cada furgoneta en tiempo real, detecta desvíos no autorizados y ten el dato de horas y kilómetros por conductor.</p>
                <ul className="tab-list">
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Mapa con toda la flota a la vez</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Alertas de geovalla por ruta asignada</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Cumple con el deber de informar al conductor (RGPD)</li>
                </ul>
              </div>
              <div className="tab-visual">
                <div className="stat"><span className="stat-num">6</span><span className="stat-label">furgonetas activas ahora</span></div>
                <div className="stat"><span className="stat-num">2</span><span className="stat-label">alertas de zona hoy</span></div>
                <div className="stat"><span className="stat-num">1.240 km</span><span className="stat-label">recorridos por la flota esta semana</span></div>
              </div>
            </div>

            <div className="tab-panel" data-panel="alquiler">
              <div>
                <h3>Recupera lo tuyo, siempre</h3>
                <p>Sabe en todo momento dónde está cada vehículo alquilado y recibe un aviso inmediato si no vuelve a la zona pactada.</p>
                <ul className="tab-list">
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Localización durante todo el alquiler</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Aviso si el vehículo sale de la zona de alquiler</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Historial de uso para resolver incidencias</li>
                </ul>
              </div>
              <div className="tab-visual">
                <div className="stat"><span className="stat-num">14</span><span className="stat-label">vehículos en alquiler activo</span></div>
                <div className="stat"><span className="stat-num">0</span><span className="stat-label">vehículos sin localizar</span></div>
                <div className="stat"><span className="stat-num">4h</span><span className="stat-label">tiempo medio de recuperación ante incidencia</span></div>
              </div>
            </div>

            <div className="tab-panel" data-panel="ganado">
              <div>
                <h3>Vigila el perímetro de la finca</h3>
                <p>Dibuja el perímetro real de tu finca o parcela y recibe un aviso en el momento en que el animal lo cruce.</p>
                <ul className="tab-list">
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Geovalla con el polígono real de tu finca</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Batería pensada para exterior, días entre cargas</li>
                  <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Un solo dispositivo por animal, varios en la misma app</li>
                </ul>
              </div>
              <div className="tab-visual">
                <div className="stat"><span className="stat-num">3</span><span className="stat-label">animales bajo seguimiento</span></div>
                <div className="stat"><span className="stat-num">0</span><span className="stat-label">salidas de finca este mes</span></div>
                <div className="stat"><span className="stat-num">4,2 ha</span><span className="stat-label">superficie vigilada</span></div>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section className="how" id="como-funciona">
          <div className="wrap">
            <div className="section-head">
              <h2>De la caja al mapa en un día</h2>
              <p>Sin instalación técnica, sin compra, sin permanencia.</p>
            </div>
            <div className="steps">
              <div className="step">
                <div className="step-num">01</div>
                <h3>Pagas el depósito</h3>
                <p>Reembolsable al devolver el dispositivo en buen estado.</p>
              </div>
              <div className="step">
                <div className="step-num">02</div>
                <h3>Recibes el GPS</h3>
                <p>Ya viene configurado. Solo tienes que colocarlo en el vehículo o collar.</p>
              </div>
              <div className="step">
                <div className="step-num">03</div>
                <h3>Abres la app</h3>
                <p>Define tu zona segura y empieza a ver la posición en tiempo real.</p>
              </div>
              <div className="step">
                <div className="step-num">04</div>
                <h3>Cancelas cuando quieras</h3>
                <p>Devuelves el dispositivo y recuperas el depósito íntegro.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FUNCIONES */}
        <section className="features" id="funciones">
          <div className="wrap">
            <div className="section-head">
              <h2>Todo lo que necesitas para no perder la pista</h2>
              <p>Una sola app para todos tus dispositivos, sea lo que sea que estés localizando.</p>
            </div>
            <div className="feat-grid">
              <div className="feat-main">
                <div className="feat-row">
                  <div className="feat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                    </svg>
                  </div>
                  <div>
                    <h3>Ubicación en tiempo real</h3>
                    <p>Posición actualizada con la frecuencia que necesites, desde el mapa de tu app.</p>
                  </div>
                </div>
                <div className="feat-row">
                  <div className="feat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <h3>Alertas de geovalla</h3>
                    <p>Dibuja la zona que quieras vigilar y recibe un aviso al instante si el dispositivo la cruza.</p>
                  </div>
                </div>
                <div className="feat-row">
                  <div className="feat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 3v18h18" />
                      <path d="M7 14l4-4 3 3 5-6" />
                    </svg>
                  </div>
                  <div>
                    <h3>Distancia recorrida</h3>
                    <p>Informes por día, semana o mes para cada dispositivo, listos para exportar.</p>
                  </div>
                </div>
                <div className="feat-row">
                  <div className="feat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="4" y="3" width="16" height="18" rx="2" />
                      <path d="M9 8h6M9 12h6M9 16h3" />
                    </svg>
                  </div>
                  <div>
                    <h3>Gestión de dispositivos</h3>
                    <p>Añade, renombra o pausa cada localizador desde una sola cuenta, sin límite de dispositivos.</p>
                  </div>
                </div>
              </div>
              <div className="feat-side">
                <div className="feat-alert">
                  <div className="feat-alert-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                    Salida de zona
                  </div>
                  <p>Furgoneta 04 ha salido de &quot;Ruta Centro&quot; — 09:42</p>
                </div>
                <div>
                  <h4>Dispositivos</h4>
                  <div className="device-list">
                    <div className="device-item"><span><span className="dot dot-cyan" />Furgoneta 04</span><span style={{ color: "var(--text-faint)", fontSize: "0.82rem" }}>86%</span></div>
                    <div className="device-item"><span><span className="dot dot-cyan" />Furgoneta 07</span><span style={{ color: "var(--text-faint)", fontSize: "0.82rem" }}>64%</span></div>
                    <div className="device-item"><span><span className="dot dot-faint" />Furgoneta 02</span><span style={{ color: "var(--text-faint)", fontSize: "0.82rem" }}>sin cobertura</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRECIO */}
        <section className="pricing" id="precio">
          <div className="wrap">
            <div className="section-head" style={{ margin: "0 auto 44px", textAlign: "center", maxWidth: "540px" }}>
              <h2>Un precio, sin sorpresas</h2>
              <p>Sin permanencia. Cancela y devuelve el dispositivo cuando quieras.</p>
            </div>
            <div className="price-card">
              <div className="price-row">
                <div>
                  <div className="price-row-label">Depósito</div>
                  <span className="price-row-sub">Reembolsable al devolver el dispositivo</span>
                </div>
                <div className="price-num">50€</div>
              </div>
              <div className="price-row">
                <div>
                  <div className="price-row-label">Cuota mensual</div>
                  <span className="price-row-sub">Incluye app, alertas y soporte</span>
                </div>
                {/* TODO: fijar precio final de la cuota mensual antes de publicar */}
                <div className="price-num">5€<span style={{ fontSize: "1rem", color: "var(--text-faint)" }}>/mes</span></div>
              </div>
              <ul className="price-includes">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Localizador GPS 4G, batería incluida</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>App con geovalla, historial y alertas</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Sin instalación técnica</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Soporte durante todo el alquiler</li>
              </ul>
              <a href="#contacto" className="btn btn-primary" data-track="cta_pricing">Solicitar dispositivo</a>
              <p className="price-note">Sin tarjeta de crédito para empezar. Te contactamos para confirmar disponibilidad.</p>
            </div>
          </div>
        </section>

        {/* LEAD FORM */}
        <section className="lead" id="contacto">
          <div className="wrap lead-grid">
            <div>
              <h2>Habla con nosotros</h2>
              <p className="lead-copy">Cuéntanos qué necesitas localizar y te contactamos con disponibilidad y siguiente paso.</p>
              <ul className="lead-points">
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Respuesta en menos de 24h laborables</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Sin compromiso hasta que confirmes</li>
                <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>Envío a toda la Península</li>
              </ul>
            </div>

            <form id="lead-form">
              <div className="field">
                <label htmlFor="f-name">Nombre</label>
                <input type="text" id="f-name" name="name" required />
              </div>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="f-email">Email</label>
                  <input type="email" id="f-email" name="email" required />
                </div>
                <div className="field">
                  <label htmlFor="f-phone">Teléfono</label>
                  <input type="tel" id="f-phone" name="phone" />
                </div>
              </div>
              <div className="field">
                <label htmlFor="f-sector">Sector</label>
                <select id="f-sector" name="sector" defaultValue="taxis">
                  <option value="taxis">Taxi</option>
                  <option value="reparto">Furgonetas de reparto</option>
                  <option value="alquiler">Alquiler de vehículos</option>
                  <option value="ganado">Ganado y mascotas</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="f-qty">Nº de dispositivos que necesitas</label>
                <input type="number" id="f-qty" name="quantity" min={1} defaultValue={1} />
              </div>
              <div className="field">
                <label htmlFor="f-msg">Mensaje (opcional)</label>
                <textarea id="f-msg" name="message" rows={3} />
              </div>
              <button type="submit" className="btn btn-primary" data-track="cta_lead_submit">Enviar solicitud</button>
              <div id="form-status" role="status" />
              <p className="form-note">Al enviar aceptas nuestra <a href="#" style={{ color: "var(--text-dim)" }}>política de privacidad</a>.</p>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap footer-grid">
          <a href="#top" className="logo" style={{ fontSize: "1.1rem" }}>
            <svg className="logo-mark" viewBox="0 0 100 100" fill="none" style={{ width: "20px", height: "20px" }}>
              <circle cx="50" cy="38" r="24" fill="#E8873D" />
              <path d="M50 62 L50 90" stroke="#E8873D" strokeWidth="12" strokeLinecap="round" />
            </svg>
            Huella
          </a>
          <ul className="footer-links">
            <li><a href="#">Aviso legal</a></li>
            <li><a href="#">Política de privacidad</a></li>
            <li><a href="#">Política de cookies</a></li>
            <li><a href="mailto:davher890@gmail.com">davher890@gmail.com</a></li>
          </ul>
          <span className="footer-copy">© 2026 Huella GPS</span>
        </div>
      </footer>

      {/* COOKIE CONSENT */}
      <div id="cookie-banner">
        <p>Usamos cookies de analítica para entender cómo se usa la web. Puedes aceptarlas o rechazarlas; la web funciona igual en ambos casos.</p>
        <div className="cookie-actions">
          <button className="btn btn-primary" id="cookie-accept">Aceptar</button>
          <button className="btn btn-ghost" id="cookie-reject">Rechazar</button>
        </div>
      </div>

      <Script src="/landing.js" strategy="afterInteractive" />
    </>
  );
}
