/* ============================================================ */
/* DATA.JS — Base de datos + helpers compartidos                */
/* ArteTam — Pure frontend (localStorage)                       */
/* ============================================================ */

/* ── DOMINIOS OFICIALES ───────────────────────────────────── */
const DOMAIN_ADMIN   = '@adminat.com';
const DOMAIN_VENDOR  = '@artesanos.com';

/* ── HASH SIMPLE (SHA-256 via SubtleCrypto, asíncrono) ────── */
/* Para uso sincrónico almacenamos un hash FNV-1a de 32 bits   */
/* como prefijo + la cadena en base64, suficiente para          */
/* distinguir contraseñas sin guardarlas en claro.              */
function _hashPwd(raw) {
    /* FNV-1a 32-bit — rápido, sin dependencias, sincrónico */
    let h = 0x811c9dc5 >>> 0;
    for (let i = 0; i < raw.length; i++) {
        h ^= raw.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;
    }
    return 'fnv:' + h.toString(16) + ':' + btoa(raw).slice(0,8);
}
function _checkPwd(raw, stored) {
    if (!stored) return false;
    if (stored.startsWith('fnv:')) return _hashPwd(raw) === stored;
    return raw === stored; /* legacy: comparación directa para semillas */
}

/* ── SEMILLAS ──────────────────────────────────────────────── */
const _artesanosSeed = [
    { id:"juan-perez",  nombre:"Juan Pérez",   especialidad:"Cerámica",      ubicacion:"Tapalpa, Jalisco",            bio:"Ceramista con más de 20 años de experiencia. Combina técnicas prehispánicas con diseños contemporáneos.",           cel:"5215551234567", email:"juan@artesanos.com",  avatar:"https://i.pravatar.cc/150?img=12", calificacion:4.9, ventas:142, anios:20, activo:true },
    { id:"maria-lopez", nombre:"María López",  especialidad:"Textiles",       ubicacion:"San Cristóbal, Chiapas",      bio:"Maestra tejedora que aprendió el oficio de su abuela. Bordados tradicionales con hilos naturales de la región.",    cel:"5215559876543", email:"maria@artesanos.com", avatar:"https://i.pravatar.cc/150?img=47", calificacion:4.8, ventas:89,  anios:15, activo:true },
    { id:"elena-rosa",  nombre:"Elena Rosa",   especialidad:"Palma y Madera", ubicacion:"Ciudad Victoria, Tamaulipas", bio:"Artesana especializada en palma tejida, tradición única de la Huasteca. Piezas funcionales con identidad regional.", cel:"5215559876543", email:"elena@artesanos.com", avatar:"https://i.pravatar.cc/150?img=32", calificacion:4.7, ventas:56,  anios:10, activo:true }
];

const _productosSeed = [
    { id:1, nombre:"Taza para café",    cat:"ceramica", precio:"$200 MXN",   precioNum:200,  stockInicial:12, vendedorId:"juan-perez",  vendedor:"Juan Pérez",  cel:"5215551234567", email:"juan@artesanos.com",  img:"https://i.pinimg.com/736x/5a/8f/fa/5a8ffa5587ad2594ae05cc9ed3e9c937.jpg",  galeria:[], caracteristicas:["Material: Barro rojo","Técnica: Torno","Capacidad: 350ml","Alto: 10cm"], descripcion:"Taza artesanal torneada a mano con barro rojo de Jalisco. Esmaltada con técnica de goteo natural, cada pieza es única.", visible:true },
    { id:2, nombre:"Cuera tamaulipeca", cat:"textiles", precio:"$8,550 MXN", precioNum:8550, stockInicial:3,  vendedorId:"maria-lopez", vendedor:"María López", cel:"5215559876543", email:"maria@artesanos.com", img:"https://i.pinimg.com/736x/99/d2/51/99d2512ef7bc72425c1d4ee5fe0d1be6.jpg", galeria:[], caracteristicas:["Material: Lana natural","Bordado: A mano","Tallas: S, M, L","Tiempo de elaboración: 3 semanas"], descripcion:"Cuera bordada a mano con motivos florales. Confeccionada en lana natural teñida con plantas locales.", visible:true },
    { id:6, nombre:"Sillones de palma", cat:"textiles", precio:"$1,800 MXN", precioNum:1800, stockInicial:0,  vendedorId:"elena-rosa",  vendedor:"Elena Rosa",  cel:"5215559876543", email:"elena@artesanos.com", img:"https://i.pinimg.com/736x/07/1c/c5/071cc546377cedd10990247299180d47.jpg",  galeria:[], caracteristicas:["Material: Palma real","Peso: 2.5kg","Medidas: 60x60cm","Resistencia: Exterior"], descripcion:"Sillones tejidos a mano con palma real de la Huasteca. Resistentes, frescos, 100% tamaulipeco.", visible:true }
];

