document.getElementById('hamburger').addEventListener('click', function() {
  const menu = document.getElementById('mobileMenu');
  const open = menu.classList.toggle('open');
  this.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.mobile-menu a').forEach(function(link) {
  link.addEventListener('click', function() {
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
  });
});

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', function() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function(l) { l.classList.remove('active'); });
      const active = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(function(s) { sectionObserver.observe(s); });

document.querySelectorAll('.tab-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
    document.querySelectorAll('.tab-pane').forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

function corrigirTeorParа20C(teor, temperatura) {
  if (!teor || !temperatura) return teor;
  return teor + (temperatura - 20) * 0.04;
}

function avaliarDensidade(densidade, tipo) {
  if (!densidade || !tipo) return null;
  if (tipo === 'anidro') {
    if (densidade >= 0.789 && densidade <= 0.792) return 'ok';
    if ((densidade >= 0.785 && densidade < 0.789) || (densidade > 0.792 && densidade <= 0.796)) return 'warn';
    return 'bad';
  } else {
    if (densidade >= 0.800 && densidade <= 0.811) return 'ok';
    if ((densidade >= 0.796 && densidade < 0.800) || (densidade > 0.811 && densidade <= 0.820)) return 'warn';
    return 'bad';
  }
}

function avaliarTeor(teor, tipo) {
  if (!teor || !tipo) return null;
  if (tipo === 'anidro') {
    if (teor >= 99.3) return 'ok';
    if (teor >= 98.0) return 'warn';
    return 'bad';
  } else {
    if (teor >= 92.6) return 'ok';
    if (teor >= 90.0) return 'warn';
    return 'bad';
  }
}

function avaliarAgua(agua, tipo) {
  if (agua === '' || agua === null || agua === undefined) return null;
  const limite = tipo === 'anidro' ? 0.7 : 7.4;
  if (agua <= limite) return 'ok';
  if (agua <= limite * 1.2) return 'warn';
  return 'bad';
}

function avaliarAcidez(acidez) {
  if (acidez === '' || acidez === null || acidez === undefined) return null;
  if (acidez <= 30) return 'ok';
  if (acidez <= 45) return 'warn';
  return 'bad';
}

function avaliarCondutividade(cond) {
  if (cond === '' || cond === null || cond === undefined) return null;
  if (cond <= 350) return 'ok';
  if (cond <= 500) return 'warn';
  return 'bad';
}

function avaliarPH(ph) {
  if (ph === '' || ph === null || ph === undefined) return null;
  if (ph >= 6.0 && ph <= 8.0) return 'ok';
  if ((ph >= 5.5 && ph < 6.0) || (ph > 8.0 && ph <= 8.5)) return 'warn';
  return 'bad';
}

function pontuar(status) {
  if (status === 'ok') return 2;
  if (status === 'warn') return 1;
  if (status === 'bad') return 0;
  return null;
}

function statusInfo(s) {
  if (s === 'ok')   return { label: 'Dentro do padrão', cls: 'ind-ok' };
  if (s === 'warn') return { label: 'Atenção requerida', cls: 'ind-warn' };
  if (s === 'bad')  return { label: 'Fora do padrão',   cls: 'ind-bad' };
  return { label: 'Não informado', cls: 'ind-na' };
}

function renderChart(indicadores) {
  const container = document.getElementById('chartArea');
  if (!container) return;

  const valid = indicadores.filter(function(i) { return i.status !== null; });
  if (!valid.length) {
    container.innerHTML = '<p style="color:rgba(255,255,255,0.2);text-align:center;font-size:0.78rem;padding:24px 0">Nenhum parâmetro informado para o gráfico.</p>';
    return;
  }

  const colorMap = { ok: '#5DB85E', warn: '#D4962E', bad: '#C94040' };

  const counts = { ok: 0, warn: 0, bad: 0 };
  valid.forEach(function(ind) { if (counts[ind.status] !== undefined) counts[ind.status]++; });

  const total = valid.length;
  const slices = [
    { key: 'ok',   count: counts.ok,   color: '#5DB85E', label: 'Dentro do padrão' },
    { key: 'warn', count: counts.warn, color: '#D4962E', label: 'Atenção' },
    { key: 'bad',  count: counts.bad,  color: '#C94040', label: 'Fora do padrão' },
  ].filter(function(s) { return s.count > 0; });

  const W   = container.clientWidth || 480;
  const H   = 220;
  const cx  = Math.min(W * 0.38, 110);
  const cy  = H / 2;
  const R   = Math.min(cy - 16, cx - 16, 88);
  const ri  = R * 0.52;

  function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(cx, cy, R, ri, startAngle, endAngle) {
    const s1 = polarToCartesian(cx, cy, R, startAngle);
    const e1 = polarToCartesian(cx, cy, R, endAngle);
    const s2 = polarToCartesian(cx, cy, ri, endAngle);
    const e2 = polarToCartesian(cx, cy, ri, startAngle);
    const large = (endAngle - startAngle) > 180 ? 1 : 0;
    return [
      'M', s1.x, s1.y,
      'A', R, R, 0, large, 1, e1.x, e1.y,
      'L', s2.x, s2.y,
      'A', ri, ri, 0, large, 0, e2.x, e2.y,
      'Z'
    ].join(' ');
  }

  let svg = '<svg width="100%" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif">';

  svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="rgba(255,255,255,0.03)"/>';

  let currentAngle = 0;

  slices.forEach(function(slice, idx) {
    const sweep     = (slice.count / total) * 360;
    const endAngle  = currentAngle + sweep;
    const midAngle  = currentAngle + sweep / 2;
    const path      = describeArc(cx, cy, R, ri, currentAngle, endAngle);
    const delay     = idx * 0.12;

    svg += '<path d="' + path + '" fill="' + slice.color + '" opacity="0.85" style="transform-origin:' + cx + 'px ' + cy + 'px">';
    svg += '<animate attributeName="opacity" from="0" to="0.85" dur="0.5s" begin="' + delay + 's" fill="freeze"/>';
    svg += '</path>';

    if (sweep > 22) {
      const labelR  = (R + ri) / 2;
      const labelPt = polarToCartesian(cx, cy, labelR, midAngle);
      svg += '<text x="' + labelPt.x + '" y="' + (labelPt.y + 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" opacity="0.9">' + slice.count + '</text>';
    }

    currentAngle = endAngle;
  });

  svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (ri - 2) + '" fill="rgba(5,15,6,0.85)"/>';
  svg += '<text x="' + cx + '" y="' + (cy - 6) + '" text-anchor="middle" font-size="22" font-weight="700" fill="#fff">' + total + '</text>';
  svg += '<text x="' + cx + '" y="' + (cy + 12) + '" text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.35)" letter-spacing="0.1em">PARAMS</text>';

  const legendX  = cx * 2 + 20;
  const legendGap = 36;
  const legendTop = cy - ((slices.length - 1) * legendGap) / 2;

  slices.forEach(function(slice, idx) {
    const lx = legendX;
    const ly = legendTop + idx * legendGap;
    const pct = Math.round((slice.count / total) * 100);

    svg += '<rect x="' + lx + '" y="' + (ly - 7) + '" width="10" height="10" rx="2" fill="' + slice.color + '" opacity="0.85"/>';
    svg += '<text x="' + (lx + 16) + '" y="' + ly + '" font-size="11" fill="rgba(255,255,255,0.55)" font-weight="500">' + slice.label + '</text>';
    svg += '<text x="' + (lx + 16) + '" y="' + (ly + 14) + '" font-size="10" fill="' + slice.color + '" font-weight="700">' + slice.count + ' parâmetro' + (slice.count > 1 ? 's' : '') + ' · ' + pct + '%</text>';
  });

  const detailX  = legendX;
  const detailTop = legendTop + slices.length * legendGap + 12;

  valid.forEach(function(ind, idx) {
    const col  = colorMap[ind.status] || '#555';
    const name = ind.nome.split('(')[0].trim();
    const dy   = detailTop + idx * 18;
    if (dy > H - 8) return;
    svg += '<text x="' + detailX + '" y="' + dy + '" font-size="9.5" fill="rgba(255,255,255,0.25)">' + name + ': <tspan fill="' + col + '" font-weight="600">' + ind.valor + '</tspan></text>';
  });

  svg += '</svg>';
  container.innerHTML = svg;
}

function calcular() {
  const densidadeVal   = parseFloat(document.getElementById('densidade').value);
  const temperaturaVal = parseFloat(document.getElementById('temperatura').value);
  const teorBruto      = parseFloat(document.getElementById('teor').value);
  const aguaVal        = parseFloat(document.getElementById('agua').value);
  const acidezVal      = parseFloat(document.getElementById('acidez').value);
  const condVal        = parseFloat(document.getElementById('condutividade').value);
  const phVal          = parseFloat(document.getElementById('ph').value);
  const tipo           = document.getElementById('tipo').value;

  if (!tipo) {
    showToast('Selecione o tipo de etanol antes de calcular.', 'warn');
    return;
  }

  const preenchidos = [densidadeVal, teorBruto, aguaVal, acidezVal, condVal, phVal].filter(function(v) { return !isNaN(v); }).length;
  if (preenchidos < 2) {
    showToast('Preencha ao menos 2 parâmetros para obter o diagnóstico.', 'warn');
    return;
  }

  const teorCorrigido = (!isNaN(teorBruto) && !isNaN(temperaturaVal))
    ? corrigirTeorParа20C(teorBruto, temperaturaVal)
    : teorBruto;

  const statusDensidade = isNaN(densidadeVal)  ? null : avaliarDensidade(densidadeVal, tipo);
  const statusTeor      = isNaN(teorCorrigido) ? null : avaliarTeor(teorCorrigido, tipo);
  const statusAgua      = isNaN(aguaVal)       ? null : avaliarAgua(aguaVal, tipo);
  const statusAcidez    = isNaN(acidezVal)     ? null : avaliarAcidez(acidezVal);
  const statusCond      = isNaN(condVal)       ? null : avaliarCondutividade(condVal);
  const statusPH        = isNaN(phVal)         ? null : avaliarPH(phVal);

  const todos    = [statusDensidade, statusTeor, statusAgua, statusAcidez, statusCond, statusPH];
  const pontos   = todos.map(pontuar).filter(function(p) { return p !== null; });
  const total    = pontos.reduce(function(a, b) { return a + b; }, 0);
  const maxPts   = pontos.length * 2;
  const pct      = maxPts > 0 ? Math.round((total / maxPts) * 100) : 0;
  const temBad   = todos.some(function(s) { return s === 'bad'; });
  const temWarn  = todos.some(function(s) { return s === 'warn'; });

  let classificacao, corFill, obsTxt;

  if (pct >= 85 && !temBad) {
    classificacao = 'APROVADO';
    corFill = 'linear-gradient(90deg, #1A6B1B, #4FA850)';
    obsTxt  = '<strong>Amostra aprovada.</strong> Todos os parâmetros analisados estão dentro dos padrões exigidos pela ANP/ABNT. O bioetanol está apto para comercialização e uso como combustível.';
  } else if (pct >= 60 && !temBad) {
    classificacao = 'ATENÇÃO';
    corFill = 'linear-gradient(90deg, #7A5000, #D4962E)';
    obsTxt  = '<strong>Amostra requer atenção.</strong> Alguns parâmetros estão próximos dos limites regulatórios. Recomenda-se nova análise laboratorial antes da comercialização.';
  } else if (pct >= 60 && temBad) {
    classificacao = 'IRREGULAR';
    corFill = 'linear-gradient(90deg, #8C3800, #D4962E)';
    obsTxt  = '<strong>Amostra irregular.</strong> Um ou mais parâmetros estão fora dos limites máximos permitidos. Esta amostra não atende aos requisitos da Resolução ANP.';
  } else {
    classificacao = 'REPROVADO';
    corFill = 'linear-gradient(90deg, #8C1A10, #C94040)';
    obsTxt  = '<strong>Amostra reprovada.</strong> Múltiplos parâmetros fora dos padrões exigidos. Este bioetanol NÃO está apto para comercialização.';
  }

  const indicadores = [
    {
      nome: 'Densidade (g/mL)',
      valor: isNaN(densidadeVal) ? '—' : densidadeVal.toFixed(4),
      rawValue: isNaN(densidadeVal) ? null : densidadeVal,
      min: tipo === 'anidro' ? 0.789 : 0.800,
      max: tipo === 'anidro' ? 0.792 : 0.811,
      status: statusDensidade,
      extra: tipo === 'anidro' ? 'Ref: 0.789–0.792' : 'Ref: 0.800–0.811'
    },
    {
      nome: 'Teor Alcoólico (°GL)',
      valor: isNaN(teorCorrigido) ? '—' : teorCorrigido.toFixed(1) + (temperaturaVal && teorBruto ? ' *' : ''),
      rawValue: isNaN(teorCorrigido) ? null : teorCorrigido,
      min: tipo === 'anidro' ? 99.3 : 92.6,
      max: 100,
      status: statusTeor,
      extra: tipo === 'anidro' ? 'Mín: 99.3°GL' : 'Mín: 92.6°GL'
    },
    {
      nome: 'Teor de Água (%)',
      valor: isNaN(aguaVal) ? '—' : aguaVal.toFixed(2) + '%',
      rawValue: isNaN(aguaVal) ? null : aguaVal,
      min: 0,
      max: tipo === 'anidro' ? 0.7 : 7.4,
      status: statusAgua,
      extra: tipo === 'anidro' ? 'Máx: 0.7%' : 'Máx: 7.4%'
    },
    {
      nome: 'Acidez (mg/100mL)',
      valor: isNaN(acidezVal) ? '—' : acidezVal.toFixed(0),
      rawValue: isNaN(acidezVal) ? null : acidezVal,
      min: 0,
      max: 30,
      status: statusAcidez,
      extra: 'Máx: 30 mg/100mL'
    },
    {
      nome: 'Condutividade (µS/cm)',
      valor: isNaN(condVal) ? '—' : condVal.toFixed(0),
      rawValue: isNaN(condVal) ? null : condVal,
      min: 0,
      max: 500,
      status: statusCond,
      extra: 'Máx: 500 µS/cm'
    },
    {
      nome: 'pH',
      valor: isNaN(phVal) ? '—' : phVal.toFixed(1),
      rawValue: isNaN(phVal) ? null : phVal,
      min: 6.0,
      max: 8.0,
      status: statusPH,
      extra: 'Ref: 6.0–8.0'
    }
  ];

  document.getElementById('placeholder').style.display = 'none';
  const content = document.getElementById('resultadoContent');
  content.style.display = 'block';

  document.getElementById('scoreBadge').textContent = pct + '%';

  const statusLabel = document.getElementById('statusLabel');
  statusLabel.textContent = classificacao;
  statusLabel.style.color = temBad ? '#E05A5A' : temWarn ? '#E8A93A' : '#7DC87E';

  const fill = document.getElementById('statusFill');
  fill.style.background = corFill;
  setTimeout(function() { fill.style.width = pct + '%'; }, 50);

  document.getElementById('statusScore').textContent = total + ' / ' + maxPts + ' pts (' + pontos.length + ' parâmetros avaliados)';

  const grid = document.getElementById('indicadoresGrid');
  grid.innerHTML = '';
  indicadores.forEach(function(ind) {
    const si = statusInfo(ind.status);
    const div = document.createElement('div');
    div.className = 'indicador';
    div.innerHTML =
      '<p class="ind-nome">' + ind.nome + '</p>' +
      '<p class="ind-valor">' + ind.valor + '</p>' +
      '<p class="ind-status ' + si.cls + '">' + si.label + '</p>' +
      '<p class="ind-status ind-na" style="font-size:0.6rem;margin-top:2px">' + ind.extra + '</p>';
    grid.appendChild(div);
  });

  const obsEl = document.getElementById('resultadoObs');
  if (temperaturaVal && !isNaN(teorBruto) && temperaturaVal !== 20) {
    obsEl.innerHTML = obsTxt + '<br><br><em style="font-size:0.75rem;opacity:0.7">* Teor corrigido de ' + teorBruto.toFixed(1) + '°GL a ' + temperaturaVal + '°C → ' + teorCorrigido.toFixed(1) + '°GL a 20°C (correção INPM simplificada)</em>';
  } else {
    obsEl.innerHTML = obsTxt;
  }

  document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
  document.querySelectorAll('.tab-pane').forEach(function(p) { p.classList.remove('active'); });
  const tabPrimary = document.querySelector('.tab-btn[data-tab="tab-resultados"]');
  if (tabPrimary) {
    tabPrimary.classList.add('active');
    document.getElementById('tab-resultados').classList.add('active');
  }

  requestAnimationFrame(function() {
    setTimeout(function() { renderChart(indicadores); }, 80);
  });

  document.getElementById('resultado').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function limparCampos() {
  ['densidade', 'temperatura', 'teor', 'agua', 'acidez', 'condutividade', 'ph'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) { el.value = ''; el.classList.remove('valid'); el.style.borderColor = ''; }
  });
  document.getElementById('tipo').value = '';
  novoCalculo();
}

function novoCalculo() {
  const content = document.getElementById('resultadoContent');
  const placeholder = document.getElementById('placeholder');
  if (content) content.style.display = 'none';
  if (placeholder) placeholder.style.display = 'flex';
  const fill = document.getElementById('statusFill');
  if (fill) fill.style.width = '0';
}

function exportarPDF() {
  const scoreBadge  = document.getElementById('scoreBadge').textContent;
  const statusLabel = document.getElementById('statusLabel').textContent;
  const scoreText   = document.getElementById('statusScore').textContent;
  const linhas      = [];

  document.querySelectorAll('.indicador').forEach(function(ind) {
    const nome  = ind.querySelector('.ind-nome').textContent.trim();
    const valor = ind.querySelector('.ind-valor').textContent.trim();
    const stat  = ind.querySelector('.ind-status').textContent.trim();
    linhas.push('  ' + nome + ': ' + valor + ' — ' + stat);
  });

  const agora = new Date().toLocaleString('pt-BR');
  const tipo  = document.getElementById('tipo').value === 'anidro' ? 'Etanol Anidro' : 'Etanol Hidratado';

  const relatorio = [
    'BIOCALCULADORA – RELATÓRIO DE QUALIDADE DO BIOETANOL',
    '=====================================================',
    'Data/Hora: ' + agora,
    'Tipo de Etanol: ' + tipo,
    '',
    'RESULTADO GERAL',
    '---------------',
    'Classificação: ' + statusLabel,
    'Pontuação: ' + scoreBadge,
    'Detalhes: ' + scoreText,
    '',
    'PARÂMETROS ANALISADOS',
    '---------------------',
    linhas.join('\n'),
    '',
    'OBSERVAÇÕES',
    '-----------',
    document.getElementById('resultadoObs').innerText,
    '',
    '=====================================================',
    'Este relatório foi gerado automaticamente pela',
    'BioCalculadora – plataforma gratuita de análise',
    'de qualidade para o bioetanol combustível.',
    'Resultados são orientativos. Análise laboratorial',
    'certificada é obrigatória para fins regulatórios.',
  ].join('\n').trim();

  const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'BioCalculadora_Relatorio_' + new Date().toISOString().slice(0, 10) + '.txt';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Relatório exportado com sucesso.', 'ok');
}

function showToast(msg, type) {
  const existing = document.querySelector('.bc-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'bc-toast';
  toast.textContent = msg;
  const isOk = type === 'ok';
  toast.style.cssText = [
    'position:fixed',
    'bottom:28px',
    'right:28px',
    'background:' + (isOk ? 'rgba(13,43,14,0.97)' : 'rgba(43,20,10,0.97)'),
    'border:1px solid ' + (isOk ? 'rgba(125,200,126,0.35)' : 'rgba(228,169,58,0.35)'),
    'color:' + (isOk ? '#7DC87E' : '#E8A93A'),
    'padding:14px 22px',
    'border-radius:3px',
    'font-family:Inter,sans-serif',
    'font-size:0.82rem',
    'font-weight:500',
    'z-index:99999',
    'box-shadow:0 8px 32px rgba(0,0,0,0.5)',
    'max-width:320px',
    'backdrop-filter:blur(12px)',
    'letter-spacing:0.01em',
    'animation:toastIn 0.3s ease',
  ].join(';');
  document.body.appendChild(toast);
  const style = document.createElement('style');
  style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';
  document.head.appendChild(style);
  setTimeout(function() { toast.remove(); }, 3500);
}

['densidade', 'temperatura', 'teor', 'agua', 'acidez', 'condutividade', 'ph'].forEach(function(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', function() {
    const val = parseFloat(this.value);
    if (!isNaN(val) && this.value !== '') {
      this.classList.add('valid');
      this.style.borderColor = 'rgba(79,168,80,0.5)';
    } else {
      this.classList.remove('valid');
      this.style.borderColor = '';
    }
  });
});

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Lax';
}

