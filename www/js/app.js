// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
	'ionic',
	'ngCordova',
	'starter.controllers.common',
	'starter.controllers.home',
	'starter.controllers.raccolta',
	'starter.controllers.profilo',
	'pascalprecht.translate',
	'google-maps'
])




.run(function ($ionicPlatform, $rootScope, $translate) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if (typeof navigator.globalization !== "undefined") {
      navigator.globalization.getPreferredLanguage(function (language) {
        $translate.use((language.value).split("-")[0]).then(function (data) {
          console.log("SUCCESS -> " + data);
        }, function (error) {
          console.log("ERROR -> " + error);
        });
      }, null);
    }

  });

  $rootScope.p = [];
  $rootScope.selectedProfile = null;
  $rootScope.supports_html5_storage = function () {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }
  $rootScope.readProfiles = function () {
    if (!$rootScope.supports_html5_storage()) {
      return;
    }
    $rootScope.p = [];
    var stringP = localStorage.getItem("profiles");
    if (!!stringP && stringP != "!!-null") {
      var rawP = [];
      rawP = stringP.split("[[;");
      for (var i = 0; i < rawP.length; i++) {
        $rootScope.p.push({
          name: rawP[i].split("([;")[0],
          type: rawP[i].split("([;")[1],
          loc: rawP[i].split("([;")[2],
          image: "img/rifiuti_btn_radio_off_holo_dark.png"
        });
      }
    }
  };
  $rootScope.findProfileById = function (id) {
    $rootScope.readProfiles();
    for (var i = 0; i < $rootScope.p.length; i++) {
      if ($rootScope.p[i].name == id) {
        return $rootScope.p[i];
      }
    }
    return null;
  };
  $rootScope.findIndexById = function (id) {
    $rootScope.readProfiles();
    for (var i = 0; i < $rootScope.p.length; i++) {
      if ($rootScope.p[i].name == id) {
        return i;
      }
    }
    return -1;
  };
  $rootScope.selectProfile = function (index) {
    if (index >= $rootScope.p.length) {
      return;
    }
    if (!!$rootScope.selectedProfile) {
      $rootScope.findProfileById($rootScope.selectedProfile.name).image = "img/rifiuti_btn_radio_off_holo_dark.png";
    }
    $rootScope.p[index].image = "img/rifiuti_btn_radio_on_holo_dark.png";
    $rootScope.selectedProfile = $rootScope.p[index];
  };
  $rootScope.menuProfilesUpdate = function () {
    var profileIndex;
    if ($rootScope.selectedProfile) {
      profileIndex = $rootScope.findIndexById($rootScope.selectedProfile.name);
    } else {
      profileIndex = 0;
    }
    $rootScope.selectProfile(profileIndex);
  };
})









/*.config(function ($translateProvider){
    $translateProvider.translations("en",{
        hello_message: "ciao",
        goodbye_message:"byebye"
    });
    $translateProvider.translations("es",{
        hello_message: "howdy",
        goodbye_message:"goodbye"
    });
    $translateProvider.preferredLanguage("en");
    $translateProvider.fallbackLanguage("en");
});*/


