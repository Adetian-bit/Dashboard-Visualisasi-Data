/* ============================================================
   WATERLINE — Pacific Sea Level Rise, 1993–2023
   Application logic
   ============================================================ */

const YEARS = DATA.years;
const COUNTRIES = DATA.countries;
const BASIN_MEAN = DATA.basinMean;
const BASIN_SMOOTH = DATA.basinSmooth;

const REGION_COLOR = { Micronesia:'#ffd166', Melanesia:'#ff7a52', Polynesia:'#7ffbe3' };
const fmt1 = d3.format("+.1f");
const fmtEN = (v) => (v>=0?"+":"\u2212") + Math.abs(v).toFixed(1);

let state = {
  yearIdx: YEARS.length - 1,
  selectedCountry: COUNTRIES.find(c=>c.id==='tuvalu') || COUNTRIES[0],
  regionFilter: 'all',
  playing: false,
  playTimer: null,
  compareIds: ['tuvalu','kiribati','palau','fiji'],
  rankMetric: 'riseCm'
};

const tip = document.getElementById('tip');
function showTip(html, x, y){
  tip.innerHTML = html;
  tip.style.left = (x+14)+'px';
  tip.style.top = (y+14)+'px';
  tip.classList.add('show');
}
function hideTip(){ tip.classList.remove('show'); }

/* ---------------------------- LINEAR REGRESSION (basin trend) ---------------------------- */
function linearRegression(xs, ys){
  const n = xs.length;
  const sumX = xs.reduce((a,b)=>a+b,0);
  const sumY = ys.reduce((a,b)=>a+b,0);
  const sumXY = xs.reduce((a,x,i)=>a + x*ys[i], 0);
  const sumXX = xs.reduce((a,x)=>a + x*x, 0);
  const slope = (n*sumXY - sumX*sumY) / (n*sumXX - sumX*sumX);
  const intercept = (sumY - slope*sumX) / n;
  return { slope, intercept };
}
const basinTrend = linearRegression(YEARS, BASIN_MEAN);
const basinTrendMmYr = basinTrend.slope * 10; // cm/yr -> mm/yr

/* ---------------------------- MAP ---------------------------- */
const mapSvg = d3.select('#map-svg');
const lonScale = d3.scaleLinear().domain([128,216]).range([60,940]);
const latScale = d3.scaleLinear().domain([-26,18]).range([560,50]);

const mapDefs = mapSvg.append('defs');
const bgGrad = mapDefs.append('radialGradient').attr('id','oceanGrad').attr('cx','30%').attr('cy','20%');
bgGrad.append('stop').attr('offset','0%').attr('stop-color','#0f2c3c');
bgGrad.append('stop').attr('offset','100%').attr('stop-color','#071420');

mapSvg.append('rect').attr('x',0).attr('y',0).attr('width',1000).attr('height',600).attr('fill','url(#oceanGrad)');

const graticule = mapSvg.append('g').attr('class','graticule');
for(let lon=130; lon<=215; lon+=10){
  graticule.append('line').attr('x1',lonScale(lon)).attr('x2',lonScale(lon)).attr('y1',50).attr('y2',560).attr('stroke','#142c3a').attr('stroke-width',1);
}
for(let lat=-25; lat<=15; lat+=10){
  graticule.append('line').attr('x1',60).attr('x2',940).attr('y1',latScale(lat)).attr('y2',latScale(lat)).attr('stroke','#142c3a').attr('stroke-width',1);
}
graticule.append('line').attr('x1',60).attr('x2',940).attr('y1',latScale(0)).attr('y2',latScale(0)).attr('stroke','#1d3c4c').attr('stroke-width',1.2);
mapSvg.append('text').attr('x',70).attr('y',latScale(0)-8).attr('fill','#5c7a86').attr('font-family','JetBrains Mono, monospace').attr('font-size',10).text('EQUATOR');

