document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('open');
  });
});

const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.style.boxShadow = window.scrollY > 20
    ? '0 4px 32px rgba(0,0,0,0.5)'
    : 'none';
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observerOpts = { rootMargin: '-40% 0px -55% 0px' };
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, observerOpts);
sections.forEach(s => observer.observe(s));

// ─── Tabs nav ────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

// ─── Cálculo e correção ───────────────────────────────────────────────────────
function corrigirTeorParа20C(teor, temperatura) {
  if (!teor || !temperatura) return teor;
  const deltaT = temperatura - 20;
  return teor + (deltaT * 0.04);
}

function avaliarDensidade(densidade, tipo) {
  if (!densidade || !tipo) return null;
  if (tipo === 'anidro') {
    if (densidade >= 0.789 && densidade <= 0.792) return 'ok';
    if (densidade >= 0.785 && densidade < 0.789 || densidade > 0.792 && densidade <= 0.796) return 'warn';
    return 'bad';
  } else {
    if (densidade >= 0.800 && densidade <= 0.811) return 'ok';
    if (densidade >= 0.796 && densidade < 0.800 || densidade > 0.811 && densidade <= 0.820) return 'warn';
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
  if (cond <= 500) return 'ok';
  if (cond <= 650) return 'warn';
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
  if (s === 'ok') return { icon: '✅', label: 'Dentro do padrão', cls: 'ind-ok' };
  if (s === 'warn') return { icon: '⚠️', label: 'Atenção requerida', cls: 'ind-warn' };
  if (s === 'bad') return { icon: '❌', label: 'Fora do padrão', cls: 'ind-bad' };
  return { icon: '—', label: 'Não informado', cls: 'ind-na' };
}

// ─── Gráfico de barras SVG ────────────────────────────────────────────────────
function renderChart(indicadores) {
  const container = document.getElementById('chartArea');
  if (!container) return;

  // Só exibe indicadores com status definido
  const valid = indicadores.filter(i => i.status !== null);
  if (valid.length === 0) {
    container.innerHTML = '<p style="color:var(--cinza4);text-align:center;font-size:0.8rem;padding:20px 0">Nenhum parâmetro informado para gráfico.</p>';
    return;
  }

  const colorMap = { ok: '#27ae60', warn: '#f39c12', bad: '#e74c3c', null: '#444' };
  const labelMap = { ok: 'Dentro do padrão', warn: 'Atenção', bad: 'Fora do padrão' };

  // Normaliza cada parâmetro para 0–100% baseado na faixa ANP
  function normalizeValue(ind) {
    if (ind.rawValue === null || ind.rawValue === undefined || isNaN(ind.rawValue)) return 0;
    const { rawValue, min, max } = ind;
    if (max === null) return Math.min(100, Math.max(0, ((rawValue - (min || 0)) / (min || 1)) * 80 + 10));
    const range = max - (min || 0);
    if (range === 0) return 50;
    const pct = ((rawValue - (min || 0)) / range) * 100;
    return Math.min(100, Math.max(2, pct));
  }

  const W = container.clientWidth || 500;
  const barH = 32;
  const gap  = 14;
  const labelW = 160;
  const totalH = valid.length * (barH + gap) + 20;
  const chartW = W - labelW - 80;

  let svg = `<svg width="100%" height="${totalH}" viewBox="0 0 ${W} ${totalH}" xmlns="http://www.w3.org/2000/svg" font-family="Plus Jakarta Sans, sans-serif">`;

  valid.forEach((ind, i) => {
    const y = i * (barH + gap) + 10;
    const pct = normalizeValue(ind);
    const barW = Math.max(4, (pct / 100) * chartW);
    const col = colorMap[ind.status] || '#444';
    const shortName = ind.nome.split('(')[0].trim();

    // Label
    svg += `<text x="${labelW - 8}" y="${y + barH / 2 + 5}" text-anchor="end" font-size="11" fill="#888" font-weight="500">${shortName}</text>`;

    // Fundo da barra
    svg += `<rect x="${labelW}" y="${y}" width="${chartW}" height="${barH}" rx="6" fill="rgba(255,255,255,0.04)" />`;

    // Barra colorida com animação via style
    svg += `<rect class="chart-bar" x="${labelW}" y="${y}" width="${barW}" height="${barH}" rx="6" fill="${col}" opacity="0.85">
      <animate attributeName="width" from="0" to="${barW}" dur="0.8s" begin="${i * 0.1}s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1"/>
    </rect>`;

    // Valor no final da barra
    svg += `<text x="${labelW + barW + 8}" y="${y + barH / 2 + 5}" font-size="11" fill="${col}" font-weight="700">${ind.valor}</text>`;

    // Status tag
    const tagX = W - 4;
    svg += `<text x="${tagX}" y="${y + barH / 2 + 5}" text-anchor="end" font-size="10" fill="${col}" opacity="0.7">${labelMap[ind.status] || ''}</text>`;
  });

  svg += `</svg>`;
  container.innerHTML = svg;
}

// ─── Calcular ─────────────────────────────────────────────────────────────────
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
    showToast('⚠️ Selecione o tipo de etanol antes de calcular.', 'warn');
    return;
  }

  const camposPreenchidos = [densidadeVal, teorBruto, aguaVal, acidezVal, condVal, phVal]
    .filter(v => !isNaN(v)).length;

  if (camposPreenchidos < 2) {
    showToast('⚠️ Preencha ao menos 2 parâmetros para obter o diagnóstico.', 'warn');
    return;
  }

  const teorCorrigido = !isNaN(teorBruto) && !isNaN(temperaturaVal)
    ? corrigirTeorParа20C(teorBruto, temperaturaVal)
    : teorBruto;

  const statusDensidade = isNaN(densidadeVal)   ? null : avaliarDensidade(densidadeVal, tipo);
  const statusTeor      = isNaN(teorCorrigido)  ? null : avaliarTeor(teorCorrigido, tipo);
  const statusAgua      = isNaN(aguaVal)        ? null : avaliarAgua(aguaVal, tipo);
  const statusAcidez    = isNaN(acidezVal)      ? null : avaliarAcidez(acidezVal);
  const statusCond      = isNaN(condVal)        ? null : avaliarCondutividade(condVal);
  const statusPH        = isNaN(phVal)          ? null : avaliarPH(phVal);

  const todos = [statusDensidade, statusTeor, statusAgua, statusAcidez, statusCond, statusPH];
  const pontos = todos.map(pontuar).filter(p => p !== null);
  const totalPontos = pontos.reduce((a, b) => a + b, 0);
  const maxPontos   = pontos.length * 2;
  const percentual  = maxPontos > 0 ? Math.round((totalPontos / maxPontos) * 100) : 0;

  let classificacao, corFill, obsTxt;
  const temBad  = todos.some(s => s === 'bad');
  const temWarn = todos.some(s => s === 'warn');

  if (percentual >= 85 && !temBad) {
    classificacao = '🟢 APROVADO';
    corFill = 'linear-gradient(90deg, #27ae60, #2ecc71)';
    obsTxt  = '✅ <strong>Amostra aprovada.</strong> Todos os parâmetros analisados estão dentro dos padrões exigidos pela ANP/ABNT. O bioetanol está apto para comercialização e uso como combustível.';
  } else if (percentual >= 60 && !temBad) {
    classificacao = '🟡 ATENÇÃO';
    corFill = 'linear-gradient(90deg, #f39c12, #f1c40f)';
    obsTxt  = '⚠️ <strong>Amostra requer atenção.</strong> Alguns parâmetros estão próximos dos limites regulatórios. Recomenda-se nova análise laboratorial antes da comercialização.';
  } else if (percentual >= 60 && temBad) {
    classificacao = '🟠 IRREGULAR';
    corFill = 'linear-gradient(90deg, #e67e22, #f39c12)';
    obsTxt  = '⚠️ <strong>Amostra irregular.</strong> Um ou mais parâmetros estão fora dos limites máximos permitidos. Esta amostra não atende aos requisitos da Resolução ANP.';
  } else {
    classificacao = '🔴 REPROVADO';
    corFill = 'linear-gradient(90deg, #c0392b, #e74c3c)';
    obsTxt  = '❌ <strong>Amostra reprovada.</strong> Múltiplos parâmetros fora dos padrões exigidos. Este bioetanol NÃO está apto para comercialização.';
  }

  // Indicadores com dados para gráfico
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

  // Exibe resultado
  document.getElementById('placeholder').style.display = 'none';
  const content = document.getElementById('resultadoContent');
  content.style.display = 'block';

  document.getElementById('scoreBadge').textContent = percentual + '%';

  const statusLabel = document.getElementById('statusLabel');
  statusLabel.textContent = classificacao;
  statusLabel.style.color = temBad ? '#e74c3c' : (temWarn ? '#f39c12' : '#27ae60');

  const fill = document.getElementById('statusFill');
  fill.style.background = corFill;
  setTimeout(() => { fill.style.width = percentual + '%'; }, 50);

  document.getElementById('statusScore').textContent = `${totalPontos} / ${maxPontos} pts (${pontos.length} parâmetros avaliados)`;

  const grid = document.getElementById('indicadoresGrid');
  grid.innerHTML = '';
  indicadores.forEach(ind => {
    const si = statusInfo(ind.status);
    const div = document.createElement('div');
    div.className = 'indicador';
    div.innerHTML = `
      <div class="ind-nome">${si.icon} ${ind.nome}</div>
      <div class="ind-valor">${ind.valor}</div>
      <div class="ind-status ${si.cls}">${ind.status ? si.label : si.label}</div>
      <div class="ind-status ind-na" style="font-size:0.68rem">${ind.extra}</div>
    `;
    grid.appendChild(div);
  });

  if (temperaturaVal && !isNaN(teorBruto) && temperaturaVal !== 20) {
    const notaTemp = `<em>* Teor corrigido de ${teorBruto.toFixed(1)}°GL a ${temperaturaVal}°C → ${teorCorrigido.toFixed(1)}°GL a 20°C (correção INPM simplificada)</em>`;
    document.getElementById('resultadoObs').innerHTML = obsTxt + '<br><br>' + notaTemp;
  } else {
    document.getElementById('resultadoObs').innerHTML = obsTxt;
  }

  // Ativa aba de resultados e renderiza gráfico
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
  const tabResultados = document.querySelector('.tab-btn[data-tab="tab-resultados"]');
  if (tabResultados) {
    tabResultados.classList.add('active');
    document.getElementById('tab-resultados').classList.add('active');
  }

  // Renderiza o gráfico após o DOM ser atualizado
  requestAnimationFrame(() => {
    setTimeout(() => renderChart(indicadores), 80);
  });

  document.getElementById('resultado').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ─── Auxiliares ───────────────────────────────────────────────────────────────
