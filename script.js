/* ============================================================ */
/* SCRIPT.JS — Lógica del index.html                            */
/* ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ── Config global → hero ── */
    const cfg = getConfig();
    const heroTitulo    = document.getElementById('hero-titulo');
    const heroSubtitulo = document.getElementById('hero-subtitulo');
    const heroImg       = document.getElementById('hero-img');
    if (heroTitulo    && cfg.bannerTitulo)    heroTitulo.textContent    = cfg.bannerTitulo;
    if (heroSubtitulo && cfg.bannerSubtitulo) heroSubtitulo.textContent = cfg.bannerSubtitulo;
    if (heroImg       && cfg.bannerImg)       heroImg.src               = cfg.bannerImg;

    /* ── Anuncio ── */
    const banner = document.getElementById('anuncio-banner');
    const bannerT = document.getElementById('anuncio-texto');
    if (banner && bannerT && cfg.anuncioActivo && cfg.anuncio) {
        bannerT.textContent = cfg.anuncio;
        banner.style.display = '';
    }

    /* ── Datos ── */
    const productos  = getProductos();
    const artesanos  = getArtesanos();
    const categorias = getCategorias();

    /* ════════════════════════════════════
       MODAL VISTA PREVIA
    ════════════════════════════════════ */
    window.verProducto = function(id) {
        const p = getProducto(id); if (!p) return;
        const s = getStock(p.id);
        const agotado = s === 0;
        const todas = [p.img, ...(p.galeria || [])].filter(Boolean);
        const cat = categorias.find(c => c.id === p.cat) || { label: p.cat };

        document.getElementById('pv-title').textContent  = p.nombre;
        document.getElementById('pv-nombre').textContent = p.nombre;
        document.getElementById('pv-precio').textContent = formatPrecio(p.precio);
        document.getElementById('pv-desc').textContent   = p.descripcion;
        document.getElementById('pv-badge').textContent  = cat.label;
        document.getElementById('pv-vendedor').innerHTML =
            `<i class="bi bi-person-circle me-1"></i>Artesano: <a href="seller.html?id=${p.vendedorId}" class="text-primary-custom text-decoration-none fw-semibold">${p.vendedor}</a>`;

        /* Stock pill */
        const sc = s===0?'pill-out':s<=3?'pill-low':'pill-ok';
        const st = s===0?'<i class="bi bi-x-circle me-1"></i>Agotado'
                : s<=3?`<i class="bi bi-fire me-1"></i>Últimas ${s} unidades`
                : `<i class="bi bi-check-circle me-1"></i>${s} unidades disponibles`;
        document.getElementById('pv-stock-badge').innerHTML = `<span class="stock-pill ${sc}">${st}</span>`;

        /* Imagen principal */
        const mainImg = document.getElementById('pv-main-img');
        mainImg.src = todas[0] || '';

        /* Thumbnails */
        document.getElementById('pv-thumbs').innerHTML = todas.map((url, i) => `
            <img src="${url}" alt="${p.nombre} ${i+1}"
                 style="width:70px;height:70px;object-fit:cover;border-radius:9px;cursor:pointer;border:2px solid ${i===0?'var(--primary)':'transparent'};transition:border-color .2s;"
                 onclick="swapPvImg(this,'${url}')"
                 onerror="this.style.display='none'">`).join('');

        /* Características */
        const caract = p.caracteristicas || [];
        document.getElementById('pv-caract').innerHTML = caract.length
            ? `<p class="fw-semibold mb-2 small" style="color:var(--text-muted);text-transform:uppercase;letter-spacing:.05em;">Características</p>
               <div class="d-flex flex-wrap gap-2">
                   ${caract.map(c => `<span style="display:inline-flex;align-items:center;gap:.35rem;background:var(--section-bg);border:1px solid var(--border-color);border-radius:8px;padding:.3rem .7rem;font-size:.8rem;color:var(--text-color);"><i class="bi bi-check2 text-primary-custom"></i>${c}</span>`).join('')}
               </div>` : '';

        /* Botones de acción */
        document.getElementById('pv-botones').innerHTML = agotado
            ? `<button class="btn btn-secondary rounded-3 w-100" disabled><i class="bi bi-slash-circle me-2"></i>Producto agotado</button>
               <a href="seller.html?id=${p.vendedorId}" class="btn btn-outline-custom rounded-3 w-100"><i class="bi bi-person-circle me-2"></i>Ver perfil del artesano</a>`
            : `<a href="https://wa.me/${waNumber(p.cel)}?text=Hola,%20me%20interesa%20el%20producto:%20${encodeURIComponent(p.nombre)}"
                  target="_blank" class="btn btn-success rounded-3 w-100">
                   <i class="bi bi-whatsapp me-2"></i>Contactar por WhatsApp
               </a>
               <a href="mailto:${p.email}?subject=Consulta%20sobre%20${encodeURIComponent(p.nombre)}"
                  class="btn btn-outline-custom rounded-3 w-100">
                   <i class="bi bi-envelope me-2"></i>Enviar correo
               </a>
               <a href="seller.html?id=${p.vendedorId}" class="btn rounded-3 w-100"
                  style="border:2px solid var(--border-color);color:var(--text-muted);background:transparent;">
                   <i class="bi bi-person-circle me-2"></i>Ver perfil del artesano
               </a>`;

        new bootstrap.Modal(document.getElementById('modalProductoView')).show();
    };

    window.swapPvImg = function(thumb, url) {
        document.getElementById('pv-main-img').src = url;
        document.querySelectorAll('#pv-thumbs img').forEach(t => t.style.borderColor = 'transparent');
        thumb.style.borderColor = 'var(--primary)';
    };

    /* ════════════════════════════════════
       CATÁLOGO
    ════════════════════════════════════ */
    const catalogGrid = document.getElementById('catalog-grid');

    function pillBadgeHTML(stock) {
        const color = stock===0 ? '#dc3545' : stock<=3 ? '#ff9800' : 'rgba(25,135,84,.9)';
        const text  = stock===0
            ? '<i class="bi bi-x-circle me-1"></i>SOLD OUT'
            : stock<=3 ? `<i class="bi bi-fire me-1"></i>Últimas ${stock}`
            : `<i class="bi bi-check-circle me-1"></i>${stock} disponibles`;
        return `<span class="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill fw-bold"
                      style="background:${color};color:#fff;font-size:.68rem;">${text}</span>`;
    }

    function renderCatalog(items) {
        if (!catalogGrid) return;
        catalogGrid.innerHTML = '';
        const visible = items.filter(p => p.visible !== false);
        if (!visible.length) {
            catalogGrid.innerHTML = `<div class="col-12 text-center py-5">
                <i class="bi bi-search display-4" style="color:var(--text-muted);"></i>
                <p class="mt-3" style="color:var(--text-muted);">No se encontraron productos.</p>
            </div>`;
            return;
        }
        visible.forEach(prod => {
            const stock   = getStock(prod.id);
            const agotado = stock === 0;
            const extra   = (prod.galeria || []).length;
            const overlay = agotado
                ? `<div class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                        style="background:rgba(0,0,0,.45);top:0;left:0;border-radius:16px 16px 0 0;">
                       <span style="color:#fff;font-size:1.3rem;font-weight:700;letter-spacing:.1em;">SOLD OUT</span>
                   </div>` : '';
            const contactBtns = agotado
                ? `<button class="btn btn-secondary btn-sm rounded-3 w-100" disabled>
                       <i class="bi bi-slash-circle me-2"></i>Agotado
                   </button>`
                : `<a href="https://wa.me/${waNumber(prod.cel)}?text=Hola,%20me%20interesa:%20${encodeURIComponent(prod.nombre)}"
                      target="_blank" class="btn btn-success btn-sm rounded-3 w-100">
                       <i class="bi bi-whatsapp me-2"></i>WhatsApp
                   </a>`;

            catalogGrid.innerHTML += `
            <div class="col-sm-6 col-md-4 col-lg-3 fade-in-up">
                <div class="card h-100 product-card rounded-4 border-0 shadow-sm${agotado ? ' sold-out-card' : ''}">
                    <div class="position-relative overflow-hidden" style="border-radius:16px 16px 0 0;cursor:pointer;" onclick="verProducto(${prod.id})">
                        <img src="${prod.img}" class="card-img-top" alt="${prod.nombre}"
                             style="height:210px;object-fit:cover;${agotado ? 'filter:grayscale(.5);' : ''}">
                        ${overlay}
                        <span class="badge position-absolute top-0 start-0 m-2 px-2 py-1 rounded-pill"
                              style="background:var(--primary);color:#fff;font-size:.68rem;">
                            ${prod.cat.toUpperCase()}
                        </span>
                        ${pillBadgeHTML(stock)}
                        ${extra ? `<span class="position-absolute bottom-0 end-0 m-2 px-2 py-1 rounded-pill"
                                         style="background:rgba(0,0,0,.55);color:#fff;font-size:.68rem;">
                                       <i class="bi bi-images me-1"></i>${extra + 1} fotos
                                   </span>` : ''}
                    </div>
                    <div class="card-body d-flex flex-column p-3">
                        <h5 class="card-title mb-1 fw-bold" style="font-size:.93rem;cursor:pointer;" onclick="verProducto(${prod.id})">${prod.nombre}</h5>
                        <p class="fw-bold mb-1 text-primary-custom">${formatPrecio(prod.precio)}</p>
                        <p class="small mb-2" style="color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${prod.descripcion}</p>
                        <p class="small mb-3" style="color:var(--text-muted);">
                            <i class="bi bi-person-circle me-1"></i>
                            <a href="seller.html?id=${prod.vendedorId}" class="text-decoration-none text-primary-custom fw-semibold">
                                ${prod.vendedor}
                            </a>
                        </p>
                        <div class="mt-auto d-flex flex-column gap-2">
                            <button class="btn btn-outline-custom btn-sm rounded-3 w-100" onclick="verProducto(${prod.id})">
                                <i class="bi bi-eye me-1"></i>Ver detalle
                            </button>
                            ${contactBtns}
                        </div>
                    </div>
                </div>
            </div>`;
        });
    }

    /* ── Filtros dinámicos ── */
    const filtersContainer = document.getElementById('category-filters');
    if (filtersContainer) {
        filtersContainer.innerHTML = `
        <button class="btn btn-primary-custom filter-btn active" data-category="todos">
            <i class="bi bi-grid-3x3-gap me-1"></i>Todos
        </button>`;
        categorias.forEach(c => {
            filtersContainer.innerHTML += `
            <button class="btn btn-outline-custom filter-btn" data-category="${c.id}">
                <i class="${c.icon} me-1"></i>${c.label}
            </button>`;
        });
    }

    renderCatalog(productos);

    /* ── Click en filtro ── */
    document.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn || !btn.closest('#category-filters')) return;
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('active', 'btn-primary-custom');
            b.classList.add('btn-outline-custom');
        });
        btn.classList.remove('btn-outline-custom');
        btn.classList.add('active', 'btn-primary-custom');
        const cat = btn.getAttribute('data-category');
        const si  = document.getElementById('search-input');
        if (si) si.value = '';
        renderCatalog(cat === 'todos' ? productos : productos.filter(p => p.cat === cat));
    });

    /* ── Búsqueda ── */
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.filter-btn').forEach(b => {
                b.classList.remove('active', 'btn-primary-custom');
                b.classList.add('btn-outline-custom');
            });
            const first = document.querySelector('.filter-btn');
            if (first) { first.classList.remove('btn-outline-custom'); first.classList.add('active', 'btn-primary-custom'); }
            renderCatalog(productos.filter(p => p.nombre.toLowerCase().includes(term)));
        });
    }

    /* ════════════════════════════════════
       ARTESANOS
    ════════════════════════════════════ */
    const artesanosGrid = document.getElementById('artesanos-grid');
    if (artesanosGrid) {
        artesanos.filter(a => a.activo !== false).forEach(a => {
            const n = productos.filter(p => p.vendedorId === a.id).length;
            artesanosGrid.innerHTML += `
            <div class="col-sm-6 col-lg-4">
                <a href="seller.html?id=${a.id}" class="text-decoration-none">
                    <div class="card border-0 shadow-sm rounded-4 p-4 h-100 benefit-card text-center" style="cursor:pointer;">
                        <img src="${a.avatar}" alt="${a.nombre}"
                             class="rounded-circle mx-auto mb-3 border border-3 border-primary-custom"
                             width="90" height="90" style="object-fit:cover;">
                        <h5 class="fw-bold mb-1">${a.nombre}</h5>
                        <p class="small mb-2 text-primary-custom fw-semibold">${a.especialidad}</p>
                        <p class="small mb-3" style="color:var(--text-muted);">
                            <i class="bi bi-geo-alt me-1"></i>${a.ubicacion}
                        </p>
                        <div class="d-flex justify-content-center gap-3 mb-3">
                            <span class="small" style="color:var(--text-muted);">
                                <i class="bi bi-box-seam me-1 text-primary-custom"></i>${n} producto${n!==1?'s':''}
                            </span>
                            <span class="small" style="color:var(--text-muted);">
                                <i class="bi bi-star-fill me-1 text-warning"></i>${a.calificacion}
                            </span>
                        </div>
                        <span class="btn btn-outline-custom btn-sm rounded-pill px-3 mt-auto">
                            Ver perfil <i class="bi bi-arrow-right ms-1"></i>
                        </span>
                    </div>
                </a>
            </div>`;
        });
    }

});
