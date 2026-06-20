let data = [];

fetch("data/sea_level.json")
.then(r=>r.json())
.then(j=>{
data=j;
init();
});

function init(){
createTrend();
createMap();
createCountry();
createRanking();
}

/* TREND */
function createTrend(){

let yearly = {};

data.forEach(d=>{
if(!yearly[d.year]) yearly[d.year]=[];
yearly[d.year].push(d.value);
});

let labels = Object.keys(yearly);

let values = labels.map(y =>
yearly[y].reduce((a,b)=>a+b,0)/yearly[y].length
);

new Chart(document.getElementById("trendChart"),{
type:"line",
data:{
labels,
datasets:[{
label:"Sea Level Anomaly",
data:values,
borderColor:"#4fc3f7"
}]
}
});
}

/* MAP */
function createMap(){

let map = L.map('map').setView([-10,160],4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

L.marker([-8.5,179]).addTo(map).bindPopup("Tuvalu");
L.marker([-17.7,168]).addTo(map).bindPopup("Vanuatu");
L.marker([-1.4,173]).addTo(map).bindPopup("Kiribati");
}

/* COUNTRY */
function createCountry(){

let select = document.getElementById("countrySelect");

let countries = [...new Set(data.map(d=>d.country))];

countries.forEach(c=>{
let opt = document.createElement("option");
opt.value=c;
opt.innerText=c;
select.appendChild(opt);
});

select.onchange = ()=>render(select.value);

render(countries[0]);
}

function render(country){

let filtered = data.filter(d=>d.country===country);

new Chart(document.getElementById("countryChart"),{
type:"line",
data:{
labels:filtered.map(d=>d.year),
datasets:[{
label:country,
data:filtered.map(d=>d.value),
borderColor:"#ffcc80"
}]
}
});
}

/* RANKING */
function createRanking(){

let latest = {};

data.forEach(d=>{
if(!latest[d.country] || d.year > latest[d.country].year){
latest[d.country] = d;
}
});

let sorted = Object.values(latest)
.sort((a,b)=>b.value-a.value);

document.getElementById("ranking").innerHTML =
sorted.map((d,i)=>
`${i+1}. ${d.country} → ${d.value}`
).join("<br>");
}