const _categoriasSeed = [
    { id:"ceramica", label:"Cerámica",   icon:"bi-cup-hot"  },
    { id:"textiles", label:"Textiles",   icon:"bi-scissors" },
    { id:"madera",   label:"Madera",     icon:"bi-tree"     },
    { id:"joyeria",  label:"Joyería",    icon:"bi-stars"    },
    { id:"palma",    label:"Palma",      icon:"bi-flower1"  }
];

const _configSeed = {
    bannerTitulo:    "Artesanías Hechas a Mano con Tradición y Pasión",
    bannerSubtitulo: "Descubre la riqueza cultural de Tamaulipas a través de piezas únicas, creadas con dedicación por maestros artesanos locales.",
    bannerImg:       "https://www.tamaulipas.gob.mx/wp-content/uploads/2025/06/STU-088-2025.-Muestra-Tamaulipas-su-belleza-artesanal-en-foros-nacionales-en-internacionales-2.jpeg",
    anuncio:         "",
    anuncioActivo:   false
};

/* Usuarios semilla — passwords en claro (legacy, se migran al primer arranque) */
const _usuariosSeed = [
    { email:'admin@adminat.com',   password:'admin2026',   nombre:'Administrador', rol:'admin',    vendedorId:null,          activo:true },
    { email:'juan@artesanos.com',  password:'artesano123', nombre:'Juan Pérez',    rol:'vendedor', vendedorId:'juan-perez',  activo:true },
    { email:'maria@artesanos.com', password:'textiles123', nombre:'María López',   rol:'vendedor', vendedorId:'maria-lopez', activo:true },
    { email:'elena@artesanos.com', password:'palma2024',   nombre:'Elena Rosa',    rol:'vendedor', vendedorId:'elena-rosa',  activo:true }
];

/* ── KEYS ──────────────────────────────────────────────────── */
const K = {
    artesanos  : 'at_artesanos',
    productos  : 'at_productos',
    categorias : 'at_categorias',
    stock      : 'at_stock',
    mensajes   : 'at_mensajes',
    config     : 'at_config',
    usuarios   : 'at_usuarios',
    solicitudes: 'at_solicitudes'
};

/* ── HELPERS GENÉRICOS ─────────────────────────────────────── */
function _load(key, seed) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : JSON.parse(JSON.stringify(seed)); }
    catch { return JSON.parse(JSON.stringify(seed)); }
}
function _save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
    /* Sincronizar entre pestañas del mismo navegador */
    try { new BroadcastChannel('at_sync').postMessage({ key }); } catch(_) {}
}