// soft decorative current arcs
const arcLayer = mapSvg.append('g').attr('opacity',.35);
const arcPaths = [
  [[150,520],[420,420],[760,330]],
  [[300,520],[560,400],[860,250]]
];
arcPaths.forEach(pts=>{
  const lineGen = d3.line().curve(d3.curveBasis);
  arcLayer.append('path').attr('d', lineGen(pts)).attr('fill','none').attr('stroke','#2fb8a6').attr('stroke-width',1).attr('stroke-dasharray','1,5');
});

mapSvg.append('text').attr('x',940).attr('y',580).attr('text-anchor','end')
  .attr('fill','#5c7a86').attr('font-family','JetBrains Mono, monospace').attr('font-size',10)
  .text('SCHEMATIC PROJECTION · NOT FOR NAVIGATION');

const rScale = d3.scaleSqrt().domain([0,20]).range([5,15]);
const colorScale = d3.scaleLinear().domain([-15,0,10,20]).range(['#5c7a86','#2fb8a6','#ffd166','#ff7a52']).clamp(true);

const markerLayer = mapSvg.append('g').attr('class','marker-layer');
const markerSel = markerLayer.selectAll('.marker')
  .data(COUNTRIES, d=>d.id)
  .enter().append('g')
  .attr('class','marker')
  .attr('transform', d=>`translate(${lonScale(d.lonAdj)},${latScale(d.lat)})`)
  .on('click', (event,d)=>{ selectCountry(d.id); })
  .on('mousemove', (event,d)=>{
    const v = d.series[state.yearIdx];
    showTip(`<b>${d.name}</b><br>${YEARS[state.yearIdx]}: <span class="t-val">${fmtEN(v)} cm</span>`, event.clientX, event.clientY);
  })
  .on('mouseleave', hideTip);

markerSel.append('circle').attr('class','halo').attr('fill', d=>REGION_COLOR[d.region]);
markerSel.append('circle').attr('class','core').attr('fill', d=>REGION_COLOR[d.region]).attr('stroke','#060f17').attr('stroke-width',1);
markerSel.append('text').attr('x',0).attr('y',-14).attr('text-anchor','middle').text(d=>d.name);

function renderMapForYear(idx){
  markerSel.select('circle.core')
    .attr('r', d=> rScale(Math.abs(d.series[idx])) )
    .attr('fill', d=> colorScale(d.series[idx]) );
  markerSel.select('circle.halo')
    .attr('r', d=> rScale(Math.abs(d.series[idx])) * 2.1 )
    .attr('fill', d=> colorScale(d.series[idx]) );
  markerSel.classed('is-selected', d=> d.id === state.selectedCountry.id);
}
function applyRegionFilter(){
  markerSel.transition().duration(300)
    .attr('opacity', d=> state.regionFilter==='all' || d.region===state.regionFilter ? 1 : 0.12 );
}

document.getElementById('region-toggle').addEventListener('click', (e)=>{
  const chip = e.target.closest('.chip'); if(!chip) return;
  document.querySelectorAll('#region-toggle .chip').forEach(c=>c.classList.remove('active'));
  chip.classList.add('active');
  state.regionFilter = chip.dataset.region;
  applyRegionFilter();
});

/* ------------------------- SCRUBBER ------------------------- */
const slider = document.getElementById('yr-slider');
const scrubYear = document.getElementById('scrub-year');
const scrubVal = document.getElementById('scrub-val');
const navYear = document.getElementById('nav-year');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');

function setYear(idx, {fromSlider=false}={}){
  state.yearIdx = idx;
  if(!fromSlider) slider.value = idx;
  const pct = (idx/(YEARS.length-1))*100;
  slider.style.setProperty('--fillpct', pct+'%');
  const yr = YEARS[idx];
  scrubYear.textContent = yr;
  navYear.textContent = yr;
  scrubVal.textContent = 'basin ' + fmtEN(BASIN_MEAN[idx]) + ' cm';
  renderMapForYear(idx);
  updateTrendGuideline(idx);
  renderSidePanel(state.selectedCountry, idx);
}

