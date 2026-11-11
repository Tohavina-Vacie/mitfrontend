import { CONTENUS_MENUS, CATALOGUE_MENUS } from "./contenusMenus";

// Contenus d'origine du site : ils s'affichent tant que rien n'a été enregistré dans l'interface « Contenu du site ».
// La base de données ne contient que ce que l'administrateur modifie.
// Les pages École, Alternance, Entreprises et Documentation sont définies dans contenusMenus.js et ajoutées à la fin.
export const CONTENUS_PAR_DEFAUT = {
  accueil: {
    hero: {
      titre: "Venez vivre une expérience humaine différente",
      texte: "L’école leader de l’alternance en informatique depuis 21 ans. Formez-vous aux métiers du développement full-stack, de la cybersécurité et de l’intelligence artificielle tout en étant immergé en entreprise.",
      bouton: "En savoir plus sur nos formations",
      image: "/entreprises/hero-etudiants.jpg",
      image_alt: "Étudiants en cours de travail",
    },
    formations: {
      titre: "Nos formations en alternance",
      sous_titre: "Des parcours adaptés aux exigences réelles du marché de l’emploi technologique, du post-bac au Bac+5.",
      lien: "En savoir plus",
      programmes: [
        {
          badge: "Bachelors (Bac+3)",
          duree: "3 ans d’études",
          titre: "Développeur Full-Stack",
          texte: "Maîtrisez les architectures web modernes, le cloud computing et les pipelines de déploiement continu.",
          mise_en_avant: "Alternance dès la 1ère année",
          page_detail: "fullstack",
        },
        {
          badge: "Masters (Bac+5)",
          duree: "2 ans d’études",
          titre: "Métiers de l’informatique",
          texte: "Les métiers de l’informatique consistent à concevoir, développer, sécuriser et maintenir les outils.",
          mise_en_avant: "Rythme alterné optimisé",
          page_detail: "metiers",
        },
        {
          badge: "Expertise (Bac+5)",
          duree: "2 ans d’études",
          titre: "Cybersécurité",
          texte: "Protégez les infrastructures critiques et configurez la sécurité des réseaux face aux nouvelles menaces.",
          mise_en_avant: "Immergé 4j en entreprise",
          page_detail: "cyber",
        },
      ],
    },
    valeurs: {
      etiquette: "Engagements & rentrée",
      titre: "5 Valeurs et Science qui guident MIT-Madagascar",
      texte: "Nous allions la rigueur scientifique à des valeurs humaines fortes d’entraide, d’éthique et d’esprit d’équipe. C’est ce qui fait de nos étudiants des professionnels recherchés par les entreprises.",
      valeurs: ["Rigueur", "Coopération", "Curiosité", "Audace", "Responsabilité"],
    },
    chiffres: {
      chiffres: [
        { valeur: "75.8%", libelle: "D’embauche avant diplomation" },
        { valeur: "41,643 €", libelle: "Salaire moyen de sortie" },
        { valeur: "242", libelle: "Entreprises partenaires" },
        { valeur: "4", libelle: "Campus en France" },
      ],
    },
    raisons: {
      etiquette: "Pourquoi nous rejoindre ?",
      titre: "Les 4 raisons de choisir MIT-Madagascar",
      raisons: [
        { numero: "01", titre: "L’Alternance dès le 1er jour", texte: "Pas besoin d’attendre la 3ème année pour intégrer le monde professionnel. Votre formation est financée et rémunérée immédiatement." },
        { numero: "02", titre: "Une pédagogie par projet", texte: "Chez nous, pas de cours magistraux passifs. Vous apprenez en faisant, à travers de vrais projets calqués sur la réalité des entreprises." },
        { numero: "03", titre: "Accompagnement personnalisé", texte: "Un tuteur dédié vous suit tout au long de votre parcours académique et professionnel pour garantir votre réussite." },
        { numero: "04", titre: "Insertion garantie à 100%", texte: "Grâce à notre puissant réseau d’entreprises partenaires, l’accès à un emploi stable est une certitude avant même d’être diplômé." },
      ],
    },
    pedagogie: {
      etiquette: "Méthode active",
      titre: "La pédagogie par projet",
      texte: "Nos étudiants ne subissent pas la formation, ils en sont les acteurs principaux. Chaque semestre s’articule autour de grands projets de groupe qui développent à la fois la technique et le leadership.",
      image: "/entreprises/dev.jpg",
      image_alt: "Étudiants travaillant sur un projet de code",
      chiffres: [
        { valeur: "80%", libelle: "De pratique réelle" },
        { valeur: "12+", libelle: "Projets d’envergure" },
      ],
    },
    rencontres: {
      etiquette: "Communauté et échanges",
      titre: "MIT-Madagascar, c’est des rencontres",
      histoires: [
        { titre: "Podcast Éruption", image: "/entreprises/Podcast.jpg", texte: "Le podcast qui donne la parole aux esprits les plus brûlants de la tech. Découvrez des parcours atypiques et inspirants d’acteurs clés de l’écosystème numérique." },
        { titre: "Conférences", image: "/entreprises/Conférences.jpg", texte: "Des conférences régulières avec des experts de pointe pour élargir votre vision du numérique, décrypter les tendances technologiques et mieux comprendre ses enjeux sociétaux." },
        { titre: "Concours", image: "/entreprises/Concours.jpg", texte: "Le Concours des Grands Projets ETNA (GPE) : un marathon annuel d’innovation, d’esprit d’équipe et d’entrepreneuriat où nos étudiants pitch devant de vrais investisseurs." },
      ],
    },
    presse: {
      etiquette: "Revue de presse",
      titre: "Ils en parlent",
      articles: [
        { source: "Le Monde Informatique", date: "Jan 2026", titre: "Comment MIT bouscule les codes de la formation IT", texte: "En proposant une alternance immédiate, l’école attire des profils diversifiés et répond concrètement à la pénurie de talents." },
        { source: "Les Echos Start", date: "Dec 2025", titre: "Pourquoi les recruteurs s’arrachent les profils MIT", texte: "Grâce à leur formation axée sur la pratique intensive et l’autonomie, les jeunes diplômés sont opérationnels dès le jour de leur embauche." },
        { source: "Le Parisien Etudiant", date: "Oct 2025", titre: "Le modèle alterné : clé de voûte de l’insertion pro", texte: "Faire confiance aux étudiants et leur confier des responsabilités en entreprise dès le départ est un pari gagnant pour MIT Madagascar." },
      ],
    },
    appel: {
      etiquette: "Votre avenir recruté",
      titre: "Prêt à sauter le pas ?",
      texte: "Inscrivez-vous à nos prochaines journées portes ouvertes ou déposez votre candidature en ligne. Notre équipe d’admission est là pour vous accompagner.",
      bouton: "Déposer mon dossier",
    },
  },

  fullstack: {
    contenu: {
      titre_page: "Développement full-stack",
      titre: "Pourquoi choisir le Full-Stack ?",
      intro: "Construisez les applications web de demain\nLa filière Développement Full-Stack forme des professionnels capables de concevoir, développer et maintenir une application web complète, de l'interface utilisateur jusqu'au serveur et à la base de données.",
      paragraphe: "Le développeur Full-Stack maîtrise les différentes parties d'une application web.",
      image: "/entreprises/dev.jpg",
      image_alt: "Code de programmation sur un écran",
      cartes: [
        { titre: "Front-End", texte: "Création des interfaces visibles par les utilisateurs.", points: ["HTML", "CSS", "JavaScript", "React / Vue.js", "Responsive Design"] },
        { titre: "Bases de données", texte: "Stockage et gestion des informations.", points: ["MySQL", "PostgreSQL", "MongoDB", "SQL"] },
        { titre: "Back-End", texte: "Développement de la logique et des fonctionnalités du serveur.", points: ["PHP / Laravel", "Python", "Node.js", "API REST", "Authentification"] },
      ],
      atouts_titre: "Pourquoi ce profil est-il prisé ?",
      atouts: [
        "Vision à 360° : Capacité à comprendre l'impact d'un choix technique Back-End sur l'expérience Front-End, et inversement.",
        "Agilité et Time-to-Market : Idéal pour les startups et les équipes réduites pour prototyper et sortir des fonctionnalités rapidement.",
        "Communication facilitée : Sert de pont naturel entre les spécialistes du design, de l'infrastructure et de la donnée.",
      ],
    },
  },

  cybersecurite: {
    contenu: {
      titre_page: "Bachelor Cybersécurité — MIT Madagascar",
      titre: "Devenez l'expert que le marché attend",
      texte: "À Madagascar comme ailleurs, les entreprises et institutions font face à une explosion des cybermenaces et manquent cruellement de talents formés pour y répondre. Le Bachelor Cybersécurité de MIT Madagascar vous prépare à devenir un professionnel complet, capable de sécuriser systèmes, réseaux et données dans un monde numérique en constante évolution.",
      image: "/entreprises/cybersecurite.jpg",
      image_alt: "Étudiants devant des serveurs et du matériel réseau",
      boites: [
        {
          titre: "Ce que vous apprenez",
          points: [
            "Sécurité des réseaux et systèmes",
            "Sécurité web & applications",
            "Cryptographie",
            "Pentest et tests d'intrusion",
            "Gestion des incidents et crises cyber",
            "Sécurité cloud & infrastructures",
          ],
        },
        {
          titre: "Les parcours possibles",
          points: [
            "Sécurité offensive — devenir pentester / hacker éthique",
            "Sécurité défensive — protection des systèmes, SOC, analyste sécurité",
            "Gouvernance & conformité — normes, audits, gestion des risques",
            "Sécurité cloud — protection des infrastructures hébergées",
          ],
        },
        {
          titre: "Débouchés / Métiers",
          points: [
            "Analyste en cybersécurité",
            "Pentester / Hacker éthique",
            "Responsable sécurité des systèmes d'information (RSSI)",
            "Ingénieur sécurité cloud",
            "Consultant en cybersécurité",
          ],
        },
      ],
    },
  },

  "metiers-informatique": {
    contenu: {
      titre_page: "Métiers de l’informatique",
      titre: "Pourquoi choisir le métier de l’informatique ?",
      texte: "Le métier de l’informatique est un domaine moderne et passionnant qui offre de nombreuses opportunités professionnelles. Il permet de développer ses compétences en technologie, en créativité et en résolution de problèmes. Comme l’informatique est présente dans presque tous les secteurs, c’est un métier d’avenir qui permet d’évoluer et d’apprendre constamment.",
      image: "/entreprises/metiers-informatique.jpg",
      image_alt: "Ordinateurs portables affichant du code et des outils de travail",
      competences_titre: "Les compétences essentielles",
      competences: ["Programmation", "Résolution de problèmes", "Analyse et logique", "Travail en équipe", "Communication"],
      avantages_titre: "Quelques avantages",
      avantages: [
        "Nombreuses opportunités professionnelles",
        "Évolution constante des technologies",
        "Possibilité de travailler à distance",
        "Diversité des spécialisations",
        "Possibilité d’évolution de carrière",
      ],
      domaines_titre: "Les différents domaines de l’informatique",
      domaines: ["Développement Web", "Cybersécurité", "Réseaux et systèmes", "Data et Intelligence Artificielle", "Développement Mobile"],
    },
  },

  contact: {
    entete: {
      titre: "Contactez-nous",
      texte: "Vous avez des questions sur nos cursus, l'alternance ou les admissions ? Nos équipes sont là pour vous répondre et vous orienter.",
    },
    formulaire: {
      titre: "Envoyer un message",
      objets: ["Inscription", "Alternance", "Admission et orientation", "Partenariat entreprise", "Prise de rendez-vous", "Autre demande"],
    },
    coordonnees: {
      titre: "Nos coordonnées",
      adresse_titre: "Campus principal",
      adresse: "Enceinte Ex-Siten, Antananarivo, Madagascar",
      contact_titre: "Téléphone & Email",
      telephone: "+261 20 22 456 78",
      email: "contact@mit.mg",
      horaires_titre: "Horaires d'ouverture",
      horaires: "Lundi - Vendredi : 08h00 - 17h30",
    },
    "rendez-vous": {
      titre: "Prendre rendez-vous en ligne",
      texte: "Planifiez un échange de 15 minutes en visioconférence avec un conseiller d'orientation pour structurer vos démarches et valider votre dossier d'alternance.",
      bouton: "Prendre rendez-vous →",
    },
    reseaux: {
      titre: "Suivez notre quotidien sur les réseaux sociaux",
      liens: [
        { nom: "LinkedIn", sigle: "in", url: "#" },
        { nom: "Twitter", sigle: "t", url: "#" },
        { nom: "Facebook", sigle: "f", url: "#" },
        { nom: "YouTube", sigle: "▶", url: "#" },
      ],
    },
  },

  // École, Alternance, Entreprises, Documentation
  ...CONTENUS_MENUS,
};