/* ── MIGRACIÓN AL PRIMER ARRANQUE ─────────────────────────── */
/* Normaliza dominios legacy, hashea contraseñas en claro,     */
/* crea admin por defecto si no existe.                         */
(function _bootstrap() {
    /* 1. Usuarios: dominio + hash de contraseñas */
    const legacyMap = {
        'juan@artesano.com':   'juan@artesanos.com',
        'maria@textiles.com':  'maria@artesanos.com',
        'elena@hilos.com':     'elena@artesanos.com',
        'admin@artetam.com':   'admin@adminat.com',
        'juan@artetam.com':    'juan@artesanos.com',
        'maria@artetam.com':   'maria@artesanos.com',
        'elena@artetam.com':   'elena@artesanos.com'
    };
    let users = _load(K.usuarios, _usuariosSeed);
    let uChg = false;
    users.forEach(u => {
        if (legacyMap[u.email]) { u.email = legacyMap[u.email]; uChg = true; }
        /* Hash passwords that are still in plain text */
        if (u.password && !u.password.startsWith('fnv:')) {
            u.password = _hashPwd(u.password); uChg = true;
        }
    });
    /* Ensure admin@adminat.com exists */
    if (!users.find(u => u.email === 'admin@adminat.com')) {
        users.unshift({ email:'admin@adminat.com', password:_hashPwd('admin2026'), nombre:'Administrador', rol:'admin', vendedorId:null, activo:true });
        uChg = true;
    }
    if (uChg) _save(K.usuarios, users);

    /* 2. Artesanos: dominio */
    let arts = _load(K.artesanos, _artesanosSeed);
    let aChg = false;
    arts.forEach(a => {
        const mapped = legacyMap[a.email];
        if (mapped) { a.email = mapped; aChg = true; }
    });
    if (aChg) _save(K.artesanos, arts);

    /* 3. Productos: dominio + normalizar precios */
    let prods = _load(K.productos, _productosSeed);
    let pChg = false;
    prods.forEach(p => {
        const mapped = legacyMap[p.email];
        if (mapped) { p.email = mapped; pChg = true; }
        /* Normalizar formato de precio si no está estandarizado */
        const formatted = formatPrecio(p.precio);
        if (formatted && formatted !== p.precio) { p.precio = formatted; pChg = true; }
    });
    if (pChg) _save(K.productos, prods);
})();

/* ── DOMINIO DE CORREO ─────────────────────────────────────── */
/**
 * Genera el email de un vendedor a partir del username.
 * Siempre usará DOMAIN_VENDOR (@artesanos.com).
 */
function vendorEmail(username) {
    const clean = username.toLowerCase().trim().replace(/\s+/g, '.').replace(/[^a-z0-9._-]/g, '');
    return clean + DOMAIN_VENDOR;
}
/** Genera email de admin */
function adminEmail(username) {
    const clean = username.toLowerCase().trim().replace(/\s+/g, '.').replace(/[^a-z0-9._-]/g, '');
    return clean + DOMAIN_ADMIN;
}

/* ── ARTESANOS ─────────────────────────────────────────────── */
function getArtesanos()           { return _load(K.artesanos, _artesanosSeed); }
function saveArtesanos(list)      { _save(K.artesanos, list); }
function getArtesano(id)          { return getArtesanos().find(a => a.id === id) || null; }
function updateArtesano(id, data) {
    const list = getArtesanos(), i = list.findIndex(a => a.id === id);
    if (i !== -1) { list[i] = { ...list[i], ...data }; saveArtesanos(list); return list[i]; }
    return null;
}

/* ── PRODUCTOS ─────────────────────────────────────────────── */
function getProductos()      { return _load(K.productos, _productosSeed); }
function saveProductos(list) { _save(K.productos, list); }
function getProducto(id)     { return getProductos().find(p => p.id === id) || null; }
function addProducto(data) {
    const list = getProductos();
    const precio = formatPrecio(data.precio || data.precioNum || 0);
    const nuevo = { id:Date.now(), visible:true, stockInicial:0, galeria:[], caracteristicas:[], ...data, precio };
    list.push(nuevo); saveProductos(list); return nuevo;
}
function updateProducto(id, data) {
    const list = getProductos(), i = list.findIndex(p => p.id === id);
    if (i !== -1) {
        if (data.precio) data.precio = formatPrecio(data.precio);
        list[i] = { ...list[i], ...data }; saveProductos(list); return list[i];
    }
    return null;
}
function deleteProducto(id) {
    saveProductos(getProductos().filter(p => p.id !== id));
    const map = getStockMap(); delete map[id]; _save(K.stock, map);
}