slider.addEventListener('input', (e)=> setYear(+e.target.value, {fromSlider:true}) );

function togglePlay(){
  state.playing = !state.playing;
  if(state.playing){
    playIcon.innerHTML = '<rect x="2" y="1" width="3.6" height="12" fill="currentColor"/><rect x="8.4" y="1" width="3.6" height="12" fill="currentColor"/>';
    state.playTimer = setInterval(()=>{
      let next = state.yearIdx + 1;
      if(next > YEARS.length-1){ next = 0; }
      setYear(next);
    }, 650);
  } else {
    playIcon.innerHTML = '<path d="M2 1l11 6-11 6V1z" fill="currentColor"/>';
    clearInterval(state.playTimer);
  }
}
playBtn.addEventListener('click', togglePlay);

/* ------------------------- SIDE PANEL ------------------------- */
function miniSpark(svgSel, series, idx, w=270, h=70){
  svgSel.selectAll('*').remove();
  svgSel.attr('viewBox',`0 0 ${w} ${h}`);
  const x = d3.scaleLinear().domain([0, series.length-1]).range([4,w-4]);
  const y = d3.scaleLinear().domain(d3.extent(series).map((v,i)=> i===0? Math.min(v,-2): Math.max(v,2))).nice().range([h-8,8]);
  const line = d3.line().x((d,i)=>x(i)).y(d=>y(d)).curve(d3.curveMonotoneX);
  svgSel.append('line').attr('x1',4).attr('x2',w-4).attr('y1',y(0)).attr('y2',y(0)).attr('stroke','#1d3c4c').attr('stroke-dasharray','2,3');
  svgSel.append('path').attr('d', line(series)).attr('fill','none').attr('stroke','#2fb8a6').attr('stroke-width',2);
  svgSel.append('circle').attr('cx', x(idx)).attr('cy', y(series[idx])).attr('r',4).attr('fill','#7ffbe3').attr('stroke','#060f17').attr('stroke-width',1.5);
}

function renderSidePanel(c, idx){
  const panel = document.getElementById('side-panel');
  const v = c.series[idx];
  panel.innerHTML = `
    <span class="region-tag" style="color:${REGION_COLOR[c.region]};border-color:${REGION_COLOR[c.region]}55">${c.region}</span>
    <h3 class="serif">${c.name}</h3>
    <span class="coords">${Math.abs(c.lat).toFixed(2)}°${c.lat<0?'S':'N'}, ${Math.abs(c.lon).toFixed(2)}°${c.lon<0?'W':'E'}</span>
    <div class="readout-grid">
      <div><b>${fmtEN(v)} cm</b><span>${YEARS[idx]} anomaly</span></div>
      <div><b>${fmtEN(c.riseCm)} cm</b><span>rise since 1993</span></div>
      <div><b>${c.trendMmYr.toFixed(1)} mm</b><span>rate per year</span></div>
      <div><b>#${COUNTRIES.slice().sort((a,b)=>b.riseCm-a.riseCm).findIndex(x=>x.id===c.id)+1}</b><span>rank by rise</span></div>
    </div>
    <div class="side-spark"><svg></svg></div>
    <p class="side-hint">Click another point on the map, or use the year marker to see how ${c.name} moved across the 1993–2023 record.</p>
  `;
  miniSpark(d3.select(panel).select('.side-spark svg'), c.series, idx);
}

function selectCountry(id){
  state.selectedCountry = COUNTRIES.find(c=>c.id===id);
  markerSel.classed('is-selected', d=> d.id === id);
  renderSidePanel(state.selectedCountry, state.yearIdx);
}

