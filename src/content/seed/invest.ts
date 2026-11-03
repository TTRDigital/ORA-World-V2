import type { Incentive, InvestmentStep } from "../types";

/** Published Act 60 explainer sections (oraworld.com/tax-incentive), tagged for the three-question orientation. */
export const incentives: Incentive[] = [
  {
    slug: "what-is-act-60",
    tags: ["general"],
    title: { en: "What is Puerto Rico Act 60?", es: "¿Qué es la Ley 60 de Puerto Rico?" },
    summary: { en: "The Puerto Rico Incentives Code consolidates the programs that previously existed under Acts 20 and 22 into a single framework.", es: "El Código de Incentivos de Puerto Rico consolida los programas que antes existían bajo las Leyes 20 y 22 en un solo marco." },
    body: {
      en: ["Act 60, also referred to as the Puerto Rico Incentives Code, is a legislative framework designed to consolidate and streamline various tax incentive programs that previously existed under different statutes, most famously Acts 20 and 22. By creating a single, cohesive code, Act 60 aims to stimulate economic growth, generate job opportunities, and attract both businesses and individuals to Puerto Rico through a range of favorable tax structures.", "Before Act 60's enactment in 2019, investors and businesses often had to navigate an array of separate laws to access Puerto Rico's tax benefits. Now the incentives that apply to export services, manufacturing, creative industries and more are organized under one umbrella."],
      es: ["La Ley 60, también conocida como el Código de Incentivos de Puerto Rico, es un marco legislativo diseñado para consolidar y simplificar los distintos programas de incentivos fiscales que antes existían bajo diferentes estatutos, sobre todo las Leyes 20 y 22. Con un solo código, la Ley 60 busca estimular el crecimiento económico, generar empleo y atraer empresas y personas a Puerto Rico mediante estructuras fiscales favorables.", "Antes de su promulgación en 2019, inversionistas y empresas debían navegar un conjunto de leyes separadas para acceder a los beneficios fiscales de Puerto Rico. Ahora los incentivos para servicios de exportación, manufactura, industrias creativas y más se agrupan bajo un mismo marco."],
    },
  },
  {
    slug: "residency",
    tags: ["relocating", "residence"],
    title: { en: "Residency requirements", es: "Requisitos de residencia" },
    summary: { en: "Personal benefits require bona fide residency: generally 183 days a year, a closer connection to Puerto Rico and no tax home elsewhere.", es: "Los beneficios personales exigen residencia bona fide: en general 183 días al año, una conexión más estrecha con Puerto Rico y ningún domicilio fiscal en otro lugar." },
    body: {
      en: ["To qualify for Act 60's personal tax benefits, individuals must establish \"bona fide\" residency in Puerto Rico. Generally, this involves spending at least 183 days per calendar year on the island, demonstrating a closer connection to Puerto Rico than any other jurisdiction, and ensuring that you do not have a tax home outside of Puerto Rico.", "Meeting the 183-day rule alone is insufficient if you maintain stronger ties elsewhere, such as a permanent home or family base. Demonstrating residency also includes showing evidence of your daily life in Puerto Rico, such as where you keep personal belongings, vote and participate in community activities."],
      es: ["Para calificar para los beneficios personales de la Ley 60, la persona debe establecer residencia \"bona fide\" en Puerto Rico. En general, esto implica pasar al menos 183 días por año natural en la isla, demostrar una conexión más estrecha con Puerto Rico que con cualquier otra jurisdicción y no tener un domicilio fiscal fuera de Puerto Rico.", "Cumplir solo la regla de 183 días no basta si se mantienen vínculos más fuertes en otro lugar, como una vivienda permanente o la base familiar. Demostrar residencia incluye evidenciar la vida diaria en Puerto Rico: dónde se guardan las pertenencias, dónde se vota y dónde se participa en la comunidad."],
    },
  },
  {
    slug: "relocating-family",
    tags: ["relocating"],
    title: { en: "Do I need to relocate my family?", es: "¿Debo trasladar a mi familia?" },
    summary: { en: "Your family does not necessarily have to move with you, but where your spouse and dependents live can affect the closer-connection test.", es: "Su familia no tiene que mudarse necesariamente con usted, pero dónde viven su cónyuge y dependientes puede afectar la prueba de conexión más estrecha." },
    body: {
      en: ["For individual investors or professionals seeking personal tax benefits, establishing bona fide residency typically means spending the majority of the year in Puerto Rico and demonstrating that your primary home is on the island. Your family doesn't necessarily have to move with you, but certain factors, such as whether your spouse and dependents live elsewhere, can affect the \"closer connection\" test for residency."],
      es: ["Para inversionistas o profesionales que buscan beneficios personales, establecer residencia bona fide suele implicar pasar la mayor parte del año en Puerto Rico y demostrar que la vivienda principal está en la isla. La familia no tiene que mudarse necesariamente, pero ciertos factores, como si el cónyuge y los dependientes viven en otro lugar, pueden afectar la prueba de \"conexión más estrecha\"."],
    },
  },
  {
    slug: "export-services",
    tags: ["business"],
    title: { en: "Export services and businesses", es: "Servicios de exportación y empresas" },
    summary: { en: "Companies serving clients outside Puerto Rico, as well as manufacturing, tourism, creative and technology ventures, may qualify for reduced corporate rates.", es: "Empresas que atienden clientes fuera de Puerto Rico, así como negocios de manufactura, turismo, industrias creativas y tecnología, pueden calificar para tasas corporativas reducidas." },
    body: {
      en: ["Export services, such as consulting, IT, marketing and financial advisory, are among the most popular categories, as these businesses primarily serve clients located outside of Puerto Rico. Manufacturing companies, including those in the pharmaceutical or medical device sectors, also see significant reductions in tax liabilities under Act 60.", "Businesses must be headquartered in Puerto Rico or have substantial operations on the island, including office space and Puerto Rican employees. Each program has unique requirements regarding investment, job creation or production output."],
      es: ["Los servicios de exportación, como consultoría, tecnología, mercadeo y asesoría financiera, están entre las categorías más populares, ya que atienden principalmente a clientes fuera de Puerto Rico. Las empresas de manufactura, incluidos los sectores farmacéutico y de dispositivos médicos, también ven reducciones significativas bajo la Ley 60.", "Las empresas deben tener su sede en Puerto Rico o mantener operaciones sustanciales en la isla, incluidos espacio de oficina y empleados puertorriqueños. Cada programa tiene requisitos propios de inversión, creación de empleo o producción."],
    },
  },
  {
    slug: "main-benefits",
    tags: ["residence", "business", "relocating"],
    title: { en: "The main benefits", es: "Los principales beneficios" },
    summary: { en: "Reduced corporate rates for qualifying export companies and, for bona fide residents who qualify, favorable treatment of capital gains, dividends and certain passive income.", es: "Tasas corporativas reducidas para empresas exportadoras que califiquen y, para residentes bona fide que califiquen, un tratamiento favorable de ganancias de capital, dividendos y ciertos ingresos pasivos." },
    body: {
      en: ["One of the key appeals of Act 60 is its array of tax incentives for qualifying individuals and corporations. These benefits often include reduced corporate income tax rates, sometimes as low as 4%, as well as exemptions or lower rates on dividends, interest and capital gains for residents.", "On a personal level, Act 60 provides incentives such as the possibility of 0% capital gains tax for bona fide residents who qualify. Property taxes and municipal taxes are not always covered, though some decrees may include partial exemptions."],
      es: ["Uno de los principales atractivos de la Ley 60 es su conjunto de incentivos para personas y corporaciones que califiquen. Estos beneficios suelen incluir tasas corporativas reducidas, en ocasiones de hasta 4%, así como exenciones o tasas más bajas sobre dividendos, intereses y ganancias de capital para residentes.", "A nivel personal, la Ley 60 ofrece incentivos como la posibilidad de 0% de impuesto sobre ganancias de capital para residentes bona fide que califiquen. Los impuestos sobre la propiedad y municipales no siempre están cubiertos, aunque algunos decretos pueden incluir exenciones parciales."],
    },
  },
  {
    slug: "application",
    tags: ["general"],
    title: { en: "Application and compliance", es: "Solicitud y cumplimiento" },
    summary: { en: "An electronic application to the DDEC, a review period, then a decree with benefits, obligations and validity. Annual filings and any philanthropic contributions keep it in force.", es: "Una solicitud electrónica ante el DDEC, un periodo de revisión y luego un decreto con beneficios, obligaciones y vigencia. Las presentaciones anuales y las aportaciones filantrópicas lo mantienen vigente." },
    body: {
      en: ["The application process typically begins with gathering essential documents, such as financial statements, incorporation papers (if applying as a business) and proof of Puerto Rican residency for individual applicants. You then submit an electronic application to the Department of Economic Development and Commerce (DDEC). Once approved, you receive a tax decree outlining your specific benefits, obligations and validity period. Timelines vary from a few weeks to several months.", "Certain benefits require individual decree holders to make annual philanthropic contributions to local nonprofits. Both individuals and businesses must meet annual filing requirements; failing to comply can lead to suspension or revocation of the decree."],
      es: ["El proceso suele comenzar reuniendo documentos esenciales, como estados financieros, documentos de incorporación (si se solicita como empresa) y prueba de residencia en Puerto Rico para personas. Luego se presenta una solicitud electrónica ante el Departamento de Desarrollo Económico y Comercio (DDEC). Una vez aprobada, se recibe un decreto que detalla beneficios, obligaciones y vigencia. Los plazos van de semanas a varios meses.", "Ciertos beneficios exigen que los titulares individuales realicen aportaciones filantrópicas anuales a organizaciones locales. Tanto personas como empresas deben cumplir con presentaciones anuales; el incumplimiento puede conllevar la suspensión o revocación del decreto."],
    },
  },
];

