export type Language = 'en' | 'am' | 'wo';

export interface Translations {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    howItWorks: string;
    services: string;
    financialLiteracy: string;
    providers: string;
    about: string;
    login: string;
    getStarted: string;
    dashboard: string;
    logout: string;
  };
  hero: {
    badge: string;
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
  };
  metrics: {
    totalSales: string;
    totalExpenses: string;
    operatingProfit: string;
    profitDisclaimer: string;
    transactionsCount: string;
    lowStock: string;
    readinessProgress: string;
  };
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    filter: string;
    search: string;
    status: string;
    date: string;
    amount: string;
    category: string;
    description: string;
    actions: string;
    verified: string;
    pending: string;
    downloadPdf: string;
    exportCsv: string;
    currency: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'SodoBiz Bridge',
    tagline: 'From Small Business Records to Bigger Opportunities.',
    nav: {
      home: 'Home',
      howItWorks: 'How It Works',
      services: 'Services',
      financialLiteracy: 'Financial Literacy',
      providers: 'Verified Providers',
      about: 'About',
      login: 'Log In',
      getStarted: 'Start Business Profile',
      dashboard: 'Dashboard',
      logout: 'Log Out',
    },
    hero: {
      badge: 'Local Micro-Enterprise Empowerment · Wolaita Sodo',
      headline: 'Build Better Business Records. Unlock More Opportunities.',
      subheadline:
        'SodoBiz Bridge helps small businesses organize sales and expenses, understand their performance, prepare business profiles, and discover verified financial and business-support services.',
      primaryCta: 'Start Your Business Profile',
      secondaryCta: 'Explore How It Works',
    },
    metrics: {
      totalSales: 'Total Sales (Revenue)',
      totalExpenses: 'Total Operating Expenses',
      operatingProfit: 'Estimated Operating Result',
      profitDisclaimer: 'Calculated as recorded income minus recorded expenses. Not audited financial advice.',
      transactionsCount: 'Transactions Recorded',
      lowStock: 'Low-Stock Products',
      readinessProgress: 'Business Readiness Score',
    },
    common: {
      save: 'Save Changes',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      filter: 'Filter Records',
      search: 'Search...',
      status: 'Status',
      date: 'Date',
      amount: 'Amount (ETB)',
      category: 'Category',
      description: 'Description',
      actions: 'Actions',
      verified: 'Verified Partner',
      pending: 'Pending Verification',
      downloadPdf: 'Download / Print Report',
      exportCsv: 'Export to CSV',
      currency: 'ETB',
    },
  },
  am: {
    appName: 'ሶዶቢዝ ብሪጅ',
    tagline: 'ከአነስተኛ የንግድ መዝገብ ወደ ትላልቅ ዕድሎች።',
    nav: {
      home: 'ዋና ገጽ',
      howItWorks: 'እንዴት እንደሚሰራ',
      services: 'አገልግሎቶች',
      financialLiteracy: 'የፋይናንስ ትምህርት',
      providers: 'የተረጋገጡ አጋሮች',
      about: 'ስለ እኛ',
      login: 'ግባ',
      getStarted: 'መገለጫ ጀምር',
      dashboard: 'ዳሽቦርድ',
      logout: 'ውጣ',
    },
    hero: {
      badge: 'የአነስተኛ ንግድ ድጋፍ · ወላይታ ሶዶ',
      headline: 'የተሻለ የንግድ መዝገብ ይያዙ። ሰፊ ዕድሎችን ይክፈቱ።',
      subheadline:
        'ሶዶቢዝ ብሪጅ አነስተኛ የንግድ ተቋማት የዕለት ሽያጭና ወጪዎችን እንዲመዘግቡ፣ ትርፋቸውን እንዲረዱ፣ እና ከተረጋገጡ የፋይናንስ ተቋማት ጋር እንዲገናኙ ይረዳል።',
      primaryCta: 'የንግድ መገለጫ ይጀምሩ',
      secondaryCta: 'እንዴት እንደሚሰራ ይመልከቱ',
    },
    metrics: {
      totalSales: 'አጠቃላይ ሽያጭ (ገቢ)',
      totalExpenses: 'አጠቃላይ የንግድ ወጪዎች',
      operatingProfit: 'ግምታዊ የሥራ ትርፍ',
      profitDisclaimer: 'ከተመዘገበው ገቢ የተቀነሰ ወጪ ግምት ነው። የኦዲት ማስረጃ አይደለም።',
      transactionsCount: 'የተመዘገቡ ግብይቶች',
      lowStock: 'ያለቁ/የሚያልቁ እቃዎች',
      readinessProgress: 'የንግድ ዝግጁነት ደረጃ',
    },
    common: {
      save: 'አስቀምጥ',
      cancel: 'ይቅር',
      delete: 'ሰርዝ',
      edit: 'አስተካክል',
      filter: 'አጣራ',
      search: 'ፈልግ...',
      status: 'ሁኔታ',
      date: 'ቀን',
      amount: 'መጠን (ብር)',
      category: 'ምድብ',
      description: 'መግለጫ',
      actions: 'ተግባራት',
      verified: 'የተረጋገጠ አጋር',
      pending: 'በማረጋገጥ ላይ',
      downloadPdf: 'ሪፖርት አውርድ / አትም',
      exportCsv: 'በሲኤስቪ (CSV) አውርድ',
      currency: 'ብር',
    },
  },
  wo: {
    appName: 'SodoBiz Bridge',
    tagline: 'Guuttaa Maacawwaa Maxaafappe Wolqqaama Dembiyaa.',
    nav: {
      home: 'Koyro Sinttaa',
      howItWorks: 'Waani Oottiyay',
      services: 'Ooso Ooteta',
      financialLiteracy: 'Miyaaza Erissuwaa',
      providers: 'Eretida Maaddiyaageeta',
      about: 'Nuuba',
      login: 'Gela',
      getStarted: 'Zalamiyaa Doomarkka',
      dashboard: 'Kaalliyo Sinttaa',
      logout: 'Kesa',
    },
    hero: {
      badge: 'Guuttaa Zalamiyan Maadduwaa · Wolaytta Sodo',
      headline: 'Geeshsha Maxaafaa Mazgaba. Wolqqaama Dembiyaa Demma.',
      subheadline:
        'SodoBiz Bridge qeera zalanchati gallassa bayziyaanne kessiyo miishshaa mazgabiidi, wogaara erettida miishshaa maaddiyaageetura gaittanaadan maaddees.',
      primaryCta: 'Zalamiyaa Mazgabaa Dooma',
      secondaryCta: 'Waani Oottiyaakko Be\'a',
    },
    metrics: {
      totalSales: 'Mullera Bayzetta (Gela)',
      totalExpenses: 'Mullera Kesiya Miishshaa',
      operatingProfit: 'Qoppido Wodhdhida Miishshaa',
      profitDisclaimer: 'Gelidaappe kiyidaysaa shaakkiidi eratettan qoppidowasa. Audite gidenna.',
      transactionsCount: 'Mazgabettida Oosota',
      lowStock: 'Wurana Hanida Meziyata',
      readinessProgress: 'Giigettiyo Eratettaa',
    },
    common: {
      save: 'Wotta',
      cancel: 'Agga',
      delete: 'Xayssa',
      edit: 'Giigissa',
      filter: 'Shaakka',
      search: 'Koya...',
      status: 'Hanotaa',
      date: 'Gallassaa',
      amount: 'Taybbiyaa (Birr)',
      category: 'Duraa',
      description: 'Qonccissuwaa',
      actions: 'Oosota',
      verified: 'Erettida Maaddiyaagaa',
      pending: 'Paacettiyaagaa',
      downloadPdf: 'Mazaafaa Maxxaaba',
      exportCsv: 'CSV kessa',
      currency: 'Birr',
    },
  },
};