/* ------------------------- GLOBAL CONTEXT STRIP ------------------------- */
function renderContextStrip(){
  const pacificRate = basinTrendMmYr;
  const pacificRise = BASIN_MEAN[BASIN_MEAN.length-1];
  const maxRate = Math.max(pacificRate, GLOBAL_MEAN_RATE_MM_YR) * 1.15;

  const bars = document.getElementById('context-bars');
  bars.innerHTML = `
    <div class="context-bar-row">
      <div class="clabel"><span>Global ocean average</span><b>${GLOBAL_MEAN_RATE_MM_YR.toFixed(1)} mm/yr</b></div>
      <div class="context-bar-track"><div class="context-bar-fill global" style="width:${(GLOBAL_MEAN_RATE_MM_YR/maxRate*100).toFixed(1)}%"></div></div>
      <div class="cval">≈ ${GLOBAL_MEAN_RISE_CM_2023.toFixed(1)} cm cumulative rise, 1993–2023 (satellite altimetry era)</div>
    </div>
    <div class="context-bar-row">
      <div class="clabel"><span>Pacific basin average</span><b>${pacificRate.toFixed(1)} mm/yr</b></div>
      <div class="context-bar-track"><div class="context-bar-fill pacific" style="width:${(pacificRate/maxRate*100).toFixed(1)}%"></div></div>
      <div class="cval">${fmtEN(pacificRise)} cm cumulative rise, 1993–2023 (this dataset, basin mean)</div>
    </div>
  `;
}

/* ------------------------- TREND CHART (with ENSO bands) ------------------------- */
const trendSvg = d3.select('#trend-svg');
const TW = 1080, TH = 420, TM = {top:20,right:30,bottom:34,left:46};
const tx = d3.scaleLinear().domain([YEARS[0], YEARS[YEARS.length-1]]).range([TM.left, TW-TM.right]);
const ty = d3.scaleLinear().domain([d3.min(BASIN_MEAN)-3, d3.max(BASIN_SMOOTH)+3]).nice().range([TH-TM.bottom, TM.top]);

// ENSO bands sit behind the gridlines/data
const ensoLayer = trendSvg.append('g').attr('class','enso-layer');
ENSO_EVENTS.forEach(ev=>{
  const x0 = tx(ev.year);
  const x1 = tx(ev.endYear);
  ensoLayer.append('rect')
    .attr('class','enso-band')
    .attr('x', x0).attr('width', Math.max(x1-x0, 4))
    .attr('y', TM.top).attr('height', TH-TM.top-TM.bottom);
  ensoLayer.append('text')
    .attr('class','enso-label')
    .attr('x', x0+3).attr('y', TM.top+12)
    .text(ev.label);
});

trendSvg.append('g').attr('class','gridlines').selectAll('line')
  .data(ty.ticks(6)).enter().append('line')
  .attr('class','gridline')
  .attr('x1', TM.left).attr('x2', TW-TM.right).attr('y1', d=>ty(d)).attr('y2', d=>ty(d));

trendSvg.append('g').attr('class','axis').attr('transform',`translate(0,${TH-TM.bottom})`)
  .call(d3.axisBottom(tx).tickFormat(d3.format('d')).ticks(8).tickSize(4));
trendSvg.append('g').attr('class','axis').attr('transform',`translate(${TM.left},0)`)
  .call(d3.axisLeft(ty).ticks(6).tickFormat(d=>d+' cm').tickSize(4));

trendSvg.append('line').attr('x1',TM.left).attr('x2',TW-TM.right).attr('y1',ty(0)).attr('y2',ty(0))
  .attr('stroke','#5c7a86').attr('stroke-dasharray','4,4').attr('stroke-width',1);

const tDefs = trendSvg.append('defs');
const areaGrad = tDefs.append('linearGradient').attr('id','areaGrad').attr('x1',0).attr('x2',0).attr('y1',0).attr('y2',1);
areaGrad.append('stop').attr('offset','0%').attr('stop-color','#2fb8a6').attr('stop-opacity',.35);
areaGrad.append('stop').attr('offset','100%').attr('stop-color','#2fb8a6').attr('stop-opacity',0);