/* ── STOCK ─────────────────────────────────────────────────── */
function getStockMap() { return _load(K.stock, {}); }
function getStock(prodId) {
    const map = getStockMap(), prod = getProducto(prodId);
    if (!prod) return 0;
    return (prodId in map) ? map[prodId] : prod.stockInicial;
}
function setStock(prodId, cantidad) {
    const map = getStockMap(); map[prodId] = Math.max(0, parseInt(cantidad)||0); _save(K.stock, map);
}
function enStock(prodId) { return getStock(prodId) > 0; }

/* ── CATEGORÍAS ────────────────────────────────────────────── */
function getCategorias()      { return _load(K.categorias, _categoriasSeed); }
function saveCategorias(list) { _save(K.categorias, list); }
function addCategoria(data) {
    const list = getCategorias();
    const id = data.label.toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'');
    if (list.find(c => c.id === id)) return null;
    const nueva = { id, label:data.label, icon:data.icon||'bi-tag' };
    list.push(nueva); saveCategorias(list); return nueva;
}
function updateCategoria(id, data) {
    const list = getCategorias(), i = list.findIndex(c => c.id === id);
    if (i !== -1) { list[i] = { ...list[i], ...data }; saveCategorias(list); return list[i]; }
    return null;
}
function deleteCategoria(id) { saveCategorias(getCategorias().filter(c => c.id !== id)); }

/* ── MENSAJES ──────────────────────────────────────────────── */
function getMensajes()       { return _load(K.mensajes, []); }
function saveMensajes(list)  { _save(K.mensajes, list); }
function addMensaje(data) {
    const list = getMensajes();
    const msg = { id:Date.now(), fecha:new Date().toISOString(), leido:false, ...data };
    list.unshift(msg); saveMensajes(list); return msg;
}
function marcarMensajeLeido(id) {
    const list = getMensajes(), i = list.findIndex(m => m.id === id);
    if (i !== -1) { list[i].leido = true; saveMensajes(list); }
}
function deleteMensaje(id) { saveMensajes(getMensajes().filter(m => m.id !== id)); }

/* ── SOLICITUDES ───────────────────────────────────────────── */
function getSolicitudes()      { return _load(K.solicitudes, []); }
function saveSolicitudes(list) { _save(K.solicitudes, list); }
function addSolicitud(data) {
    const list = getSolicitudes();
    const s = { id:Date.now(), fecha:new Date().toISOString(), estado:'pendiente', ...data };
    list.unshift(s); saveSolicitudes(list); return s;
}
function updateSolicitud(id, data) {
    const list = getSolicitudes(), i = list.findIndex(s => s.id === id);
    if (i !== -1) { list[i] = { ...list[i], ...data }; saveSolicitudes(list); }
}

/* ── CONFIGURACIÓN GLOBAL ──────────────────────────────────── */
function getConfig()      { return _load(K.config, _configSeed); }
function saveConfig(data) { _save(K.config, { ...getConfig(), ...data }); }

/* ── USUARIOS ──────────────────────────────────────────────── */
const USUARIOS = _usuariosSeed; /* alias legacy */
function getUsuarios()       { return _load(K.usuarios, _usuariosSeed); }
function saveUsuarios(list)  { _save(K.usuarios, list); }

/**
 * Autentica un usuario.
 * Retorna el objeto user, o { __suspended:true } si la cuenta existe pero está suspendida.
 * Retorna null si las credenciales no coinciden.
 */
function loginUser(email, password) {
    const u = getUsuarios().find(u => u.email === email && _checkPwd(password, u.password));
    if (!u) return null;
    if (u.activo === false) return { __suspended:true, nombre:u.nombre };
    return u;
}