/** Deposit schedule. Entirely placeholder until the offering plan is filed; shown with the offering-plan notice. */
export const investmentSteps: InvestmentStep[] = [
  { order: 1, title: { en: "Register", es: "Regístrese" }, detail: { en: "Receive pricing and floor plans first. No deposits or reservations can be accepted until an offering plan is filed with the New York State Department of Law.", es: "Reciba precios y planos en primicia. No se pueden aceptar depósitos ni reservas hasta que se presente un plan de oferta ante el Departamento de Justicia del Estado de Nueva York." }, percent: null, when: { en: "Now", es: "Ahora" }, placeholder: false },
  { order: 2, title: { en: "Reservation", es: "Reserva" }, detail: { en: "Deposit at reservation: to be confirmed", es: "Depósito en la reserva: por confirmar" }, percent: null, when: { en: "After the offering plan is filed", es: "Tras la presentación del plan de oferta" }, placeholder: true },
  { order: 3, title: { en: "Contract", es: "Contrato" }, detail: { en: "Deposit at contract: to be confirmed", es: "Depósito al contrato: por confirmar" }, percent: null, when: { en: "To be confirmed", es: "Por confirmar" }, placeholder: true },
  { order: 4, title: { en: "Construction milestone", es: "Hito de construcción" }, detail: { en: "Deposit at milestone: to be confirmed", es: "Depósito al hito: por confirmar" }, percent: null, when: { en: "To be confirmed", es: "Por confirmar" }, placeholder: true },
  { order: 5, title: { en: "Closing", es: "Cierre" }, detail: { en: "Balance at closing: to be confirmed", es: "Saldo al cierre: por confirmar" }, percent: null, when: { en: "Estimated delivery: to be confirmed", es: "Entrega estimada: por confirmar" }, placeholder: true },
];
