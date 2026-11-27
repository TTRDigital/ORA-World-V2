/**
 * Local income taxes that reach a resident's long-term capital gains, by place, for the Act 60 calculator's address
 * lookup (client meeting, 24 Nov: "put the address and it picks up state, city and other taxes"). Researched on
 * 24 Nov 2026 from official sources: Maryland Comptroller (county rates, 2026), Indiana Departmental Notice #1
 * (county rates, Oct 2026), Michigan city income tax ordinances and MCL 141.612 (cities), NYS-50-T-Y (Yonkers),
 * Metro and Multnomah County (Oregon), Ohio Department of Taxation (school districts, 2026) and the Iowa Department
 * of Revenue (school district surtax, 2025: the 2026 list was not yet published). Keys are Census geographies as the
 * Census Bureau geocoder returns them: county FIPS, incorporated place names and school district GEOIDs (NCES IDs).
 * Ohio city taxes and Pennsylvania local earned income taxes do not reach capital gains, so they are not listed.
 */
import type { Bracket } from "./capitalGainsRates";

type Rate = { name: string; rate: number };
export type LocalTables = {
  MD: Record<string, Rate & { brackets?: Bracket[]; mode?: "marginal" | "band" }>;
  IN: Record<string, Rate>;
  MI: Record<string, Rate & { exemption: number }>;
  YONKERS: { place: string; rate: number };
  OR: {
    metroRate: number;
    metroThreshold: number;
    /** Married filing jointly (Metro 2026 tables; Multnomah County Preschool for All). */
    metroThresholdJoint: number;
    metroPlaces: string[];
    multnomahFips: string;
    multnomah: Bracket[];
    multnomahJoint: Bracket[];
  };
  OH: Record<string, Rate & { base: "traditional" | "earned" }>;
  IA: Record<string, Rate>;
};

