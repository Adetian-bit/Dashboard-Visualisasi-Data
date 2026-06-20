/* ============================================================
   WATERLINE — Pacific Sea Level Rise, 1993–2023
   Data payload + derived constants
   ============================================================ */

const DATA = {
  "years": [1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023],
  "countries": [
    {"id":"palau","name":"Palau","region":"Micronesia","lat":7.5006,"lon":134.6242,"lonAdj":134.624,"series":[-10.0,-10.0,0.0,0.0,-10.0,0.0,10.0,10.0,10.0,-10.0,0.0,0.0,0.0,0.0,0.0,20.0,10.0,10.0,10.0,10.0,10.0,0.0,-10.0,0.0,10.0,0.0,0.0,10.0,20.0,20.0,10.0],"latest":10.0,"earlyAvg":-6.0,"recentAvg":12.0,"riseCm":18.0,"trendMmYr":4.84},
    {"id":"micronesia-federated-state-of","name":"Micronesia (FSM)","region":"Micronesia","lat":6.9248,"lon":158.1611,"lonAdj":158.161,"series":[-10.0,0.0,0.0,0.0,-10.0,0.0,10.0,10.0,10.0,0.0,0.0,0.0,0.0,0.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,0.0,-10.0,10.0,10.0,10.0,10.0,10.0,10.0,20.0,10.0],"latest":10.0,"earlyAvg":-4.0,"recentAvg":12.0,"riseCm":16.0,"trendMmYr":4.64},
    {"id":"guam","name":"Guam","region":"Micronesia","lat":13.4745,"lon":144.7504,"lonAdj":144.75,"series":[0.0,0.0,-10.0,0.0,-10.0,0.0,10.0,10.0,0.0,0.0,0.0,0.0,0.0,10.0,10.0,20.0,10.0,10.0,10.0,10.0,10.0,0.0,-10.0,0.0,10.0,0.0,0.0,10.0,20.0,10.0,10.0],"latest":10.0,"earlyAvg":-4.0,"recentAvg":10.0,"riseCm":14.0,"trendMmYr":3.55},
    {"id":"papua-new-guinea","name":"Papua New Guinea","region":"Melanesia","lat":-9.4438,"lon":147.1803,"lonAdj":147.18,"series":[-10.0,0.0,0.0,0.0,0.0,-10.0,0.0,10.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,10.0,10.0,0.0,10.0,10.0,10.0,10.0,0.0,0.0,10.0,10.0,10.0,10.0,10.0,20.0,10.0],"latest":10.0,"earlyAvg":-2.0,"recentAvg":12.0,"riseCm":14.0,"trendMmYr":5.4},
    {"id":"solomon-islands","name":"Solomon Islands","region":"Melanesia","lat":-9.428,"lon":159.9498,"lonAdj":159.95,"series":[-10.0,0.0,0.0,10.0,0.0,-10.0,0.0,10.0,10.0,0.0,0.0,0.0,0.0,0.0,10.0,10.0,10.0,0.0,10.0,10.0,10.0,10.0,0.0,0.0,10.0,10.0,10.0,10.0,20.0,20.0,10.0],"latest":10.0,"earlyAvg":0.0,"recentAvg":14.0,"riseCm":14.0,"trendMmYr":5.12},
    {"id":"vanuatu","name":"Vanuatu","region":"Melanesia","lat":-17.7333,"lon":168.3273,"lonAdj":168.327,"series":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,10.0,0.0,0.0,0.0,0.0,0.0,0.0,10.0,10.0,0.0,10.0,10.0,0.0,0.0,0.0,0.0,10.0,10.0,10.0,10.0,10.0,20.0,20.0],"latest":20.0,"earlyAvg":0.0,"recentAvg":14.0,"riseCm":14.0,"trendMmYr":4.6},
    {"id":"fiji","name":"Fiji","region":"Melanesia","lat":-18.1416,"lon":178.4419,"lonAdj":178.442,"series":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,10.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,10.0,10.0,0.0,10.0,10.0,10.0,0.0,0.0,0.0,10.0,10.0,10.0,10.0,10.0,20.0,10.0],"latest":10.0,"earlyAvg":0.0,"recentAvg":12.0,"riseCm":12.0,"trendMmYr":4.15},
    {"id":"marshall-islands","name":"Marshall Islands","region":"Micronesia","lat":7.1164,"lon":171.1858,"lonAdj":171.186,"series":[0.0,0.0,0.0,0.0,-10.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,10.0,0.0,10.0,10.0,0.0,10.0,10.0,10.0,10.0,0.0,0.0,0.0,10.0,0.0,10.0,10.0,10.0,10.0,10.0],"latest":10.0,"earlyAvg":-2.0,"recentAvg":10.0,"riseCm":12.0,"trendMmYr":3.83},
    {"id":"niue","name":"Niue","region":"Polynesia","lat":-19.0545,"lon":-169.9187,"lonAdj":190.081,"series":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,10.0,10.0,10.0,10.0,0.0,10.0,10.0,10.0,10.0,0.0,10.0,10.0,10.0,10.0,10.0,10.0,20.0,10.0],"latest":10.0,"earlyAvg":0.0,"recentAvg":12.0,"riseCm":12.0,"trendMmYr":4.92},
    {"id":"cook-islands","name":"Cook Islands","region":"Polynesia","lat":-21.2078,"lon":-159.775,"lonAdj":200.225,"series":[0.0,0.0,0.0,0.0,0.0,-10.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,10.0,10.0,0.0,0.0,0.0,10.0,0.0,0.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0],"latest":10.0,"earlyAvg":0.0,"recentAvg":10.0,"riseCm":10.0,"trendMmYr":4.64},
    {"id":"french-polynesia","name":"French Polynesia","region":"Polynesia","lat":-17.5516,"lon":-149.5585,"lonAdj":210.441,"series":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,10.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0],"latest":10.0,"earlyAvg":0.0,"recentAvg":10.0,"riseCm":10.0,"trendMmYr":4.15},
    {"id":"kiribati","name":"Kiribati","region":"Micronesia","lat":1.329,"lon":172.979,"lonAdj":172.979,"series":[0.0,0.0,0.0,0.0,0.0,-10.0,0.0,0.0,0.0,10.0,10.0,10.0,10.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0],"latest":10.0,"earlyAvg":0.0,"recentAvg":10.0,"riseCm":10.0,"trendMmYr":3.91},
    {"id":"nauru","name":"Nauru","region":"Micronesia","lat":-0.5477,"lon":166.9209,"lonAdj":166.921,"series":[0.0,0.0,0.0,0.0,0.0,-10.0,0.0,0.0,0.0,0.0,0.0,10.0,10.0,10.0,0.0,0.0,10.0,0.0,10.0,10.0,10.0,10.0,10.0,0.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0],"latest":10.0,"earlyAvg":0.0,"recentAvg":10.0,"riseCm":10.0,"trendMmYr":4.48},
    {"id":"new-caledonia","name":"New Caledonia","region":"Melanesia","lat":-22.2758,"lon":166.458,"lonAdj":166.458,"series":[0.0,0.0,0.0,0.0,0.0,10.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,10.0,10.0,0.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0],"latest":10.0,"earlyAvg":0.0,"recentAvg":10.0,"riseCm":10.0,"trendMmYr":4.31},
    {"id":"northern-mariana-islands","name":"Northern Mariana Islands","region":"Micronesia","lat":15.1778,"lon":145.7503,"lonAdj":145.75,"series":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,10.0,0.0,10.0,10.0,0.0,0.0,0.0,0.0,10.0,0.0,0.0,0.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0],"latest":10.0,"earlyAvg":0.0,"recentAvg":10.0,"riseCm":10.0,"trendMmYr":3.43},
    {"id":"samoa","name":"Samoa","region":"Polynesia","lat":-13.8506,"lon":-171.7513,"lonAdj":188.249,"series":[0.0,0.0,0.0,10.0,0.0,-20.0,0.0,0.0,0.0,0.0,0.0,10.0,0.0,10.0,10.0,10.0,0.0,0.0,10.0,10.0,0.0,0.0,10.0,0.0,10.0,10.0,10.0,10.0,20.0,10.0,10.0],"latest":10.0,"earlyAvg":2.0,"recentAvg":12.0,"riseCm":10.0,"trendMmYr":4.52},
    {"id":"tonga","name":"Tonga","region":"Polynesia","lat":-21.1393,"lon":-175.2049,"lonAdj":184.795,"series":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,10.0,0.0,10.0,0.0,0.0,0.0,0.0,10.0,10.0,10.0,0.0,10.0,10.0,10.0,10.0,0.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0],"latest":10.0,"earlyAvg":0.0,"recentAvg":10.0,"riseCm":10.0,"trendMmYr":3.87},
    {"id":"tuvalu","name":"Tuvalu","region":"Polynesia","lat":-8.5167,"lon":179.2167,"lonAdj":179.217,"series":[0.0,0.0,0.0,0.0,0.0,-20.0,0.0,0.0,0.0,10.0,0.0,10.0,10.0,10.0,10.0,10.0,0.0,0.0,10.0,0.0,10.0,10.0,10.0,0.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0],"latest":10.0,"earlyAvg":0.0,"recentAvg":10.0,"riseCm":10.0,"trendMmYr":4.4},
    {"id":"wallis-and-futuna","name":"Wallis and Futuna","region":"Polynesia","lat":-13.2825,"lon":-176.1742,"lonAdj":183.826,"series":[0.0,0.0,0.0,10.0,0.0,-20.0,0.0,0.0,10.0,0.0,0.0,0.0,0.0,10.0,10.0,10.0,10.0,0.0,10.0,10.0,0.0,0.0,0.0,0.0,10.0,10.0,10.0,10.0,20.0,10.0,10.0],"latest":10.0,"earlyAvg":2.0,"recentAvg":12.0,"riseCm":10.0,"trendMmYr":4.15},
    {"id":"american-samoa","name":"American Samoa","region":"Polynesia","lat":-14.2756,"lon":-170.702,"lonAdj":189.298,"series":[0.0,0.0,0.0,10.0,0.0,-20.0,0.0,0.0,0.0,0.0,0.0,10.0,0.0,10.0,10.0,10.0,0.0,0.0,10.0,0.0,0.0,0.0,10.0,0.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0],"latest":10.0,"earlyAvg":2.0,"recentAvg":10.0,"riseCm":8.0,"trendMmYr":3.83},
    {"id":"tokelau","name":"Tokelau","region":"Polynesia","lat":-9.3805,"lon":-171.2479,"lonAdj":188.752,"series":[0.0,0.0,10.0,0.0,0.0,-10.0,0.0,0.0,0.0,10.0,10.0,10.0,10.0,0.0,10.0,0.0,0.0,0.0,0.0,0.0,10.0,10.0,10.0,0.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0],"latest":10.0,"earlyAvg":2.0,"recentAvg":10.0,"riseCm":8.0,"trendMmYr":3.23}
  ],
  "basinMean": [-1.905,-0.476,0.0,1.905,-1.905,-6.19,1.429,3.333,2.381,1.429,0.952,2.857,2.857,4.286,6.19,8.095,5.714,2.381,7.619,6.667,6.667,5.238,2.857,3.333,10.0,8.571,9.048,10.0,12.381,13.333,10.476],
  "basinSmooth": [-0.794,-0.119,-0.476,-1.333,-0.952,-0.286,-0.19,0.476,1.905,2.19,2.095,2.476,3.428,4.857,5.428,5.333,6.0,6.095,5.81,5.714,5.81,4.952,5.619,6.0,6.762,8.19,10.0,10.667,11.048,11.547,12.063],
  "meta": {
    "source": "Pacific Community (SPC) Pacific Data Hub - Climate Change Indicators: Sea Level Anomalies",
    "unit": "cm relative to 1993 baseline",
    "lastUpdated": "2026-05-26"
  }
};

