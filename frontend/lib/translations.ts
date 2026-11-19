export type Language = "mr" | "en";

export interface Translations {
  topline: string;
  nav: {
    home: string;
    story: string;
    shop: string;
    farming: string;
    heritage: string;
    gallery: string;
    contact: string;
  };
  hero3D: {
    scrollHint: string;
    skipBtn: string;
    storyBtn: string;
    s1Tag: string;
    s1Title: string;
    s1Sub: string;
    s2Tag: string;
    s2Title: string;
    s2Sub: string;
    s3Tag: string;
    s3Title: string;
    s3Sub: string;
    s4Tag: string;
    s4Title: string;
    s4Sub: string;
    shopNow: string;
  };
  hero: {
    eyebrow: string;
    titleStart: string;
    titleHighlight: string;
    titleEnd: string;
    lead: string;
    shopBtn: string;
    storyBtn: string;
    trust1: string;
    trust2: string;
    trust3: string;
    trust4: string;
    badgeTitle: string;
    badgeSub: string;
  };
  founder: {
    eyebrow: string;
    title: string;
    subtitle: string;
    p1: string;
    p2: string;
    p3: string;
    p4: string;
    p5: string;
    p6: string;
    quote: string;
    founderTitle: string;
    farmTitle: string;
    stat1Val: string;
    stat1Lbl: string;
    stat2Val: string;
    stat2Lbl: string;
    stat3Val: string;
    stat3Lbl: string;
    stat4Val: string;
    stat4Lbl: string;
  };
  dignitaries: {
    eyebrow: string;
    title: string;
    lead: string;
    dignitary1Name: string;
    dignitary1Role: string;
    dignitary1Desc: string;
    dignitary2Name: string;
    dignitary2Role: string;
    dignitary2Desc: string;
    dignitary3Name: string;
    dignitary3Role: string;
    dignitary3Desc: string;
    dignitary4Name: string;
    dignitary4Role: string;
    dignitary4Desc: string;
  };
  products: {
    eyebrow: string;
    title: string;
    lead: string;
    viewAll: string;
    inStock: string;
    outStock: string;
    addToCart: string;
    addedToCart: string;
    perBox: string;
  };
  farming: {
    eyebrow: string;
    title: string;
    lead: string;
    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
  };
  heritage: {
    eyebrow: string;
    title: string;
    lead: string;
    exploreBtn: string;
    h1Title: string;
    h1Desc: string;
    h2Title: string;
    h2Desc: string;
    h3Title: string;
    h3Desc: string;
    h4Title: string;
    h4Desc: string;
  };
  gallery: {
    eyebrow: string;
    title: string;
    lead: string;
    c1: string;
    c2: string;
    c3: string;
    c4: string;
    c5: string;
    c6: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    name: string;
    phone: string;
    email: string;
    message: string;
    sendBtn: string;
    sending: string;
    success: string;
    error: string;
    visitTitle: string;
    address: string;
    phoneLabel: string;
    emailLabel: string;
  };
  footer: {
    about: string;
    exploreTitle: string;
    contactTitle: string;
    address: string;
    rights: string;
    developedBy: string;
  };
}