function getCookie(name) {
  return document.cookie.split('; ').reduce(function(acc, part) {
    const kv = part.split('=');
    return kv[0] === name ? decodeURIComponent(kv[1]) : acc;
  }, null);
}

function deleteCookie(name) {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

function applyConsent(choice) {
  if (choice === 'aceitar') {
    setCookie('biocalc_consent', 'accepted', 365);
    setCookie('biocalc_session', Date.now(), 7);
  } else {
    deleteCookie('biocalc_session');
    deleteCookie('biocalc_analytics');
    setCookie('biocalc_consent', 'rejected', 365);
    localStorage.removeItem('cookieChoice');
  }
  localStorage.setItem('cookieChoice', choice);
}

function handleCookie(choice) {
  applyConsent(choice);
  const banner = document.getElementById('cookieBanner');
  banner.classList.add('dismissed');
  banner.addEventListener('transitionend', function() {
    banner.style.display = 'none';
  }, { once: true });
  showToast(
    choice === 'aceitar'
      ? 'Cookies aceitos e registrados.'
      : 'Cookies rejeitados. Apenas o essencial será salvo.',
    'ok'
  );
}

(function initCookieBanner() {
  const cookieSalvo  = getCookie('biocalc_consent');
  const storageSalvo = localStorage.getItem('cookieChoice');
  if (cookieSalvo || storageSalvo) {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'none';
    const choice = (cookieSalvo === 'accepted' || storageSalvo === 'aceitar') ? 'aceitar' : 'rejeitar';
    applyConsent(choice);
  }
}());