/* ----------------------------------------------------------------
   Derived / reference constants used by the new sections.
   Global rate is the IPCC AR6 / NOAA-cited modern satellite-era
   average (~3.3 mm/yr, 1993–2023). Pacific rate is computed directly
   from DATA.basinMean via simple linear regression (see js/main.js).
   These are presented as an order-of-magnitude comparison, not a
   precise scientific reconciliation of differing methodologies.
---------------------------------------------------------------- */
const GLOBAL_MEAN_RATE_MM_YR = 3.3;          // global ocean average, satellite altimetry era
const GLOBAL_MEAN_RISE_CM_2023 = 9.6;        // approx cumulative rise 1993-2023 at global mean rate

/* Strong ENSO episodes intersecting the record, used to annotate the
   trend chart. Years mark the boreal-winter peak commonly cited for
   each event (ONI-based classification). */
const ENSO_EVENTS = [
  { year: 1997, endYear: 1998, label: "Strong El Niño", type: "elnino" },
  { year: 2015, endYear: 2016, label: "Strong El Niño", type: "elnino" },
  { year: 2010, endYear: 2011, label: "Strong La Niña", type: "lanina" }
];

/* Years to project forward to, using the basin's own 31-year linear
   trend (~4.3 mm/yr). This is a simple extrapolation of the observed
   historical rate, not a climate model projection. */
const PROJECTION_YEARS = [2030, 2040, 2050];
