// Contenus d'origine des pages École, Alternance, Entreprises et Documentation.
// Ils s'affichent tant que rien n'a été enregistré dans « Contenu du site » (dashboard admin).
// Ce fichier est fusionné dans CONTENUS_PAR_DEFAUT et CATALOGUE (voir contenusParDefaut.js).

export const CONTENUS_MENUS = {
    /* ------------------------------- École ------------------------------- */
    ecole: {
      hero: {
        titre: "L’École MIT Madagascar",
        texte: "Propulser les talents tech de Madagascar vers des sommets internationaux grâce à une pédagogie d’excellence, calquée sur le modèle de la MIT Madagascar",
        bouton: "Rejoindre la rentrée 2026",
        image: "/entreprises/ecole.jpg",
        image_alt: "Salle de travail de l’école MIT Madagascar",
      },
      histoire: {
        titre: "Notre Histoire & Jalons",
        sous_titre: "Plus de deux décennies d’engagement à former la nouvelle élite informatique de la région.",
        jalons: [
          { annee: "2005", titre: "Fondation de l’École", texte: "Lancement de la première école d’informatique active inspirée des meilleures pratiques pédagogiques françaises." },
          { annee: "2012", titre: "L’Alternance Pionnière", texte: "Intégration d’un rythme école-entreprise dès la 1ère année d’études supérieures à Madagascar." },
          { annee: "2020", titre: "Cybersécurité & Cloud", texte: "Inauguration du laboratoire de sécurité offensive et d’architectures cloud avancées." },
          { annee: "2026", titre: "Cap International", texte: "Lancement de la plateforme internationale pour favoriser le placement en remote et en mobilité." },
        ],
      },
      campus: {
        titre: "Notre Campus Moderne",
        sous_titre: "Un cadre de travail stimulant, conçu pour le travail collaboratif, la recherche et l’innovation technologique.",
        lieux: [
          { image: "/entreprises/colab.jpg", titre: "Les Espaces Collaboratifs", texte: "Pensés pour le travail d’équipe, nos espaces de co-working permettent d’apprendre en mode projet de façon fluide." },
          { image: "/entreprises/cyber.jpg", titre: "Le Lab de Cybersécurité", texte: "Un environnement isolé pour tester les vulnérabilités de sécurité et administrer des réseaux en temps réel." },
        ],
      },
      equipe: {
        titre: "Notre Équipe Pédagogique",
        sous_titre: "Des professionnels de haut niveau et des universitaires engagés pour votre insertion professionnelle.",
        membres: [
          { nom: "M. Andrianjafy Toky", role: "Lead Coach Web Development", image: "/ecole/equipe/toky.jpg", texte: "Expert Full-Stack, consultant senior pour des grands comptes internationaux." },
          { nom: "Mme Razafindrakoto Lily", role: "Responsable Relations Entreprises", image: "/ecole/equipe/lily.jpg", texte: "Dédiée au placement en alternance et au suivi des apprentis en entreprise." },
          { nom: "Mme Ranivoarson Sarah", role: "Responsable des Admissions", image: "/ecole/equipe/sarah.jpg", texte: "Spécialiste de l’accompagnement des étudiants dans leur transition professionnelle." },
          { nom: "M. Ravalomanana Thierry", role: "Coach Cybersécurité & Réseaux", image: "/ecole/equipe/thierry.jpg", texte: "Certifié CISSP, expert en audits de sécurité d’infrastructures critiques." },
          { nom: "Mme Rambolarson Nina", role: "Formatrice Algorithmique & Data", image: "/ecole/equipe/nina.jpg", texte: "Enseignante-chercheuse passionnée par l’innovation pédagogique active." },
          { nom: "Dr. Rakotoarisoa Jean", role: "Directeur Académique", image: "/ecole/equipe/jean.jpg", texte: "Ph.D en Intelligence Artificielle, 15 ans d’expérience dans l’enseignement supérieur." },
        ],
      },
      partenaires: {
        etiquette: "Plus de 200 entreprises partenaires",
        noms: ["Orange", "BMOI", "Telma", "SGS", "Ravinala Airports"],
      },
      valeurs: {
        titre: "Nos Valeurs Fondatrices",
        sous_titre: "Ce qui anime notre communauté éducative au quotidien.",
        valeurs: [
          { titre: "Innovation", texte: "Nous adaptons continuellement nos cursus aux dernières technologies du marché." },
          { titre: "Excellence", texte: "La rigueur scientifique au service de projets d’envergure professionnelle." },
          { titre: "Collaboration", texte: "L’apprentissage en équipe et l’entraide sont les piliers de notre modèle." },
          { titre: "Inclusivité", texte: "Une école ouverte à tous les talents motivés, sans barrière financière." },
          { titre: "Engagement", texte: "Un accompagnement personnalisé de chaque étudiant vers la réussite." },
        ],
      },
      appel: {
        etiquette: "Rejoignez-nous dès maintenant",
        titre: "Prêt à transformer votre avenir ?",
        texte: "Donnez un coup d’accélérateur à votre carrière informatique en intégrant l’un de nos bachelors ou masters en alternance.",
        bouton: "Déposer mon dossier de candidature",
      },
    },
  
    /* ----------------------------- Alternance ----------------------------- */
    alternance: {
      hero: {
        titre: "L’Alternance chez MIT",
        texte: "Associez théorie et pratique professionnelle grâce à notre modèle d’apprentissage intensif. Étudiez sans frais, gagnez un salaire et devenez hautement compétitif.",
        bouton: "Comment postuler ?",
        image: "/entreprises/alternance.jpg",
        image_alt: "Alternants au travail dans une entreprise partenaire",
      },
      etapes: {
        titre: "Comment ça marche ?",
        sous_titre: "Notre méthode structurée pour vous guider de la sélection jusqu’à votre premier jour en entreprise.",
        etapes: [
          { numero: "01", titre: "Candidature en ligne", texte: "Déposez votre dossier académique et passez nos tests d’évaluation technique en ligne." },
          { numero: "02", titre: "Sélection & Validation", texte: "Un entretien individuel pour valider votre projet professionnel et votre motivation." },
          { numero: "03", titre: "Placement assisté", texte: "Accédez à notre réseau de partenaires et recevez du coaching pour décrocher votre contrat." },
          { numero: "04", titre: "Formation & Entreprise", texte: "Débutez votre rythme alterné : 4 jours en entreprise, 1 jour de formation active." },
        ],
      },
      rythme: {
        titre: "Rythme d’alternance optimisé",
        sous_titre: "Un calendrier conçu pour maximiser votre présence en entreprise tout en conservant une dynamique académique rigoureuse.",
        // Un jour dont le lieu commence par « École » est mis en avant
        jours: [
          { jour: "Lundi", lieu: "École", texte: "Cours avancés, projet, évaluations" },
          { jour: "Mardi", lieu: "Entreprise", texte: "Immersion professionnelle" },
          { jour: "Mercredi", lieu: "Entreprise", texte: "Immersion professionnelle" },
          { jour: "Jeudi", lieu: "Entreprise", texte: "Immersion professionnelle" },
          { jour: "Vendredi", lieu: "Entreprise", texte: "Immersion professionnelle" },
        ],
      },
      avantages: {
        titre: "Vos Avantages Apprentis",
        sous_titre: "De multiples opportunités pour concilier autonomie financière et excellence académique.",
        avantages: [
          { valeur: "0 Ar", titre: "Formation Gratuite", texte: "Votre entreprise partenaire prend intégralement en charge vos frais de scolarité." },
          { valeur: "Mensuel", titre: "Salaire Garanti", texte: "Bénéficiez d’une rémunération mensuelle fixe tout au long de vos études." },
          { valeur: "+5 Ans", titre: "Expérience pro solide", texte: "Cumulez jusqu’à 5 ans d’expérience concrète à la fin de votre cursus." },
          { valeur: "95%", titre: "Employabilité assurée", texte: "Plus de 75% de nos étudiants signent un CDI avant même d’être diplômés." },
        ],
      },
      temoignages: {
        titre: "Ce que disent nos étudiants",
        sous_titre: "Découvrez les retours d’expérience de nos alternants immergés dans le tissu économique tech.",
        temoignages: [
          { citation: "L’alternance m’a permis de financer entièrement mes études tout en travaillant sur des projets cloud passionnants chez Orange Madagascar.", nom: "Rasoa Fitia", promo: "Promo 2025 - Dev FullStack" },
          { citation: "Être sur le terrain 4 jours par semaine m’a appris à gérer le stress des cyberattaques réelles, ce qu’aucun cours théorique n’aurait pu m’enseigner.", nom: "Andry Faly", promo: "Promo 2024 - Cybersécurité" },
          { citation: "Dès ma première année, j’ai été intégrée dans une équipe de Business Intelligence. Je me sens utile et prête pour le marché mondial.", nom: "Mina R.", promo: "Promo 2026 - Data Analyst" },
        ],
      },
      appel: {
        etiquette: "Rejoignez l’aventure",
        titre: "Postuler en alternance",
        texte: "Démarrez le processus d’inscription et débloquez l’accès à nos entreprises partenaires pour financer vos études.",
        bouton: "Déposer mon dossier alternant",
      },
    },
  
    /* ----------------------------- Entreprises ----------------------------- */
    entreprises: {
      hero: {
        titre: "Entreprises, recrutez nos talents",
        texte: "Intégrez des profils tech ultra-qualifiés dans vos équipes. Notre processus de recrutement en alternance vous assure des collaborateurs agiles, productifs et formés aux technologies du futur.",
        bouton: "Contacter un conseiller relations entreprises",
        image: "/entreprises/entreprise.jpg",
        image_alt: "Équipe en réunion devant un tableau de bord",
      },
      raisons: {
        titre: "Pourquoi recruter chez MIT Madagascar ?",
        sous_titre: "Découvrez comment notre modèle d’alternance crée un impact productif immédiat au sein de vos équipes techniques.",
        raisons: [
          { numero: "01", titre: "Talents immédiatement opérationnels", texte: "Nos formations sont fondées sur la pratique intensive par projet, calquée sur les enjeux de production réels." },
          { numero: "02", titre: "Financement avantageux", texte: "Optimisez vos budgets de formation grâce aux dispositifs d’alternance et d’aide à l’apprentissage numérique." },
          { numero: "03", titre: "Pré-recrutement stratégique", texte: "Formez vos futurs collaborateurs à vos méthodes, votre stack technique et votre culture d’entreprise pendant leurs études." },
          { numero: "04", titre: "Accompagnement de A à Z", texte: "Notre équipe relations entreprises prend en charge la diffusion de vos offres et la pré-sélection des profils." },
        ],
      },
      profils: {
        titre: "Nos Profils Tech Disponibles",
        sous_titre: "Du niveau Bachelor à l’Expertise MSc, identifiez les compétences stratégiques adaptées à vos besoins.",
        profils: [
          { titre: "Développeurs Web & Mobile", nombre: "120+ candidats", texte: "Maîtrisant React, Node.js, Python, les architectures cloud et les bases de données SQL / NoSQL." },
          { titre: "Administrateurs Système & Cloud", nombre: "80+ candidats", texte: "Formés à l’intégration de conteneurs Docker/Kubernetes, à l’automatisation CI/CD et à la gestion AWS." },
          { titre: "Experts en Cybersécurité", nombre: "45+ candidats", texte: "Réseaux sécurisés, pentesting, gouvernance des risques et supervision de SOC." },
          { titre: "Architectes Intelligence Artificielle", nombre: "30+ candidats", texte: "Implémentation de pipelines de Machine Learning, Computer Vision et NLP appliqués." },
        ],
      },
      processus: {
        titre: "Processus de Recrutement Simplifié",
        sous_titre: "Notre équipe dédiée vous accompagne à chaque étape pour assurer un matching optimal et sans stress.",
        etapes: [
          { numero: "1", titre: "Définition du besoin", texte: "Échange sur vos postes d’alternants ou vos besoins de renfort tech." },
          { numero: "2", titre: "Pré-sélection ciblée", texte: "Notre équipe vous propose un catalogue de profils qualifiés et validés pédagogiquement." },
          { numero: "3", titre: "Entretiens de matching", texte: "Vous rencontrez les candidats sélectionnés et choisissez vos futurs talents." },
          { numero: "4", titre: "Contractualisation", texte: "Prise en charge administrative de la convention d’alternance par notre équipe." },
        ],
      },
      // valeur = nombre entier atteint par le compteur animé ; suffixe = symbole affiché après (+, %…)
      chiffres: {
        chiffres: [
          { valeur: 500, suffixe: "+", libelle: "Alternants placés en entreprise" },
          { valeur: 95, suffixe: "%", libelle: "Taux de placement post-diplôme" },
          { valeur: 200, suffixe: "+", libelle: "Entreprises partenaires actives" },
        ],
      },
      formulaire: {
        titre: "Recrutez dès maintenant",
        sous_titre: "Laissez-nous vos coordonnées et l’un de nos conseillers relations entreprises vous recontactera sous 24h ouvrées.",
        bouton: "Envoyer ma demande de recrutement",
        message_succes: "Merci ! Votre demande a bien été envoyée, un conseiller vous recontactera sous 24h ouvrées.",
      },
    },
  
    /* ---------------------------- Documentation ---------------------------- */
    documentation: {
      hero: {
        titre: "Centre de Documentation",
        texte: "Retrouvez l’ensemble de nos guides pratiques, formulaires d’inscription et documentations pour accompagner votre parcours de formation d’excellence à l’MIT Madagascar.",
      },
      brochures: {
        titre: "Brochures & Guides",
        documents: [
          { titre: "Livret d’accueil", texte: "Informations pratiques pour préparer votre rentrée : accès, logement, outils numériques.", taille: "3.5 MB", fichier: "/documents/livret-accueil.pdf" },
          { titre: "Brochure des formations", texte: "Présentation des Bachelors et Masters, des programmes et des débouchés.", taille: "À définir", fichier: "/documents/brochure-formations.pdf" },
          { titre: "Guide de l’alternance", texte: "Comprendre le rythme alterné, le contrat et vos démarches pour trouver une entreprise.", taille: "À définir", fichier: "/documents/guide-alternance.pdf" },
          { titre: "Dossier de candidature", texte: "Formulaire d’inscription et liste des pièces à fournir pour déposer votre dossier.", taille: "À définir", fichier: "/documents/dossier-candidature.pdf" },
        ],
      },
      faq: {
        titre: "Foire Aux Questions",
        sous_titre: "Des réponses claires à vos questions les plus courantes concernant la vie de l’école et l’alternance.",
        questions: [
          { question: "Comment s’inscrire à l’MIT Madagascar ?", reponse: "L’admission se fait sur dossier puis entretien de motivation et tests d’évaluation technique ou logique." },
          { question: "Quels sont les frais de scolarité ?", reponse: "Grâce au modèle d’alternance, vos frais de formation sont entièrement pris en charge par l’entreprise d’accueil. Vous êtes également rémunéré chaque mois." },
          { question: "Quel est le rythme de l’alternance ?", reponse: "Le rythme standard est optimisé pour l’immersion : généralement 4 jours par semaine en entreprise et 1 jour de séminaire ou projet intensif sur le campus." },
          { question: "Quels diplômes sont délivrés ?", reponse: "Nous délivrons des diplômes équivalents Bachelors (Bac+3) et Masters (Bac+5), reconnus par l’État et calqués sur l’ingénierie active européenne." },
          { question: "Comment trouver une entreprise partenaire ?", reponse: "L’MIT Madagascar dispose d’une cellule de relations entreprises dédiée qui vous accompagne dans la rédaction de votre CV, prépare vos entretiens et vous met directement en relation avec plus de 200 partenaires." },
        ],
      },
      actualite: {
        titre: "Actualités du Campus",
        image: "/entreprises/campus.jpg",
        image_alt: "",
        etiquette: "Actualité · Admissions",
        titre_article: "Candidatures 2026 : le calendrier d’admission est en ligne",
        texte: "Dépôt des dossiers de janvier à avril, tests et entretiens en mai, matchmaking alternance en juin-juillet et rentrée en octobre 2026.",
        lien: "/formations",
      },
      ressources: {
        titre: "Ressources Pédagogiques",
        sous_titre: "Accédez directement aux plateformes d’apprentissage et de collaboration technique utilisées par l’école.",
        liens: [
          { titre: "Office 365", texte: "Messagerie étudiante officielle, stockage cloud et outils bureautiques collaboratifs accessibles gratuitement.", url: "https://www.office.com" },
        ],
      },
      appel: {
        etiquette: "Une admission accompagnée",
        titre: "Prêt à démarrer l’aventure ?",
        texte: "Nos équipes pédagogiques et relations entreprises sont à votre disposition pour analyser votre profil et vous guider pas à pas dans votre démarche.",
        bouton: "Contacter un conseiller d’admission",
        lien: "mailto:contact@mit.io",
      },
    },
  };
  
  // Entrées à ajouter au CATALOGUE (liste des sections modifiables dans le dashboard)
  export const CATALOGUE_MENUS = [
    {
      page: "ecole",
      libelle: "Page École",
      url: "/ecole",
      sections: [
        ["hero", "Bandeau d'accueil"],
        ["histoire", "Histoire et jalons"],
        ["campus", "Campus"],
        ["equipe", "Équipe pédagogique"],
        ["partenaires", "Partenaires"],
        ["valeurs", "Valeurs fondatrices"],
        ["appel", "Appel à l'action"],
      ],
    },
    {
      page: "alternance",
      libelle: "Page Alternance",
      url: "/alternance",
      sections: [
        ["hero", "Bandeau d'accueil"],
        ["etapes", "Comment ça marche"],
        ["rythme", "Rythme d'alternance"],
        ["avantages", "Avantages apprentis"],
        ["temoignages", "Témoignages"],
        ["appel", "Appel à l'action"],
      ],
    },
    {
      page: "entreprises",
      libelle: "Page Entreprises",
      url: "/entreprises",
      sections: [
        ["hero", "Bandeau d'accueil"],
        ["raisons", "Pourquoi recruter chez MIT"],
        ["profils", "Profils tech disponibles"],
        ["processus", "Processus de recrutement"],
        ["chiffres", "Chiffres clés"],
        ["formulaire", "Formulaire de recrutement"],
      ],
    },
    {
      page: "documentation",
      libelle: "Page Documentation",
      url: "/documentation",
      sections: [
        ["hero", "En-tête"],
        ["brochures", "Brochures et guides"],
        ["faq", "Foire aux questions"],
        ["actualite", "Actualités du campus"],
        ["ressources", "Ressources pédagogiques"],
        ["appel", "Appel à l'action"],
      ],
    },
  ];