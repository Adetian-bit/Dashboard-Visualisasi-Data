/* ============================================
   BORN BELOW THE FUTURE SEA
   Interactive Storytelling Engine
   ============================================ */

// ---- Sea Level Data (mm, relative to 1993 baseline) ----
const SEA_LEVEL_DATA = {
  'Fiji': { color: '#00B4D8', data: generateData(3.60, 0.1116) },
  'Tuvalu': { color: '#E63946', data: generateData(3.83, 0.1190) },
  'Samoa': { color: '#4CC9F0', data: generateData(3.79, 0.1174) },
  'Tonga': { color: '#F5F7FA', data: generateData(3.56, 0.1103) },
  'Kiribati': { color: '#F4A261', data: generateData(3.37, 0.1045) },
  'Solomon Islands': { color: '#2A9D8F', data: generateData(7.64, 0.2368) },
  'Cook Islands': { color: '#9B5DE5', data: generateData(3.64, 0.1129) },
};

function generateData(avgRate, totalRise) {
  const years = [];
  for (let y = 1993; y <= 2024; y++) {
    const t = (y - 1993) / (2024 - 1993);
    // Slight acceleration curve
    const value = totalRise * 1000 * (t * t * 0.3 + t * 0.7);
    years.push({ year: y, value: Math.round(value * 10) / 10 });
  }
  return years;
}

// ---- Island Map Data ----
const ISLAND_POSITIONS = [
  { name: 'Fiji', x: 480, y: 260, rise: 111.6, rate: 3.60 },
  { name: 'Tuvalu', x: 435, y: 185, rise: 119.0, rate: 3.83 },
  { name: 'Samoa', x: 530, y: 220, rise: 117.4, rate: 3.79 },
  { name: 'Tonga', x: 520, y: 290, rise: 110.3, rate: 3.56 },
  { name: 'Kiribati', x: 500, y: 120, rise: 104.5, rate: 3.37 },
  { name: 'Solomon Islands', x: 290, y: 210, rise: 236.8, rate: 7.64 },
  { name: 'Cook Islands', x: 630, y: 270, rise: 112.9, rate: 3.64 },
  { name: 'Vanuatu', x: 370, y: 265, rise: 117.0, rate: 3.77 },
  { name: 'Marshall Islands', x: 340, y: 110, rise: 100.0, rate: 3.23 },
  { name: 'Papua New Guinea', x: 200, y: 200, rise: 228.4, rate: 7.37 },
  { name: 'Palau', x: 120, y: 130, rise: 216.1, rate: 6.97 },
  { name: 'Guam', x: 170, y: 90, rise: 101.9, rate: 3.29 },
  { name: 'Nauru', x: 350, y: 150, rise: 120.0, rate: 3.87 },
  { name: 'New Caledonia', x: 350, y: 310, rise: 117.4, rate: 3.79 },
  { name: 'French Polynesia', x: 740, y: 255, rise: 101.9, rate: 3.29 },
  { name: 'Niue', x: 570, y: 265, rise: 133.5, rate: 4.31 },
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initScrollAnimations();
  initProgressBar();
  initNavigation();
  initTrendChart();
  initRegionalChart();
  initComparisonSlider();
  initPacificMap();
  initDecisionCards();
});

// ============================================
// UNDERWATER PARTICLES
// ============================================
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const PARTICLE_COUNT = 80;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -Math.random() * 0.4 - 0.1;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.fadeDir = Math.random() > 0.5 ? 1 : -1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity += this.fadeDir * 0.003;
      if (this.opacity > 0.5) this.fadeDir = -1;
      if (this.opacity < 0.05) this.fadeDir = 1;
      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 10;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 180, 216, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ============================================
// SCROLL ANIMATIONS (Intersection Observer)
// ============================================
function initScrollAnimations() {
  const elements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ============================================
// PROGRESS BAR
// ============================================
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    bar.style.width = progress + '%';
  });
}