const areaGen = d3.area().x((d,i)=>tx(YEARS[i])).y0(ty(ty.domain()[0])).y1(d=>ty(d)).curve(d3.curveMonotoneX);
const lineGenRaw = d3.line().x((d,i)=>tx(YEARS[i])).y(d=>ty(d)).curve(d3.curveMonotoneX);
const lineGenSmooth = d3.line().x((d,i)=>tx(YEARS[i])).y(d=>ty(d)).curve(d3.curveMonotoneX);

trendSvg.append('path').attr('d', areaGen(BASIN_SMOOTH)).attr('fill','url(#areaGrad)');
trendSvg.append('path').attr('d', lineGenRaw(BASIN_MEAN)).attr('fill','none').attr('stroke','#5c7a86').attr('stroke-width',1.2).attr('opacity',.7);
trendSvg.selectAll('.raw-dot').data(BASIN_MEAN).enter().append('circle').attr('class','raw-dot')
  .attr('cx',(d,i)=>tx(YEARS[i])).attr('cy',d=>ty(d)).attr('r',2.2).attr('fill','#5c7a86').attr('opacity',.6);
trendSvg.append('path').attr('d', lineGenSmooth(BASIN_SMOOTH)).attr('fill','none').attr('stroke','#7ffbe3').attr('stroke-width',2.6);

const guideline = trendSvg.append('line').attr('y1',TM.top).attr('y2',TH-TM.bottom).attr('stroke','#eaf3f1').attr('stroke-width',1).attr('stroke-dasharray','3,3').attr('opacity',.5);
const guideDot = trendSvg.append('circle').attr('r',5).attr('fill','#ff7a52').attr('stroke','#060f17').attr('stroke-width',1.5);

trendSvg.selectAll('.hit').data(BASIN_MEAN).enter().append('circle').attr('class','hit')
  .attr('cx',(d,i)=>tx(YEARS[i])).attr('cy',d=>ty(d)).attr('r',10).attr('fill','transparent')
  .on('mousemove', function(event,d){
    const i = BASIN_MEAN.indexOf(d);
    showTip(`<b>${YEARS[i]}</b><br>raw: <span class="t-val">${fmtEN(d)} cm</span><br>smoothed: <span class="t-val">${fmtEN(BASIN_SMOOTH[i])} cm</span>`, event.clientX, event.clientY);
  })
  .on('mouseleave', hideTip)
  .on('click', function(event,d){ setYear(BASIN_MEAN.indexOf(d)); });

function updateTrendGuideline(idx){
  const xPos = tx(YEARS[idx]);
  guideline.attr('x1',xPos).attr('x2',xPos);
  guideDot.attr('cx',xPos).attr('cy', ty(BASIN_SMOOTH[idx]));
}

/* ------------------------- HERO SPARK ------------------------- */
const heroSparkSvg = d3.select('#hero-spark').append('svg').attr('width','100%').attr('viewBox','0 0 270 60');
(function(){
  const w=270,h=60;
  const x = d3.scaleLinear().domain([0,BASIN_SMOOTH.length-1]).range([2,w-2]);
  const y = d3.scaleLinear().domain(d3.extent(BASIN_SMOOTH)).range([h-6,6]);
  const line = d3.line().x((d,i)=>x(i)).y(d=>y(d)).curve(d3.curveMonotoneX);
  heroSparkSvg.append('path').attr('d', line(BASIN_SMOOTH)).attr('fill','none').attr('stroke','#7ffbe3').attr('stroke-width',2);
  heroSparkSvg.append('circle').attr('cx',x(BASIN_SMOOTH.length-1)).attr('cy',y(BASIN_SMOOTH[BASIN_SMOOTH.length-1])).attr('r',3.4).attr('fill','#7ffbe3');
  heroSparkSvg.append('text').attr('x',2).attr('y',12).attr('fill','#5c7a86').attr('font-family','JetBrains Mono, monospace').attr('font-size',9).text('1993');
  heroSparkSvg.append('text').attr('x',w-2).attr('y',12).attr('text-anchor','end').attr('fill','#5c7a86').attr('font-family','JetBrains Mono, monospace').attr('font-size',9).text('2023');
})();