export const translations: Record<Language, Translations> = {
  mr: {
    topline: "॥ शिवसमर्थ ॥ कोकणच्या मातीतील अस्सल चव आपल्या घरापर्यंत · नारिंग्रे, ता. देवगड",
    nav: {
      home: "मुख्यपृष्ठ",
      story: "माझे मनोगत",
      shop: "आंबे खरेदी करा",
      farming: "सेंद्रिय शेती",
      heritage: "कोकण वारसा",
      gallery: "फोटो गॅलरी",
      contact: "संपर्क",
    },
    hero3D: {
      scrollHint: "खाली स्क्रोल करा आणि ३D प्रवास पहा",
      skipBtn: "थेट आंबे खरेदी करा",
      storyBtn: "माझे मनोगत वाचा",
      s1Tag: "GI Tag प्रमाणित · नारिंग्रे, देवगड",
      s1Title: "॥ शिवसमर्थ देवगड हापूस ॥",
      s1Sub: "कोकणच्या मातीतील अस्सल सुवर्ण चव. योग्य पक्वतेत झाडावरून काढलेला.",
      s2Tag: "नैसर्गिक सुगंध आणि गोडी",
      s2Title: "२० एकर समुद्रकिनारी बाग",
      s2Sub: "अरबी समुद्राची खारी हवा आणि लाल कातळ मातीतून निर्माण झालेली अद्वितीय गोडी.",
      s3Tag: "१००% सेंद्रिय व नैसर्गिक शेती",
      s3Title: "कार्बाईड विरहित · गवताची आडी",
      s3Sub: "पारंपरिक भाताच्या सुक्या गवतात (पेंढा) नैसर्गिक तापमानावर पिकवलेला.",
      s4Tag: "थेट बागेतून आपल्या घरी",
      s4Title: "अस्सल चवीचा एक प्रामाणिक प्रवास!",
      s4Sub: "कोणतेही विषारी रसायने नाहीत. बागेतून थेट आपल्या दारात ताज्या पेट्या.",
      shopNow: "ताजी पेटी खरेदी करा",
    },
    hero: {
      eyebrow: "देवगडच्या लाल कातळ मातीतील नैसर्गिक गोडवा",
      titleStart: "देवगड हापूस – ",
      titleHighlight: "अस्सल चवीचा",
      titleEnd: " एक प्रामाणिक प्रवास!",
      lead: "सिंधुदुर्ग जिल्ह्यातील देवगड तालुक्यातील नारिंग्रे या गावात, समुद्राच्या अतिशय जवळ असलेल्या २० एकर बागेतून थेट आपल्या दारात — १००% नैसर्गिक, रासायनिक अवशेषमुक्त आणि पारंपरिक गवताच्या आडीत पिकवलेला अस्सल हापूस.",
      shopBtn: "ताजी पेटी खरेदी करा",
      storyBtn: "माझे मनोगत वाचा",
      trust1: "२० एकर नारिंग्रे बाग",
      trust2: "१००% नैसर्गिक व सेंद्रिय",
      trust3: "कार्बाईड विरहित (आडीत पिकवलेला)",
      trust4: "GI Tag प्रमाणित",
      badgeTitle: "अस्सल देवगड हापूस",
      badgeSub: "शेवाळे ॲग्रो फार्म · नारिंग्रे, देवगड",
    },
    founder: {
      eyebrow: "माझे मनोगत",
      title: "देवगड हापूस आंबा – अस्सल चवीचा एक प्रामाणिक प्रवास!",
      subtitle: "केवळ व्यवसाय नाही, तर अस्सल देवगड हापूस आंब्याची परंपरा, नैसर्गिक चव आणि गुणवत्ता जपण्याचा एक ध्यास.",
      p1: "मला स्वतःला देवगड हापूस आंबा खूप आवडतो. मी देवगड हापूस आंब्याचा केवळ चाहता नाही, तर खऱ्या अर्थाने एक मोठा खवय्या आहे. देवगड हापूसचा तो अप्रतिम सुगंध, मधुर चव, केशरी रंग आणि तोंडात विरघळणारा गर याची सर इतर कोणत्याही आंब्याला येऊ शकत नाही.",
      p2: "परंतु गेल्या काही वर्षांत एक गोष्ट प्रकर्षाने जाणवू लागली, ती म्हणजे दिवसेंदिवस अस्सल देवगड हापूस आंबा मिळणे कठीण होत चालले आहे. एवढेच नव्हे, तर पूर्वी अनुभवायला मिळणारी त्याची नैसर्गिक गोडी, सुगंध आणि चवही आता फारशी जाणवत नाही.",
      p3: "यामागे अनेक कारणे आहेत. पारंपरिक शेतीपद्धतींचा होत चाललेला अभाव, नैसर्गिक खतांचा कमी वापर, रासायनिक औषधांचा वाढता वापर आणि सेंद्रिय शेतीकडे झालेले दुर्लक्ष यामुळे आंब्याच्या नैसर्गिक गुणवत्तेवर परिणाम होत असल्याचे जाणवते. त्यामुळे अस्सल देवगड हापूसची चव अनुभवणे हीदेखील एक मोठी गोष्ट बनली आहे.",
      p4: "पुण्यातील बाजारपेठेतही अस्सल देवगड हापूस आंबा मिळणे दिवसेंदिवस कठीण होत चालले आहे. मी स्वतः गेली अनेक वर्षे पुण्यातील मार्केटमधून देवगड हापूस आंबा खरेदी करत होतो. मात्र, मनासारखा अस्सल आंबा मिळत नसल्याने मनात एक विचार सतत येत होता — आपल्या भागातील लोकांना अस्सल देवगड हापूस आंब्याची पूर्वीसारखी चव का मिळू नये? त्यांना नैसर्गिक पद्धतीने पिकवलेला, रासायनिक अवशेषांचा धोका कमीत कमी ठेवून उत्पादित केलेला आणि उत्तम दर्जाचा आंबा का मिळू नये?",
      p5: "याच विचारातून एका वेगळ्या प्रवासाची सुरुवात झाली. मी स्वतः सिंधुदुर्ग जिल्ह्यातील देवगड तालुक्यात अनेक दिवस फिरलो. तेथील अनेक आंब्यांच्या बागा पाहिल्या, जमिनींची पाहणी केली आणि योग्य जागेचा शोध घेतला. अखेर देवगड तालुक्यातील नारिंग्रे या गावात, समुद्राच्या अतिशय जवळ आणि मुख्य रस्त्यालगत असलेली उत्तम कलमे असणारी तब्बल २० एकर जमीन खरेदी करण्याचा निर्णय घेतला.",
      p6: "पुण्यापासून जवळपास ३७५ किलोमीटर अंतरावर असलेली ही आंब्याची बाग! विशेष म्हणजे, मला स्वतःला आंब्याच्या शेतीचा कोणताही पूर्वानुभव नव्हता. तरीसुद्धा केवळ देवगड हापूस आंब्यावरील प्रेम, त्याची अस्सल चव लोकांपर्यंत पोहोचवण्याची इच्छा आणि काहीतरी वेगळे करण्याची जिद्द या जोरावर मी हा निर्णय घेतला. या बागेत आंब्याचे उत्पादन घेताना सेंद्रिय आणि नैसर्गिक शेतीपद्धतीचा अवलंब करण्याचा मी निश्चय केला.",
      quote: "माझ्यासाठी हा केवळ आंब्याचा व्यवसाय नाही, तर अस्सल देवगड हापूस आंब्याची परंपरा, त्याची नैसर्गिक चव आणि गुणवत्ता जपण्याचा एक प्रामाणिक प्रयत्न आहे. कारण माझा उद्देश फक्त आंबा विकणे नाही, तर प्रत्येक आंबाप्रेमीला अस्सल देवगड हापूस आंब्याचा आनंद आणि समाधान मिळवून देणे हा आहे!",
      founderTitle: "संस्थापक, शिवसमर्थ हापूस",
      farmTitle: "शेवाळे ॲग्रो फार्म · नारिंग्रे, ता. देवगड, जि. सिंधुदुर्ग",
      stat1Val: "२० एकर",
      stat1Lbl: "देवगड नारिंग्रे येथील बाग",
      stat2Val: "३७५ किमी",
      stat2Lbl: "पुणे ते देवगड प्रवास",
      stat3Val: "१००%",
      stat3Lbl: "नैसर्गिक व सेंद्रिय शेती",
      stat4Val: "GI Tag",
      stat4Lbl: "प्रमाणित अस्सल प्रत",
    },
    dignitaries: {
      eyebrow: "मान्यवरांचा विश्वास आणि पसंती",
      title: "देशातील नामवंत व्यक्तींची पहिली पसंती — शिवसमर्थ हापूस",
      lead: "आमच्या देवगड बागेतील अस्सल गोडवा आणि सुगंध देशातील ज्येष्ठ नेते, मंत्री आणि मान्यवर खवय्यांपर्यंत पोहोचला आहे.",
      dignitary1Name: "मा. श्री. शिवराज सिंह चौहान",
      dignitary1Role: "केंद्रीय कृषी व शेतकरी कल्याण मंत्री",
      dignitary1Desc: "शिवसमर्थ देवगड हापूसच्या अस्सल सुगंधाची, चवीची आणि नैसर्गिक पिकवण पद्धतीची विशेष प्रशंसा.",
      dignitary2Name: "मा. श्री. किरेन रिजिजू",
      dignitary2Role: "केंद्रीय संसदीय कार्य मंत्री",
      dignitary2Desc: "शिवसमर्थ हापूसच्या प्रीमियम गुणवत्तेचा, GI टॅग प्रामाणिकतेचा आणि नैसर्गिक गोडीचा आस्वाद.",
      dignitary3Name: "मा. श्री. मुरलीधर मोहोळ",
      dignitary3Role: "केंद्रीय राज्यमंत्री, नागरी विमान वाहतूक व सहकार",
      dignitary3Desc: "शिवसमर्थ देवगड हापूसच्या अस्सल गोडव्याचे आणि कोकणच्या सेंद्रिय शेती परंपरेचे विशेष कौतुक व सदिच्छा.",
      dignitary4Name: "पोलीस आयुक्त व वरिष्ठ अधिकारी",
      dignitary4Role: "महाराष्ट्र पोलीस व प्रशासन",
      dignitary4Desc: "शिवसमर्थ हापूसच्या अधिकृत पेटीचे औपचारिक अनावरण व चवीचे विशेष कौतुक.",
    },
    products: {
      eyebrow: "थेट झाडावरून ताजी पेटी",
      title: "आमचे अस्सल देवगड हापूस बॉक्स",
      lead: "प्रत्येक आंबा झाडावरून योग्य पक्वतेत उतरवून, स्वच्छ करून, नैसर्गिक गवताच्या आडीत पिकवून तयार केलेला.",
      viewAll: "सर्व उत्पादने पहा",
      inStock: "हंगामात उपलब्ध",
      outStock: "सध्या उपलब्ध नाही",
      addToCart: "कार्टमध्ये जोडा",
      addedToCart: "कार्टमध्ये जोडले!",
      perBox: "पेटी",
    },
    farming: {
      eyebrow: "पारंपरिक व सेंद्रिय शेती",
      title: "नैसर्गिक पद्धतीने पिकवलेला अस्सल हापूस",
      lead: "कोणतेही विषारी रसायने किंवा कार्बाईड न वापरता, पारंपरिक कोकणी पद्धतीने झाडावरून थेट आपल्या ताटात.",
      f1Title: "कातळ खनिजे व समुद्रकिनारा",
      f1Desc: "देवगडच्या नारिंग्रे गावातील लाल जांभा दगड (कातळ) आणि अरबी समुद्राची खारी हवा यामुळे आंब्याला नैसर्गिक गोडी व अद्वितीय केशरी रंग मिळतो.",
      f2Title: "सेंद्रिय व नैसर्गिक खते",
      f2Desc: "रासायनिक खतांचा त्याग करून शेणखत, जिवामृत आणि नैसर्गिक पालापाचोळ्याचा वापर करून जमिनीचा कस आणि आंब्याची चव जपली जाते.",
      f3Title: "गवताच्या आडीत पारंपरिक पिकवण",
      f3Desc: "आम्ही कार्बाईडचा वापर करत नाही. भाताच्या सुक्या गवताच्या आडीत (पेंढा) नैसर्गिक तापमानावर आंबा पिकवला जातो, ज्यामुळे नैसर्गिक सुगंध टिकून राहतो.",
      f4Title: "GI Tag प्रमाणित मूळ प्रत",
      f4Desc: "प्रत्येक बॉक्सवर अधिकृत जिओग्राफिकल इंडिकेशन (GI Tag) प्रमाणित असते, ज्यामुळे ग्राहकाला अस्सल देवगड हापूसची १००% हमी मिळते.",
    },
    heritage: {
      eyebrow: "भूमी, लोक आणि परंपरा",
      title: "कोकण वारसा आणि देवगडची संस्कृती",
      lead: "ऐतिहासिक सागरी किल्ले, अरबी समुद्राची लाट आणि शतकांची आंबा शेती संस्कृती.",
      exploreBtn: "वारसा जाणून घ्या",
      h1Title: "सिंधुदुर्ग किल्ला",
      h1Desc: "छत्रपती शिवाजी महाराजांनी कुरटे बेटावर उभारलेला हा अभेद्य सागरी किल्ला, अरबी समुद्राच्या लाटांवर आजही दिमाखात उभा आहे.",
      h2Title: "देवगडची समुद्र किनारपट्टी",
      h2Desc: "जांभा दगडाची जमीन आणि समुद्राची खारी हवा यामुळे देवगड हापूसला जगातील सर्वोत्तम सुगंध आणि गोडी प्राप्त होते.",
      h3Title: "विजयदुर्ग किल्ला",
      h3Desc: "वाघोटन नदीच्या मुखावर वसलेला मराठा आरमाराचा सर्वात जुना आणि अभेद्य सागरी किल्ला.",
      h4Title: "नारिंग्रे येथील आंबा बाग",
      h4Desc: "देवगड तालुक्यातील निसर्गरम्य नारिंग्रे गावात २० एकर जागेवर वसलेली शिवसमर्थ हापूसची समुद्रकिनारी बाग.",
    },
    gallery: {
      eyebrow: "बागेतील क्षणचित्रे",
      title: "शेती, तोडणी व पॅकिंग गॅलरी",
      lead: "आमच्या देवगड नारिंग्रे बागेतील मानवी हातांनी टिपलेले अस्सल, अनएडिटेड आणि जिवंत क्षणचित्रे.",
      c1: "झाडावरून काढलेली ताजी देवगड हापूसची पेटी (गवताच्या आडीत)",
      c2: "अस्सल केशरी-सोनेरी गर व रसाळ पोत (Devgad Alphonso Cut Pulp)",
      c3: "देवगड नारिंग्रे बागेत आंब्यांची पाहणी करताना संस्थापक",
      c4: "अधिकृत GI Tag प्रमाणित देवगड हापूस आंबा",
      c5: "पारंपरिक गवताच्या आडीत आंब्यांची प्रतवारी व सुबक मांडणी",
      c6: "मान्यवर नेत्यांना शिवसमर्थ हापूसची अधिकृत पेटी सस्नेह भेट",
    },
    contact: {
      eyebrow: "आम्हाला संपर्क करा",
      title: "आपली विचारणा नोंदवा",
      name: "आपले नाव",
      phone: "मोबाईल नंबर",
      email: "ईमेल पत्ता",
      message: "आपला संदेश / मागणी",
      sendBtn: "विचारणा पाठवा",
      sending: "पाठवत आहे...",
      success: "धन्यवाद! आपली विचारणा यशस्वीरीत्या प्राप्त झाली आहे. आम्ही लवकरच संपर्क करू.",
      error: "विचारणा पाठवता आली नाही. कृपया WhatsApp बटनाद्वारे थेट संपर्क साधावा.",
      visitTitle: "थेट संपर्क व बागेचा पत्ता",
      address: "शिवसमर्थ हापूस (शेवाळे ॲग्रो फार्म),\nमु. पो. नारिंग्रे (समुद्र किनाऱ्याजवळ, मुख्य रस्त्यालगत),\nता. देवगड, जि. सिंधुदुर्ग, महाराष्ट्र - ४१६६३०",
      phoneLabel: "फोन / व्हॉट्सअॅप:",
      emailLabel: "ईमेल:",
    },
    footer: {
      about: "सिंधुदुर्ग जिल्ह्यातील देवगड तालुक्यातील नारिंग्रे गावातील २० एकर समुद्रकिनारी बागेतून थेट आपल्या दारात १००% नैसर्गिक, सेंद्रिय आणि गवताच्या आडीत पिकवलेला अस्सल हापूस.",
      exploreTitle: "विभाग",
      contactTitle: "संपर्क व बागेचा पत्ता",
      address: "शिवसमर्थ हापूस (शेवाळे ॲग्रो फार्म), नारिंग्रे, ता. देवगड, जि. सिंधुदुर्ग, महाराष्ट्र - ४१६६३०",
      rights: "शिवसमर्थ हापूस. सर्व हक्क सुरक्षित.",
      developedBy: "अस्सल देवगड शेतकरी परंपरा",
    }
  },
  en: {
    topline: "॥ Shiv Samarth ॥ Direct from our coastal orchard in Naringre, Devgad to your doorstep",
    nav: {
      home: "Home",
      story: "Founder's Story",
      shop: "Shop Mangoes",
      farming: "Organic Farming",
      heritage: "Konkan Heritage",
      gallery: "Photo Gallery",
      contact: "Contact",
    },
    hero3D: {
      scrollHint: "Scroll down to experience our 3D journey",
      skipBtn: "Shop Mangoes Direct",
      storyBtn: "Read Founder's Story",
      s1Tag: "GI Tagged Origin · Naringre, Devgad",
      s1Title: "Shiv Samarth Devgad Alphonso",
      s1Sub: "Pure Konkan sunshine & divine aroma. Hand-picked at peak maturity.",
      s2Tag: "Authentic Coastal Terroir",
      s2Title: "20-Acre Coastal Orchard",
      s2Sub: "Nurtured by Arabian maritime sea breezes and rich red laterite mineral soil.",
      s3Tag: "100% Organic & Chemical-Free",
      s3Title: "Carbide-Free · Straw Ripened",
      s3Sub: "Naturally matured in traditional rice straw beds (aadi) without artificial gases.",
      s4Tag: "Direct from Orchard to You",
      s4Title: "A Sincere Journey of Authentic Taste!",
      s4Sub: "Zero chemical residues. Farm-fresh Alphonso boxes delivered straight to your home.",
      shopNow: "Shop Fresh Peti Now",
    },
    hero: {
      eyebrow: "Direct From Devgad's Coastal Laterite Soil",
      titleStart: "Devgad Alphonso – ",
      titleHighlight: "A Sincere Journey",
      titleEnd: " of Authentic Taste!",
      lead: "Straight from our 20-acre coastal orchard in Naringre village, Devgad, Sindhudurg — 100% natural, residue-free, and traditionally straw-ripened authentic Alphonso mangoes.",
      shopBtn: "Shop Fresh Peti",
      storyBtn: "Read Founder's Story",
      trust1: "20-Acre Coastal Orchard",
      trust2: "100% Organic & Natural",
      trust3: "Carbide-Free (Straw-Ripened)",
      trust4: "GI Tag Certified",
      badgeTitle: "Authentic Devgad Hapus",
      badgeSub: "Shewale Agro Farm · Naringre, Devgad",
    },
    founder: {
      eyebrow: "From the Founder's Heart",
      title: "Devgad Alphonso Mango – A Sincere Journey of Authentic Taste!",
      subtitle: "Not merely a business, but a lifelong commitment to preserving the heritage and soul of real Devgad Hapus.",
      p1: "I have always been deeply passionate about Devgad Alphonso mangoes. I am not merely a fan, but a true connoisseur. The divine aroma, the rich natural sweetness, the vibrant saffron-golden hue, and the melt-in-the-mouth pulp of authentic Devgad Hapus simply cannot be matched by any other mango in the world.",
      p2: "However, over the past few years, one painful reality became increasingly evident: finding truly genuine Devgad Alphonso was becoming harder by the day. Worse still, the natural sweetness, aroma, and soul-satisfying taste we once enjoyed in our childhood was fading away.",
      p3: "There are multiple reasons behind this — the erosion of traditional farming practices, lack of natural organic compost, increasing chemical sprays, and neglect of organic soil health have severely compromised the natural quality of the fruit. Experiencing genuine Devgad Hapus had become a rarity.",
      p4: "Even in Pune's fruit markets, finding authentic Devgad Hapus was becoming an uphill battle. For years, I purchased mangoes from Pune's markets, yet the lack of genuine taste constantly stirred a question in my heart: Why shouldn't people in our cities enjoy the true, unadulterated taste of Devgad Alphonso as it used to be? Why shouldn't they receive mangoes naturally ripened without hazardous chemical residues, grown with pure organic care and peak quality?",
      p5: "From this very conviction, a transformative journey began. I traveled extensively across Devgad taluka in Sindhudurg district for days, surveying numerous orchards, inspecting soils, and searching for the ideal land. Finally, in Naringre village, Devgad taluka — situated close to the Arabian Sea coastline and adjacent to the main road — I decided to acquire 20 acres of prime orchard land with exquisite mango trees.",
      p6: "An orchard located 375 kilometers away from Pune! Remarkably, I had no prior background in mango cultivation. Yet, solely powered by my love for Devgad Alphonso, an earnest yearning to deliver authentic taste to people, and the grit to build something genuine, I took this leap of faith. In this orchard, I resolved to strictly practice organic, natural farming.",
      quote: "For me, this is not just a business; it is a heartfelt endeavor to preserve the rich legacy, natural flavor, and timeless quality of authentic Devgad Alphonso. Because my goal is not simply to sell mangoes — it is to bring pure joy, delight, and complete satisfaction to every mango lover!",
      founderTitle: "Founder, Shiv Samarth Hapus",
      farmTitle: "Shewale Agro Farm · Naringre, Tal. Devgad, Dist. Sindhudurg",
      stat1Val: "20 Acres",
      stat1Lbl: "Coastal Orchard in Naringre",
      stat2Val: "375 km",
      stat2Lbl: "Pune to Devgad Journey",
      stat3Val: "100%",
      stat3Lbl: "Organic & Natural Cultivation",
      stat4Val: "GI Tag",
      stat4Lbl: "Certified Origin & Purity",
    },
    dignitaries: {
      eyebrow: "Trusted by Esteemed Dignitaries",
      title: "Preferred by Renowned Leaders Across India",
      lead: "The authentic aroma and natural sweetness of our Devgad orchard has reached and delighted national ministers, esteemed MPs, and prominent dignitaries.",
      dignitary1Name: "Hon. Shri Shivraj Singh Chouhan",
      dignitary1Role: "Union Minister of Agriculture & Farmers Welfare",
      dignitary1Desc: "Admired the authentic aroma, rich sweetness, and natural ripening of Shiv Samarth Devgad Hapus.",
      dignitary2Name: "Hon. Shri Kiren Rijiju",
      dignitary2Role: "Union Minister of Parliamentary Affairs",
      dignitary2Desc: "Savoring the premium quality, GI authenticity, and organic taste of our harvest.",
      dignitary3Name: "Shri Murlidhar Mohol",
      dignitary3Role: "Minister of State – Civil Aviation and Cooperation",
      dignitary3Desc: "Appreciated the preservation of Konkan's authentic Alphonso farming traditions, natural aroma, and organic care.",
      dignitary4Name: "Police Commissioners & Officials",
      dignitary4Role: "Senior Maharashtra Police Leadership",
      dignitary4Desc: "Unveiling and admiring the official Shiv Samarth Devgad Hapus gift boxes.",
    },
    products: {
      eyebrow: "Freshly Harvested From Our Trees",
      title: "Our Authentic Devgad Mango Boxes",
      lead: "Each mango is hand-picked at peak maturity, gently graded, and naturally ripened on traditional rice straw beds.",
      viewAll: "View All Products",
      inStock: "In Season / Available",
      outStock: "Currently Unavailable",
      addToCart: "Add to Cart",
      addedToCart: "Added to Cart!",
      perBox: "Peti",
    },
    farming: {
      eyebrow: "Traditional & Sustainable Agriculture",
      title: "Naturally Grown, Residue-Free Devgad Hapus",
      lead: "Zero hazardous chemicals, zero artificial carbide — strictly cultivated with Konkan traditions and sea-breeze terroir.",
      f1Title: "Laterite Minerals & Sea Breeze",
      f1Desc: "Located in Naringre village, Devgad, the red laterite soil (Katal) enriched with coastal minerals and maritime winds imparts an unmatched sweetness and aroma.",
      f2Title: "Organic & Natural Nutrition",
      f2Desc: "Rejecting harsh chemical fertilizers, we nourish trees with natural cow dung, Jeevamrit, and organic mulch to preserve soil vitality.",
      f3Title: "Straw Bed (Aadi) Ripening",
      f3Desc: "100% carbide-free. We ripen mangoes naturally in traditional rice straw beds (aadi) at ambient temperature, preserving vitamins and pure flavor.",
      f4Title: "GI Tag Purity Guarantee",
      f4Desc: "Every box carries an official Geographical Indication (GI Tag) QR verification seal, assuring customers 100% genuine origin from Devgad.",
    },
    heritage: {
      eyebrow: "Land, People & Legacy",
      title: "Konkan Heritage and Orchard Culture",
      lead: "Explore the coastal fortress heritage, the Arabian Sea tides, and centuries of living orchard traditions.",
      exploreBtn: "Discover Heritage",
      h1Title: "Sindhudurg Fort",
      h1Desc: "Built by Chhatrapati Shivaji Maharaj on Kurte island, this formidable sea fortress stands resilient against the Arabian Sea waves.",
      h2Title: "Devgad Coastline",
      h2Desc: "Renowned worldwide for its laterite coastal soil and maritime winds, producing the sweet, aromatic Alphonso mango.",
      h3Title: "Vijaydurg Fort",
      h3Desc: "One of the oldest sea forts in the Konkan, nestled in the mouth of the Vaghotan river with legendary naval history.",
      h4Title: "Naringre Mango Orchard",
      h4Desc: "Our 20-acre coastal orchard situated beside the Arabian Sea in Naringre, carrying forward pure Konkan farming traditions.",
    },
    gallery: {
      eyebrow: "Moments from the Farm",
      title: "Harvest & Farm Gallery",
      lead: "Authentic, human-clicked moments from our coastal Devgad orchards, traditional harvest, and packaging.",
      c1: "Freshly harvested Devgad mangoes in crate on natural straw (Aadi)",
      c2: "Vibrant golden-saffron cut pulp texture (100% Tree-Ripened)",
      c3: "Founder inspecting developing Alphonso clusters in Naringre orchard",
      c4: "Official Geographical Indication (GI Tag) certified fruit in hand",
      c5: "Traditional sorting and grading on natural rice straw beds",
      c6: "Presenting the official Shiv Samarth Devgad Hapus box to dignitaries",
    },
    contact: {
      eyebrow: "We Would Love to Hear From You",
      title: "Get in Touch",
      name: "Your Name",
      phone: "Phone Number",
      email: "Email Address",
      message: "Your Message / Order Requirement",
      sendBtn: "Send Enquiry",
      sending: "Sending...",
      success: "Thank you! Your enquiry has been received. We will get back to you shortly.",
      error: "Enquiry could not be sent. Please contact us directly via WhatsApp.",
      visitTitle: "Farm & Contact Details",
      address: "Shiv Samarth Hapus (Shewale Agro Farm),\nAt Post Naringre (Near Sea Coast, Main Road),\nTal. Devgad, Dist. Sindhudurg, Maharashtra - 416630",
      phoneLabel: "Phone / WhatsApp:",
      emailLabel: "Email:",
    },
    footer: {
      about: "Direct from our 20-acre coastal orchard in Naringre village, Devgad, Sindhudurg — 100% natural, residue-free, and traditionally straw-ripened Alphonso mangoes.",
      exploreTitle: "Navigation",
      contactTitle: "Farm & Contact Details",
      address: "Shiv Samarth Hapus (Shewale Agro Farm), Naringre, Tal. Devgad, Dist. Sindhudurg, Maharashtra - 416630",
      rights: "Shiv Samarth Hapus. All rights reserved.",
      developedBy: "Authentic Devgad Farming Legacy",
    }
  }
};