.config(function ($stateProvider, $urlRouterProvider, $translateProvider) {

  var lang = navigator.language.split("-");
  var current_lang = (lang[0]);
  //alert( "current_lang: " + current_lang );


  $translateProvider.translations("it", {
    hello_message: "ciao",
    goodbye_message: "arrivederci",
    LUN: "LUN",
    MAR: "MAR",
    MER: "MER",
    GIO: "GIO",
    VEN: "VEN",
    SAB: "SAB",
    DOM: "DOM",
    Tocca: "Tocca + per aggiungere una nota",

    'ad esempio': "Ad esempio:",
    Invia: "Invia una email per segnalare un problema direttamente all'ente che si ocupa della gestione dei rifiuti. Puoi allegare una foto e le coordinate GPS della tua posizione.",
    Progetto: '"100% Riciclo" è un progetto di:',
    Collaborazione: "con la collaborazione di:",
    Eventuali: "Per informazioni:",

    TutorialUno: "Questo tutorial ti inlustrerà il funzionamento della app. Per sapere dove buttare uno specifico rifiuto, scrivine il nome qui e premi sulla lente d'ingrandimento.",
    TutorialDue: "Scopri quali rifiuti appartengono ad una determinata categoria e scopri dove devono essere conferiti",
    TutorialTre: "Aggiungi delle note personali o dei promemoria legati alla gestione dei rifiuti (e.g. pagamento della bolletta, oggetti da portare al CRM, etc)",
    TutorialQuattro: "Tieni sotto controllo le scadenze della raccolta porta a porta e aggiungi delle note personali.",
    TutorialCinque: "Premi qui per aprire il menù laterale e scoprire ulteriori funzionalità",
    TTUno: "Benvenuto!",
    TTDue: "Tipologie di rifiuto",
    TTTre: "Note",
    TTQuattro: "Calendario",
    TTCinque: "Menù laterale",

    y1: "Servizio TIA e informatica",
    y2: "Per informazioni in merito alla Tariffa di Igiene Urbana",
    y3: "Via Padre Gnesotti, 2 38079 Tione di Trento TN",
    y4: "lunedì - giovedì 8.30-12.30 14.00-17.00 venerdì 8.30-12.30",
    y5: "www.comunitadellegiudicarie.it",
    y6: "0465/339532",
    y7: "serviziotiaeinformatica@comunedellegiudicarie.it",
    y8: "c.giudicarie.legamail.it",
    y9: "0465/339548",

    u1: "Ufficio Igiene Ambientale",
    u2: "Per informazioni in merito alla raccolta differenziata",
    u3: "Centro Integrato, Loc. Zuclo 38079 Zuclo TN",
    u4: "lunedì - giovedì 8.30-12.30 14.00-17.00 venerdì 8.30-12.30",
    i2: "Il gestore dei rifiuti per la Comunità dell Giudicarie",



  });
  $translateProvider.translations("en", {
    hello_message: "howdy",
    goodbye_message: "goodbye",
    LUN: "MON",
    MAR: "TUE",
    MER: "WED",
    GIO: "THU",
    VEN: "FRI",
    SAB: "SAT",
    DOM: "SUN",
    Carta: "Paper",
    Accumulatori: "Accumulators",
    Cartone: "Cardboard",
    'Cartoni per bevande': "Cartons for beverages",
    'Cartucce toner esaurite': "Depleted toner cartridges",
    'Imballaggi in metallo': "Metal packagings",
    'Imballaggi in plastica': "Plastic packagings",
    'Imballaggi in vetro': "Glass packagings",
    'Indumenti usati': "Used clothes",
    Inerti: "Inerts",
    Ingombranti: "Bulky",
    Legno: "Wood",
    'Medicinali scaduti': "Expired medicines",
    'Oggetti in metallo': "Metal objects",
    'Oggetti in plastica': "Plastic Objects",
    'Oggetti in vetro': "Glass objects",
    'Olio vegetale': "Vegetable oil",
    'Olio minerale': "Mineral oil",
    'Organico': "Organic",
    'Pericolosi': "Dangerous",
    Pile: "Batteries",
    Pneumatici: "Tires",
    Residuo: "Remains",
    'Verde e ramaglie': "Grass, leaves and branches",
    'Carta, cartone e cartoni per bevande': "Paper, cardboard and beverages cartons",
    'Imballaggi in plastica e metallo': "Metal and plastic packagings",
    'Centro di raccolta materiali (CRM)': "Dump",

    Lunedì: "Monday",
    Martedì: "Tuesday",
    Mercoledì: "Wednesday",
    Giovedì: "Thursday",
    Venerdì: "Friday",
    Sabato: "Saturday",
    Domenica: "Sunday",

    Gennaio: "January",
    Febbraio: "February",
    Marzo: "March",
    Aprile: "April",
    Maggio: "May",
    Giugno: "June",
    Luglio: "July",
    Agosto: "August",
    Settembre: "September",
    Ottobre: "October",
    Novembre: "November",
    Dicembre: "December",

    Tocca: "Click + to add a note",
    'ad esempio': "For example:",
    'Portare la tv al CRM': '"Bring the tv to the dump"',
    'Pagare la bolletta dei rifiuti': '"Pay the garbage bill"',

    'Che rifiuto vuoi buttare?': "What do you want to throw?",
    NOTE: "NOTES",
    'DOVE LO BUTTO?': "WHERE TO THROW?",
    CALENDARIO: "CALENDAR",

    'Punti di raccolta': "Collection points",
    'Tipi di raccolta': "Types of collection",
    'Tipologie di raccolta': "Types of collection",
    'Gestione profili': "Profiles managment",
    'Segnala': "Report",
    Contatti: "Contacts",
    Tutorial: "Tutorial",
    Info: "Info",

    Profili: "Profiles",
    Residente: "Resident",
    'Azienda standard': "Standard business",
    'Turista occasionale': "Fortuitous tourist",
    'Turista stagionale': "Seasonal tourist",
    'Azienda con porta a porta': "Business with door to door collection",

    'Nome del profilo': "Name of the profile",
    'Tipo di utenza': "Type of user",
    'Comune o Località': "Comune/place",
    Selezionare: "Select",

    Invia: "Send an email to warn about a problem directly with the authority in charge. You can attach a photo and the GPS coordinates of your position",
    'Allega la tua posizione': "Send position",
    'Segnala!': "Send!",
    'Inserisci qui il testo della segnalazione': "Write here the text of your report",
    Segnalazione: "Report",


    Progetto: '"100% Riciclo" is a project by:',
    Collaborazione: "with the collaboration of:",
    Eventuali: "For informations:",
    Informazioni: "Informations",

    TutorialUno: "This tutorial will show you the features of this app. To know where to throw a specific type of garbage, write its name here and click the magnifying glass",
    TutorialDue: "Discover which types of garbage belongs to the same category and find out where to throw them away",
    TutorialTre: "Add personal notes or memo linked to the collection (i.e. payment of the bill, things to bring to the dump,etc)",
    TutorialQuattro: "Discover what happens today and in any other day: which type of door to door collection is expected and which dumps are open",
    TutorialCinque: "Click here to open the side menu and discover additional features",
    TTUno: "Welcome!",
    TTDue: "Types of garbage",
    TTTre: "Notes",
    TTQuattro: "Calendar",
    TTCinque: "Side menu",

    y1: "TIA service and computer science",
    y2: "For informations abut the TIA (fee for the urban cleaning) ",
    y3: "Via Padre Gnesotti, 2 38079 Tione di Trento TN",
    y4: "Monday - Thursday 8.30-12.30 14.00-17.00 Friday 8.30-12.30",
    y5: "www.comunitadellegiudicarie.it",
    y6: "0465/339532",
    y7: "serviziotiaeinformatica@comunedellegiudicarie.it",
    y8: "c.giudicarie.legamail.it",
    y9: "0465/339548",
    u1: "Ambiental cleanliness office",
    u2: "For informations about the recycling",
    u3: "Centro Integrato, Loc. Zuclo 38079 Zuclo TN",
    u4: "Monday - Thursday 8.30-12.30 14.00-17.00 Friday 8.30-12.30",
    i2: "The managing authority for the recycling of Comunità delle Giudicarie",

    Agende: "Agendas",
    Calendari: "Calendars",
    Carta: "Paper",
    'Carta da pacco': "Wrapping paper",
    'Carta del pane': "Bread paper",
    'Contenitori di carta': "Paper containers",
    'Faldoni ufficio senza anelli': "Large folders",
    'Fogli di carta': "Paper sheets",
    'Fogli pubblicitari': "Fliers",
    'Giornali': "Newspaper",
    'Imballaggi di carta': "Packaging box",
    Libri: "Books",
    Pieghevoli: "Foldable",
    Quaderni: "Notebook",
    'Sacchetti di carta': "Paper bag",
    'Shopper di carta': "Paper packet",
    'Tovaglie di carta pulite': "Clean paper tablecover",
    'Vaschette porta uova in carta': "Paper egg container",
    'Volantini': "Fliers",
    'Accumulatori per auto': "Car accumulators",
    'Batterie di automobile': "Car batteries",
    'Cassette della frutta in cartone': "Cardboard crate for fruit",
    'Scatole in cartone': "Cardboard boxes",
    'Scatoloni in cartone': "Big cardboard boxes",
    'Brik (latte succhi di frutta)': "Brick( milk, fruit juice)",
    'Cartone per bevande (latte, succhi, vino, panna, ecc.)': "Cardboard boxes for milk,fruitjuice,wine,cream,etc.",
    'Cartucce stampante': "Printer cardriges",
    'Alluminio (contenitori vuoti)': "Aluminum (empty containers)",
    'Banda stagnata': "Metal sheet",
    'Barattoli di metallo/latta': "Tinplate can",
    'Bombolette spray esaurite': "Empty spray cans",
    'Bombolette spray infiammabili vuote': "Empty flammable spray cans",
    'Carta stagnola (in alluminio pulita)': "Clean aluminum foil",
    'Carta stagnola chiusura yogurt': "Yogurth aluminum foil",
    'Fogli di alluminio': "Aluminum foils",
    'Imballaggi di alluminio': "Aluminum packaging",
    'Imballaggi di metallo': "Metal packaging",
    Insetticidi: "Insecticide",
    'Lacche (contenitori non vuoti)': "Not empty laque container",
    'Lattine': "Cans",
    'Stagnola pulita': "Clean aluminum foil",
    'Taniche (per uso domestico in metallo)': "Metal jerry cans",
    'Tappi a corona': "Metal caps",
    'Tappi a vite in alluminio': "Aluminum screw top",
    'Tappi metallici di barattolo': "Tinplate can tops",
    'Vaschette (alluminio/latta)': "Aluminum bowl",
    'Vassoi per alimenti in genere (alluminio)': "Aluminum trays",
    'Acetone (contenitore vuoto)': "Acetone (empty container)",
    'Acidi (contenitore vuoto)': "Acids (empty container)",
    'Acquaragia (contenitore vuoto)': "White spirit (empty container)",
    'Alcool (contenitori vuoti)': "Alcool (empty container)",
    'Ammoniaca (contenitori vuoti)': "Ammonia (empty container)",
    'Appendiabiti in plastica': "Plastic coat hangers",
    'Bicchieri in plastica': "Plastic glass",
    'Blister in plastica': "Plastic blister",
    'Borse di plastica': "Plastic bags",
    'Bottiglie di plastica': "Plastic bottles",
    'Buste di materiale  accoppiato': "Insulating bags",
    'Buste di plastica per alimenti (pasta, biscotti, mozzarella)': "Plastic bags for food (pasta, biscuits, mozzarella)",
    'Candeggina (contenitori vuoti)': "Bleach (empty container)",
    'Carta argentata (es. uovo di pasqua)': "Aluminum foil (example: easter egg)",
    'Carta oleata per alimenti': "Oiled paper for food",
    'Carta plastificata o carta accoppiata con alluminio': "Insulating or laminated paper",
    'Cellophane': "Cellophane",
    'Contenitori dello yogurt': "Yogurt container",
    'Cosmetici (contenitori vuoti e puliti)': "Cosmetics (empty and clean container)",
    'Dentifricio (tubetto)': "Toothpaste (Tube)",
    'Deodoranti per uso personale (non sotto pressione)': "Deodorants (not under pressure)",
    'Detersivi (contenitori di plastica vuoti)': "Detergents (empty plastic container)",
    'Disinfettanti (contenitore vuoto)': "Disinfectants (empty container)",
    'Fazzoletti di polistirolo per imballi': "Polystyrene tissue for packaging",
    'Fiale di plastica (vuote)': "Plastic vials (empty)",
    'Film in plastica (cellophane)': "Cellophane",
    'Imballaggi di polistirolo': "Polystyrene packagings",
    'Incarti trasparenti per riviste': "Trasparent wrap for magazines",
    'Nylon da imballaggi': "Nylons for packagings",
    'Pellicole di plastica per alimenti': "Plastic wrap for food",
    'Piatti usa e getta (svuotati)': "Disposable plastic plate",
    'Plastica (solo imballaggi)': "Plastic (Packaging only)",
    'Polistirolo da imballaggio': "Polystyrene for packaging",
    'Rafia sintetica': "Syntetic raffia",
    'Reggette per legatura pacchi': "Plastic tape",
    'Reti per frutta e verdura': "Plastic net for fruits and vegetables",
    'Sacchetti di carta (con interno plastificato)': "Paper bags (laminated inside)",
    'Sacchetti di plastica': "Plastic bags",
    'Sacchetti per alimenti in materiale accoppiato plastica-alluminio (es. caffè)': "Bags for food with plastic and aluminum (example:coffee)",
    'Sacchetti per alimenti in plastica (pasta, insalata lavata)': "Plastic bags for food (pasta, washed salad)",
    'Shopper di plastica': "Plastic bags",
    'Taniche (per uso domestico in plastica)': "Plastic jerry can",
    'Tappi di plastica': "Plastic tops",
    'Tubetti di dentifricio': "Toothpaste tubes",
    'Tubetti di maionese': "Mayonnaise tubes",
    'Vaschette (per alimenti in plastica alluminio/latta)': "Bowls for food (plastic/aluminum)",
    'Vaschette del gelato': "Ice cream bowls",
    'Vaschette porta uova in plastica': "Plastic egg cointers",
    'Vasi contenenti piante da trapiantare': "Vaso with plants to trasplant ",
    'Vassoi per alimenti in genere (plastica o alluminio)': "Bowls for food (plastic or aluminum)",
    'Barattoli di vetro': "Glass cans",
    'Bicchieri in vetro': "Glasses",
    'Boccette di profumi in vetro': "Perfume glass vials",
    'Bottiglie di vetro': "Glass bottles",
    'Contenitori di vetro': "Glass containers",
    'Fiale di vetro (vuote)': "Empty glass vials",
    'Vasetti in vetro con o senza tappo': "Glass jars with or without top",
    'Profumi (contenitori vuoti, in vetro)': "Perfume (glass empty containers)",
    'Abiti usati in buono stato': "Clothes in good conditions",
    'Biancheria intima in buono stato': "Underwear in good conditions",
    'Calze e calzini in buono stato': "Hose and socks in good conditions",
    'Cappelli': "Hats",
    'Cinture (in plastica, stoffa,)': "Plastic or cloth belts",
    'Coperte': "Blankets",
    'Guanti di  pelle o lana': "Leather or wool gloves",
    'Indumenti usati in buono stato': "Articles of clothing in good conditions",
    'Lenzuola in buono stato': "Sheets in good conditions",
    'Pellicce': "Fur coats",
    'Scarpe in buono stato': "Shoes in good conditions",
    'Tende in stoffa': "Cloth curtains",
    'Tessuti': "Wovens",
    'Vestiti usati in buono stato': "Used clothes in good conditions",
    'Calcinacci (piccole quantità)': "Pieces of plasters (small quantity)",
    'Ceramica': "Ceramic",
    'Mattonelle di ceramica (piccole quantità)': "Ceramic tiles (small quantity)",
    'Mattoni  (piccole quantità)': "Bricks (small quantity)",
    'Piastrelle (piccole quantità)': "Tiles (small quantity)",
    'Sanitari': "Bathroom fixtures",
    'Acquario': "Fish tanks",
    'Alberi di natale sintetici': "Syntetic Christmas tree",
    'Asse da stiro': "Ironing board",
    'Attrezzi da orto o da giardino': "Garden tools",
    'Armadi': "Wardrobes",
    'Bilance pesa persone analogica': "Bathroom scales",
    'Box per bambini': "Play pen",
    'Canne da pesca': "Fishing rods",
    'Carrozzine': "Prams",
    'Caschi per moto e bici': "Bike or motorbike helmets ",
    'Cuscini': "Pillows",
    'Divano': "Couch",
    'Gabbiette per animali': "Cages for animals",
    'Gazebi': "Gazebo",
    'Infissi e serramenti (piccole quantità)': "Window and door fixtures (small quantity)",
    'Lampadari': "Chandelier",
    'Materassi': "Matress",
    'Ombrelli/ombrelloni': "Umbrellas/parasols",
    'Pirex (Pirofile) e teglie': "Oven pans and backing trays",
    'Poltrona': "Armchair",
    'Quadri': "Paintings",
    'Reti per letto': "Box springs",
    'Seggioloni': "Child seats",
    'Stendini per biancheria': "Drying racks",
    'Strumenti musicali': "Musica instrument",
    'Tappeti': "Rugs",
    'Tappezzeria': "Tapestry",
    'Valigie': "Suitcases",
    'Zaini': "Backpacks",
    'Appendiabiti in legno': "Wooden coat hangers",
    'Bancali in legno': "Wooden pallets",
    'Cassette della frutta in legno': "Wooden boxed for fruits",
    'Cornici in legno': "Wooden frames",
    'Legno (Tavole e grossi pezzi)': "Wood (Tables and big pieces)",
    'Mobili in legno': "Wooden furniture",
    'Porte in legno': "Wooden doors",
    'Sedie in legno': "Wooden chairs",
    'Farmaci': "Drugs",
    'Appendiabiti in metallo': "Metallic coat hangers",
    'Biciclette (pezzi)': "Bicycle pieces",
    'Caffettiere': "Coffie maker",
    'Cerchioni di pneumatici': "Wheel rims",
    'Ferro (oggetti)': "Iron (items)",
    'Chiodi': "Nails",
    'Forbici': "Scissors",
    'Oggetti ferro battuto': "Wrought-iron items",
    'Strutture in ferro': "Iron structures",
    'Tubi di ferro': "Iron pipes",
    'Rubinetteria': "Taps and fittings",
    'Bacinelle': "Basins",
    'Pentole': "Saucepans",
    'Cassette della frutta in plastica': "Plastic fruit boxes",
    'Contenitori da cucina in plastica': "Plastic kitchen containers",
    'Cornici in plastica': "Plastic frames",
    'Giocattoli': "Toys",
    'Secchielli di plastica': "Plastic buckets",
    'Teli di nylon': "Nylon",
    'Tubi di gomma': "Rubber pipes",
    'Tubi di PVC': "PVC pipes",
    'Vasi in plastica': "Plastic pots",
    'Caraffe di vetro': "Glass carafes",
    'Damigiane': "Jugs",
    'Lastre di vetro': "Glass plates",
    'Specchi': "Mirrors",
    'Vetro in lastre': "Glass plates",
    'Olio alimentare usato': "Food oil",
    'Olio per automobili esausto': " worn out car oil",
    'Alimenti': "Food",
    'Avanzi di cucina': "Leftovers",
    'Biscotti': "Biscuits",
    'Borse della spesa biodegradabili': "Biodegradable tote bags",
    'Bucce di frutta': "Fruit peels",
    'Carbone per caminetti': "Fireplace charcoal",
    'Carta assorbente da cucina': "Blotting paper",
    'Cibi cotti e crudi': "Cooked or raw food",
    'Carne': "Meat",
    'Deiezioni di animali domestici': "Pet feces",
    'Escrementi animali': "Pet excrements",
    'Fazzoletti di carta': "Paper tissues",
    'Filtri di tè o caffè': "Coffee or tea filters",
    'Fiori': "Flowers",
    'Fondi di te e caffè': "Coffee grounds",
    'Formaggi': "Cheese",
    'Frutta': "Fruit",
    'Gusci di frutta secca od uova': "fruit or egg shells",
    'Gusci di molluschi e crostacei': "Mollusk or shellfish shells",
    "Gusci d'uovo": "eggshells",
    'Lettiere naturali per animali': "Natural anumal litter",
    'Lische di pesce': "Fishbones",
    'Molluschi (gusci)': "Mollusks (shells)",
    'Noccioli': "Kernels",
    'Ossi': "Bones",
    'Pane': "Bread",
    'Pesci': "Fish",
    'Rifiuti di cucina': "Kitchen waste",
    'Scarti di cucina': "Kitchen scraps",
    'Semi': "Seeds",
    'Stuzzicadenti': "Toothpicks",
    'Sughero naturale': "Natual cork",
    'Tappi di sughero naturale': "Cork",
    'Terriccio per piante': "Topsoil for plants",
    'Tovaglioli di carta': "Paper napkins",
    'Uova': "Eggs",
    'Verdura': "Vegetables",
    'Zucchero': "Sugar",
    'Antiparassitari': "Paraciticedes",
    'Antiruggine': "Anti rust",
    'Collanti': "Glues",
    'Diluenti per vernici (contenitore vuoto)': "Thinner for paints (empty container)",
    'Smacchiatori': "Stains remover",
    'Solventi': "Solvents",
    'Trielina (contenitore vuoto, domest)': "Trichloroethylene (empty container)",
    'Vernice': "Paint",
    'Batterie (stilo o a bottone)': "Batteries (Double A, etc.)",
    'Batterie per orologi': "Batteries for watches",
    'Pneumatici automobili (senza cerchio)': "Car tires (without rims)",
    'Pneumatici biciclette  (senza cerchio)': "Bicycle tires (without rims)",
    'Pneumatici motociclette  (senza cerchio)': "Motorcycle tires (without rims)",
    'Antenne': "Antennas",
    'Asciugacapelli': "Hair-drier",
    'Aspirapolvere': "Vacuum cleaner",
    'Bilance pesa persone digitale': "Digital scales",
    'Boiler scaldabagno elettrico': "Electric hot water heater",
    'Calcolatrici': "Calculators",
    'Cellulari (telefono)': "Cellphones",
    'Computer': "Computers",
    'Condizionatori (domestici)': "Air-conditioning",
    'Elettrodomestici': "Electrical appliance",
    'Ferri da stiro': "Electric iron",
    'Forni': "Ovens",
    'Frigoriferi': "Refrigerator",
    'Frullatori': "Blenders",
    'Lampade al neon': "Neon lights",
    'Lavastoviglie': "",
    'lampadine a basso consumo': "",
    'Lavatrice': "Dishwashers",
    'Monitor computer': "Monitors",
    'Mouse': "Mouses",
    'Radio/Hi Fi': "Radios/Hi-Fi",
    'Robot da cucina': "Food processor",
    'Stampanti': "Printers",
    'Sveglie': "Alarm clocks",
    'Tastiere del computer': "Keyboards",
    'Telecomandi': "Remote controller",
    'Telefoni': "Phones",
    'Televisori': "TVs",
    'Tostapane': "Toaster",
    'Tubi  fluorescenti': "Fluorescent pipes",
    'Tubi al neon': "Neon pipes",
    'Umidificatori domestici': "Domestic humidifier",
    'Utensili elettrici di piccole dimensioni': "Small electric tools",
    'Videogames (console)': "Consoles",
    'Videoregistratori': "Video recorders",
    'Alberi di natale naturali': "Natural Christmas tree",
    'Erba': "Weeds",
    'Piante': "Plants",
    "Piante d'appartamento": "Apartment plants",
    'Potature': "Prunings",
    'Ramaglie': "Branches",
    'Residui da orto': "Garden residuals",
    'Rifiuti di giardinaggio o vegetali': "Gardening or vegetable waste",
    'Segatura non contaminata': "Sawdust",
    'Abiti usati inutilizzabili': "Used  worn-out clothes",
    'Accendini': "Firelighter",
    'Addobbi natalizi': "Christmas decorations",
    'Adesivi': "Stickers",
    'Aghi da cucito': "Needle",
    'Assorbenti': "Tampons",
    'Astucci per matite': "Pencil case",
    'Astucci per rossetto': "Lipstick case",
    'Bambole': "Dolls",
    'Bamboo verniciato': "Varnished bamboo",
    'Bandiere': "Flags",
    'Batuffoli e bastoncini di cotone': "Cotton balls",
    'Bianchetti/Cancellini': "Correction fluid",
    'Bigiotteria': "Trinkets",
    'Biglie': "Marbles",
    'Biro': "Biro",
    'Bottoni': "Buttons",
    'Calze di nylon': "Nylons",
    'Candele': "Candles",
    'Capelli': "Hair",
    'Card plastificate (bancomat)': "Laminated cards (ATM)",
    'Carta carbone': "Carbon paper",
    'Carta cerata': "Oil paper",
    'Carta da forno': "Oven paper",
    'Carta unta o sporca di altre sostanze': "Oily or dirty paper",
    'Carta vetrata': "Sandpaper",
    'Cassette audio': "Tapes",
    'Cerotti': "Sticking plasters",
    'Chewing gum': "Chewing gum",
    'CD': "CDs",
    'Chiavi': "Keys",
    'Ciabatte': "Slippers",
    'Cialda in plastica caffè espresso': "Plastic coffee pods",
    'Colori ad olio, tempere, acrilici': "Oil colours",
    'Compact Disk': "Compact Disk",
    'Copertine quaderni con anelli': "Book covers with rings",
    'Cosmetici (contenitori pieni)': "Cosmetics (full containers)",
    'Cotton Fiocc': "Cotton swabs",
    'Cuoio (piccoli pezzi)': "Small pieces of leather",
    'Custodie cd/dvd': "CD/DVD cases",
    'Deumidificatori (domestici)': "Domistic dehumidifier",
    'Dischi in vinile': "Long play record",
    'DVD': "DVD",
    'Elastici': "Rubber bands",
    'Etichette adesive': "Stickers",
    'Evidenziatore': "HIghlighter",
    'Feltrini': "Felt cover",
    'Fili elettrici (piccole quantità)': "Small amount of wires",
    'Filo interdentale': "Dental floss",
    'Fiori finti': "Fake flowers",
    'Floppy Disk': "Floppy Disk",
    'Fotografie': "Photos",
    'Ganci per chiudere i sacchetti': "Bread clips",
    'Garze': "Bandages",
    'Gommapiuma': "Foam rubber",
    'Gomme da masticare': "Chewing gum",
    'Gomme per cancellare': "Rubber",
    'Graffette metalliche': "Metallic clips",
    'Guanti di gomma': "Rubber gloves",
    'Guarnizioni': "Seals",
    'Lacci per scarpe': "Shoelaces",
    'Lamette usa e getta': "Disposable blades",
    'Lampadine ad incandescenza': "Light bulb",
    'Lenti di ingrandimento': "Hand lens",
    'Lenti di occhiali': "Glasses lens",
    'Lettiere sintetiche per animali': "Syntetic litter",
    'Lucida scarpe': "Shoe polisher",
    'Magneti': "Magnets",
    'Mastici': "Mastic",
    'Matite': "Pencils",
    'Mollette per bucato': "Pegs",
    'Mozziconi sigaretta': "Cigarette butts",
    'Musicassette': "Tapes",
    'Nastri adesivi': "Adhesive tape",
    'Nastri audio e video': "Audio and video tapes",
    'Nastri per regali': "Ribbons",
    'Negativi fotografico': "Photo neggatives",
    'Occhiali': "Glasses",
    'Orologi': "Watches",
    'Ovatte': "Wadding",
    'Pacchetti di sigarette': "Cigarette packs",
    'Palette': "Shovels",
    'Palloni da gioco': "Balls",
    'Pannolini': "Diapers",
    'Pellicole fotografiche': "Photo films",
    'Peluche': "Stuffed animals",
    'Penne e pennarelli': "Pens and markers",
    'Pennelli': "Paint brushes",
    'Pettini': "Combs",
    'Piatti di ceramica': "Ceramic plates",
    'Pongo': "Play dough",
    'Porcellana': "Porcelain",
    'Portachiavi': "Key ring",
    'Posate': "Silverware",
    'Preservativi': "Condoms",
    'Radiografie': "X-rays",
    'Rasoi usa e getta': "Disposable blades",
    'Righelli': "Rulers",
    'Rullini fotografici': "Rolls",
    "Sacchetti dell'aspirapolvere": "Vacuum cleaner bags",
    'Salviette umidificate': "Humidified napkin",
    'Saponette': "Bar of soap",
    'Scarpe rotte': "Broken shoes",
    'Scope': "Brooms",
    'Scopini water': "Toilet brush",
    'Scotch': "Scotch",
    'Sigarette': "Cigarettes",
    'Siringhe (con cappuccio)': "Syringe (with cap)",
    'Spazzole per capelli': "Hairbrush",
    'Spazzolini da denti': "Toothbrush",
    'Spugnette': "Sponges",
    'Stoffa-stracci': "Dust-cloth",
    'Sughero finto o trattato': "Fake cork",
    'Taglieri (in plastica o legno)': "Wooden or plastic cutting boards",
    'Tamponi per timbri': "Stamps",
    'Tazzine in ceramica': "Ceramic cups",
    'Tovaglie plastificate': "Laminated tablecloth",
    'Trucchi': "Make up",
    'Tubetti di colore (non pericoloso ma con residui)': "Color tubes (with residuals)",
    'Uncinetti': "Crochet hook",
    'Utensili di piccole dimensioni': "Small tools",
    'Vasi in genere': "Pots",
    'Videocassette': "Video tape",
    'Zanzariere': "Mosquito net",
    'Zerbini': "Doormat",
    'Zoccoli': "Clogs",
    'Scatta una foto': "Take a photo",




    Avanti: "Next",
    Salta: "Skip",
    'Punto di raccolta': "Collection point",
    DETTAGLI: "DETAILS",
    'TIPOLOGIE DI RACCOLTA': "TYPES OF COLLECTION",
    'Tipo di raccolta': "Type of collection",
    'LISTA RIFIUTI': "GARBAGE LIST",
    'PUNTI DI RACCOLTA': "COLLECTION POINTS",
    Rifiuto: "Waste",
    'Isola Ecologica': "Recycling depot",
    CRM: "Dump",
    Rivenditore: "Seller",
    'Cosa vuoi ricordare?': "What do you want to remember?",







  });
  $translateProvider.preferredLanguage(current_lang);
  //debug only
  //$translateProvider.preferredLanguage("en"); // solo lingua inglese, commentare per attivare il riconoscimento della lingua automatico
  //end debug only

  $translateProvider.fallbackLanguage("it");









  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: "/home",
    views: {
      'menuContent': {
        templateUrl: "templates/home.html",
        controller: 'HomeCtrl'
      }
    }
  })
  .state('app.home.note', {
    url: "/note",
    views: {
      'note': {
        templateUrl: "templates/home/note.html",
        controller: 'noteCtrl'
      }
    }
  })
  .state('app.home.tipidirifiuti', {
    url: "/tipidirifiuti",
    views: {
      'tipidirifiuti': {
        templateUrl: "templates/home/tipidirifiuti.html",
        controller: 'tipidirifiutiCtrl'
      }
    }
  })
  .state('app.home.calendario', {
    url: "/calendario",
    views: {
      'calendario': {
        templateUrl: "templates/home/calendario.html",
        controller: 'calendarioCtrl'
      }
    }
  })

  .state('app.puntiDiRaccolta', {
    url: "/puntiDiRaccolta/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/puntiDiRaccolta.html",
        controller: 'PDRCtrl'
      }
    }
  })

  .state('app.tipiDiRaccolta', {
    url: "/tipiDiRaccolta",
    views: {
      'menuContent': {
        templateUrl: "templates/tipiDiRaccolta.html",
        controller: 'TDRCtrl'
      }
    }
  })

  .state('app.raccolta', {
    url: "/raccolta/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/raccolta.html",
        controller: 'RaccoltaCtrl'
      }
    }
  })

  .state('app.rifiuto', {
    url: "/rifiuto/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/rifiuto.html",
        controller: 'RifiutoCtrl'
      }
    }
  })

  .state('app.prova', {
    url: "/rifiutoS/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/srifiuto.html",
        controller: 'RifiutoCtrl'
      }
    }
  })

  .state('app.puntoDiRaccolta', {
    url: "/puntoDiRaccolta/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/puntoDiRaccolta.html",
        controller: 'PuntoDiRaccoltaCtrl'
      }
    }
  })

  .state('app.profili', {
    url: "/profili",
    views: {
      'menuContent': {
        templateUrl: "templates/profili.html",
        controller: 'ProfiliCtrl'
      }
    }
  })

  .state('app.aggProfilo', {
    url: "/aggProfilo",
    views: {
      'menuContent': {
        templateUrl: "templates/aggProfilo.html",
        controller: 'AggiungiProfiloCtrl'
      }
    }
  })

  .state('app.modificaProfilo', {
    url: "/modificaProfilo/:id",
    views: {
      'menuContent': {
        templateUrl: "templates/modificaProfilo.html",
        controller: 'ModificaProfiloCtrl'
      }
    }
  })

  .state('app.segnala', {
    url: "/segnala",
    views: {
      'menuContent': {
        templateUrl: "templates/segnala.html",
        controller: 'SegnalaCtrl'
      }
    }
  })

  .state('app.contatti', {
    url: "/contatti",
    views: {
      'menuContent': {
        templateUrl: "templates/contatti.html",
        controller: 'ContattiCtrl'
      }
    }
  })

  .state('app.info', {
    url: "/info",
    views: {
      'menuContent': {
        templateUrl: "templates/info.html",
        controller: 'InfoCtrl'
      }
    }
  });
  $urlRouterProvider.otherwise('/app/home/tipidirifiuti');
});