export const LOCAL: LocalTables = {
  MD: {
    "24001": {
      name: "Allegany County",
      rate: 0.032,
    },
    "24003": {
      name: "Anne Arundel County",
      rate: 0.032,
      brackets: [
        [0, 0.027],
        [50000, 0.0294],
        [400000, 0.032],
      ],
      mode: "marginal",
    },
    "24005": {
      name: "Baltimore County",
      rate: 0.032,
    },
    "24009": {
      name: "Calvert County",
      rate: 0.032,
    },
    "24011": {
      name: "Caroline County",
      rate: 0.032,
    },
    "24013": {
      name: "Carroll County",
      rate: 0.0303,
    },
    "24015": {
      name: "Cecil County",
      rate: 0.0274,
    },
    "24017": {
      name: "Charles County",
      rate: 0.0303,
    },
    "24019": {
      name: "Dorchester County",
      rate: 0.033,
    },
    "24021": {
      name: "Frederick County",
      rate: 0.032,
      brackets: [
        [0, 0.0225],
        [25000, 0.0275],
        [50000, 0.0296],
        [150000, 0.032],
      ],
      mode: "band",
    },
    "24023": {
      name: "Garrett County",
      rate: 0.0265,
    },
    "24025": {
      name: "Harford County",
      rate: 0.0306,
    },
    "24027": {
      name: "Howard County",
      rate: 0.032,
    },
    "24029": {
      name: "Kent County",
      rate: 0.033,
    },
    "24031": {
      name: "Montgomery County",
      rate: 0.032,
    },
    "24033": {
      name: "Prince George's County",
      rate: 0.032,
    },
    "24035": {
      name: "Queen Anne's County",
      rate: 0.032,
    },
    "24037": {
      name: "St. Mary's County",
      rate: 0.032,
    },
    "24039": {
      name: "Somerset County",
      rate: 0.032,
    },
    "24041": {
      name: "Talbot County",
      rate: 0.024,
    },
    "24043": {
      name: "Washington County",
      rate: 0.0295,
    },
    "24045": {
      name: "Wicomico County",
      rate: 0.032,
    },
    "24047": {
      name: "Worcester County",
      rate: 0.0225,
    },
    "24510": {
      name: "Baltimore City",
      rate: 0.032,
    },
  },
  IN: {
    "18001": {
      name: "Adams County",
      rate: 0.016,
    },
    "18003": {
      name: "Allen County",
      rate: 0.0159,
    },
    "18005": {
      name: "Bartholomew County",
      rate: 0.0175,
    },
    "18007": {
      name: "Benton County",
      rate: 0.0179,
    },
    "18009": {
      name: "Blackford County",
      rate: 0.025,
    },
    "18011": {
      name: "Boone County",
      rate: 0.017025,
    },
    "18013": {
      name: "Brown County",
      rate: 0.025234,
    },
    "18015": {
      name: "Carroll County",
      rate: 0.024733,
    },
    "18017": {
      name: "Cass County",
      rate: 0.0295,
    },
    "18019": {
      name: "Clark County",
      rate: 0.02,
    },
    "18021": {
      name: "Clay County",
      rate: 0.0235,
    },
    "18023": {
      name: "Clinton County",
      rate: 0.0265,
    },
    "18025": {
      name: "Crawford County",
      rate: 0.0165,
    },
    "18027": {
      name: "Daviess County",
      rate: 0.015,
    },
    "18029": {
      name: "Dearborn County",
      rate: 0.014,
    },
    "18031": {
      name: "Decatur County",
      rate: 0.0245,
    },
    "18033": {
      name: "DeKalb County",
      rate: 0.0213,
    },
    "18035": {
      name: "Delaware County",
      rate: 0.015,
    },
    "18037": {
      name: "Dubois County",
      rate: 0.012,
    },
    "18039": {
      name: "Elkhart County",
      rate: 0.02,
    },
    "18041": {
      name: "Fayette County",
      rate: 0.0282,
    },
    "18043": {
      name: "Floyd County",
      rate: 0.0189,
    },
    "18045": {
      name: "Fountain County",
      rate: 0.021,
    },
    "18047": {
      name: "Franklin County",
      rate: 0.017,
    },
    "18049": {
      name: "Fulton County",
      rate: 0.0288,
    },
    "18051": {
      name: "Gibson County",
      rate: 0.013,
    },
    "18053": {
      name: "Grant County",
      rate: 0.0275,
    },
    "18055": {
      name: "Greene County",
      rate: 0.0235,
    },
    "18057": {
      name: "Hamilton County",
      rate: 0.011,
    },
    "18059": {
      name: "Hancock County",
      rate: 0.0194,
    },
    "18061": {
      name: "Harrison County",
      rate: 0.01,
    },
    "18063": {
      name: "Hendricks County",
      rate: 0.017,
    },
    "18065": {
      name: "Henry County",
      rate: 0.0202,
    },
    "18067": {
      name: "Howard County",
      rate: 0.0235,
    },
    "18069": {
      name: "Huntington County",
      rate: 0.0195,
    },
    "18071": {
      name: "Jackson County",
      rate: 0.021,
    },
    "18073": {
      name: "Jasper County",
      rate: 0.02864,
    },
    "18075": {
      name: "Jay County",
      rate: 0.025,
    },
    "18077": {
      name: "Jefferson County",
      rate: 0.0103,
    },
    "18079": {
      name: "Jennings County",
      rate: 0.025,
    },
    "18081": {
      name: "Johnson County",
      rate: 0.014,
    },
    "18083": {
      name: "Knox County",
      rate: 0.017,
    },
    "18085": {
      name: "Kosciusko County",
      rate: 0.01,
    },
    "18087": {
      name: "LaGrange County",
      rate: 0.0165,
    },
    "18089": {
      name: "Lake County",
      rate: 0.015,
    },
    "18091": {
      name: "LaPorte County",
      rate: 0.0145,
    },
    "18093": {
      name: "Lawrence County",
      rate: 0.0175,
    },
    "18095": {
      name: "Madison County",
      rate: 0.0225,
    },
    "18097": {
      name: "Marion County",
      rate: 0.0202,
    },
    "18099": {
      name: "Marshall County",
      rate: 0.0125,
    },
    "18101": {
      name: "Martin County",
      rate: 0.025,
    },
    "18103": {
      name: "Miami County",
      rate: 0.0254,
    },
    "18105": {
      name: "Monroe County",
      rate: 0.0214,
    },
    "18107": {
      name: "Montgomery County",
      rate: 0.0265,
    },
    "18109": {
      name: "Morgan County",
      rate: 0.0272,
    },
    "18111": {
      name: "Newton County",
      rate: 0.01,
    },
    "18113": {
      name: "Noble County",
      rate: 0.0175,
    },
    "18115": {
      name: "Ohio County",
      rate: 0.02,
    },
    "18117": {
      name: "Orange County",
      rate: 0.0175,
    },
    "18119": {
      name: "Owen County",
      rate: 0.025,
    },
    "18121": {
      name: "Parke County",
      rate: 0.0265,
    },
    "18123": {
      name: "Perry County",
      rate: 0.014,
    },
    "18125": {
      name: "Pike County",
      rate: 0.012,
    },
    "18127": {
      name: "Porter County",
      rate: 0.005,
    },
    "18129": {
      name: "Posey County",
      rate: 0.0145,
    },
    "18131": {
      name: "Pulaski County",
      rate: 0.0285,
    },
    "18133": {
      name: "Putnam County",
      rate: 0.023,
    },
    "18135": {
      name: "Randolph County",
      rate: 0.03,
    },
    "18137": {
      name: "Ripley County",
      rate: 0.0238,
    },
    "18139": {
      name: "Rush County",
      rate: 0.0215,
    },
    "18141": {
      name: "St. Joseph County",
      rate: 0.0175,
    },
    "18143": {
      name: "Scott County",
      rate: 0.0216,
    },
    "18145": {
      name: "Shelby County",
      rate: 0.017,
    },
    "18147": {
      name: "Spencer County",
      rate: 0.008,
    },
    "18149": {
      name: "Starke County",
      rate: 0.0171,
    },
    "18151": {
      name: "Steuben County",
      rate: 0.0199,
    },
    "18153": {
      name: "Sullivan County",
      rate: 0.017,
    },
    "18155": {
      name: "Switzerland County",
      rate: 0.0145,
    },
    "18157": {
      name: "Tippecanoe County",
      rate: 0.0128,
    },
    "18159": {
      name: "Tipton County",
      rate: 0.026,
    },
    "18161": {
      name: "Union County",
      rate: 0.0275,
    },
    "18163": {
      name: "Vanderburgh County",
      rate: 0.0125,
    },
    "18165": {
      name: "Vermillion County",
      rate: 0.015,
    },
    "18167": {
      name: "Vigo County",
      rate: 0.02,
    },
    "18169": {
      name: "Wabash County",
      rate: 0.029,
    },
    "18171": {
      name: "Warren County",
      rate: 0.0212,
    },
    "18173": {
      name: "Warrick County",
      rate: 0.01,
    },
    "18175": {
      name: "Washington County",
      rate: 0.02,
    },
    "18177": {
      name: "Wayne County",
      rate: 0.0125,
    },
    "18179": {
      name: "Wells County",
      rate: 0.021,
    },
    "18181": {
      name: "White County",
      rate: 0.0232,
    },
    "18183": {
      name: "Whitley County",
      rate: 0.016829,
    },
  },
  MI: {
    "Albion city": {
      name: "Albion",
      rate: 0.01,
      exemption: 600,
    },
    "Battle Creek city": {
      name: "Battle Creek",
      rate: 0.01,
      exemption: 750,
    },
    "Benton Harbor city": {
      name: "Benton Harbor",
      rate: 0.01,
      exemption: 750,
    },
    "Big Rapids city": {
      name: "Big Rapids",
      rate: 0.01,
      exemption: 600,
    },
    "Detroit city": {
      name: "Detroit",
      rate: 0.024,
      exemption: 600,
    },
    "East Lansing city": {
      name: "East Lansing",
      rate: 0.01,
      exemption: 600,
    },
    "Flint city": {
      name: "Flint",
      rate: 0.01,
      exemption: 600,
    },
    "Grand Rapids city": {
      name: "Grand Rapids",
      rate: 0.015,
      exemption: 600,
    },
    "Grayling city": {
      name: "Grayling",
      rate: 0.01,
      exemption: 3000,
    },
    "Hamtramck city": {
      name: "Hamtramck",
      rate: 0.01,
      exemption: 600,
    },
    "Highland Park city": {
      name: "Highland Park",
      rate: 0.02,
      exemption: 600,
    },
    "Hudson city": {
      name: "Hudson",
      rate: 0.01,
      exemption: 1000,
    },
    "Ionia city": {
      name: "Ionia",
      rate: 0.01,
      exemption: 700,
    },
    "Jackson city": {
      name: "Jackson",
      rate: 0.01,
      exemption: 600,
    },
    "Lansing city": {
      name: "Lansing",
      rate: 0.01,
      exemption: 600,
    },
    "Lapeer city": {
      name: "Lapeer",
      rate: 0.01,
      exemption: 600,
    },
    "Muskegon city": {
      name: "Muskegon",
      rate: 0.01,
      exemption: 600,
    },
    "Muskegon Heights city": {
      name: "Muskegon Heights",
      rate: 0.01,
      exemption: 600,
    },
    "Pontiac city": {
      name: "Pontiac",
      rate: 0.01,
      exemption: 600,
    },
    "Port Huron city": {
      name: "Port Huron",
      rate: 0.01,
      exemption: 600,
    },
    "Portland city": {
      name: "Portland",
      rate: 0.01,
      exemption: 1000,
    },
    "Saginaw city": {
      name: "Saginaw",
      rate: 0.015,
      exemption: 0,
    },
    "Springfield city": {
      name: "Springfield",
      rate: 0.01,
      exemption: 750,
    },
    "Walker city": {
      name: "Walker",
      rate: 0.01,
      exemption: 600,
    },
  },
  YONKERS: {
    place: "Yonkers city",
    rate: 0.1675,
  },
  OR: {
    metroRate: 0.01,
    metroThreshold: 128000,
    metroThresholdJoint: 205000,
    metroPlaces: [
      "Beaverton city",
      "Cornelius city",
      "Durham city",
      "Fairview city",
      "Forest Grove city",
      "Gladstone city",
      "Gresham city",
      "Happy Valley city",
      "Hillsboro city",
      "Johnson City city",
      "King City city",
      "Lake Oswego city",
      "Maywood Park city",
      "Milwaukie city",
      "Oregon City city",
      "Portland city",
      "Rivergrove city",
      "Sherwood city",
      "Tigard city",
      "Troutdale city",
      "Tualatin city",
      "West Linn city",
      "Wilsonville city",
      "Wood Village city",
    ],
    multnomahFips: "41051",
    multnomahJoint: [
      [200000, 0.015],
      [400000, 0.03],
    ],
    multnomah: [
      [125000, 0.015],
      [250000, 0.03],
    ],
  },
  OH: {
    "3904518": {
      name: "Ada Exempted Village School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904684": {
      name: "Amanda-Clearcreek Local School District",
      rate: 0.02,
      base: "earned",
    },
    "3910004": {
      name: "Anna Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904662": {
      name: "Ansonia Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3904899": {
      name: "Antwerp Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3910002": {
      name: "Arcadia Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904663": {
      name: "Arcanum-Butler Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904742": {
      name: "Arlington Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3904352": {
      name: "Athens City School District",
      rate: 0.01,
      base: "earned",
    },
    "3904670": {
      name: "Ayersville Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904359": {
      name: "Bellevue City School District",
      rate: 0.005,
      base: "traditional",
    },
    "3904716": {
      name: "Berkshire Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904685": {
      name: "Berne Union Local School District",
      rate: 0.02,
      base: "earned",
    },
    "3904861": {
      name: "Bethel Local School District",
      rate: 0.0075,
      base: "earned",
    },
    "3904362": {
      name: "Bexley City School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904674": {
      name: "Big Walnut Local School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904638": {
      name: "Blanchester Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904686": {
      name: "Bloom-Carroll Local School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904521": {
      name: "Bluffton Exempted Village School District",
      rate: 0.005,
      base: "traditional",
    },
    "3904976": {
      name: "Botkins Local School District",
      rate: 0.0125,
      base: "earned",
    },
    "3904363": {
      name: "Bowling Green City School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904522": {
      name: "Bradford Exempted Village School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3904367": {
      name: "Bryan City School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904650": {
      name: "Buckeye Central Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904675": {
      name: "Buckeye Valley Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904694": {
      name: "Canal Winchester Local School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904879": {
      name: "Cardington-Lincoln Local School District",
      rate: 0.0075,
      base: "earned",
    },
    "3904526": {
      name: "Carey Exempted Village School District",
      rate: 0.01,
      base: "traditional",
    },
    "3905041": {
      name: "Carlisle Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904725": {
      name: "Cedar Cliff Local School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3910030": {
      name: "Celina City School District",
      rate: 0.01,
      base: "earned",
    },
    "3904782": {
      name: "Centerburg Local School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904671": {
      name: "Central Local School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3905053": {
      name: "Chippewa Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904376": {
      name: "Circleville City School District",
      rate: 0.0075,
      base: "earned",
    },
    "3904941": {
      name: "Clear Fork Valley Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904632": {
      name: "Clermont Northeastern Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904639": {
      name: "Clinton-Massie Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904848": {
      name: "Cloverleaf Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3910020": {
      name: "Clyde-Green Springs Exempted Village School District",
      rate: 0.015,
      base: "earned",
    },
    "3904531": {
      name: "Coldwater Exempted Village School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904651": {
      name: "Colonel Crawford Local School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904532": {
      name: "Columbiana Exempted Village School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904931": {
      name: "Columbus Grove Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904932": {
      name: "Continental Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904743": {
      name: "Cory-Rawson Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3904533": {
      name: "Covington Exempted Village School District",
      rate: 0.02,
      base: "traditional",
    },
    "3910008": {
      name: "Crestline Exempted Village School District",
      rate: 0.0025,
      base: "earned",
    },
    "3904643": {
      name: "Crestview Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3905035": {
      name: "Crestview Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3905054": {
      name: "Dalton Local School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904783": {
      name: "Danville Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3904386": {
      name: "Defiance City School District",
      rate: 0.005,
      base: "traditional",
    },
    "3904388": {
      name: "Delphos City School District",
      rate: 0.005,
      base: "traditional",
    },
    "3905067": {
      name: "Eastwood Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904393": {
      name: "Eaton Community City School District",
      rate: 0.015,
      base: "traditional",
    },
    "3905061": {
      name: "Edgerton Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904841": {
      name: "Elgin Local School District",
      rate: 0.0075,
      base: "earned",
    },
    "3905068": {
      name: "Elmwood Local School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904705": {
      name: "Evergreen Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3905032": {
      name: "Fairbanks Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904396": {
      name: "Fairborn City School District",
      rate: 0.005,
      base: "traditional",
    },
    "3904687": {
      name: "Fairfield Union Local School District",
      rate: 0.02,
      base: "traditional",
    },
    "3904977": {
      name: "Fairlawn Local School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904706": {
      name: "Fayette Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3910000": {
      name: "Findlay City School District",
      rate: 0.01,
      base: "earned",
    },
    "3904978": {
      name: "Fort Loramie Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904859": {
      name: "Fort Recovery Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904664": {
      name: "Franklin Monroe Local School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904401": {
      name: "Fremont City School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904405": {
      name: "Geneva Area City School District",
      rate: 0.0125,
      base: "earned",
    },
    "3904538": {
      name: "Gibsonburg Exempted Village School District",
      rate: 0.01,
      base: "earned",
    },
    "3904634": {
      name: "Goshen Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904539": {
      name: "Granville Exempted Village School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3905055": {
      name: "Green Local School District",
      rate: 0.005,
      base: "earned",
    },
    "3904726": {
      name: "Greeneview Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904540": {
      name: "Greenfield Exempted Village School District",
      rate: 0.0125,
      base: "earned",
    },
    "3904409": {
      name: "Greenville City School District",
      rate: 0.005,
      base: "traditional",
    },
    "3904749": {
      name: "Hardin Northern Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3904979": {
      name: "Hardin-Houston Local School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904541": {
      name: "Hicksville Exempted Village School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904880": {
      name: "Highland Local School District",
      rate: 0.005,
      base: "traditional",
    },
    "3904412": {
      name: "Hillsboro City School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904582": {
      name: "Hillsdale Local School District",
      rate: 0.0125,
      base: "earned",
    },
    "3904757": {
      name: "Holgate Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904970": {
      name: "Hopewell-Loudon Local School District",
      rate: 0.005,
      base: "earned",
    },
    "3910005": {
      name: "Jackson Center Local School District",
      rate: 0.015,
      base: "earned",
    },
    "3904920": {
      name: "James A. Garfield Local School District",
      rate: 0.015,
      base: "earned",
    },
    "3904825": {
      name: "Jefferson Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904933": {
      name: "Jennings Local School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904798": {
      name: "Johnstown-Monroe Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904826": {
      name: "Jonathan Alder Local School District",
      rate: 0.0125,
      base: "earned",
    },
    "3904934": {
      name: "Kalida Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3910025": {
      name: "Kenton City School District",
      rate: 0.01,
      base: "traditional",
    },
    "3905043": {
      name: "Kings Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904956": {
      name: "Lakota Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904420": {
      name: "Lancaster City School District",
      rate: 0.015,
      base: "earned",
    },
    "3904935": {
      name: "Leipsic Local School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904758": {
      name: "Liberty Center Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3904688": {
      name: "Liberty Union-Thurston Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3904744": {
      name: "Liberty-Benton Local School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904801": {
      name: "Licking Valley Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904908": {
      name: "Logan Elm Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904425": {
      name: "London City School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904546": {
      name: "Loudonville-Perrysville Exempted Village School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904612": {
      name: "Madison Local School District",
      rate: 0.005,
      base: "traditional",
    },
    "3904827": {
      name: "Madison-Plains Local School District",
      rate: 0.0125,
      base: "earned",
    },
    "3910031": {
      name: "Marion Local School District",
      rate: 0.005,
      base: "earned",
    },
    "3904745": {
      name: "McComb Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904548": {
      name: "Mechanicsburg Exempted Village School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904862": {
      name: "Miami East Local School District",
      rate: 0.0175,
      base: "earned",
    },
    "3905063": {
      name: "Millcreek-West Unity Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904936": {
      name: "Miller City-New Cleveland Local School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904551": {
      name: "Milton-Union Exempted Village School District",
      rate: 0.02,
      base: "earned",
    },
    "3904594": {
      name: "Minster Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904667": {
      name: "Mississinawa Valley Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3905074": {
      name: "Mohawk Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904771": {
      name: "Monroeville Local School District",
      rate: 0.015,
      base: "earned",
    },
    "3904552": {
      name: "Montpelier Exempted Village School District",
      rate: 0.0125,
      base: "earned",
    },
    "3904553": {
      name: "Mount Gilead Exempted Village School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904927": {
      name: "National Trail Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3904595": {
      name: "New Bremen Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904596": {
      name: "New Knoxville Local School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904871": {
      name: "New Lebanon Local School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904772": {
      name: "New London Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904613": {
      name: "New Miami Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904971": {
      name: "New Riegel Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904445": {
      name: "Newark City School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904863": {
      name: "Newton Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3905070": {
      name: "North Baltimore Local School District",
      rate: 0.0125,
      base: "earned",
    },
    "3904802": {
      name: "North Fork Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3905033": {
      name: "North Union Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904625": {
      name: "Northeastern Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904881": {
      name: "Northmor Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904803": {
      name: "Northridge Local School District",
      rate: 0.005,
      base: "earned",
    },
    "3904990": {
      name: "Northwest Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904626": {
      name: "Northwestern Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3910033": {
      name: "Northwestern Local School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3905071": {
      name: "Northwood Local School District",
      rate: 0.0025,
      base: "earned",
    },
    "3904455": {
      name: "Norton City School District",
      rate: 0.005,
      base: "earned",
    },
    "3904456": {
      name: "Norwalk City School District",
      rate: 0.005,
      base: "traditional",
    },
    "3905056": {
      name: "Norwayne Local School District",
      rate: 0.0075,
      base: "earned",
    },
    "3904459": {
      name: "Oberlin City School District",
      rate: 0.02,
      base: "traditional",
    },
    "3910021": {
      name: "Old Fort Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3905072": {
      name: "Otsego Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904937": {
      name: "Ottawa-Glandorf Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904938": {
      name: "Ottoville Local School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904939": {
      name: "Pandora-Gilboa Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3904857": {
      name: "Parkway Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904759": {
      name: "Patrick Henry Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3904557": {
      name: "Paulding Exempted Village School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904558": {
      name: "Perrysburg Exempted Village School District",
      rate: 0.005,
      base: "traditional",
    },
    "3904707": {
      name: "Pettisville Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904689": {
      name: "Pickerington Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904708": {
      name: "Pike-Delta-York Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904464": {
      name: "Piqua City School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904842": {
      name: "Pleasant Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904946": {
      name: "Plymouth-Shiloh Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904928": {
      name: "Preble Shawnee Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3904700": {
      name: "Reynoldsburg City School District",
      rate: 0.005,
      base: "traditional",
    },
    "3904843": {
      name: "Ridgedale Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904750": {
      name: "Ridgemont Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3904844": {
      name: "River Valley Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904751": {
      name: "Riverdale Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904809": {
      name: "Riverside Local School District",
      rate: 0.015,
      base: "earned",
    },
    "3904614": {
      name: "Ross Local School District",
      rate: 0.0125,
      base: "earned",
    },
    "3904981": {
      name: "Russia Local School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904835": {
      name: "Sebring Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904968": {
      name: "Seneca East Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3910009": {
      name: "Shelby City School District",
      rate: 0.01,
      base: "traditional",
    },
    "3910003": {
      name: "Sidney City School District",
      rate: 0.0075,
      base: "earned",
    },
    "3904773": {
      name: "South Central Local School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904627": {
      name: "Southeastern Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904804": {
      name: "Southwest Licking Local School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904738": {
      name: "Southwest Local School District",
      rate: 0.0075,
      base: "earned",
    },
    "3904580": {
      name: "Spencerville Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904837": {
      name: "Springfield Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904472": {
      name: "St. Marys City School District",
      rate: 0.01,
      base: "earned",
    },
    "3905065": {
      name: "Stryker Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904709": {
      name: "Swanton Local School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3904615": {
      name: "Talawanda City School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904909": {
      name: "Teays Valley Local School District",
      rate: 0.015,
      base: "earned",
    },
    "3904489": {
      name: "Tiffin City School District",
      rate: 0.0075,
      base: "earned",
    },
    "3904926": {
      name: "Tri-County North Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904668": {
      name: "Tri-Village Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904620": {
      name: "Triad Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904592": {
      name: "Trimble Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3905059": {
      name: "Triway Local School District",
      rate: 0.01,
      base: "earned",
    },
    "3904492": {
      name: "Troy City School District",
      rate: 0.015,
      base: "earned",
    },
    "3904900": {
      name: "Twin Valley Community Local School District",
      rate: 0.015,
      base: "traditional",
    },
    "3904953": {
      name: "Union-Scioto Local School District",
      rate: 0.005,
      base: "traditional",
    },
    "3904645": {
      name: "United Local School District",
      rate: 0.005,
      base: "traditional",
    },
    "3910024": {
      name: "Upper Sandusky Exempted Village School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904752": {
      name: "Upper Scioto Valley Local School District",
      rate: 0.005,
      base: "traditional",
    },
    "3904874": {
      name: "Valley View Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3910001": {
      name: "Van Buren Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3910023": {
      name: "Van Wert City School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904747": {
      name: "Vanlue Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904563": {
      name: "Versailles Exempted Village School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904690": {
      name: "Walnut Township Local School District",
      rate: 0.0175,
      base: "earned",
    },
    "3904498": {
      name: "Wapakoneta City School District",
      rate: 0.0075,
      base: "traditional",
    },
    "3910011": {
      name: "Washington Court House City School District",
      rate: 0.01,
      base: "earned",
    },
    "3904564": {
      name: "Wauseon Exempted Village School District",
      rate: 0.0175,
      base: "earned",
    },
    "3904903": {
      name: "Wayne Trace Local School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904597": {
      name: "Waynesfield-Goshen Local School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904565": {
      name: "Wellington Exempted Village School District",
      rate: 0.01,
      base: "traditional",
    },
    "3904621": {
      name: "West Liberty-Salem Local School District",
      rate: 0.0175,
      base: "traditional",
    },
    "3904774": {
      name: "Western Reserve Local School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904504": {
      name: "Westerville City School District",
      rate: 0.0075,
      base: "earned",
    },
    "3904509": {
      name: "Willard City School District",
      rate: 0.0075,
      base: "earned",
    },
    "3904514": {
      name: "Wyoming City School District",
      rate: 0.0125,
      base: "traditional",
    },
    "3904515": {
      name: "Xenia Community City School District",
      rate: 0.005,
      base: "traditional",
    },
    "3904567": {
      name: "Yellow Springs Exempted Village School District",
      rate: 0.02,
      base: "traditional",
    },
    "3904954": {
      name: "Zane Trace Local School District",
      rate: 0.0075,
      base: "earned",
    },
  },
  IA: {
    "1903090": {
      name: "Adair-Casey Community School District",
      rate: 0.08,
    },
    "1903150": {
      name: "Adel-De Soto-Minburn Community School District",
      rate: 0.0,
    },
    "1903060": {
      name: "AGWSR Community School District",
      rate: 0.17,
    },
    "1904080": {
      name: "AHSTW Community School District",
      rate: 0.01,
    },
    "1903220": {
      name: "Akron-Westfield Community School District",
      rate: 0.12,
    },
    "1900031": {
      name: "Albert City-Truesdale Community School District",
      rate: 0.0,
    },
    "1903270": {
      name: "Albia Community School District",
      rate: 0.01,
    },
    "1903300": {
      name: "Alburnett Community School District",
      rate: 0.05,
    },
    "1900032": {
      name: "Alden Community School District",
      rate: 0.08,
    },
    "1903360": {
      name: "Algona Community School District",
      rate: 0.06,
    },
    "1903390": {
      name: "Allamakee Community School District",
      rate: 0.11,
    },
    "1903480": {
      name: "Alta-Aurelia Community School District",
      rate: 0.09,
    },
    "1903540": {
      name: "Ames Community School District",
      rate: 0.03,
    },
    "1903570": {
      name: "Anamosa Community School District",
      rate: 0.08,
    },
    "1903630": {
      name: "Andrew Community School District",
      rate: 0.05,
    },
    "1903690": {
      name: "Ankeny Community School District",
      rate: 0.0,
    },
    "1903750": {
      name: "Aplington-Parkersburg Community School District",
      rate: 0.07,
    },
    "1903780": {
      name: "Ar-We-Va Community School District",
      rate: 0.05,
    },
    "1903930": {
      name: "Atlantic Community School District",
      rate: 0.08,
    },
    "1903960": {
      name: "Audubon Community School District",
      rate: 0.06,
    },
    "1904200": {
      name: "Ballard Community School District",
      rate: 0.02,
    },
    "1904380": {
      name: "Baxter Community School District",
      rate: 0.09,
    },
    "1904440": {
      name: "BCLUW Community School District",
      rate: 0.05,
    },
    "1904560": {
      name: "Bedford Community School District",
      rate: 0.07,
    },
    "1904620": {
      name: "Belle Plaine Community School District",
      rate: 0.02,
    },
    "1904650": {
      name: "Bellevue Community School District",
      rate: 0.07,
    },
    "1904680": {
      name: "Belmond-Klemme Community School District",
      rate: 0.08,
    },
    "1904740": {
      name: "Bennett Community School District",
      rate: 0.01,
    },
    "1904830": {
      name: "Benton Community School District",
      rate: 0.08,
    },
    "1904860": {
      name: "Bettendorf Community School District",
      rate: 0.0,
    },
    "1905070": {
      name: "Bondurant-Farrar Community School District",
      rate: 0.0,
    },
    "1905130": {
      name: "Boone Community School District",
      rate: 0.01,
    },
    "1905190": {
      name: "Boyden-Hull Community School District",
      rate: 0.03,
    },
    "1909570": {
      name: "Boyer Valley Community School District",
      rate: 0.02,
    },
    "1905490": {
      name: "Brooklyn-Guernsey-Malcom Community School District",
      rate: 0.02,
    },
    "1905790": {
      name: "Burlington Community School District",
      rate: 0.0,
    },
    "1905970": {
      name: "CAL Community School District",
      rate: 0.11,
    },
    "1906000": {
      name: "Calamus-Wheatland Community School District",
      rate: 0.06,
    },
    "1905940": {
      name: "CAM Community School District",
      rate: 0.1,
    },
    "1906060": {
      name: "Camanche Community School District",
      rate: 0.0,
    },
    "1906240": {
      name: "Cardinal Community School District",
      rate: 0.07,
    },
    "1906270": {
      name: "Carlisle Community School District",
      rate: 0.0,
    },
    "1906330": {
      name: "Carroll Community School District",
      rate: 0.04,
    },
    "1906510": {
      name: "Cedar Falls Community School District",
      rate: 0.01,
    },
    "1906540": {
      name: "Cedar Rapids Community School District",
      rate: 0.05,
    },
    "1906660": {
      name: "Center Point-Urbana Community School District",
      rate: 0.01,
    },
    "1906750": {
      name: "Centerville Community School District",
      rate: 0.05,
    },
    "1906780": {
      name: "Central City Community School District",
      rate: 0.01,
    },
    "1906840": {
      name: "Central Community School District",
      rate: 0.01,
    },
    "1906810": {
      name: "Central DeWitt Community School District",
      rate: 0.07,
    },
    "1906900": {
      name: "Central Decatur Community School District",
      rate: 0.07,
    },
    "1906930": {
      name: "Central Lee Community School District",
      rate: 0.06,
    },
    "1906960": {
      name: "Central Lyon Community School District",
      rate: 0.06,
    },
    "1920760": {
      name: "Central Springs Community School District",
      rate: 0.16,
    },
    "1907050": {
      name: "Chariton Community School District",
      rate: 0.05,
    },
    "1907080": {
      name: "Charles City Community School District",
      rate: 0.08,
    },
    "1907110": {
      name: "Charter Oak-Ute Community School District",
      rate: 0.02,
    },
    "1907170": {
      name: "Cherokee Community School District",
      rate: 0.05,
    },
    "1907350": {
      name: "Clarinda Community School District",
      rate: 0.08,
    },
    "1907380": {
      name: "Clarion-Goldfield-Dows Community School District",
      rate: 0.08,
    },
    "1907410": {
      name: "Clarke Community School District",
      rate: 0.1,
    },
    "1907440": {
      name: "Clarksville Community School District",
      rate: 0.05,
    },
    "1907470": {
      name: "Clay Central-Everly Community School District",
      rate: 0.01,
    },
    "1913350": {
      name: "Clayton Ridge Community School District",
      rate: 0.0,
    },
    "1907590": {
      name: "Clear Creek-Amana Community School District",
      rate: 0.05,
    },
    "1907620": {
      name: "Clear Lake Community School District",
      rate: 0.05,
    },
    "1907710": {
      name: "Clinton Community School District",
      rate: 0.04,
    },
    "1900009": {
      name: "Colfax-Mingo Community School District",
      rate: 0.03,
    },
    "1907860": {
      name: "College Community School District",
      rate: 0.0,
    },
    "1907900": {
      name: "Collins-Maxwell Community School District",
      rate: 0.04,
    },
    "1907920": {
      name: "Colo-NESCO Community School District",
      rate: 0.01,
    },
    "1907980": {
      name: "Columbus Community School District",
      rate: 0.1,
    },
    "1908070": {
      name: "Coon Rapids-Bayard Community School District",
      rate: 0.06,
    },
    "1908130": {
      name: "Corning Community School District",
      rate: 0.03,
    },
    "1908220": {
      name: "Council Bluffs Community School District",
      rate: 0.0,
    },
    "1908310": {
      name: "Creston Community School District",
      rate: 0.08,
    },
    "1908520": {
      name: "Dallas Center-Grimes Community School District",
      rate: 0.0,
    },
    "1908550": {
      name: "Danville Community School District",
      rate: 0.07,
    },
    "1908580": {
      name: "Davenport Community School District",
      rate: 0.0,
    },
    "1908610": {
      name: "Davis County Community School District",
      rate: 0.08,
    },
    "1908730": {
      name: "Decorah Community School District",
      rate: 0.07,
    },
    "1908880": {
      name: "Delwood Community School District",
      rate: 0.09,
    },
    "1908910": {
      name: "Denison Community School District",
      rate: 0.05,
    },
    "1908940": {
      name: "Denver Community School District",
      rate: 0.04,
    },
    "1908970": {
      name: "Des Moines Independent Community School District",
      rate: 0.0,
    },
    "1909060": {
      name: "Diagonal Community School District",
      rate: 0.08,
    },
    "1909120": {
      name: "Dike-New Hartford Community School District",
      rate: 0.08,
    },
    "1909480": {
      name: "Dubuque Community School District",
      rate: 0.0,
    },
    "1909540": {
      name: "Dunkerton Community School District",
      rate: 0.01,
    },
    "1909600": {
      name: "Durant Community School District",
      rate: 0.18,
    },
    "1909990": {
      name: "Eagle Grove Community School District",
      rate: 0.01,
    },
    "1910050": {
      name: "Earlham Community School District",
      rate: 0.0,
    },
    "1910110": {
      name: "East Buchanan Community School District",
      rate: 0.1,
    },
    "1900040": {
      name: "East Marshall Community School District",
      rate: 0.08,
    },
    "1918240": {
      name: "East Mills Community School District",
      rate: 0.2,
    },
    "1929580": {
      name: "East Sac County Community School District",
      rate: 0.01,
    },
    "1910350": {
      name: "East Union Community School District",
      rate: 0.05,
    },
    "1910410": {
      name: "Eastern Allamakee Community School District",
      rate: 0.06,
    },
    "1910130": {
      name: "Easton Valley Community School District",
      rate: 0.04,
    },
    "1904950": {
      name: "Eddyville-Blakesburg-Fremont Community School District",
      rate: 0.1,
    },
    "1910500": {
      name: "Edgewood-Colesburg Community School District",
      rate: 0.05,
    },
    "1910690": {
      name: "Eldora-New Providence Community School District",
      rate: 0.02,
    },
    "1910950": {
      name: "Emmetsburg Community School District",
      rate: 0.13,
    },
    "1910980": {
      name: "English Valleys Community School District",
      rate: 0.08,
    },
    "1911040": {
      name: "Essex Community School District",
      rate: 0.07,
    },
    "1911070": {
      name: "Estherville Lincoln Central Community School District",
      rate: 0.1,
    },
    "1911250": {
      name: "Exira-Elk Horn-Kimballton Community School District",
      rate: 0.03,
    },
    "1911340": {
      name: "Fairfield Community School District",
      rate: 0.01,
    },
    "1911790": {
      name: "Forest City Community School District",
      rate: 0.12,
    },
    "1911820": {
      name: "Fort Dodge Community School District",
      rate: 0.02,
    },
    "1911850": {
      name: "Fort Madison Community School District",
      rate: 0.05,
    },
    "1912120": {
      name: "Fremont-Mills Community School District",
      rate: 0.2,
    },
    "1912230": {
      name: "Galva-Holstein Community School District",
      rate: 0.1,
    },
    "1912330": {
      name: "Garner-Hayfield-Ventura Community School District",
      rate: 0.08,
    },
    "1912480": {
      name: "George-Little Rock Community School District",
      rate: 0.16,
    },
    "1912510": {
      name: "Gilbert Community School District",
      rate: 0.0,
    },
    "1912600": {
      name: "Gilmore City-Bradgate Community School District",
      rate: 0.1,
    },
    "1912660": {
      name: "Gladbrook-Reinbeck Community School District",
      rate: 0.02,
    },
    "1912690": {
      name: "Glenwood Community School District",
      rate: 0.1,
    },
    "1912750": {
      name: "Glidden-Ralston Community School District",
      rate: 0.08,
    },
    "1900060": {
      name: "GMG Community School District",
      rate: 0.1,
    },
    "1912810": {
      name: "Graettinger-Terril Community School District",
      rate: 0.05,
    },
    "1915210": {
      name: "Greene County Community School District",
      rate: 0.1,
    },
    "1913200": {
      name: "Grinnell-Newburg Community School District",
      rate: 0.02,
    },
    "1913230": {
      name: "Griswold Community School District",
      rate: 0.01,
    },
    "1913290": {
      name: "Grundy Center Community School District",
      rate: 0.06,
    },
    "1913320": {
      name: "Guthrie Center Community School District",
      rate: 0.1,
    },
    "1913440": {
      name: "Hamburg Community School District",
      rate: 0.02,
    },
    "1913470": {
      name: "Hampton-Dumont Community School District",
      rate: 0.03,
    },
    "1913500": {
      name: "Harlan Community School District",
      rate: 0.07,
    },
    "1916140": {
      name: "Harris-Lake Park Community School District",
      rate: 0.0,
    },
    "1913660": {
      name: "Hartley-Melvin-Sanborn Community School District",
      rate: 0.02,
    },
    "1914010": {
      name: "Highland Community School District",
      rate: 0.04,
    },
    "1914160": {
      name: "Hinton Community School District",
      rate: 0.08,
    },
    "1913380": {
      name: "H-L-V Community School District",
      rate: 0.1,
    },
    "1914280": {
      name: "Howard-Winneshiek Community School District",
      rate: 0.06,
    },
    "1914310": {
      name: "Hubbard-Radcliffe Community School District",
      rate: 0.0,
    },
    "1914340": {
      name: "Hudson Community School District",
      rate: 0.07,
    },
    "1914370": {
      name: "Humboldt Community School District",
      rate: 0.02,
    },
    "1914880": {
      name: "IKM-Manning Community School District",
      rate: 0.05,
    },
    "1914580": {
      name: "Independence Community School District",
      rate: 0.05,
    },
    "1914640": {
      name: "Indianola Community School District",
      rate: 0.05,
    },
    "1914670": {
      name: "Interstate 35 Community School District",
      rate: 0.01,
    },
    "1914700": {
      name: "Iowa City Community School District",
      rate: 0.04,
    },
    "1914730": {
      name: "Iowa Falls Community School District",
      rate: 0.04,
    },
    "1914850": {
      name: "Iowa Valley Community School District",
      rate: 0.12,
    },
    "1915180": {
      name: "Janesville Consolidated School District",
      rate: 0.06,
    },
    "1915330": {
      name: "Jesup Community School District",
      rate: 0.0,
    },
    "1915450": {
      name: "Johnston Community School District",
      rate: 0.0,
    },
    "1915630": {
      name: "Keokuk Community School District",
      rate: 0.0,
    },
    "1915660": {
      name: "Keota Community School District",
      rate: 0.03,
    },
    "1915750": {
      name: "Kingsley-Pierson Community School District",
      rate: 0.02,
    },
    "1915840": {
      name: "Knoxville Community School District",
      rate: 0.09,
    },
    "1916110": {
      name: "Lake Mills Community School District",
      rate: 0.07,
    },
    "1916320": {
      name: "Lamoni Community School District",
      rate: 0.04,
    },
    "1916420": {
      name: "Laurens-Marathon Community School District",
      rate: 0.09,
    },
    "1916440": {
      name: "Lawton-Bronson Community School District",
      rate: 0.01,
    },
    "1916530": {
      name: "Le Mars Community School District",
      rate: 0.0,
    },
    "1916620": {
      name: "Lenox Community School District",
      rate: 0.02,
    },
    "1916680": {
      name: "Lewis Central Community School District",
      rate: 0.07,
    },
    "1917220": {
      name: "Linn-Mar Community School District",
      rate: 0.0,
    },
    "1917250": {
      name: "Lisbon Community School District",
      rate: 0.02,
    },
    "1917460": {
      name: "Logan-Magnolia Community School District",
      rate: 0.08,
    },
    "1917550": {
      name: "Lone Tree Community School District",
      rate: 0.02,
    },
    "1917820": {
      name: "Louisa-Muscatine Community School District",
      rate: 0.1,
    },
    "1918030": {
      name: "Lynnville-Sully Community School District",
      rate: 0.06,
    },
    "1918180": {
      name: "Madrid Community School District",
      rate: 0.07,
    },
    "1918330": {
      name: "Manson Northwest Webster Community School District",
      rate: 0.08,
    },
    "1918480": {
      name: "Maple Valley-Anthon Oto Community School District",
      rate: 0.05,
    },
    "1918510": {
      name: "Maquoketa Community School District",
      rate: 0.08,
    },
    "1918540": {
      name: "Maquoketa Valley Community School District",
      rate: 0.0,
    },
    "1918630": {
      name: "Marcus-Meriden-Cleghorn Community School District",
      rate: 0.07,
    },
    "1918690": {
      name: "Marion Independent School District",
      rate: 0.04,
    },
    "1918720": {
      name: "Marshalltown Community School District",
      rate: 0.04,
    },
    "1918750": {
      name: "Martensdale-St. Marys Community School District",
      rate: 0.01,
    },
    "1918780": {
      name: "Mason City Community School District",
      rate: 0.01,
    },
    "1918930": {
      name: "Mediapolis Community School District",
      rate: 0.1,
    },
    "1918960": {
      name: "Melcher-Dallas Community School District",
      rate: 0.05,
    },
    "1918120": {
      name: "MFL MarMac Community School District",
      rate: 0.1,
    },
    "1919140": {
      name: "Mid-Prairie Community School District",
      rate: 0.08,
    },
    "1919200": {
      name: "Midland Community School District",
      rate: 0.1,
    },
    "1919440": {
      name: "Missouri Valley Community School District",
      rate: 0.04,
    },
    "1918840": {
      name: "MOC-Floyd Valley Community School District",
      rate: 0.01,
    },
    "1919590": {
      name: "Montezuma Community School District",
      rate: 0.01,
    },
    "1919650": {
      name: "Monticello Community School District",
      rate: 0.07,
    },
    "1919710": {
      name: "Moravia Community School District",
      rate: 0.03,
    },
    "1919740": {
      name: "Mormon Trail Community School District",
      rate: 0.1,
    },
    "1919770": {
      name: "Morning Sun Community School District",
      rate: 0.01,
    },
    "1919800": {
      name: "Moulton-Udell Community School District",
      rate: 0.1,
    },
    "1919860": {
      name: "Mount Ayr Community School District",
      rate: 0.05,
    },
    "1919890": {
      name: "Mount Pleasant Community School District",
      rate: 0.05,
    },
    "1920040": {
      name: "Mount Vernon Community School District",
      rate: 0.05,
    },
    "1920100": {
      name: "Murray Community School District",
      rate: 0.01,
    },
    "1920130": {
      name: "Muscatine Community School District",
      rate: 0.02,
    },
    "1920190": {
      name: "Nashua-Plainfield Community School District",
      rate: 0.11,
    },
    "1920250": {
      name: "Nevada Community School District",
      rate: 0.05,
    },
    "1920340": {
      name: "New Hampton Community School District",
      rate: 0.07,
    },
    "1920460": {
      name: "New London Community School District",
      rate: 0.11,
    },
    "1920580": {
      name: "Newell-Fonda Community School District",
      rate: 0.14,
    },
    "1920610": {
      name: "Newton Community School District",
      rate: 0.07,
    },
    "1913110": {
      name: "Nodaway Valley Community School District",
      rate: 0.09,
    },
    "1903450": {
      name: "North Butler Community School District",
      rate: 0.01,
    },
    "1917100": {
      name: "North Cedar Community School District",
      rate: 0.1,
    },
    "1900006": {
      name: "North Fayette Valley Community School District",
      rate: 0.09,
    },
    "1905750": {
      name: "North Iowa Community School District",
      rate: 0.07,
    },
    "1920830": {
      name: "North Kossuth Community School District",
      rate: 0.02,
    },
    "1920820": {
      name: "North Linn Community School District",
      rate: 0.01,
    },
    "1920850": {
      name: "North Mahaska Community School District",
      rate: 0.03,
    },
    "1920910": {
      name: "North Polk Community School District",
      rate: 0.05,
    },
    "1920940": {
      name: "North Scott Community School District",
      rate: 0.02,
    },
    "1921000": {
      name: "North Tama County Community School District",
      rate: 0.08,
    },
    "1903850": {
      name: "North Union Community School District",
      rate: 0.04,
    },
    "1921090": {
      name: "Northeast Community School District",
      rate: 0.11,
    },
    "1921210": {
      name: "Northwood-Kensett Community School District",
      rate: 0.01,
    },
    "1921240": {
      name: "Norwalk Community School District",
      rate: 0.0,
    },
    "1921600": {
      name: "Odebolt Arthur Battle Creek Ida Grove Community School District",
      rate: 0.02,
    },
    "1921630": {
      name: "Oelwein Community School District",
      rate: 0.06,
    },
    "1921660": {
      name: "Ogden Community School District",
      rate: 0.05,
    },
    "1900021": {
      name: "Okoboji Community School District",
      rate: 0.01,
    },
    "1921720": {
      name: "Olin Consolidated School District",
      rate: 0.01,
    },
    "1921810": {
      name: "Orient-Macksburg Community School District",
      rate: 0.01,
    },
    "1921840": {
      name: "Osage Community School District",
      rate: 0.06,
    },
    "1921870": {
      name: "Oskaloosa Community School District",
      rate: 0.05,
    },
    "1922110": {
      name: "Ottumwa Community School District",
      rate: 0.06,
    },
    "1900025": {
      name: "Panorama Community School District",
      rate: 0.04,
    },
    "1922380": {
      name: "Paton-Churdan Community School District",
      rate: 0.05,
    },
    "1999017": {
      name: "PCM Community School District",
      rate: 0.05,
    },
    "1922440": {
      name: "Pekin Community School District",
      rate: 0.13,
    },
    "1922470": {
      name: "Pella Community School District",
      rate: 0.04,
    },
    "1922530": {
      name: "Perry Community School District",
      rate: 0.03,
    },
    "1923110": {
      name: "Pleasant Valley Community School District",
      rate: 0.0,
    },
    "1923160": {
      name: "Pleasantville Community School District",
      rate: 0.08,
    },
    "1923190": {
      name: "Pocahontas Area Community School District",
      rate: 0.08,
    },
    "1923340": {
      name: "Postville Community School District",
      rate: 0.2,
    },
    "1924000": {
      name: "Red Oak Community School District",
      rate: 0.06,
    },
    "1924120": {
      name: "Remsen-Union Community School District",
      rate: 0.01,
    },
    "1924150": {
      name: "Riceville Community School District",
      rate: 0.04,
    },
    "1910340": {
      name: "River Valley Community School District",
      rate: 0.11,
    },
    "1900027": {
      name: "Riverside Community School District",
      rate: 0.09,
    },
    "1924660": {
      name: "Rock Valley Community School District",
      rate: 0.0,
    },
    "1924870": {
      name: "Roland-Story Community School District",
      rate: 0.09,
    },
    "1924960": {
      name: "Rudd-Rockford-Marble Rock Community School District",
      rate: 0.09,
    },
    "1925050": {
      name: "Ruthven-Ayrshire Community School District",
      rate: 0.07,
    },
    "1925320": {
      name: "Saydel Community School District",
      rate: 0.0,
    },
    "1925380": {
      name: "Schaller-Crestland Community School District",
      rate: 0.02,
    },
    "1925410": {
      name: "Schleswig Community School District",
      rate: 0.05,
    },
    "1925590": {
      name: "Sergeant Bluff-Luton Community School District",
      rate: 0.0,
    },
    "1925620": {
      name: "Seymour Community School District",
      rate: 0.09,
    },
    "1925980": {
      name: "Sheldon Community School District",
      rate: 0.07,
    },
    "1926070": {
      name: "Shenandoah Community School District",
      rate: 0.16,
    },
    "1900015": {
      name: "Sibley-Ocheyedan Community School District",
      rate: 0.1,
    },
    "1926250": {
      name: "Sidney Community School District",
      rate: 0.19,
    },
    "1926280": {
      name: "Sigourney Community School District",
      rate: 0.04,
    },
    "1926370": {
      name: "Sioux Center Community School District",
      rate: 0.01,
    },
    "1900023": {
      name: "Sioux Central Community School District",
      rate: 0.06,
    },
    "1926400": {
      name: "Sioux City Community School District",
      rate: 0.04,
    },
    "1926580": {
      name: "Solon Community School District",
      rate: 0.01,
    },
    "1900024": {
      name: "South Central Calhoun Community School District",
      rate: 0.01,
    },
    "1926640": {
      name: "South Hamilton Community School District",
      rate: 0.06,
    },
    "1900026": {
      name: "South O'Brien Community School District",
      rate: 0.09,
    },
    "1926670": {
      name: "South Page Community School District",
      rate: 0.12,
    },
    "1926730": {
      name: "South Tama County Community School District",
      rate: 0.08,
    },
    "1926790": {
      name: "South Winneshiek Community School District",
      rate: 0.06,
    },
    "1926820": {
      name: "Southeast Polk Community School District",
      rate: 0.05,
    },
    "1999019": {
      name: "Southeast Valley Community School District",
      rate: 0.12,
    },
    "1926850": {
      name: "Southeast Warren Community School District",
      rate: 0.05,
    },
    "1926910": {
      name: "Spencer Community School District",
      rate: 0.04,
    },
    "1927000": {
      name: "Spirit Lake Community School District",
      rate: 0.01,
    },
    "1927060": {
      name: "Springville Community School District",
      rate: 0.02,
    },
    "1925200": {
      name: "St. Ansgar Community School District",
      rate: 0.07,
    },
    "1927240": {
      name: "Stanton Community School District",
      rate: 0.02,
    },
    "1927270": {
      name: "Starmont Community School District",
      rate: 0.02,
    },
    "1927390": {
      name: "Storm Lake Community School District",
      rate: 0.08,
    },
    "1927480": {
      name: "Stratford Community School District",
      rate: 0.04,
    },
    "1927600": {
      name: "Sumner-Fredericksburg Community School District",
      rate: 0.1,
    },
    "1927870": {
      name: "Tipton Community School District",
      rate: 0.16,
    },
    "1927960": {
      name: "Treynor Community School District",
      rate: 0.04,
    },
    "1927990": {
      name: "Tri-Center Community School District",
      rate: 0.01,
    },
    "1928020": {
      name: "Tri-County Community School District",
      rate: 0.02,
    },
    "1928050": {
      name: "Tripoli Community School District",
      rate: 0.07,
    },
    "1928110": {
      name: "Turkey Valley Community School District",
      rate: 0.0,
    },
    "1928170": {
      name: "Twin Cedars Community School District",
      rate: 0.05,
    },
    "1928200": {
      name: "Twin Rivers Community School District",
      rate: 0.08,
    },
    "1928230": {
      name: "Underwood Community School District",
      rate: 0.0,
    },
    "1900022": {
      name: "Union Community School District",
      rate: 0.07,
    },
    "1928560": {
      name: "United Community School District",
      rate: 0.01,
    },
    "1928680": {
      name: "Urbandale Community School District",
      rate: 0.0,
    },
    "1928980": {
      name: "Van Buren County Community School District",
      rate: 0.09,
    },
    "1929010": {
      name: "Van Meter Community School District",
      rate: 0.03,
    },
    "1929280": {
      name: "Villisca Community School District",
      rate: 0.05,
    },
    "1929310": {
      name: "Vinton-Shellsburg Community School District",
      rate: 0.04,
    },
    "1929490": {
      name: "WACO Community School District",
      rate: 0.0,
    },
    "1929730": {
      name: "Wapello Community School District",
      rate: 0.1,
    },
    "1929760": {
      name: "Wapsie Valley Community School District",
      rate: 0.18,
    },
    "1930240": {
      name: "Washington Community School District",
      rate: 0.08,
    },
    "1930480": {
      name: "Waterloo Community School District",
      rate: 0.0,
    },
    "1930510": {
      name: "Waukee Community School District",
      rate: 0.0,
    },
    "1930540": {
      name: "Waverly-Shell Rock Community School District",
      rate: 0.07,
    },
    "1930560": {
      name: "Wayne Community School District",
      rate: 0.04,
    },
    "1930630": {
      name: "Webster City Community School District",
      rate: 0.05,
    },
    "1930720": {
      name: "West Bend-Mallard Community School District",
      rate: 0.0,
    },
    "1930750": {
      name: "West Branch Community School District",
      rate: 0.02,
    },
    "1930780": {
      name: "West Burlington Independent School District",
      rate: 0.0,
    },
    "1930870": {
      name: "West Central Community School District",
      rate: 0.02,
    },
    "1927500": {
      name: "West Central Valley Community School District",
      rate: 0.05,
    },
    "1930900": {
      name: "West Delaware County Community School District",
      rate: 0.07,
    },
    "1930930": {
      name: "West Des Moines Community School District",
      rate: 0.0,
    },
    "1925920": {
      name: "West Fork Community School District",
      rate: 0.01,
    },
    "1905430": {
      name: "West Hancock Community School District",
      rate: 0.1,
    },
    "1930960": {
      name: "West Harrison Community School District",
      rate: 0.04,
    },
    "1930990": {
      name: "West Liberty Community School District",
      rate: 0.02,
    },
    "1931020": {
      name: "West Lyon Community School District",
      rate: 0.07,
    },
    "1931080": {
      name: "West Marshall Community School District",
      rate: 0.07,
    },
    "1931110": {
      name: "West Monona Community School District",
      rate: 0.04,
    },
    "1931290": {
      name: "West Sioux Community School District",
      rate: 0.05,
    },
    "1931350": {
      name: "Western Dubuque County Community School District",
      rate: 0.05,
    },
    "1931470": {
      name: "Westwood Community School District",
      rate: 0.05,
    },
    "1931620": {
      name: "Whiting Community School District",
      rate: 0.05,
    },
    "1931680": {
      name: "Williamsburg Community School District",
      rate: 0.07,
    },
    "1931800": {
      name: "Wilton Community School District",
      rate: 0.05,
    },
    "1931830": {
      name: "Winfield-Mount Union Community School District",
      rate: 0.12,
    },
    "1931860": {
      name: "Winterset Community School District",
      rate: 0.04,
    },
    "1931920": {
      name: "Woodbine Community School District",
      rate: 0.14,
    },
    "1931950": {
      name: "Woodbury Central Community School District",
      rate: 0.04,
    },
    "1932010": {
      name: "Woodward-Granger Community School District",
      rate: 0.01,
    },
  },
};

export const LOCAL_SOURCES = {
  MD: [
    "https://www.marylandcomptroller.gov/content/dam/mdcomp/tax/forms/worksheets/2026-pv-worksheet.pdf",
    "https://www.marylandcomptroller.gov/content/dam/mdcomp/tax/legal-publications/facts/withholding-tax-facts-2026.pdf",
    "https://www.marylandcomptroller.gov/content/dam/mdcomp/tax/legal-publications/alerts/tax-alert-changes-to-standard-and-itemized-deductions-and-to-state-and-local-income-tax-rates-from-the-2025-legislative-session.pdf",
  ],
  IN: [
    "https://www.in.gov/dor/files/dn01.pdf",
    "https://www.in.gov/dor/files/ib32.pdf",
    "https://www.in.gov/dor/files/2025-county-tax-rates-and-codes.pdf",
  ],
  MI: [
    "https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-141-612",
    "https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-141-626",
    "https://www.legislature.mi.gov/Laws/MCL?objectName=mcl-141-611",
  ],
  YONKERS: [
    "https://www.tax.ny.gov/pdf/publications/withholding/nys50_t_y.pdf",
    "https://www.tax.ny.gov/forms/current-forms/it/it201i.htm",
    "https://www.tax.ny.gov/pit/file/nyc_yonkers_residents.htm",
  ],
  OR: [
    "https://www.portland.gov/revenue/personal-tax",
    "https://multco.us/file/metro_%26_multnomah_county_opt_form_2026_-_english-2/download",
    "https://multco.us/file/2026_multnomah_count_preschool_for_all_personal_income_tax_tables/download",
  ],
  OH: [
    "https://dam.assets.ohio.gov/image/upload/tax.ohio.gov/employer_withholding/2025-2026%20NYP%20Updates/School_Districts_2026.pdf",
    "https://dam.assets.ohio.gov/image/upload/tax.ohio.gov/forms/DRAFTS/2026/it1040-booklet-draft.pdf",
    "https://www.lsc.ohio.gov/assets/organizations/legislative-service-commission/files/school-district-income-taxes-december-2025.pdf",
  ],
  IA: [
    "https://revenue.iowa.gov/media/4382/download",
    "https://revenue.iowa.gov/forms?name=41-027&field_topic_target_id=All&year=All",
    "https://tax-mapper.iowa.gov/TaxMapper/SchoolSurTax",
  ],
};