function limparCampos() {
  ['densidade','temperatura','teor','agua','acidez','condutividade','ph'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('tipo').value = '';
  novoCalculo();
}

function novoCalculo() {
  document.getElementById('resultadoContent').style.display = 'none';
  document.getElementById('placeholder').style.display = 'flex';
  document.getElementById('statusFill').style.width = '0';
}

function exportarPDF() {
  const scoreBadge = document.getElementById('scoreBadge').textContent;
  const statusLabel = document.getElementById('statusLabel').textContent;
  const scoreText   = document.getElementById('statusScore').textContent;

  const linhas = [];
  document.querySelectorAll('.indicador').forEach(ind => {
    const nome  = ind.querySelector('.ind-nome').textContent.trim();
    const valor = ind.querySelector('.ind-valor').textContent.trim();
    const stat  = ind.querySelector('.ind-status').textContent.trim();
    linhas.push(`  ${nome}: ${valor} — ${stat}`);
  });

  const agora = new Date().toLocaleString('pt-BR');
  const tipo  = document.getElementById('tipo').value === 'anidro' ? 'Etanol Anidro' : 'Etanol Hidratado';

  const relatorio = `
BIOCALCULADORA – RELATÓRIO DE QUALIDADE DO BIOETANOL
=====================================================
Data/Hora: ${agora}
Tipo de Etanol: ${tipo}

RESULTADO GERAL
---------------
Classificação: ${statusLabel}
Pontuação: ${scoreBadge}
Detalhes: ${scoreText}

PARÂMETROS ANALISADOS
---------------------
${linhas.join('\n')}

OBSERVAÇÕES
-----------
${document.getElementById('resultadoObs').innerText}

=====================================================
Este relatório foi gerado automaticamente pela
BioCalculadora – plataforma gratuita de análise
de qualidade para o bioetanol combustível.
Resultados são orientativos. Análise laboratorial
certificada é obrigatória para fins regulatórios.
  `.trim();

  const blob = new Blob([relatorio], { type: 'text/plain;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `BioCalculadora_Relatorio_${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📄 Relatório exportado com sucesso!', 'ok');
}

function showToast(msg, type = 'ok') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 32px; right: 32px;
    background: ${type === 'ok' ? '#1a4a0a' : '#4a2a0a'};
    border: 1px solid ${type === 'ok' ? '#27ae60' : '#f39c12'};
    color: ${type === 'ok' ? '#2ecc71' : '#f39c12'};
    padding: 14px 22px;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    animation: fadeUp 0.3s ease;
    max-width: 340px;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

['densidade','temperatura','teor','agua','acidez','condutividade','ph'].forEach(id => {
  document.getElementById(id).addEventListener('input', function() {
    const val = parseFloat(this.value);
    if (!isNaN(val) && this.value !== '') {
      this.style.borderColor = '#7dc420';
    } else {
      this.style.borderColor = '';
    }
  });
});

// ─── Cookie Consent ───────────────────────────────────────────────────────────
function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((acc, part) => {
    const [k, v] = part.split('=');
    return k === name ? decodeURIComponent(v) : acc;
  }, null);
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
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
  banner.addEventListener('transitionend', () => {
    banner.style.display = 'none';
  }, { once: true });
  showToast(
    choice === 'aceitar'
      ? '✅ Cookies aceitos e registrados!'
      : '🚫 Cookies rejeitados. Apenas o essencial será salvo.',
    'ok'
  );
}

(function initCookieBanner() {
  const cookieSalvo  = getCookie('biocalc_consent');
  const storageSalvo = localStorage.getItem('cookieChoice');
  if (cookieSalvo || storageSalvo) {
    const banner = document.getElementById('cookieBanner');
    if (banner) banner.style.display = 'none';
    const choice = cookieSalvo === 'accepted' || storageSalvo === 'aceitar' ? 'aceitar' : 'rejeitar';
    applyConsent(choice);
  }
})();

// ─── Conversor de Medidas ─────────────────────────────────────────────────────
const conversores = {
  temperatura: {
    label: 'Temperatura',
    icon: '🌡️',
    unidades: ['°C (Celsius)', '°F (Fahrenheit)', 'K (Kelvin)', '°R (Rankine)'],
  },
  densidade: {
    label: 'Densidade',
    icon: '⚗️',
    unidades: ['g/mL', 'kg/m³', 'lb/ft³', 'lb/gal (US)'],
  },
  concentracao: {
    label: 'Concentração / Teor',
    icon: '🔬',
    unidades: ['% v/v', '% m/m', '°GL (INPM)', 'mg/100mL'],
  },
  condutividade: {
    label: 'Condutividade',
    icon: '⚡',
    unidades: ['µS/cm', 'mS/cm', 'µS/m', 'S/m'],
  },
  pressao: {
    label: 'Pressão',
    icon: '🔧',
    unidades: ['kPa', 'bar', 'atm', 'psi', 'mmHg'],
  }
};

// Funções de conversão centrais (tudo para a unidade base da grandeza)
const toBase = {
  temperatura: {
    '°C (Celsius)':    v => v,
    '°F (Fahrenheit)': v => (v - 32) * 5/9,
    'K (Kelvin)':      v => v - 273.15,
    '°R (Rankine)':    v => (v - 491.67) * 5/9,
  },
  densidade: {
    'g/mL':        v => v,
    'kg/m³':       v => v / 1000,
    'lb/ft³':      v => v * 0.016018,
    'lb/gal (US)': v => v * 0.11983,
  },
  concentracao: {
    '% v/v':    v => v,
    '% m/m':    v => v * 0.789, // aprox. para etanol
    '°GL (INPM)': v => v,       // °GL ≈ % v/v para etanol
    'mg/100mL': v => v / 789,   // aprox. mg → % v/v
  },
  condutividade: {
    'µS/cm': v => v,
    'mS/cm': v => v * 1000,
    'µS/m':  v => v / 100,
    'S/m':   v => v * 10000,
  },
  pressao: {
    'kPa':   v => v,
    'bar':   v => v * 100,
    'atm':   v => v * 101.325,
    'psi':   v => v * 6.89476,
    'mmHg':  v => v * 0.133322,
  }
};

const fromBase = {
  temperatura: {
    '°C (Celsius)':    v => v,
    '°F (Fahrenheit)': v => v * 9/5 + 32,
    'K (Kelvin)':      v => v + 273.15,
    '°R (Rankine)':    v => (v + 273.15) * 9/5,
  },
  densidade: {
    'g/mL':        v => v,
    'kg/m³':       v => v * 1000,
    'lb/ft³':      v => v / 0.016018,
    'lb/gal (US)': v => v / 0.11983,
  },
  concentracao: {
    '% v/v':    v => v,
    '% m/m':    v => v / 0.789,
    '°GL (INPM)': v => v,
    'mg/100mL': v => v * 789,
  },
  condutividade: {
    'µS/cm': v => v,
    'mS/cm': v => v / 1000,
    'µS/m':  v => v * 100,
    'S/m':   v => v / 10000,
  },
  pressao: {
    'kPa':   v => v,
    'bar':   v => v / 100,
    'atm':   v => v / 101.325,
    'psi':   v => v / 6.89476,
    'mmHg':  v => v / 0.133322,
  }
};

function buildConversor() {
  const container = document.getElementById('conversorContent');
  if (!container) return;
  let html = '';

  Object.entries(conversores).forEach(([key, cat]) => {
    const units = cat.unidades;
    const opts  = units.map((u, i) => `<option value="${u}">${u}</option>`).join('');

    html += `
      <div class="conv-card" id="conv-${key}">
        <div class="conv-card-header">
          <span class="conv-icon">${cat.icon}</span>
          <span class="conv-title">${cat.label}</span>
        </div>
        <div class="conv-row">
          <div class="conv-field">
            <label>De</label>
            <input type="number" class="conv-input" id="conv-input-${key}" placeholder="Digite o valor..." step="any"
              oninput="converter('${key}')" />
            <select class="conv-select" id="conv-from-${key}" onchange="converter('${key}')">
              ${opts}
            </select>
          </div>
          <div class="conv-arrow">→</div>
          <div class="conv-field">
            <label>Para</label>
            <div class="conv-result-wrap">
              <span class="conv-result" id="conv-result-${key}">—</span>
              <span class="conv-result-unit" id="conv-result-unit-${key}"></span>
            </div>
            <select class="conv-select" id="conv-to-${key}" onchange="converter('${key}')">
              ${units.map((u,i) => `<option value="${u}" ${i===1?'selected':''}>${u}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="conv-hint" id="conv-hint-${key}"></div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function converter(key) {
  const inputEl  = document.getElementById(`conv-input-${key}`);
  const fromEl   = document.getElementById(`conv-from-${key}`);
  const toEl     = document.getElementById(`conv-to-${key}`);
  const resultEl = document.getElementById(`conv-result-${key}`);
  const unitEl   = document.getElementById(`conv-result-unit-${key}`);
  const hintEl   = document.getElementById(`conv-hint-${key}`);

  const val  = parseFloat(inputEl.value);
  const from = fromEl.value;
  const to   = toEl.value;

  unitEl.textContent = to;

  if (isNaN(val)) {
    resultEl.textContent = '—';
    hintEl.textContent   = '';
    return;
  }

  if (from === to) {
    resultEl.textContent = val.toFixed(4);
    hintEl.textContent   = 'Mesma unidade — nenhuma conversão necessária.';
    return;
  }

  try {
    const baseVal     = toBase[key][from](val);
    const convertido  = fromBase[key][to](baseVal);
    resultEl.textContent = isFinite(convertido) ? convertido.toFixed(6).replace(/\.?0+$/, '') : '—';

    // Dica contextual para temperatura (faixa ANP)
    if (key === 'temperatura' && to === '°C (Celsius)') {
      const celsius = convertido;
      if (celsius < 15 || celsius > 30) {
        hintEl.textContent = `⚠️ ${celsius.toFixed(2)}°C está fora da faixa comum de análise (15–30°C). Referência ANP: 20°C.`;
        hintEl.style.color = '#f39c12';
      } else {
        hintEl.textContent = `✅ ${celsius.toFixed(2)}°C está dentro da faixa de análise laboratorial. Referência ANP: 20°C.`;
        hintEl.style.color = '#27ae60';
      }
    } else {
      hintEl.textContent = '';
    }
  } catch(e) {
    resultEl.textContent = 'Erro';
  }
}

// Inicializa conversor ao carregar
document.addEventListener('DOMContentLoaded', () => {
  buildConversor();
});
