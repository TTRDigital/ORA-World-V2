/**
 * Long-term capital gains and ordinary income (interest and dividends) rates for the Act 60 calculator (client, 24 Nov), tax year 2026, single filer.
 * Researched on 24 Nov 2026 from official sources (the IRS, state revenue departments, state statutes and enacted
 * legislation); each entry lists the pages checked. Generated from the research files: update the rates here when
 * states publish new figures. How they are applied is in src/lib/capitalGainsTax.ts.
 *
 * Not modelled: itemized deductions, credits other than the personal credit, the AMT, holding-period rules, the
 * exclusions that only apply to particular assets (for example Oklahoma real property held five years, or Vermont's
 * 40% exclusion for non-traded assets), Oregon's subtraction of federal tax, and local taxes that apply only in some
 * cities or districts (Michigan cities, Ohio school districts, Portland Metro and Multnomah County).
 */
export type Bracket = [number, number];
/** A local income tax: a flat rate or brackets on the state taxable income, the gain, or the state tax itself.
 *  `band`: the rate of the bracket the whole base falls in applies to all of it (Frederick County, Maryland).
 *  `minus`: an exemption taken off the base first (Michigan cities). */
export type LocalTax = {
  name: string;
  nameEs?: string;
  base: "gain" | "taxable" | "stateTax";
  flat?: number;
  brackets?: Bracket[];
  band?: boolean;
  minus?: number;
  /** Married filing jointly: thresholds or exemptions that differ (Oregon's Metro and Multnomah, Michigan cities). */
  mfj?: { brackets?: Bracket[]; minus?: number };
};
export type Jurisdiction = {
  code: string;
  name: string;
  nameEs?: string;
  taxYear: number;
  noIncomeTax?: boolean;
  deduction: number;
  /** Alabama: residents deduct the federal income tax they paid. */
  deductsFederalTax?: boolean;
  /** Deductions that shrink with income: full up to phase[0], down to `keep` of the amount at phase[1] (straight line). */
  phased?: { amount: number; phase: [number, number]; keep?: number }[];
  credit?: number;
  /** Share of long-term gains excluded (capped at `cap`); gains above `exemptAbove` are not taxed at all (Arkansas). */
  exclusion?: { pct: number; cap?: number | null; exemptAbove?: number };
  brackets: Bracket[];
  /** base: "taxable" (default), "gain" (capital gains only) or "investment" (gains, interest and dividends);
   *  test "agi": the threshold is tested on total income; mode "all": the whole base is taxed once over it. */
  surtaxes?: {
    threshold: number;
    rate: number;
    base?: "gain" | "taxable" | "investment";
    test?: "agi";
    mode?: "excess" | "all";
  }[];
  /** Montana and Hawaii: the schedule for ordinary income when long-term gains have their own schedule in `brackets`. */
  ordinaryBrackets?: Bracket[];
  /** Washington: only capital gains are taxed. */
  gainsOnly?: boolean;
  /** New York's supplemental tax (Tax Law 601(d-5)): for each band of taxable income from `over`, add
   *  base + inc x min(1, (AGI - start) / span); above `flatAbove` of AGI the whole of taxable income is taxed at `flatRate`. */
  recapture?: {
    bands: { over: number; base: number; inc: number; start: number }[];
    span: number;
    flatAbove: number;
    flatRate: number;
  };
  local?: LocalTax;
  /** Married filing jointly (client, 27 Nov): only the fields that differ from the single filer. */
  mfj?: Partial<
    Omit<Jurisdiction, "code" | "name" | "nameEs" | "taxYear" | "note" | "noteEs" | "sources" | "mfj">
  >;
  note: string;
  noteEs?: string;
  sources: string[];
};

export const FEDERAL = {
  taxYear: 2026,
  ordinaryBrackets: [
    [0, 0.1],
    [12400, 0.12],
    [50400, 0.22],
    [105700, 0.24],
    [201775, 0.32],
    [256225, 0.35],
    [640600, 0.37],
  ] as Bracket[],
  standardDeduction: 16100,
  ltcgBrackets: [
    [0, 0],
    [49450, 0.15],
    [545500, 0.2],
  ] as Bracket[],
  niit: { rate: 0.038, threshold: 200000 },
  sources: [
    "https://www.irs.gov/pub/irs-drop/rp-25-32.pdf",
    "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill",
    "https://www.irs.gov/individuals/net-investment-income-tax",
  ],
  mfj: {
    standardDeduction: 32200,
    ordinaryBrackets: [
      [0, 0.1],
      [24800, 0.12],
      [100800, 0.22],
      [211400, 0.24],
      [403550, 0.32],
      [512450, 0.35],
      [768700, 0.37],
    ] as Bracket[],
    ltcgBrackets: [
      [0, 0],
      [98900, 0.15],
      [613700, 0.2],
    ] as Bracket[],
    niit: { rate: 0.038, threshold: 250000 },
  },
};

