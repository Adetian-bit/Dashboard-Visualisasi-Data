let data = [];

fetch("data/sea_level.json")
.then(r=>r.json())
.then(j=>{
data=j;
init();
});

function init(){
trend();
selector();
insight();
}

function trend(){
const yearly={};
data.forEach(d=>{
if(!yearly[d.year]) yearly[d.year]=[];
yearly[d.year].push(d.value);
});

const labels=Object.keys(yearly);
const values=labels.map(y=>
yearly[y].reduce((a,b)=>a+b,0)/yearly[y].length
);

new Chart(document.getElementById("trendChart"),{
type:"line",
data:{
labels:labels,
datasets:[{label:"Sea Level",data:values,borderColor:"#4fc3f7"}]
}
});
}

function selector(){
const s=document.getElementById("countrySelect");
const countries=[...new Set(data.map(d=>d.country))];
countries.forEach(c=>{
const o=document.createElement("option");
o.value=c;o.innerText=c;
s.appendChild(o);
});

s.addEventListener("change",()=>render(s.value));
render(countries[0]);
}

function render(country){
const f=data.filter(d=>d.country===country);
new Chart(document.getElementById("countryChart"),{
type:"line",
data:{
labels:f.map(d=>d.year),
datasets:[{label:country,data:f.map(d=>d.value),borderColor:"#ffcc80"}]
}
});
}

function insight(){
const avg=data.reduce((a,b)=>a+b.value,0)/data.length;
document.getElementById("insightBox").innerHTML=
"Average anomaly: "+avg.toFixed(3)+" m";
}