/**
 * Crea un nuevo usuario vendedor.
 * El email se genera automáticamente: username@artesanos.com
 * La contraseña se hashea.
 * Crea también el perfil de artesano si se provee vendedorId.
 * Retorna { ok, email, error? }
 */
function createVendorUser({ username, password, nombre, vendedorId, cel, especialidad, ubicacion, bio, activo=true }) {
    const email = vendorEmail(username);
    const list  = getUsuarios();
    if (list.find(u => u.email === email)) return { ok:false, error:`Ya existe una cuenta con el correo ${email}` };
    const vid = vendedorId || username.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
    list.push({ email, password:_hashPwd(password), nombre, rol:'vendedor', vendedorId:vid, activo });
    saveUsuarios(list);
    /* Crear artesano si no existe */
    const arts = getArtesanos();
    if (!arts.find(a => a.id === vid)) {
        const celNorm = cel ? waNumber(cel) : '';
        arts.push({ id:vid, nombre, especialidad:especialidad||'Artesanías', ubicacion:ubicacion||'México', bio:bio||'', cel:celNorm, email, avatar:'', calificacion:5.0, ventas:0, anios:0, activo:true });
        saveArtesanos(arts);
    }
    return { ok:true, email };
}

/* ── SESIÓN ────────────────────────────────────────────────── */
function getSession()   { try { return JSON.parse(sessionStorage.getItem('artetam_session')||'null'); } catch { return null; } }
function setSession(u)  { sessionStorage.setItem('artetam_session', JSON.stringify(u)); }
function clearSession() { sessionStorage.removeItem('artetam_session'); }

/**
 * Verifica si la sesión sigue siendo válida (cuenta no suspendida).
 * Si fue suspendida, limpia la sesión y devuelve false.
 */
function validateSession() {
    const sess = getSession();
    if (!sess) return false;
    const u = getUsuarios().find(u => u.email === sess.email);
    if (u && u.activo === false) { clearSession(); return false; }
    return !!u;
}

/* ── WHATSAPP ──────────────────────────────────────────────── */
/**
 * Normaliza un número de teléfono para wa.me
 * 10 dígitos → 52XXXXXXXXXX
 * 12 dígitos con 52 → tal cual
 */
function waNumber(raw) {
    const d = String(raw||'').replace(/\D/g,'');
    if (d.length === 10)  return '52' + d;
    if (d.length === 12 && d.startsWith('52'))  return d;
    if (d.length === 13 && d.startsWith('521')) return d;
    return d;
}

/* ── TEMA ──────────────────────────────────────────────────── */
function initTheme() {
    const btn=document.getElementById('theme-toggle'), icon=document.getElementById('theme-icon'), html=document.documentElement;
    if (!btn) return;
    const saved = localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
    html.setAttribute('data-theme', saved); _setIcon(icon, saved);
    btn.addEventListener('click', () => {
        const next = html.getAttribute('data-theme')==='dark'?'light':'dark';
        html.setAttribute('data-theme', next); localStorage.setItem('theme', next); _setIcon(icon, next);
    });
}
function _setIcon(el, t) { if (el) el.className = t==='dark'?'bi bi-sun-fill':'bi bi-moon-fill'; }