// ============================================
// NAVIGATION DOTS
// ============================================
function initNavigation() {
  const sections = document.querySelectorAll('.scroll-section');
  const dots = document.querySelectorAll('.nav-dot');

  // Click handler
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.section);
      sections[idx]?.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Scroll spy
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(sections).indexOf(entry.target);
        dots.forEach((d, i) => {
          d.classList.toggle('active', i === idx);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

// ============================================
// TREND LINE CHART (Canvas)
// ============================================
function initTrendChart() {
  const canvas = document.getElementById('trend-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const container = canvas.parentElement;
  const tooltip = document.getElementById('trend-tooltip');
  const yearDisplay = document.getElementById('trend-year');
  const legendContainer = document.getElementById('trend-legend');

  let animProgress = 0;
  let animated = false;
  const countries = Object.keys(SEA_LEVEL_DATA);
  const visibleCountries = new Set(countries);

  function resize() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  function draw() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    ctx.clearRect(0, 0, w, h);

    const pad = { top: 20, right: 30, bottom: 40, left: 60 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    // Find max value
    let maxVal = 0;
    countries.forEach(c => {
      if (!visibleCountries.has(c)) return;
      SEA_LEVEL_DATA[c].data.forEach(d => {
        if (d.value > maxVal) maxVal = d.value;
      });
    });
    maxVal = Math.ceil(maxVal / 50) * 50 + 20;

    // Y axis grid
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = 'rgba(245,247,250,0.3)';
    ctx.textAlign = 'right';
    for (let v = 0; v <= maxVal; v += 50) {
      const y = pad.top + chartH - (v / maxVal) * chartH;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(pad.left + chartW, y);
      ctx.stroke();
      ctx.fillText(v + ' mm', pad.left - 8, y + 3);
    }

    // X axis labels
    ctx.textAlign = 'center';
    for (let year = 1993; year <= 2024; year += 5) {
      const x = pad.left + ((year - 1993) / 31) * chartW;
      ctx.fillText(year.toString(), x, h - 10);
    }

    // Draw lines
    const pointsDrawn = Math.floor(animProgress * 32);
    countries.forEach(country => {
      if (!visibleCountries.has(country)) return;
      const { color, data } = SEA_LEVEL_DATA[country];
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.beginPath();

      const limit = Math.min(data.length, pointsDrawn);
      for (let i = 0; i < limit; i++) {
        const x = pad.left + ((data[i].year - 1993) / 31) * chartW;
        const y = pad.top + chartH - (data[i].value / maxVal) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Glow
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.15;
      ctx.lineWidth = 6;
      ctx.beginPath();
      for (let i = 0; i < limit; i++) {
        const x = pad.left + ((data[i].year - 1993) / 31) * chartW;
        const y = pad.top + chartH - (data[i].value / maxVal) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    });
  }

  // Animation
  function animateChart() {
    if (animProgress < 1) {
      animProgress += 0.02;
      resize();
      draw();
      requestAnimationFrame(animateChart);
    }
  }

  // Observe
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      animateChart();
    }
  }, { threshold: 0.3 });
  observer.observe(container);

  // Tooltip
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pad = { left: 60, right: 30 };
    const chartW = rect.width - pad.left - pad.right;
    const yearIdx = Math.round(((x - pad.left) / chartW) * 31);
    const year = 1993 + Math.max(0, Math.min(31, yearIdx));
    
    yearDisplay.textContent = year;

    let html = `<strong style="color: var(--cyan)">Year ${year}</strong><br>`;
    countries.forEach(c => {
      if (!visibleCountries.has(c)) return;
      const d = SEA_LEVEL_DATA[c].data.find(d => d.year === year);
      if (d) {
        html += `<span style="color:${SEA_LEVEL_DATA[c].color}">● ${c}: +${d.value.toFixed(1)} mm</span><br>`;
      }
    });
    tooltip.innerHTML = html;
    tooltip.style.opacity = 1;
    tooltip.style.left = Math.min(x + 15, rect.width - 200) + 'px';
    tooltip.style.top = '40px';
  });

  container.addEventListener('mouseleave', () => {
    tooltip.style.opacity = 0;
  });

  // Legend
  countries.forEach(c => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <span class="legend-dot" style="background:${SEA_LEVEL_DATA[c].color}"></span>
      <span class="legend-name">${c}</span>
      <span class="legend-value">+${SEA_LEVEL_DATA[c].data[SEA_LEVEL_DATA[c].data.length - 1].value.toFixed(1)} mm</span>
    `;
    item.addEventListener('click', () => {
      if (visibleCountries.has(c)) {
        visibleCountries.delete(c);
        item.style.opacity = '0.3';
      } else {
        visibleCountries.add(c);
        item.style.opacity = '1';
      }
      resize();
      draw();
    });
    legendContainer.appendChild(item);
  });

  window.addEventListener('resize', () => { resize(); draw(); });
}

// ============================================
// REGIONAL BAR CHART
// ============================================
function initRegionalChart() {
  const container = document.getElementById('regional-chart');
  if (!container) return;

  const regionData = [
    { name: 'Solomon Islands', rise: 236.8, rate: 7.64, color: '#2A9D8F' },
    { name: 'Papua New Guinea', rise: 228.4, rate: 7.37, color: '#E76F51' },
    { name: 'Micronesia', rise: 225.8, rate: 7.28, color: '#F4A261' },
    { name: 'Palau', rise: 216.1, rate: 6.97, color: '#E9C46A' },
    { name: 'Niue', rise: 133.5, rate: 4.31, color: '#9B5DE5' },
    { name: 'Nauru', rise: 120.0, rate: 3.87, color: '#00B4D8' },
    { name: 'Tuvalu', rise: 119.0, rate: 3.83, color: '#E63946' },
    { name: 'Samoa', rise: 117.4, rate: 3.79, color: '#4CC9F0' },
    { name: 'Fiji', rise: 111.6, rate: 3.60, color: '#00B4D8' },
    { name: 'Tonga', rise: 110.3, rate: 3.56, color: '#F5F7FA' },
  ];

  let sortOrder = 'fastest';

  function render() {
    container.innerHTML = '';
    const sorted = [...regionData].sort((a, b) => 
      sortOrder === 'fastest' ? b.rise - a.rise : a.rise - b.rise
    );
    const maxRise = Math.max(...sorted.map(d => d.rise));

    sorted.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'bar-row';
      row.innerHTML = `
        <span class="bar-label">${item.name}</span>
        <div class="bar-track">
          <div class="bar-fill" style="width: 0%; background: ${item.color}; opacity: 0.8;"></div>
        </div>
        <span class="bar-value">+${item.rise.toFixed(1)} mm</span>
      `;
      container.appendChild(row);

      // Animate
      setTimeout(() => {
        const fill = row.querySelector('.bar-fill');
        fill.style.width = ((item.rise / maxRise) * 100) + '%';
      }, 80 * i);
    });
  }

  render();

  // Toggle buttons
  document.querySelectorAll('.bar-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.bar-toggle').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      sortOrder = btn.dataset.sort;
      render();
    });
  });
}

// ============================================
// COMPARISON SLIDER
// ============================================
function initComparisonSlider() {
  const slider = document.getElementById('comparison-slider');
  const rightSide = document.getElementById('comparison-right');
  const divider = document.getElementById('comparison-divider');
  if (!slider || !rightSide || !divider) return;

  let isDragging = false;

  function setPosition(x) {
    const rect = slider.getBoundingClientRect();
    let percent = ((x - rect.left) / rect.width) * 100;
    percent = Math.max(10, Math.min(90, percent));
    rightSide.style.clipPath = `polygon(${percent}% 0, 100% 0, 100% 100%, ${percent}% 100%)`;
    divider.style.left = percent + '%';
  }

  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    setPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (isDragging) {
      e.preventDefault();
      setPosition(e.clientX);
    }
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch support
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    setPosition(e.touches[0].clientX);
  });

  slider.addEventListener('touchmove', (e) => {
    if (isDragging) {
      e.preventDefault();
      setPosition(e.touches[0].clientX);
    }
  });

  slider.addEventListener('touchend', () => {
    isDragging = false;
  });
}

// ============================================
// PACIFIC MAP
// ============================================
function initPacificMap() {
  const svg = document.getElementById('pacific-map');
  const tooltip = document.getElementById('map-tooltip');
  if (!svg) return;

  const centerX = 450;
  const centerY = 225;

  // Draw connection lines
  ISLAND_POSITIONS.forEach(island => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', island.x);
    line.setAttribute('y1', island.y);
    line.setAttribute('x2', centerX);
    line.setAttribute('y2', centerY);
    line.setAttribute('stroke', 'rgba(76, 201, 240, 0.06)');
    line.setAttribute('stroke-width', '0.8');
    line.setAttribute('stroke-dasharray', '3 5');
    svg.appendChild(line);
  });

  // Draw island nodes
  ISLAND_POSITIONS.forEach(island => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.classList.add('island-node');

    const isFiji = island.name === 'Fiji';
    const isTuvalu = island.name === 'Tuvalu';
    const nodeColor = isFiji ? '#00B4D8' : isTuvalu ? '#E63946' : '#4CC9F0';

    // Glow circle
    const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    glow.setAttribute('cx', island.x);
    glow.setAttribute('cy', island.y);
    glow.setAttribute('r', 16);
    glow.setAttribute('fill', nodeColor);
    glow.setAttribute('opacity', '0.08');
    glow.classList.add('island-glow');
    g.appendChild(glow);

    // Main circle
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', island.x);
    circle.setAttribute('cy', island.y);
    circle.setAttribute('r', isFiji || isTuvalu ? 5 : 3);
    circle.setAttribute('fill', nodeColor);
    circle.setAttribute('opacity', isFiji || isTuvalu ? '1' : '0.5');
    g.appendChild(circle);

    // Pulse ring for Fiji and Tuvalu
    if (isFiji || isTuvalu) {
      const pulseRing = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pulseRing.setAttribute('cx', island.x);
      pulseRing.setAttribute('cy', island.y);
      pulseRing.setAttribute('r', 12);
      pulseRing.setAttribute('fill', 'none');
      pulseRing.setAttribute('stroke', nodeColor);
      pulseRing.setAttribute('stroke-width', '1');
      pulseRing.setAttribute('opacity', '0.3');
      pulseRing.style.animation = 'pulse 3s ease-in-out infinite';
      g.appendChild(pulseRing);
    }

    // Label
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', island.x);
    text.setAttribute('y', island.y - 20);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', isFiji || isTuvalu ? nodeColor : '#F5F7FA');
    text.setAttribute('opacity', isFiji || isTuvalu ? '0.9' : '0.25');
    text.setAttribute('class', 'map-text-sm island-label');
    text.textContent = island.name;
    g.appendChild(text);

    // Hover events
    g.addEventListener('mouseenter', (e) => {
      const svgRect = svg.getBoundingClientRect();
      tooltip.innerHTML = `
        <div class="tooltip-name">${island.name}</div>
        <div class="tooltip-value">+${island.rise} mm</div>
        <div class="tooltip-rate">Average: ${island.rate} mm/year</div>
      `;
      tooltip.style.opacity = 1;
      
      const tooltipX = (island.x / 900) * svgRect.width;
      const tooltipY = (island.y / 450) * svgRect.height;
      tooltip.style.left = (tooltipX + 25) + 'px';
      tooltip.style.top = (tooltipY - 30) + 'px';
    });

    g.addEventListener('mouseleave', () => {
      tooltip.style.opacity = 0;
    });

    svg.appendChild(g);
  });
}

// ============================================
// DECISION CARDS
// ============================================
function initDecisionCards() {
  const cards = document.querySelectorAll('.decision-card');
  const resultContainer = document.getElementById('decision-result');

  const results = {
    relocation: {
      title: 'Path Chosen: Relocation',
      text: 'Litia\'s family joins thousands of Pacific Islanders seeking new homes. In New Zealand, they find safety — but the pull of their ancestral Vanua never fades. By 2050, over 1 million climate migrants from Oceania reshape the demographic landscape of Australia and New Zealand. Communities form "little Pacific" enclaves, preserving fragments of culture far from their sinking shores. Physical safety is secured, but at the cost of an irreplaceable spiritual connection to the land.'
    },
    adaptation: {
      title: 'Path Chosen: Adaptation',
      text: 'Litia\'s village builds the first community-led mangrove restoration corridor in Fiji. Reinforced sea walls, elevated water tanks, and salt-resistant crops become the new normal. International climate funds trickle in, but the village\'s strength comes from within — from ancestral knowledge of tides, from communal labor, and from an unwavering refusal to abandon their homeland. The sea continues to rise, but so does their resilience.'
    }
  };

  const impactData = {
    relocation: { safety: 90, heritage: 25, economy: 55 },
    adaptation: { safety: 40, heritage: 95, economy: 65 }
  };

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const choice = card.dataset.choice;
      
      // Toggle selection
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      // Show result
      const result = results[choice];
      resultContainer.innerHTML = `
        <div class="result-content">
          <h4>${result.title}</h4>
          <p>${result.text}</p>
        </div>
      `;

      // Update impact metrics
      const impact = impactData[choice];
      updateMetric('safety', impact.safety);
      updateMetric('heritage', impact.heritage);
      updateMetric('economy', impact.economy);
    });
  });

  function updateMetric(key, value) {
    const bar = document.getElementById(`${key}-bar`);
    const val = document.getElementById(`${key}-val`);
    if (bar) bar.style.width = value + '%';
    if (val) val.textContent = value + '%';
  }
}