/* ------------------------- COMPARE CHART ------------------------- */
const compareChipsEl = document.getElementById('compare-chips');
const COMPARE_PALETTE = ['#7ffbe3','#ff7a52','#ffd166','#5ea8ff','#c792ea'];

function buildChips(){
  compareChipsEl.innerHTML = COUNTRIES.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(c=>`
    <div class="country-chip" data-id="${c.id}"><span class="dot"></span>${c.name}</div>
  `).join('');
  refreshChipState();
  compareChipsEl.addEventListener('click', (e)=>{
    const chip = e.target.closest('.country-chip'); if(!chip) return;
    const id = chip.dataset.id;
    const idx = state.compareIds.indexOf(id);
    if(idx>-1){ state.compareIds.splice(idx,1); }
    else { if(state.compareIds.length>=5){ state.compareIds.shift(); } state.compareIds.push(id); }
    refreshChipState();
    renderCompareChart();
  });
}
function refreshChipState(){
  document.querySelectorAll('.country-chip').forEach(chip=>{
    const active = state.compareIds.includes(chip.dataset.id);
    chip.classList.toggle('active', active);
    const dotColor = active ? COMPARE_PALETTE[state.compareIds.indexOf(chip.dataset.id) % COMPARE_PALETTE.length] : '';
    chip.querySelector('.dot').style.background = active ? dotColor : '#5c7a86';
  });
  document.getElementById('compare-count').textContent = state.compareIds.length;
}

const compareSvg = d3.select('#compare-svg');
function renderCompareChart(){
  compareSvg.selectAll('*').remove();
  const W=1080,H=420,M={top:20,right:140,bottom:34,left:46};
  const selected = state.compareIds.map(id=>COUNTRIES.find(c=>c.id===id)).filter(Boolean);
  const allVals = selected.flatMap(c=>c.series);
  const cx = d3.scaleLinear().domain([YEARS[0],YEARS[YEARS.length-1]]).range([M.left,W-M.right]);
  const cy = d3.scaleLinear().domain([d3.min(allVals.concat([0]))-3, d3.max(allVals.concat([0]))+3]).nice().range([H-M.bottom,M.top]);

  compareSvg.append('g').selectAll('line').data(cy.ticks(6)).enter().append('line')
    .attr('class','gridline').attr('x1',M.left).attr('x2',W-M.right).attr('y1',d=>cy(d)).attr('y2',d=>cy(d));
  compareSvg.append('g').attr('class','axis').attr('transform',`translate(0,${H-M.bottom})`).call(d3.axisBottom(cx).tickFormat(d3.format('d')).ticks(8).tickSize(4));
  compareSvg.append('g').attr('class','axis').attr('transform',`translate(${M.left},0)`).call(d3.axisLeft(cy).ticks(6).tickFormat(d=>d+' cm').tickSize(4));
  compareSvg.append('line').attr('x1',M.left).attr('x2',W-M.right).attr('y1',cy(0)).attr('y2',cy(0)).attr('stroke','#5c7a86').attr('stroke-dasharray','4,4');

  const lineGen = d3.line().x((d,i)=>cx(YEARS[i])).y(d=>cy(d)).curve(d3.curveMonotoneX);

  selected.forEach((c,i)=>{
    const color = COMPARE_PALETTE[i % COMPARE_PALETTE.length];
    compareSvg.append('path').attr('d', lineGen(c.series)).attr('fill','none').attr('stroke',color).attr('stroke-width',2.4)
      .attr('opacity',0).transition().duration(500).attr('opacity',1);
    compareSvg.append('circle').attr('cx', cx(YEARS[YEARS.length-1])).attr('cy', cy(c.series[c.series.length-1])).attr('r',3.6).attr('fill',color);

    selected[i]._hitColor = color;
    compareSvg.selectAll(`.hit-${i}`).data(c.series).enter().append('circle').attr('class',`hit-${i}`)
      .attr('cx',(d,j)=>cx(YEARS[j])).attr('cy',d=>cy(d)).attr('r',8).attr('fill','transparent')
      .on('mousemove', function(event,d){
        const j = c.series.indexOf(d);
        showTip(`<b>${c.name}</b> · ${YEARS[j]}<br><span class="t-val">${fmtEN(d)} cm</span>`, event.clientX, event.clientY);
      }).on('mouseleave', hideTip);
  });

  /* End-of-line labels with collision avoidance: sort by raw y, then push
     apart any labels closer than the minimum line-height. */
  const labelMinGap = 14;
  const labelData = selected.map((c,i)=>({
    name: c.name,
    color: COMPARE_PALETTE[i % COMPARE_PALETTE.length],
    y: cy(c.series[c.series.length-1])
  })).sort((a,b)=>a.y-b.y);
  for(let i=1;i<labelData.length;i++){
    if(labelData[i].y - labelData[i-1].y < labelMinGap){
      labelData[i].y = labelData[i-1].y + labelMinGap;
    }
  }
  compareSvg.selectAll('.end-label').data(labelData).enter().append('text')
    .attr('class','end-label')
    .attr('x', cx(YEARS[YEARS.length-1])+10).attr('y', d=>d.y+4)
    .attr('fill', d=>d.color).attr('font-family','JetBrains Mono, monospace').attr('font-size',11.5)
    .text(d=>d.name);

  if(selected.length===0){
    compareSvg.append('text').attr('x',W/2).attr('y',H/2).attr('text-anchor','middle')
      .attr('fill','#5c7a86').attr('font-family','JetBrains Mono, monospace').attr('font-size',13)
      .text('Select at least one country or territory above.');
  }
}