export const JURISDICTIONS: Jurisdiction[] = [
  {
    code: "AL",
    name: "Alabama",
    nameEs: "Alabama",
    taxYear: 2026,
    deduction: 4000,
    brackets: [
      [0, 0.02],
      [500, 0.04],
      [3000, 0.05],
    ],
    sources: ["https://www.revenue.alabama.gov/wp-content/uploads/2026/01/25f40bk.pdf"],
    deductsFederalTax: true,
    mfj: {
      deduction: 8000,
      brackets: [
        [0, 0.02],
        [1000, 0.04],
        [6000, 0.05],
      ],
    },
    note: "Alabama: 2% to 5% by bracket, after deducting the federal income tax paid.",
    noteEs: "Alabama: de 2% a 5% según el tramo, tras deducir el impuesto federal pagado.",
  },
  {
    code: "AK",
    name: "Alaska",
    nameEs: "Alaska",
    taxYear: 2026,
    noIncomeTax: true,
    deduction: 0,
    brackets: [[0, 0]],
    sources: ["https://www.akleg.gov/pdf/11/Bills/Final/CH%201%20SSSLA%201980.pdf"],
    note: "Alaska does not tax long-term capital gains.",
    noteEs: "Alaska no grava las ganancias de capital a largo plazo.",
  },
  {
    code: "AZ",
    name: "Arizona",
    nameEs: "Arizona",
    taxYear: 2026,
    deduction: 16100,
    exclusion: {
      pct: 0.25,
      cap: null,
    },
    brackets: [[0, 0.025]],
    sources: [
      "https://www.azleg.gov/ars/43/01022.htm",
      "https://www.azleg.gov/ars/43/01041.htm",
      "https://azdor.gov/forms/individual-income-tax-highlights",
      "https://www.azleg.gov/legtext/57leg/2R/summary/S.4168-1861ATT_ASENACTED.DOCX.htm",
    ],
    mfj: {
      deduction: 32200,
    },
    note: "Arizona: a flat 2.5%, with 25% of long-term gains on assets bought after 2011 subtracted.",
    noteEs:
      "Arizona: una tasa fija de 2.5%, con el 25% de las ganancias a largo plazo de activos comprados después de 2011 restado.",
  },
  {
    code: "AR",
    name: "Arkansas",
    nameEs: "Arkansas",
    taxYear: 2026,
    deduction: 2470,
    credit: 29,
    exclusion: {
      pct: 0.5,
      cap: null,
      exemptAbove: 10000000,
    },
    brackets: [
      [0, 0.02],
      [4700, 0.037],
    ],
    sources: [
      "https://arkleg.state.ar.us/Home/FTPDocument?path=%2FACTS%2F2026S1%2FPublic%2FACT1.pdf",
      "https://www.dfa.arkansas.gov/wp-content/uploads/2025_AR1000D_CapitalGains.pdf",
      "https://www.dfa.arkansas.gov/wp-content/uploads/2025_AR1000F_and_AR1000NR_Instructions.pdf",
      "https://www.dfa.arkansas.gov/wp-content/uploads/whformula_2026.pdf",
    ],
    mfj: {
      deduction: 4940,
      credit: 58,
    },
    note: "Arkansas: up to 3.7% by bracket, with 50% of long-term gains excluded and gains above $10 million exempt.",
    noteEs:
      "Arkansas: hasta 3.7% según el tramo, con el 50% de las ganancias a largo plazo excluido y las ganancias de más de $10 millones exentas.",
  },
  {
    code: "CA",
    name: "California",
    nameEs: "California",
    taxYear: 2026,
    deduction: 5900,
    credit: 0,
    brackets: [
      [0, 0.01],
      [11456, 0.02],
      [27157, 0.04],
      [42861, 0.06],
      [59498, 0.08],
      [75197, 0.093],
      [384109, 0.103],
      [460927, 0.113],
      [768213, 0.123],
    ],
    sources: [
      "https://www.ftb.ca.gov/about-ftb/newsroom/tax-news/2026/10.html",
      "https://www.ftb.ca.gov/forms/2025/2025-540-booklet.pdf",
    ],
    surtaxes: [
      {
        threshold: 1000000,
        rate: 0.01,
      },
    ],
    mfj: {
      deduction: 11800,
      brackets: [
        [0, 0.01],
        [22912, 0.02],
        [54314, 0.04],
        [85722, 0.06],
        [118996, 0.08],
        [150394, 0.093],
        [768218, 0.103],
        [921854, 0.113],
        [1536426, 0.123],
      ],
    },
    note: "California: 1% to 12.3% by bracket, plus the 1% Behavioral Health Services Tax above $1 million. No lower rate for capital gains.",
    noteEs:
      "California: de 1% a 12.3% según el tramo, más el impuesto de 1% para servicios de salud conductual sobre $1 millón. Sin tasa reducida para ganancias de capital.",
  },
  {
    code: "CO",
    name: "Colorado",
    nameEs: "Colorado",
    taxYear: 2026,
    deduction: 1000,
    brackets: [[0, 0.044]],
    sources: [
      "https://tax.colorado.gov/sites/tax/files/documents/Book104_2025.pdf",
      "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill",
    ],
    phased: [
      {
        amount: 15100,
        phase: [300000, 300001],
      },
    ],
    mfj: {
      deduction: 2000,
      phased: [
        {
          amount: 30200,
          phase: [300000, 300001],
        },
      ],
    },
    note: "Colorado: a flat 4.4%.",
    noteEs: "Colorado: una tasa fija de 4.4%.",
  },
  {
    code: "CT",
    name: "Connecticut",
    nameEs: "Connecticut",
    taxYear: 2026,
    deduction: 0,
    brackets: [
      [0, 0.02],
      [10000, 0.045],
      [50000, 0.055],
      [100000, 0.06],
      [200000, 0.065],
      [250000, 0.069],
      [500000, 0.0699],
    ],
    sources: ["https://portal.ct.gov/-/media/drs/forms/2025/income/2025-ct-1040-instructions_1225.pdf"],
    recapture: {
      bands: [],
      span: 50000,
      flatAbove: 540000,
      flatRate: 0.0699,
    },
    mfj: {
      brackets: [
        [0, 0.02],
        [20000, 0.045],
        [100000, 0.055],
        [200000, 0.06],
        [400000, 0.065],
        [500000, 0.069],
        [1000000, 0.0699],
      ],
      recapture: {
        bands: [],
        span: 100000,
        flatAbove: 1080000,
        flatRate: 0.0699,
      },
    },
    note: "Connecticut: 2% to 6.99% by bracket; at higher incomes the 6.99% rate applies to all taxable income.",
    noteEs:
      "Connecticut: de 2% a 6.99% según el tramo; con ingresos altos, la tasa de 6.99% se aplica a todo el ingreso tributable.",
  },
  {
    code: "DE",
    name: "Delaware",
    nameEs: "Delaware",
    taxYear: 2026,
    deduction: 3250,
    credit: 110,
    brackets: [
      [0, 0],
      [2000, 0.022],
      [5000, 0.039],
      [10000, 0.048],
      [20000, 0.052],
      [25000, 0.0555],
      [60000, 0.066],
    ],
    sources: [
      "https://revenue.delaware.gov/software-developer/tax-rate-changes/",
      "https://delcode.delaware.gov/title30/c011/sc02/index.html",
      "https://legis.delaware.gov/BillDetail/141813",
      "https://legis.delaware.gov/BillDetail/142529",
    ],
    mfj: {
      deduction: 6500,
      credit: 220,
    },
    note: "Delaware: 2.2% to 6.6% by bracket.",
    noteEs: "Delaware: de 2.2% a 6.6% según el tramo.",
  },
  {
    code: "DC",
    name: "District of Columbia",
    nameEs: "Distrito de Columbia",
    taxYear: 2026,
    deduction: 15000,
    brackets: [
      [0, 0.04],
      [10000, 0.06],
      [40000, 0.065],
      [60000, 0.085],
      [250000, 0.0925],
      [500000, 0.0975],
      [1000000, 0.1075],
    ],
    sources: [
      "https://code.dccouncil.gov/us/dc/council/code/sections/47-1806.03",
      "https://code.dccouncil.gov/us/dc/council/code/sections/47-1801.04",
      "https://www.govinfo.gov/content/pkg/PLAW-119publ78/html/PLAW-119publ78.htm",
    ],
    mfj: {
      deduction: 30000,
    },
    note: "District of Columbia: 4% to 10.75% by bracket.",
    noteEs: "Distrito de Columbia: de 4% a 10.75% según el tramo.",
  },
  {
    code: "FL",
    name: "Florida",
    nameEs: "Florida",
    taxYear: 2026,
    noIncomeTax: true,
    deduction: 0,
    brackets: [[0, 0]],
    sources: ["https://www.flsenate.gov/Laws/Constitution"],
    note: "Florida does not tax long-term capital gains.",
    noteEs: "Florida no grava las ganancias de capital a largo plazo.",
  },
  {
    code: "GA",
    name: "Georgia",
    nameEs: "Georgia",
    taxYear: 2026,
    deduction: 15000,
    brackets: [[0, 0.0499]],
    sources: [
      "https://www.legis.ga.gov/api/legislation/document/20252026/249080",
      "https://gov.georgia.gov/press-releases/2026-05-11/gov-kemp-signs-legislation-lowering-taxes-and-supporting-economic-growth",
    ],
    mfj: {
      deduction: 30000,
    },
    note: "Georgia: a flat 4.99%.",
    noteEs: "Georgia: una tasa fija de 4.99%.",
  },
  {
    code: "HI",
    name: "Hawaii",
    nameEs: "Hawái",
    taxYear: 2026,
    deduction: 9144,
    brackets: [
      [0, 0.014],
      [9600, 0.032],
      [14400, 0.055],
      [19200, 0.064],
      [24000, 0.068],
      [36000, 0.072],
      [48000, 0.076],
      [65143, 0.0725],
    ],
    sources: [
      "https://files.hawaii.gov/tax/news/announce/ann24-03.pdf",
      "https://files.hawaii.gov/tax/news/announce/ann26-06.pdf",
      "https://files.hawaii.gov/tax/forms/2025/n11ins.pdf",
    ],
    ordinaryBrackets: [
      [0, 0.014],
      [9600, 0.032],
      [14400, 0.055],
      [19200, 0.064],
      [24000, 0.068],
      [36000, 0.072],
      [48000, 0.076],
      [125000, 0.079],
      [175000, 0.0825],
      [225000, 0.09],
      [275000, 0.1],
      [325000, 0.11],
    ],
    mfj: {
      deduction: 18288,
      brackets: [
        [0, 0.014],
        [19200, 0.032],
        [28800, 0.055],
        [38400, 0.064],
        [48000, 0.068],
        [72000, 0.072],
        [96000, 0.076],
        [130286, 0.0725],
      ],
      ordinaryBrackets: [
        [0, 0.014],
        [19200, 0.032],
        [28800, 0.055],
        [38400, 0.064],
        [48000, 0.068],
        [72000, 0.072],
        [96000, 0.076],
        [250000, 0.079],
        [350000, 0.0825],
        [450000, 0.09],
        [550000, 0.1],
        [650000, 0.11],
      ],
    },
    note: "Hawaii: rates up to 11% on interest, dividends and other ordinary income, but long-term capital gains are taxed at no more than 7.25%.",
    noteEs:
      "Hawái: tasas de hasta 11% sobre intereses, dividendos y otros ingresos ordinarios, pero las ganancias de capital a largo plazo pagan como máximo 7.25%.",
  },
  {
    code: "ID",
    name: "Idaho",
    nameEs: "Idaho",
    taxYear: 2026,
    deduction: 16100,
    brackets: [
      [0, 0],
      [4811, 0.053],
    ],
    sources: [
      "https://tax.idaho.gov/document-mngr/forms_EIN00046",
      "https://tax.idaho.gov/wp-content/uploads/pubs/EPB00744/EPB00744_07-23-2026.pdf",
      "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill",
    ],
    mfj: {
      deduction: 32200,
      brackets: [
        [0, 0],
        [9622, 0.053],
      ],
    },
    note: "Idaho: 5.3% above a zero bracket. Idaho's 60% exclusion applies only to Idaho real property, so it is not applied here.",
    noteEs:
      "Idaho: 5.3% por encima de un tramo exento. La exclusión de 60% de Idaho aplica solo a bienes raíces en Idaho, por lo que no se aplica aquí.",
  },
  {
    code: "IL",
    name: "Illinois",
    nameEs: "Illinois",
    taxYear: 2026,
    deduction: 0,
    brackets: [[0, 0.0495]],
    sources: [
      "https://tax.illinois.gov/forms/withholding/currentyear/il-700-t-withholding-guide-tables.html",
      "https://tax.illinois.gov/content/dam/soi/en/web/tax/forms/incometax/documents/currentyear/individual/il-1040-instr.pdf",
    ],
    phased: [
      {
        amount: 2925,
        phase: [250000, 250001],
      },
    ],
    mfj: {
      phased: [
        {
          amount: 5850,
          phase: [500000, 500001],
        },
      ],
    },
    note: "Illinois: a flat 4.95%.",
    noteEs: "Illinois: una tasa fija de 4.95%.",
  },
  {
    code: "IN",
    name: "Indiana",
    nameEs: "Indiana",
    taxYear: 2026,
    deduction: 1000,
    brackets: [[0, 0.0295]],
    sources: [
      "https://www.in.gov/dor/resources/tax-rates-and-reports/rates-fees-and-penalties/",
      "https://www.in.gov/dor/files/dn01.pdf",
    ],
    local: {
      name: "County income tax",
      nameEs: "Impuesto del condado",
      base: "taxable",
      flat: 0.0202,
    },
    mfj: {
      deduction: 2000,
    },
    note: "Indiana: a flat 2.95%, plus county income tax (2.02% in Marion County, Indianapolis; 0.5% to 3% statewide).",
    noteEs:
      "Indiana: una tasa fija de 2.95%, más el impuesto del condado (2.02% en el condado de Marion, Indianápolis; de 0.5% a 3% en el estado).",
  },
  {
    code: "IA",
    name: "Iowa",
    nameEs: "Iowa",
    taxYear: 2026,
    deduction: 16100,
    credit: 40,
    brackets: [[0, 0.038]],
    sources: [
      "https://revenue.iowa.gov/press-release/2025-10-21/idr-announces-2026-individual-income-tax-and-interest-rates",
      "https://revenue.iowa.gov/taxes/tax-guidance/individual-income-tax/1040-expanded-instructions/federal-taxable-income",
      "https://revenue.iowa.gov/taxes/tax-guidance/individual-income-tax/1040-expanded-instructions/exemption-credits",
      "https://revenue.iowa.gov/media/2965/download?inline=",
    ],
    local: {
      name: "School district surtax",
      nameEs: "Sobretasa del distrito escolar",
      base: "stateTax",
      flat: 0.05,
    },
    mfj: {
      deduction: 32200,
      credit: 80,
    },
    note: "Iowa: a flat 3.8%, plus a typical 5% school district surtax on the state tax.",
    noteEs: "Iowa: una tasa fija de 3.8%, más una sobretasa escolar típica de 5% sobre el impuesto estatal.",
  },
  {
    code: "KS",
    name: "Kansas",
    nameEs: "Kansas",
    taxYear: 2026,
    deduction: 12765,
    brackets: [
      [0, 0.052],
      [23000, 0.0558],
    ],
    sources: [
      "https://www.ksrevenue.gov/pdf/k-40es26.pdf",
      "https://ksrevenue.gov/taxnotices/notice25-06.pdf",
      "https://www.ksrevenue.gov/taxnotices/notice26-11.pdf",
      "https://www.ksrevenue.gov/taxnotices/notice24-08.pdf",
    ],
    mfj: {
      deduction: 26560,
      brackets: [
        [0, 0.052],
        [46000, 0.0558],
      ],
    },
    note: "Kansas: 5.2% to 5.58% by bracket.",
    noteEs: "Kansas: de 5.2% a 5.58% según el tramo.",
  },
  {
    code: "KY",
    name: "Kentucky",
    nameEs: "Kentucky",
    taxYear: 2026,
    deduction: 3360,
    brackets: [[0, 0.035]],
    sources: [
      "https://revenue.ky.gov/Forms/2026%20Withholding%20Formula.pdf",
      "https://revenue.ky.gov/News/Pages/Kentucky-DOR-Announces-2026-Standard-Deduction.aspx",
      "https://revenue.ky.gov/Software-Developer/Documents/TY2026%20E-File%20HandBook%20Publication%201345%20v1.0.pdf",
    ],
    note: "Kentucky: a flat 3.5%.",
    noteEs: "Kentucky: una tasa fija de 3.5%.",
  },
  {
    code: "LA",
    name: "Louisiana",
    nameEs: "Luisiana",
    taxYear: 2026,
    deduction: 12838,
    brackets: [[0, 0.03]],
    sources: [
      "https://revenue.louisiana.gov/tax-education-and-faqs/faqs/income-tax-reform/what-are-the-individual-income-tax-rates-and-brackets/",
      "https://dam.ldr.la.gov/lawspolicies/RIB%2026-019.pdf",
      "https://dam.ldr.la.gov/lawspolicies/RIB%2026-005-Updated%20Withholding%20Tables.pdf",
    ],
    mfj: {
      deduction: 25676,
    },
    note: "Louisiana: a flat 3%.",
    noteEs: "Luisiana: una tasa fija de 3%.",
  },
  {
    code: "ME",
    name: "Maine",
    nameEs: "Maine",
    taxYear: 2026,
    deduction: 0,
    brackets: [
      [0, 0.058],
      [27400, 0.0675],
      [64850, 0.0715],
    ],
    sources: [
      "https://www.maine.gov/revenue/sites/maine.gov.revenue/files/inline-files/26_1040es_fillable.pdf",
      "https://www.maine.gov/revenue/sites/maine.gov.revenue/files/inline-files/26_wh_tab_instr_August2026.pdf",
      "https://www.maine.gov/revenue/sites/maine.gov.revenue/files/inline-files/legischange26.pdf",
      "https://www.maine.gov/revenue/sites/maine.gov.revenue/files/inline-files/ta_august2026_vol36_iss10.pdf",
    ],
    phased: [
      {
        amount: 15700,
        phase: [102250, 177250],
      },
      {
        amount: 5300,
        phase: [341000, 466000],
      },
    ],
    surtaxes: [
      {
        threshold: 1000000,
        rate: 0.02,
      },
    ],
    mfj: {
      brackets: [
        [0, 0.058],
        [54850, 0.0675],
        [129750, 0.0715],
      ],
      phased: [
        {
          amount: 31400,
          phase: [204550, 354550],
        },
        {
          amount: 10600,
          phase: [409150, 534150],
        },
      ],
      surtaxes: [
        {
          threshold: 1500000,
          rate: 0.02,
        },
      ],
    },
    note: "Maine: 5.8% to 7.15% by bracket, plus 2% above $1,000,000.",
    noteEs: "Maine: de 5.8% a 7.15% según el tramo, más 2% sobre $1,000,000.",
  },
  {
    code: "MD",
    name: "Maryland",
    nameEs: "Maryland",
    taxYear: 2026,
    deduction: 3400,
    brackets: [
      [0, 0.02],
      [1000, 0.03],
      [2000, 0.04],
      [3000, 0.0475],
      [100000, 0.05],
      [125000, 0.0525],
      [150000, 0.055],
      [250000, 0.0575],
      [500000, 0.0625],
      [1000000, 0.065],
    ],
    sources: [
      "https://www.marylandcomptroller.gov/content/dam/mdcomp/tax/legal-publications/facts/withholding-tax-facts-2026.pdf",
      "https://www.marylandcomptroller.gov/content/dam/mdcomp/tax/legal-publications/alerts/tax-alert-changes-to-standard-and-itemized-deductions-and-to-state-and-local-income-tax-rates-from-the-2025-legislative-session.pdf",
      "https://www.marylandcomptroller.gov/legal-library/tb-58-dec-29-2025.html",
      "https://www.marylandcomptroller.gov/content/dam/mdcomp/tax/forms/worksheets/2026-pv-worksheet.pdf",
    ],
    phased: [
      {
        amount: 3200,
        phase: [100000, 150000],
      },
    ],
    surtaxes: [
      {
        threshold: 350000,
        rate: 0.02,
        base: "gain",
        test: "agi",
        mode: "all",
      },
    ],
    local: {
      name: "County income tax",
      nameEs: "Impuesto del condado",
      base: "taxable",
      flat: 0.032,
    },
    mfj: {
      deduction: 6850,
      brackets: [
        [0, 0.02],
        [1000, 0.03],
        [2000, 0.04],
        [3000, 0.0475],
        [150000, 0.05],
        [175000, 0.0525],
        [225000, 0.055],
        [300000, 0.0575],
        [600000, 0.0625],
        [1200000, 0.065],
      ],
      phased: [
        {
          amount: 6400,
          phase: [150000, 200000],
        },
      ],
    },
    note: "Maryland: 2% to 6.5% by bracket, plus 2% on the whole gain above $350,000 of income, plus a typical 3.2% county income tax.",
    noteEs:
      "Maryland: de 2% a 6.5% según el tramo, más 2% sobre toda la ganancia con ingresos de más de $350,000, más un impuesto del condado típico de 3.2%.",
  },
  {
    code: "MA",
    name: "Massachusetts",
    nameEs: "Massachusetts",
    taxYear: 2026,
    deduction: 4400,
    brackets: [[0, 0.05]],
    sources: [
      "https://www.mass.gov/info-details/massachusetts-tax-rates",
      "https://www.mass.gov/info-details/massachusetts-4-surtax-on-taxable-income",
      "https://www.mass.gov/doc/2026-form-1-es-estimated-tax-payment-vouchers-instructions-and-worksheets/download",
    ],
    surtaxes: [
      {
        threshold: 1107750,
        rate: 0.04,
      },
    ],
    mfj: {
      deduction: 8800,
    },
    note: "Massachusetts: a flat 5%, plus 4% above $1,107,750.",
    noteEs: "Massachusetts: una tasa fija de 5%, más 4% sobre $1,107,750.",
  },
  {
    code: "MI",
    name: "Michigan",
    nameEs: "Míchigan",
    taxYear: 2026,
    deduction: 5900,
    brackets: [[0, 0.0425]],
    sources: [
      "https://www.michigan.gov/treasury/reference/taxpayer-notices/2026/04/15/425-income-tax-rate-for-individuals-and-fiduciaries-in-2026-tax-year",
      "https://www.michigan.gov/taxes/-/media/Project/Websites/taxes/Forms/SUW/TY2026/446_Withholding-Guide_2026.pdf",
      "https://detroitmi.gov/departments/office-chief-financial-officer/ocfo-divisions/office-treasury/income-tax/income-tax-information",
      "https://www.michigan.gov/taxes/-/media/Project/Websites/taxes/Forms/City-Withholding/TY2026/5469_ty2026.pdf",
    ],
    mfj: {
      deduction: 11800,
    },
    note: "Michigan: a flat 4.25%. About two dozen cities add their own income tax (Detroit 2.4%, most others 1%); enter your address to include yours.",
    noteEs:
      "Míchigan: una tasa fija de 4.25%. Unas dos docenas de ciudades añaden su propio impuesto (Detroit 2.4%, la mayoría 1%); escriba su dirección para incluir el suyo.",
  },
  {
    code: "MN",
    name: "Minnesota",
    nameEs: "Minnesota",
    taxYear: 2026,
    deduction: 3060,
    brackets: [
      [0, 0.0535],
      [33310, 0.068],
      [109430, 0.0785],
      [203150, 0.0985],
    ],
    sources: [
      "https://www.revenue.state.mn.us/press-release/2025-12-16/minnesota-income-tax-brackets-standard-deduction-and-dependent-exemption",
      "https://www.revenue.state.mn.us/sites/default/files/2025-12/inflation-adjusted-amounts-2026.pdf",
      "https://www.revenue.state.mn.us/net-investment-income-tax-niit",
      "https://www.revenue.state.mn.us/sites/default/files/2026-08/hf2438sf2082-enacted-otb-3.pdf",
    ],
    phased: [
      {
        amount: 2802,
        phase: [244400, 337800],
      },
      {
        amount: 9438,
        phase: [337800, 432180],
      },
    ],
    surtaxes: [
      {
        threshold: 1000000,
        rate: 0.01,
        base: "investment",
      },
    ],
    mfj: {
      deduction: 6120,
      brackets: [
        [0, 0.0535],
        [48700, 0.068],
        [193480, 0.0785],
        [337930, 0.0985],
      ],
      phased: [
        {
          amount: 2802,
          phase: [244400, 337800],
        },
        {
          amount: 21678,
          phase: [337800, 554580],
        },
      ],
    },
    note: "Minnesota: 5.35% to 9.85% by bracket, plus 1% above $1,000,000.",
    noteEs: "Minnesota: de 5.35% a 9.85% según el tramo, más 1% sobre $1,000,000.",
  },
  {
    code: "MS",
    name: "Mississippi",
    nameEs: "Misisipi",
    taxYear: 2026,
    deduction: 8300,
    brackets: [
      [0, 0],
      [10000, 0.04],
    ],
    sources: [
      "https://www.dor.ms.gov/individual/tax-rates",
      "https://www.dor.ms.gov/individual/individual-income-tax-frequently-asked-questions",
    ],
    mfj: {
      deduction: 16600,
      brackets: [
        [0, 0],
        [20000, 0.04],
      ],
    },
    note: "Mississippi: a flat 4%.",
    noteEs: "Misisipi: una tasa fija de 4%.",
  },
  {
    code: "MO",
    name: "Missouri",
    nameEs: "Misuri",
    taxYear: 2026,
    deduction: 16100,
    brackets: [
      [0, 0],
      [1348, 0.02],
      [2696, 0.025],
      [4044, 0.03],
      [5392, 0.035],
      [6740, 0.04],
      [8088, 0.045],
      [9436, 0.047],
    ],
    sources: [
      "https://dor.mo.gov/news/newsitem/uuid/15044650-59dd-48f4-975a-01988d485255",
      "https://dor.mo.gov/faq/taxation/individual/capital-gains-subtraction.html",
      "https://dor.mo.gov/forms/MO-1040ES_2026.pdf",
      "https://www.stlouis-mo.gov/government/departments/collector/earnings-tax/taxable-items.cfm",
    ],
    exclusion: {
      pct: 1,
      cap: null,
    },
    mfj: {
      deduction: 32200,
      brackets: [
        [0, 0],
        [2696, 0.02],
        [5392, 0.025],
        [8088, 0.03],
        [10784, 0.035],
        [13480, 0.04],
        [16176, 0.045],
        [18872, 0.047],
      ],
    },
    note: "Missouri: no tax on capital gains since 2025; interest and dividends are taxed at up to 4.7%.",
    noteEs:
      "Misuri: sin impuesto sobre ganancias de capital desde 2025; los intereses y dividendos pagan hasta 4.7%.",
  },
  {
    code: "MT",
    name: "Montana",
    nameEs: "Montana",
    taxYear: 2026,
    deduction: 16100,
    brackets: [
      [0, 0.03],
      [47500, 0.041],
    ],
    sources: [
      "https://revenue.mt.gov/news/recent-news/HB-337",
      "https://revenuefiles.mt.gov/files/Forms/Publication-1/Publication-1-2026.pdf",
      "https://mca.legmt.gov/bills/mca/title_0150/chapter_0300/part_0210/section_0030/0150-0300-0210-0030.html",
      "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill",
    ],
    ordinaryBrackets: [
      [0, 0.047],
      [47500, 0.0565],
    ],
    mfj: {
      deduction: 32200,
      brackets: [
        [0, 0.03],
        [95000, 0.041],
      ],
      ordinaryBrackets: [
        [0, 0.047],
        [95000, 0.0565],
      ],
    },
    note: "Montana: long-term gains at 3% or 4.1%; interest and dividends at 4.7% or 5.65%.",
    noteEs: "Montana: ganancias a largo plazo al 3% o 4.1%; intereses y dividendos al 4.7% o 5.65%.",
  },
  {
    code: "NE",
    name: "Nebraska",
    nameEs: "Nebraska",
    taxYear: 2026,
    deduction: 8850,
    credit: 176,
    brackets: [
      [0, 0.0246],
      [4130, 0.0351],
      [24760, 0.0455],
    ],
    sources: [
      "https://revenue.nebraska.gov/sites/default/files/doc/tax-forms/drafts/2026_tax_calculation_schedule.pdf",
      "https://revenue.nebraska.gov/sites/default/files/doc/tax-forms/drafts/f_1040n.pdf",
      "https://nebraskalegislature.gov/laws/statutes.php?statute=77-2715.03",
    ],
    mfj: {
      deduction: 17700,
      credit: 352,
      brackets: [
        [0, 0.0246],
        [8250, 0.0351],
        [49530, 0.0455],
      ],
    },
    note: "Nebraska: 2.46% to 4.55% by bracket.",
    noteEs: "Nebraska: de 2.46% a 4.55% según el tramo.",
  },
  {
    code: "NV",
    name: "Nevada",
    nameEs: "Nevada",
    taxYear: 2026,
    noIncomeTax: true,
    deduction: 0,
    brackets: [[0, 0]],
    sources: ["https://www.leg.state.nv.us/Const/NvConst.html"],
    note: "Nevada does not tax long-term capital gains.",
    noteEs: "Nevada no grava las ganancias de capital a largo plazo.",
  },
  {
    code: "NH",
    name: "New Hampshire",
    nameEs: "Nuevo Hampshire",
    taxYear: 2026,
    noIncomeTax: true,
    deduction: 0,
    brackets: [[0, 0]],
    sources: [
      "https://revenue.nh.gov/taxes-glance/interest-dividends-tax",
      "https://gencourt.state.nh.us/rsa/html/V/77/77-3.htm",
    ],
    note: "New Hampshire does not tax long-term capital gains.",
    noteEs: "Nuevo Hampshire no grava las ganancias de capital a largo plazo.",
  },
  {
    code: "NJ",
    name: "New Jersey",
    nameEs: "Nueva Jersey",
    taxYear: 2026,
    deduction: 1000,
    brackets: [
      [0, 0.014],
      [20000, 0.0175],
      [35000, 0.035],
      [40000, 0.05525],
      [75000, 0.0637],
      [500000, 0.0897],
      [1000000, 0.1075],
    ],
    sources: [
      "https://www.nj.gov/treasury/taxation/pdf/current/njtaxratesch.pdf",
      "https://www.nj.gov/treasury/taxation/taxtables.shtml",
      "https://www.nj.gov/treasury/taxation/pdf/current/1040.pdf",
      "https://www.nj.gov/treasury/taxation/njit10.shtml",
    ],
    mfj: {
      deduction: 2000,
      brackets: [
        [0, 0.014],
        [20000, 0.0175],
        [50000, 0.0245],
        [70000, 0.035],
        [80000, 0.05525],
        [150000, 0.0637],
        [500000, 0.0897],
        [1000000, 0.1075],
      ],
    },
    note: "New Jersey: 1.4% to 10.75% by bracket.",
    noteEs: "Nueva Jersey: de 1.4% a 10.75% según el tramo.",
  },
  {
    code: "NM",
    name: "New Mexico",
    nameEs: "Nuevo México",
    taxYear: 2026,
    deduction: 16100,
    exclusion: {
      pct: 1.0,
      cap: 2500,
    },
    brackets: [
      [0, 0.015],
      [5500, 0.032],
      [16500, 0.043],
      [33500, 0.047],
      [66500, 0.049],
      [210000, 0.059],
    ],
    sources: [
      "https://realfile.tax.newmexico.gov/2025trt.pdf",
      "https://realfile.tax.newmexico.gov/2025pit-adj-ins.pdf",
      "https://realfile.tax.newmexico.gov/2025pit-1-ins.pdf",
      "https://www.tax.newmexico.gov/individuals/personal-income-tax-information-overview/",
    ],
    mfj: {
      deduction: 32200,
      brackets: [
        [0, 0.015],
        [8000, 0.032],
        [25000, 0.043],
        [50000, 0.047],
        [100000, 0.049],
        [315000, 0.059],
      ],
    },
    note: "New Mexico: 1.5% to 5.9% by bracket, the first $2,500 of gains excluded.",
    noteEs: "Nuevo México: de 1.5% a 5.9% según el tramo, con los primeros $2,500 de ganancias excluidos.",
  },
  {
    code: "NY",
    name: "New York",
    nameEs: "Nueva York (estado)",
    taxYear: 2026,
    deduction: 8000,
    brackets: [
      [0, 0.039],
      [8500, 0.044],
      [11700, 0.0515],
      [13900, 0.054],
      [80650, 0.059],
      [215400, 0.0685],
      [1077550, 0.0965],
      [5000000, 0.103],
      [25000000, 0.109],
    ],
    sources: [
      "https://www.nysenate.gov/legislation/laws/TAX/601",
      "https://www.tax.ny.gov/forms/html-instructions/2025/it/it201i-2025.htm",
      "https://www.tax.ny.gov/pit/file/tax-tables/2025.htm",
    ],
    recapture: {
      bands: [
        {
          over: 80650,
          base: 0,
          inc: 567,
          start: 107650,
        },
        {
          over: 215400,
          base: 567,
          inc: 2047,
          start: 215400,
        },
        {
          over: 1077550,
          base: 2614,
          inc: 30172,
          start: 1077550,
        },
        {
          over: 5000000,
          base: 32786,
          inc: 32500,
          start: 5000000,
        },
      ],
      span: 50000,
      flatAbove: 25000000,
      flatRate: 0.109,
    },
    mfj: {
      deduction: 16050,
      brackets: [
        [0, 0.039],
        [17150, 0.044],
        [23600, 0.0515],
        [27900, 0.054],
        [161550, 0.059],
        [323200, 0.0685],
        [2155350, 0.0965],
        [5000000, 0.103],
        [25000000, 0.109],
      ],
      recapture: {
        bands: [
          {
            over: 27900,
            base: 0,
            inc: 333,
            start: 107650,
          },
          {
            over: 161550,
            base: 333,
            inc: 807,
            start: 161550,
          },
          {
            over: 323200,
            base: 1140,
            inc: 3071,
            start: 323200,
          },
          {
            over: 2155350,
            base: 4211,
            inc: 60350,
            start: 2155350,
          },
          {
            over: 5000000,
            base: 64561,
            inc: 32500,
            start: 5000000,
          },
        ],
        span: 50000,
        flatAbove: 25000000,
        flatRate: 0.109,
      },
    },
    note: "New York State: 3.9% to 10.9% by bracket; at higher incomes the top rate reached applies to all taxable income.",
    noteEs:
      "Estado de Nueva York: de 3.9% a 10.9% según el tramo; con ingresos altos, la tasa más alta alcanzada se aplica a todo el ingreso tributable.",
  },
  {
    code: "NYC",
    name: "New York City",
    nameEs: "Ciudad de Nueva York",
    taxYear: 2026,
    deduction: 8000,
    brackets: [
      [0, 0.039],
      [8500, 0.044],
      [11700, 0.0515],
      [13900, 0.054],
      [80650, 0.059],
      [215400, 0.0685],
      [1077550, 0.0965],
      [5000000, 0.103],
      [25000000, 0.109],
    ],
    sources: [
      "https://www.nysenate.gov/legislation/laws/TAX/601",
      "https://www.tax.ny.gov/forms/html-instructions/2025/it/it201i-2025.htm",
      "https://www.tax.ny.gov/forms/html-instructions/2025/it/it201i-2025.htm",
      "https://www.tax.ny.gov/pit/file/tax-tables/2025.htm",
    ],
    recapture: {
      bands: [
        {
          over: 80650,
          base: 0,
          inc: 567,
          start: 107650,
        },
        {
          over: 215400,
          base: 567,
          inc: 2047,
          start: 215400,
        },
        {
          over: 1077550,
          base: 2614,
          inc: 30172,
          start: 1077550,
        },
        {
          over: 5000000,
          base: 32786,
          inc: 32500,
          start: 5000000,
        },
      ],
      span: 50000,
      flatAbove: 25000000,
      flatRate: 0.109,
    },
    local: {
      name: "New York City income tax",
      nameEs: "Impuesto de la ciudad de Nueva York",
      base: "taxable",
      brackets: [
        [0, 0.03078],
        [12000, 0.03762],
        [25000, 0.03819],
        [50000, 0.03876],
      ],
    },
    mfj: {
      deduction: 16050,
      brackets: [
        [0, 0.039],
        [17150, 0.044],
        [23600, 0.0515],
        [27900, 0.054],
        [161550, 0.059],
        [323200, 0.0685],
        [2155350, 0.0965],
        [5000000, 0.103],
        [25000000, 0.109],
      ],
      recapture: {
        bands: [
          {
            over: 27900,
            base: 0,
            inc: 333,
            start: 107650,
          },
          {
            over: 161550,
            base: 333,
            inc: 807,
            start: 161550,
          },
          {
            over: 323200,
            base: 1140,
            inc: 3071,
            start: 323200,
          },
          {
            over: 2155350,
            base: 4211,
            inc: 60350,
            start: 2155350,
          },
          {
            over: 5000000,
            base: 64561,
            inc: 32500,
            start: 5000000,
          },
        ],
        span: 50000,
        flatAbove: 25000000,
        flatRate: 0.109,
      },
      local: {
        name: "New York City income tax",
        nameEs: "Impuesto de la ciudad de Nueva York",
        base: "taxable",
        brackets: [
          [0, 0.03078],
          [21600, 0.03762],
          [45000, 0.03819],
          [90000, 0.03876],
        ],
      },
    },
    note: "New York City: New York State tax (3.9% to 10.9%, with the top rate reached applying to all taxable income at higher incomes) plus New York City income tax of 3.078% to 3.876%.",
    noteEs:
      "Ciudad de Nueva York: impuesto del estado de Nueva York (de 3.9% a 10.9%; con ingresos altos, la tasa más alta alcanzada se aplica a todo el ingreso tributable) más el impuesto de la ciudad de 3.078% a 3.876%.",
  },
  {
    code: "NC",
    name: "North Carolina",
    nameEs: "Carolina del Norte",
    taxYear: 2026,
    deduction: 12750,
    brackets: [[0, 0.0399]],
    sources: [
      "https://www.ncdor.gov/taxes-forms/individual-income-tax/tax-rate-schedules",
      "https://www.ncdor.gov/taxes-forms/individual-income-tax/north-carolina-standard-deduction-or-north-carolina-itemized-deductions",
    ],
    mfj: {
      deduction: 25500,
    },
    note: "North Carolina: a flat 3.99%.",
    noteEs: "Carolina del Norte: una tasa fija de 3.99%.",
  },
  {
    code: "ND",
    name: "North Dakota",
    nameEs: "Dakota del Norte",
    taxYear: 2026,
    deduction: 16100,
    exclusion: {
      pct: 0.4,
      cap: null,
    },
    brackets: [
      [0, 0],
      [49575, 0.0195],
      [250400, 0.025],
    ],
    sources: [
      "https://www.tax.nd.gov/sites/www/files/documents/forms/individual/2025-iit/28709-form-nd-1es-2026.pdf",
      "https://www.tax.nd.gov/sites/www/files/documents/forms/individual/2025-iit/2025-individual-income-tax-booklet.pdf",
      "https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill",
    ],
    mfj: {
      deduction: 32200,
      brackets: [
        [0, 0],
        [82800, 0.0195],
        [304850, 0.025],
      ],
    },
    note: "North Dakota: 1.95% to 2.5% by bracket, 40% of long-term gains excluded.",
    noteEs:
      "Dakota del Norte: de 1.95% a 2.5% según el tramo, con el 40% de las ganancias a largo plazo excluido.",
  },
  {
    code: "OH",
    name: "Ohio",
    nameEs: "Ohio",
    taxYear: 2026,
    deduction: 0,
    brackets: [
      [0, 0],
      [13977.27, 0.0275],
    ],
    sources: [
      "https://codes.ohio.gov/assets/laws/revised-code/authenticated/57/5747/5747.02/9-30-2025/5747.02-9-30-2025.pdf",
      "https://codes.ohio.gov/ohio-revised-code/section-5747.025",
      "https://dam.assets.ohio.gov/image/upload/tax.ohio.gov/forms/DRAFTS/2026/it1040-booklet-draft.pdf",
    ],
    phased: [
      {
        amount: 1900,
        phase: [499999, 500000],
      },
    ],
    mfj: {
      phased: [
        {
          amount: 3800,
          phase: [499999, 500000],
        },
      ],
    },
    note: "Ohio: a flat 2.75%.",
    noteEs: "Ohio: una tasa fija de 2.75%.",
  },
  {
    code: "OK",
    name: "Oklahoma",
    nameEs: "Oklahoma",
    taxYear: 2026,
    deduction: 7350,
    brackets: [
      [0, 0],
      [3750, 0.025],
      [4900, 0.035],
      [7200, 0.045],
    ],
    sources: [
      "https://oklahoma.gov/content/dam/ok/en/tax/documents/forms/software-developers/Dev511-Pkt-26.pdf",
    ],
    mfj: {
      deduction: 14700,
      brackets: [
        [0, 0],
        [7500, 0.025],
        [9800, 0.035],
        [14400, 0.045],
      ],
    },
    note: "Oklahoma: up to 4.5% by bracket. Gains on Oklahoma real property held at least five years can be fully deductible; not applied here.",
    noteEs:
      "Oklahoma: hasta 4.5% según el tramo. Las ganancias por bienes raíces en Oklahoma con al menos cinco años de tenencia pueden deducirse por completo; no se aplica aquí.",
  },
  {
    code: "OR",
    name: "Oregon",
    nameEs: "Oregón",
    taxYear: 2026,
    deduction: 2900,
    brackets: [
      [0, 0.0475],
      [4550, 0.0675],
      [11400, 0.0875],
      [125000, 0.099],
    ],
    sources: [
      "https://www.oregon.gov/dor/forms/FormsPubs/publication-or-estimate_101-026_2026.pdf",
      "https://www.oregon.gov/dor/forms/FormsPubs/publication-or-17_101-431_2025.pdf",
      "https://www.portland.gov/revenue/personal-tax",
      "https://multco.us/news/news-release-multnomah-county-commissioners-unanimously-delay-preschool-all-income-tax",
    ],
    mfj: {
      deduction: 5800,
      brackets: [
        [0, 0.0475],
        [9100, 0.0675],
        [22800, 0.0875],
        [250000, 0.099],
      ],
      phased: [
        {
          amount: 5942.86,
          phase: [200000, 200001],
        },
      ],
    },
    note: "Oregon: 4.75% to 9.9% by bracket. Portland Metro and Multnomah County add local taxes on higher incomes; enter your address to include them.",
    noteEs:
      "Oregón: de 4.75% a 9.9% según el tramo. Portland Metro y el condado de Multnomah añaden impuestos locales sobre ingresos altos; escriba su dirección para incluirlos.",
  },
  {
    code: "PA",
    name: "Pennsylvania",
    nameEs: "Pensilvania",
    taxYear: 2026,
    deduction: 0,
    brackets: [[0, 0.0307]],
    sources: [
      "https://www.pa.gov/agencies/revenue/resources/tax-types-and-information/personal-income-tax",
      "https://www.phila.gov/services/payments-assistance-taxes/taxes/income-taxes/school-income-tax/",
    ],
    note: "Pennsylvania: a flat 3.07%.",
    noteEs: "Pensilvania: una tasa fija de 3.07%.",
  },
  {
    code: "RI",
    name: "Rhode Island",
    nameEs: "Rhode Island",
    taxYear: 2026,
    deduction: 0,
    brackets: [
      [0, 0.0375],
      [82050, 0.0475],
      [186450, 0.0599],
    ],
    sources: [
      "https://tax.ri.gov/sites/g/files/xkgbur541/files/2025-11/ADV_2025_22_Inflation_Adjustments.pdf",
      "https://tax.ri.gov/sites/g/files/xkgbur541/files/2026-01/ADV_2026_02_Tax-Changes.pdf",
      "https://tax.ri.gov/sites/g/files/xkgbur541/files/2026-07/2026_summary_of_legislative_changes.pdf",
    ],
    phased: [
      {
        amount: 16450,
        phase: [261000, 290800],
      },
    ],
    mfj: {
      phased: [
        {
          amount: 32900,
          phase: [261000, 290800],
        },
      ],
    },
    note: "Rhode Island: 3.75% to 5.99% by bracket.",
    noteEs: "Rhode Island: de 3.75% a 5.99% según el tramo.",
  },
  {
    code: "SC",
    name: "South Carolina",
    nameEs: "Carolina del Sur",
    taxYear: 2026,
    deduction: 0,
    exclusion: {
      pct: 0.44,
      cap: null,
    },
    brackets: [
      [0, 0.0199],
      [30000, 0.0521],
    ],
    sources: [
      "https://dor.sc.gov/iit",
      "https://dor.sc.gov/sites/dor/files/policies/IL26-23.pdf",
      "https://www.scstatehouse.gov/code/t12c006.php",
    ],
    mfj: {
      phased: [
        {
          amount: 30000,
          phase: [80000, 190000],
        },
      ],
    },
    note: "South Carolina: 1.99% to 5.21% by bracket, 44% of long-term gains excluded.",
    noteEs:
      "Carolina del Sur: de 1.99% a 5.21% según el tramo, con el 44% de las ganancias a largo plazo excluido.",
  },
  {
    code: "SD",
    name: "South Dakota",
    nameEs: "Dakota del Sur",
    taxYear: 2026,
    noIncomeTax: true,
    deduction: 0,
    brackets: [[0, 0]],
    sources: ["https://dor.sd.gov/individuals/taxes/"],
    note: "South Dakota does not tax long-term capital gains.",
    noteEs: "Dakota del Sur no grava las ganancias de capital a largo plazo.",
  },
  {
    code: "TN",
    name: "Tennessee",
    nameEs: "Tennessee",
    taxYear: 2026,
    noIncomeTax: true,
    deduction: 0,
    brackets: [[0, 0]],
    sources: [
      "https://www.tn.gov/revenue/taxes/hall-income-tax.html",
      "https://revenue.support.tn.gov/hc/en-us/articles/360057828631-HIT-3-Hall-Income-Tax-Repealed-Beginning-January-2021",
    ],
    note: "Tennessee does not tax long-term capital gains.",
    noteEs: "Tennessee no grava las ganancias de capital a largo plazo.",
  },
  {
    code: "TX",
    name: "Texas",
    nameEs: "Texas",
    taxYear: 2026,
    noIncomeTax: true,
    deduction: 0,
    brackets: [[0, 0]],
    sources: ["https://tcss.legis.texas.gov/resources/CN/pdf/CN.8.pdf"],
    note: "Texas does not tax long-term capital gains.",
    noteEs: "Texas no grava las ganancias de capital a largo plazo.",
  },
  {
    code: "UT",
    name: "Utah",
    nameEs: "Utah",
    taxYear: 2026,
    deduction: 0,
    brackets: [[0, 0.0445]],
    sources: [
      "https://le.utah.gov/Session/2026/bills/enrolled/SB0060.pdf",
      "https://tax.utah.gov/forms/current/tc-40inst.pdf",
    ],
    mfj: {
      phased: [
        {
          amount: 43416,
          phase: [37392, 186007],
        },
      ],
    },
    note: "Utah: a flat 4.45%.",
    noteEs: "Utah: una tasa fija de 4.45%.",
  },
  {
    code: "VT",
    name: "Vermont",
    nameEs: "Vermont",
    taxYear: 2025,
    deduction: 12950,
    exclusion: {
      pct: 1.0,
      cap: 5000,
    },
    brackets: [
      [0, 0.0335],
      [49400, 0.066],
      [119700, 0.076],
      [249700, 0.0875],
    ],
    sources: [
      "https://tax.vermont.gov/sites/tax/files/documents/TaxRateSched-2025.pdf",
      "https://tax.vermont.gov/sites/tax/files/documents/IN-153-Instr-2025.pdf",
      "https://tax.vermont.gov/sites/tax/files/documents/IN-111-Instr-2025.pdf",
      "https://tax.vermont.gov/sites/tax/files/documents/TaxTables-2026.pdf",
    ],
    mfj: {
      deduction: 25900,
      brackets: [
        [0, 0.0335],
        [82500, 0.066],
        [199450, 0.076],
        [304000, 0.0875],
      ],
    },
    note: "Vermont: 3.35% to 8.75% by bracket, the first $5,000 of gains excluded (2025 rates, the latest published).",
    noteEs:
      "Vermont: de 3.35% a 8.75% según el tramo, con los primeros $5,000 de ganancias excluidos (tasas de 2025, las últimas publicadas).",
  },
  {
    code: "VA",
    name: "Virginia",
    nameEs: "Virginia",
    taxYear: 2026,
    deduction: 9680,
    brackets: [
      [0, 0.02],
      [3000, 0.03],
      [5000, 0.05],
      [17000, 0.0575],
    ],
    sources: [
      "https://www.tax.virginia.gov/news/new-virginia-tax-laws",
      "https://www.tax.virginia.gov/laws-rules-decisions/legislative-summaries/26-82",
      "https://www.tax.virginia.gov/exemptions",
      "https://www.tax.virginia.gov/node/35195",
    ],
    mfj: {
      deduction: 19360,
    },
    note: "Virginia: 2% to 5.75% by bracket.",
    noteEs: "Virginia: de 2% a 5.75% según el tramo.",
  },
  {
    code: "WA",
    name: "Washington",
    nameEs: "Washington",
    taxYear: 2026,
    deduction: 290000,
    brackets: [
      [0, 0.07],
      [1000000, 0.099],
    ],
    sources: [
      "https://dor.wa.gov/taxes-rates/other-taxes/capital-gains-tax",
      "https://dor.wa.gov/taxes-rates/other-taxes/capital-gains-tax/do-you-owe-capital-gains-tax",
      "https://dor.wa.gov/forms-publications/publications-subject/special-notices/new-tiered-rates-washingtons-capital-gains-tax",
      "https://dor.wa.gov/taxes-rates/other-taxes/capital-gains-tax/frequently-asked-questions-about-washingtons-capital-gains-tax",
    ],
    gainsOnly: true,
    note: "Washington: no income tax, but a 7% capital gains excise tax on long-term gains above a $290,000 deduction, and 9.9% on the part above $1 million. Real estate sales are exempt, and interest and dividends are not taxed.",
    noteEs:
      "Washington: sin impuesto sobre la renta, pero con un impuesto de 7% sobre las ganancias de capital a largo plazo por encima de una deducción de $290,000, y de 9.9% sobre la parte que exceda $1 millón. Las ventas de bienes raíces están exentas y los intereses y dividendos no pagan impuesto.",
  },
  {
    code: "WV",
    name: "West Virginia",
    nameEs: "Virginia Occidental",
    taxYear: 2026,
    deduction: 2000,
    brackets: [
      [0, 0.0211],
      [10000, 0.0281],
      [25000, 0.0316],
      [40000, 0.0422],
      [60000, 0.0458],
    ],
    sources: [
      "https://tax.wv.gov/Individuals/Pages/PersonalIncomeTaxReductionBill.aspx",
      "https://tax.wv.gov/Documents/PIT/2025/it140.PersonalIncomeTaxFormsAndInstructions.2025.pdf",
    ],
    mfj: {
      deduction: 4000,
    },
    note: "West Virginia: 2.11% to 4.58% by bracket.",
    noteEs: "Virginia Occidental: de 2.11% a 4.58% según el tramo.",
  },
  {
    code: "WI",
    name: "Wisconsin",
    nameEs: "Wisconsin",
    taxYear: 2026,
    deduction: 700,
    exclusion: {
      pct: 0.3,
      cap: null,
    },
    brackets: [
      [0, 0.035],
      [15110, 0.044],
      [51950, 0.053],
      [332720, 0.0765],
    ],
    sources: [
      "https://www.revenue.wi.gov/TaxForms2026/2026-Form1-ES-Inst.pdf",
      "https://www.revenue.wi.gov/TaxForms2025/2025-ScheduleWD-Inst.pdf",
    ],
    phased: [
      {
        amount: 13960,
        phase: [28743, 194933],
      },
    ],
    mfj: {
      deduction: 1400,
      brackets: [
        [0, 0.035],
        [20150, 0.044],
        [69260, 0.053],
        [443630, 0.0765],
      ],
      phased: [
        {
          amount: 25840,
          phase: [41486, 228129],
        },
      ],
    },
    note: "Wisconsin: 3.5% to 7.65% by bracket, 30% of long-term gains excluded.",
    noteEs: "Wisconsin: de 3.5% a 7.65% según el tramo, con el 30% de las ganancias a largo plazo excluido.",
  },
  {
    code: "WY",
    name: "Wyoming",
    nameEs: "Wyoming",
    taxYear: 2026,
    noIncomeTax: true,
    deduction: 0,
    brackets: [[0, 0]],
    sources: ["https://wyomingbusiness.org/why-wyoming/business-resources/"],
    note: "Wyoming does not tax long-term capital gains.",
    noteEs: "Wyoming no grava las ganancias de capital a largo plazo.",
  },
];