// Pages et sections modifiables depuis le dashboard admin
export const CATALOGUE = [
  {
    page: "accueil",
    libelle: "Page d'accueil",
    url: "/",
    sections: [
      ["hero", "Bandeau d'accueil"],
      ["formations", "Nos formations en alternance"],
      ["valeurs", "Valeurs"],
      ["chiffres", "Chiffres clés"],
      ["raisons", "Les 4 raisons de nous rejoindre"],
      ["pedagogie", "Pédagogie par projet"],
      ["rencontres", "Rencontres (podcast, conférences, concours)"],
      ["presse", "Revue de presse"],
      ["appel", "Appel à l'action"],
    ],
  },
  { page: "fullstack", libelle: "Filière Développement full-stack", url: "/", sections: [["contenu", "Page de description"]] },
  { page: "cybersecurite", libelle: "Filière Cybersécurité", url: "/", sections: [["contenu", "Page de description"]] },
  { page: "metiers-informatique", libelle: "Filière Métiers de l'informatique", url: "/", sections: [["contenu", "Page de description"]] },
  {
    page: "contact",
    libelle: "Page Contactez-nous",
    url: "/contact",
    sections: [
      ["entete", "En-tête"],
      ["formulaire", "Formulaire"],
      ["coordonnees", "Coordonnées"],
      ["rendez-vous", "Bandeau rendez-vous"],
      ["reseaux", "Réseaux sociaux"],
    ],
  },

  // École, Alternance, Entreprises, Documentation
  ...CATALOGUE_MENUS,
];