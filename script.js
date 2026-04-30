
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

function corrigirTeorParа20C(teor, temperatura) {
  if (!teor || !temperatura) return teor;
  const deltaT = temperatura - 20;
  // Coeficiente de dilatação: ~0.04°GL por °C
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


  const statusDensidade    = isNaN(densidadeVal) ? null : avaliarDensidade(densidadeVal, tipo);
  const statusTeor         = isNaN(teorCorrigido) ? null : avaliarTeor(teorCorrigido, tipo);
  const statusAgua         = isNaN(aguaVal) ? null : avaliarAgua(aguaVal, tipo);
  const statusAcidez       = isNaN(acidezVal) ? null : avaliarAcidez(acidezVal);
  const statusCond         = isNaN(condVal) ? null : avaliarCondutividade(condVal);
  const statusPH           = isNaN(phVal) ? null : avaliarPH(phVal);


  const todos = [statusDensidade, statusTeor, statusAgua, statusAcidez, statusCond, statusPH];
  const pontos = todos.map(pontuar).filter(p => p !== null);
  const totalPontos = pontos.reduce((a, b) => a + b, 0);
  const maxPontos = pontos.length * 2;
  const percentual = maxPontos > 0 ? Math.round((totalPontos / maxPontos) * 100) : 0;


  let classificacao, corFill, obsTxt;
  const temBad = todos.some(s => s === 'bad');
  const temWarn = todos.some(s => s === 'warn');

  if (percentual >= 85 && !temBad) {
    classificacao = '🟢 APROVADO';
    corFill = 'linear-gradient(90deg, #27ae60, #2ecc71)';
    obsTxt = '✅ <strong>Amostra aprovada.</strong> Todos os parâmetros analisados estão dentro dos padrões exigidos pela ANP/ABNT. O bioetanol está apto para comercialização e uso como combustível.';
  } else if (percentual >= 60 && !temBad) {
    classificacao = '🟡 ATENÇÃO';
    corFill = 'linear-gradient(90deg, #f39c12, #f1c40f)';
    obsTxt = '⚠️ <strong>Amostra requer atenção.</strong> Alguns parâmetros estão próximos dos limites regulatórios. Recomenda-se nova análise laboratorial antes da comercialização.';
  } else if (percentual >= 60 && temBad) {
    classificacao = '🟠 IRREGULAR';
    corFill = 'linear-gradient(90deg, #e67e22, #f39c12)';
    obsTxt = '⚠️ <strong>Amostra irregular.</strong> Um ou mais parâmetros estão fora dos limites máximos permitidos. Esta amostra não atende aos requisitos da Resolução ANP. Solicite análise laboratorial completa.';
  } else {
    classificacao = '🔴 REPROVADO';
    corFill = 'linear-gradient(90deg, #c0392b, #e74c3c)';
    obsTxt = '❌ <strong>Amostra reprovada.</strong> Múltiplos parâmetros fora dos padrões exigidos. Este bioetanol NÃO está apto para comercialização. Verifique o processo produtivo e realize análise laboratorial certificada.';
  }


  const indicadores = [
    {
      nome: 'Densidade (g/mL)',
      valor: isNaN(densidadeVal) ? '—' : densidadeVal.toFixed(4),
      status: statusDensidade,
      extra: tipo === 'anidro' ? 'Ref: 0.789–0.792' : 'Ref: 0.800–0.811'
    },
    {
      nome: 'Teor Alcoólico (°GL)',
      valor: isNaN(teorCorrigido) ? '—' : teorCorrigido.toFixed(1) + (temperaturaVal && teorBruto ? ' *' : ''),
      status: statusTeor,
      extra: tipo === 'anidro' ? 'Mín: 99.3°GL' : 'Mín: 92.6°GL'
    },
    {
      nome: 'Teor de Água (%)',
      valor: isNaN(aguaVal) ? '—' : aguaVal.toFixed(2) + '%',
      status: statusAgua,
      extra: tipo === 'anidro' ? 'Máx: 0.7%' : 'Máx: 7.4%'
    },
    {
      nome: 'Acidez (mg/100mL)',
      valor: isNaN(acidezVal) ? '—' : acidezVal.toFixed(0),
      status: statusAcidez,
      extra: 'Máx: 30 mg/100mL'
    },
    {
      nome: 'Condutividade (µS/cm)',
      valor: isNaN(condVal) ? '—' : condVal.toFixed(0),
      status: statusCond,
      extra: 'Máx: 500 µS/cm'
    },
    {
      nome: 'pH',
      valor: isNaN(phVal) ? '—' : phVal.toFixed(1),
      status: statusPH,
      extra: 'Ref: 6.0–8.0'
    }
  ];


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


  document.getElementById('resultado').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


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
  const tipo = document.getElementById('tipo').value === 'anidro' ? 'Etanol Anidro' : 'Etanol Hidratado';

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
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
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
    font-family: 'DM Sans', sans-serif;
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
function handleCookie(choice) {
  const banner = document.getElementById('cookieBanner');
  banner.classList.add('dismissed');
  banner.addEventListener('transitionend', () => {
    banner.style.display = 'none';
  }, { once: true });
  localStorage.setItem('cookieChoice', choice);
  showToast(choice === 'aceitar' ? '✅ Preferências salvas!' : '🚫 Cookies rejeitados.', 'ok');
}
document.querySelectorAll('.calc-inputs input, .calc-inputs select').forEach(el => {
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter') calcular();
  });
});