/* ── NAVBAR DINÁMICA ───────────────────────────────────────── */
function initNavbar() {
    const rawPage = location.pathname.split('/').pop() || 'index.html';
    const page = rawPage === '' ? 'index.html' : rawPage;
    const navLinks = [...document.querySelectorAll('.navbar-nav .nav-link')];

    /* Simple, stable active-link: compare current filename to each link's filename */
    navLinks.forEach(a => {
        a.classList.remove('active-nav');
        const href = a.getAttribute('href') || '';
        if (!href) return;
        /* Extract filename part, stripping any hash */
        const filePart = href.split('/').pop().split('#')[0] || 'index.html';
        if (filePart === page) a.classList.add('active-nav');
    });

    /* Verificar suspensión de sesión en cada carga de página */
    const sess = getSession();
    if (sess) {
        const u = getUsuarios().find(u => u.email === sess.email);
        if (u && u.activo === false) {
            clearSession();
            const protectedPages = ['seller.html','admin.html'];
            if (protectedPages.includes(page)) window.location.href = 'login.html';
            return;
        }
    }

    /* Personalizar botón de login según sesión */
    const loginBtn = document.getElementById('nav-login-btn');
    if (sess && loginBtn) {
        if (sess.rol === 'admin') {
            loginBtn.href = 'admin.html';
            loginBtn.innerHTML = `<i class="bi bi-speedometer2"></i><span>Panel Admin</span>`;
            loginBtn.classList.replace('btn-outline-custom','btn-primary-custom');
        } else {
            loginBtn.href = `seller.html?id=${sess.vendedorId}`;
            loginBtn.innerHTML = `<i class="bi bi-person-circle"></i><span>${sess.nombre.split(' ')[0]}</span>`;
            const out = document.createElement('button');
            out.className = 'btn btn-sm d-flex align-items-center gap-2';
            out.style.cssText = 'border:2px solid rgba(220,53,69,.45);color:#dc3545;background:transparent;border-radius:6px;transition:all .2s;';
            out.innerHTML = `<i class="bi bi-box-arrow-right"></i><span>Salir</span>`;
            out.addEventListener('mouseenter', () => out.style.background = 'rgba(220,53,69,.08)');
            out.addEventListener('mouseleave', () => out.style.background = 'transparent');
            out.addEventListener('click', () => { clearSession(); window.location.href = 'index.html'; });
            loginBtn.insertAdjacentElement('afterend', out);
        }
    }
}

/* ── SMOOTH SCROLL ─────────────────────────────────────────── */
function initSmoothScroll() {
    document.querySelectorAll('.nav-scroll').forEach(a => {
        a.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            e.preventDefault();
            const t = document.getElementById(href.substring(1));
            if (t) window.scrollTo({ top:t.getBoundingClientRect().top+window.pageYOffset-70, behavior:'smooth' });
            const nav = document.getElementById('navbarNav');
            if (nav && nav.classList.contains('show')) new bootstrap.Collapse(nav,{toggle:false}).hide();
        });
    });
}

/* ── HELPERS UI ────────────────────────────────────────────── */
function stockPillClass(s) { return s===0?'pill-out':s<=3?'pill-low':'pill-ok'; }
function stockPillText(s)  {
    if (s===0) return '<i class="bi bi-x-circle me-1"></i>Agotado';
    if (s<=3)  return `<i class="bi bi-fire me-1"></i>Últimas ${s}`;
    return `<i class="bi bi-check-circle me-1"></i>${s} uds.`;
}

/**
 * Formatea un precio al estándar mexicano: $1,234.00 MXN
 * Acepta número, string como "$1800 MXN", "$1,800 MXN", "1800", etc.
 */
function formatPrecio(raw) {
    if (raw === null || raw === undefined || raw === '') return '';
    /* Si ya tiene el formato deseado, devolverlo */
    if (typeof raw === 'string' && /^\$[\d,]+\.\d{2}\sMXN$/.test(raw.trim())) return raw.trim();
    /* Extraer solo los dígitos y punto decimal */
    const num = parseFloat(String(raw).replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return String(raw);
    return '$' + num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MXN';
}

/* ── DEFAULT AVATAR ────────────────────────────────────────── */
const DEFAULT_AVATAR = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzIiIGZpbGw9IiNlYWUzZDUiLz48Y2lyY2xlIGN4PSIzMiIgY3k9IjI0IiByPSIxMCIgZmlsbD0iIzliODA2YSIvPjxlbGxpcHNlIGN4PSIzMiIgY3k9IjU0IiByeD0iMTgiIHJ5PSIxNCIgZmlsbD0iIzliODA2YSIvPjwvc3ZnPg==';

document.addEventListener('DOMContentLoaded', () => { initTheme(); initNavbar(); initSmoothScroll(); });