/* ------------------------- RANKING ------------------------- */
const rankListEl = document.getElementById('rank-list');
function renderRanking(metric){
  const sorted = COUNTRIES.slice().sort((a,b)=>b[metric]-a[metric]);
  const maxVal = d3.max(sorted, d=>d[metric]);
  const unit = metric==='riseCm' ? 'cm' : 'mm/yr';
  rankListEl.innerHTML = sorted.map((c,i)=>`
    <div class="rank-row">
      <div class="rr-num mono">${String(i+1).padStart(2,'0')}</div>
      <div class="rr-name"><span class="dot" style="background:${REGION_COLOR[c.region]}"></span>${c.name}</div>
      <div class="rr-bar"><i style="width:${(c[metric]/maxVal*100).toFixed(1)}%"></i></div>
      <div class="rr-val">${metric==='riseCm'?fmtEN(c[metric]):'+'+c[metric].toFixed(1)} ${unit}</div>
    </div>
  `).join('');
}
document.querySelector('.rank-toggle').addEventListener('click',(e)=>{
  const btn = e.target.closest('button'); if(!btn) return;
  document.querySelectorAll('.rank-toggle button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  state.rankMetric = btn.dataset.metric;
  renderRanking(state.rankMetric);
});

/* ------------------------- PROJECTION ------------------------- */
function renderProjectionCards(){
  const mount = document.getElementById('projection-cards');
  mount.innerHTML = PROJECTION_YEARS.map(yr=>{
    const val = basinTrend.slope*yr + basinTrend.intercept;
    return `
      <div class="proj-card">
        <span class="py">${yr}</span>
        <div class="pv">${fmtEN(val)} cm</div>
        <p class="pl">basin-mean anomaly if the observed 1993–2023 rate (${basinTrendMmYr.toFixed(1)} mm/yr) continues unchanged</p>
      </div>
    `;
  }).join('');
}

function renderProjectionChart(){
  const svg = d3.select('#projection-svg');
  svg.selectAll('*').remove();
  const W=1080,H=380,M={top:20,right:30,bottom:34,left:46};
  const lastProjYear = PROJECTION_YEARS[PROJECTION_YEARS.length-1];
  const px = d3.scaleLinear().domain([YEARS[0], lastProjYear]).range([M.left,W-M.right]);
  const projVals = PROJECTION_YEARS.map(yr=>basinTrend.slope*yr+basinTrend.intercept);
  const py = d3.scaleLinear().domain([d3.min(BASIN_MEAN)-3, d3.max(projVals)+3]).nice().range([H-M.bottom,M.top]);

  svg.append('g').selectAll('line').data(py.ticks(6)).enter().append('line')
    .attr('class','gridline').attr('x1',M.left).attr('x2',W-M.right).attr('y1',d=>py(d)).attr('y2',d=>py(d));
  svg.append('g').attr('class','axis').attr('transform',`translate(0,${H-M.bottom})`)
    .call(d3.axisBottom(px).tickFormat(d3.format('d')).ticks(10).tickSize(4));
  svg.append('g').attr('class','axis').attr('transform',`translate(${M.left},0)`)
    .call(d3.axisLeft(py).ticks(6).tickFormat(d=>d+' cm').tickSize(4));
  svg.append('line').attr('x1',M.left).attr('x2',W-M.right).attr('y1',py(0)).attr('y2',py(0))
    .attr('stroke','#5c7a86').attr('stroke-dasharray','4,4').attr('stroke-width',1);

  // historical observed line (solid)
  const lineHist = d3.line().x((d,i)=>px(YEARS[i])).y(d=>py(d)).curve(d3.curveMonotoneX);
  svg.append('path').attr('d', lineHist(BASIN_MEAN)).attr('fill','none').attr('stroke','#7ffbe3').attr('stroke-width',2.4);

  // projected segment (dashed), starting from the last observed point
  const projPoints = [[YEARS[YEARS.length-1], BASIN_MEAN[BASIN_MEAN.length-1]]]
    .concat(PROJECTION_YEARS.map((yr,i)=>[yr, projVals[i]]));
  const lineProj = d3.line().x(d=>px(d[0])).y(d=>py(d[1])).curve(d3.curveLinear);
  svg.append('path').attr('d', lineProj(projPoints)).attr('fill','none').attr('stroke','#ff7a52').attr('stroke-width',2.4).attr('stroke-dasharray','6,5');

  // boundary marker between observed and projected
  svg.append('line').attr('x1', px(YEARS[YEARS.length-1])).attr('x2', px(YEARS[YEARS.length-1]))
    .attr('y1', M.top).attr('y2', H-M.bottom).attr('stroke','#1d3c4c').attr('stroke-width',1).attr('stroke-dasharray','2,3');
  svg.append('text').attr('x', px(YEARS[YEARS.length-1])+6).attr('y', M.top+14)
    .attr('fill','#5c7a86').attr('font-family','JetBrains Mono, monospace').attr('font-size',10)
    .text('LAST OBSERVED');

  // projection points
  PROJECTION_YEARS.forEach((yr,i)=>{
    svg.append('circle').attr('cx', px(yr)).attr('cy', py(projVals[i])).attr('r',5)
      .attr('fill','#ff7a52').attr('stroke','#060f17').attr('stroke-width',1.5)
      .on('mousemove', function(event){
        showTip(`<b>${yr} (projected)</b><br><span class="t-val">${fmtEN(projVals[i])} cm</span>`, event.clientX, event.clientY);
      }).on('mouseleave', hideTip);
    svg.append('text').attr('x', px(yr)).attr('y', py(projVals[i])-12).attr('text-anchor','middle')
      .attr('fill','#ff7a52').attr('font-family','JetBrains Mono, monospace').attr('font-size',11).attr('font-weight',600)
      .text(fmtEN(projVals[i])+' cm');
  });
}

/* ------------------------- INIT ------------------------- */
buildChips();
renderCompareChart();
renderRanking('riseCm');
renderContextStrip();
renderProjectionCards();
renderProjectionChart();
setYear(state.yearIdx);
applyRegionFilter();
