export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  country: string[];
  type: "article" | "video" | "document" | "webinar" | "calculator";
  date: string;
  image?: string;
  featured?: boolean;
  content?: string;
  downloadUrl?: string;
  language: "french" | "english";
}

export const categories = [
  { id: "all", name: "Tous" },
  { id: "législation", name: "Législation" },
  { id: "fiscalité", name: "Fiscalité" },
  { id: "actualité", name: "Actualités" },
  { id: "comparatif", name: "Comparatifs" },
  { id: "formation", name: "Formation" },
  { id: "outil", name: "Outils" },
];

export const popularTags = ["CNSS", "IRPP", "congés payés", "indemnités", "réformes 2025"];

export const resourcesData: Resource[] = [
  {
    id: "6",
    title: "Nouvelles Mesures Sociales au Bénin - 2025",
    description: "Point sur les nouvelles mesures sociales adoptées au Bénin pour l'année 2025 : congés, protection sociale, etc.",
    category: "actualité",
    tags: ["protection sociale", "CNSS", "congés", "ARCH", "réformes 2025"],
    country: ["benin"],
    type: "article",
    date: "2025-01-01",
    featured: true,
    language: "french",
    content: `# Nouvelles Mesures Sociales au Bénin - 2025

## I. Renforcement de la Protection Sociale

La protection sociale reste une priorité majeure au Bénin en 2025, avec des efforts continus pour étendre la couverture et améliorer les prestations.

### Stratégie Nationale de Protection Sociale (2024-2028)

Approuvée fin 2024, cette stratégie est dotée d'un budget significatif de plus de 700 milliards de FCFA sur 5 ans et vise à renforcer la protection sociale des populations, en particulier les plus vulnérables. Elle comprend :

- La transformation des Centres de Promotion Sociale (CPS) en Guichets Uniques de Protection Sociale (GUPS)
- La poursuite et l'intensification des Filets de Protection Sociale Productifs (GBESSOKE)
- Distribution de cartes SIM aux bénéficiaires prévue en avril 2025

### Programme ARCH (Assurance pour le Renforcement du Capital Humain)

Ce programme phare continue d'être renforcé en 2025 et regroupe :
- L'assurance maladie
- Le volet formation
- Le crédit
- L'assurance retraite pour les populations du secteur informel et les artisans

Des appels à candidatures pour des postes clés au sein du volet formation ont été lancés en avril 2025.

### Assurance Retraite

La CNSS met l'accent sur :
- L'importance de la déclaration de tous les travailleurs, y compris les saisonniers
- Le cumul des mois de cotisation pour l'obtention d'une pension de retraite
- La révision du calcul du taux de risque professionnel pour les "prestations de services"
- L'amélioration de la gestion des carrières et la remise automatique des livrets de pension

## II. Mesures Relatives aux Congés et au Droit du Travail

### Congés Payés
- 2 jours ouvrables par mois de service (24 jours/an)
- Majorations pour ancienneté :
  * 2 jours après 15 ans
  * 4 jours après 20 ans
  * 6 jours après 25 ans
- Indemnité calculée sur la base du 1/12ème des salaires perçus

### Congé Maternité
- 14 semaines au total :
  * 6 semaines avant l'accouchement
  * 8 semaines après l'accouchement
- Prise en charge intégrale du salaire par la CNSS
- Protection contre le licenciement (sauf faute lourde)

### Autres Dispositions
- Maintien des congés spéciaux pour événements familiaux (mariage, décès, naissance)
- Obligation de déclaration des agents saisonniers à la CNSS

## III. Amélioration des Conditions de Vie et Soutien Social

### Accès au Logement
- Actualisation des modalités d'acquisition des logements économiques :
  * Durée de remboursement prolongée à 20 ans (au lieu de 17 ans)
  * Taux d'actualisation abaissé à 4,5% (au lieu de 6,5%)

### Soutien aux PME
La Loi de Finances 2025 prévoit :
- Exonération de TVA
- Exonération de droits de douane pour l'importation de matériels et équipements

### Autres Mesures
- Incitations à la déclaration fiscale spontanée
- Avantages douaniers et fiscaux pour certains secteurs
- Renforcement de la lutte contre le travail des enfants

## Conclusion

L'année 2025 marque une consolidation importante des acquis en matière de protection sociale au Bénin, avec un accent particulier sur :
- L'élargissement de la couverture sociale
- L'amélioration de l'accès aux services
- Le renforcement du programme ARCH
- Le soutien aux entreprises et aux travailleurs

Ces mesures s'inscrivent dans une vision globale visant à améliorer les conditions de vie des populations et à moderniser le système de protection sociale béninois.`
  },
  {
    id: "1",
    title: "Guide complet des cotisations sociales au Bénin",
    description: "Présentation détaillée des différentes cotisations sociales pour les employeurs et employés au Bénin.",
    category: "législation",
    tags: ["CNSS", "cotisations", "employeur"],
    country: ["benin"],
    type: "article",
    date: "2025-04-15",
    featured: true,
    language: "french",
    content: `
# Guide complet des cotisations sociales au Bénin

## I. Introduction au Régime de Sécurité Sociale au Bénin

Le Bénin dispose d'un régime général de sécurité sociale qui couvre les travailleurs salariés du secteur structuré, ainsi qu'un régime spécial pour les travailleurs indépendants, agricoles et du secteur informel (bien que l'adhésion pour ces derniers puisse être facultative pour certaines branches). La Caisse Nationale de Sécurité Sociale (CNSS) est l'organisme principal chargé du recouvrement des cotisations obligatoires et du service des prestations.

Le système de sécurité sociale béninois vise à offrir une protection dans plusieurs domaines :

- Prestations familiales et de maternité
- Accidents du travail et maladies professionnelles
- Vieillesse, invalidité et décès (pensions)
- Maladie (via le Régime d'Assurance Maladie Universelle - RAMU, qui tend à se généraliser)

## II. Cotisations Sociales Obligatoires pour les Salariés du Secteur Privé

Les cotisations sont calculées sur l'ensemble des rémunérations brutes perçues par les travailleurs.

### A. À la charge de l'Employeur

L'employeur supporte la majeure partie des cotisations sociales. Les taux sont les suivants :

- **Prestations familiales**: 9 % du salaire brut (dont 0,2 % pour couvrir les prestations en espèces de l'assurance maternité)
- **Risques professionnels** (Accidents du travail et maladies professionnelles): Varie de 1 % à 4 % du salaire brut, en fonction du secteur d'activité de l'entreprise et du risque encouru
- **Vieillesse, invalidité, décès** (Pensions): 6,4 % du salaire brut
- **Versement patronal supplémentaire**: 4 % (ce versement s'ajoute aux cotisations CNSS et vise à financer des actions sociales)

### B. À la charge du Salarié

Le salarié contribue également aux cotisations sociales, mais à un taux moindre :

- **Vieillesse, invalidité, décès** (Pensions): 3,6 % du salaire brut

### Tableau récapitulatif des cotisations CNSS (hors RAMU et autres retenues)

| Type de cotisation | Taux employeur | Taux salarié |
|-------------------|----------------|--------------|
| Prestations familiales | 9 % | - |
| Risques professionnels | 1 % à 4 % | - |
| Vieillesse, invalidité, décès | 6,4 % | 3,6 % |
| Versement patronal | 4 % | - |

**Note importante** : Le salaire minimum interprofessionnel garanti (SMIG) est de 52 000 F CFA depuis le 1er janvier 2023.

## III. Autres Retenues sur Salaires

En plus des cotisations sociales à la CNSS, d'autres retenues peuvent être effectuées sur le salaire brut du salarié :

- **Impôt sur les Traitements et Salaires (ITS)**: Impôt progressif dont les taux varient selon les tranches de revenus
- **Cotisations syndicales**: Pour les salariés adhérents à un syndicat
- **Retenues facultatives**: Remboursements de prêts, avances sur salaire, acomptes, déductions pour absences

## IV. Procédures et Obligations des Employeurs

### Déclaration et Paiement des Cotisations

- Versement mensuel pour les employeurs de 20 salariés ou plus
- Versement trimestriel pour les employeurs de moins de 20 salariés
- Délai de paiement : 15 jours suivant la période concernée
- Exigibilité immédiate en cas de cessation d'activité

### Documents Requis

- Déclaration de salaires et de cotisations
- Liste nominative du personnel (trimestrielle pour +20 salariés)

### Sanctions

- Majoration de 1,50 % par mois de retard
- Possibilité de poursuites ou saisies-arrêts

## V. Prestations de la Sécurité Sociale

Les cotisations financent diverses prestations :

- Allocations familiales
- Indemnités de maternité
- Couverture des accidents du travail
- Pensions de retraite
- Pensions d'invalidité
- Prestations aux survivants

## VI. Régime d'Assurance Maladie Universelle (RAMU)

Le RAMU vise à étendre la couverture maladie à toute la population. Pour les salariés du secteur privé, une cotisation est versée via leurs employeurs. Les modalités de recouvrement et de répartition des cotisations sont en évolution.

## Conclusion

Les cotisations sociales au Bénin constituent un pilier essentiel de la protection sociale des travailleurs. Il est impératif pour les employeurs de comprendre et de respecter leurs obligations en matière de déclaration et de paiement des cotisations à la CNSS, afin d'assurer les droits de leurs employés aux diverses prestations sociales.
    `
  },
  {
    id: "2",
    title: "Calcul de l'IRPP au Togo - Barème 2025",
    description: "Explication du barème progressif de l'Impôt sur le Revenu des Personnes Physiques applicable au Togo en 2025.",
    category: "fiscalité",
    tags: ["IRPP", "impôts", "barème"],
    country: ["togo"],
    type: "document",
    date: "2025-03-22",
    featured: true,
    language: "french",
    downloadUrl: "/documents/irpp-togo-2025.pdf",
    content: `
# Barème IRPP Togo 2025

## Tranches d'imposition
1. De 0 à 900 000 FCFA : 0%
2. De 900 001 à 4 000 000 FCFA : 15%
3. De 4 000 001 à 6 000 000 FCFA : 25%
4. De 6 000 001 à 10 000 000 FCFA : 35%
5. Au-delà de 10 000 000 FCFA : 40%

## Calcul et exemples pratiques
[...]
    `
  },
  {
    id: "3",
    title: "Réforme du Code du Travail au Bénin 2025",
    description: "Analyse des principales modifications apportées au Code du Travail béninois et leurs impacts sur les entreprises.",
    category: "législation",
    tags: ["code du travail", "réformes", "droit social"],
    country: ["benin"],
    type: "article",
    date: "2025-03-15",
    featured: true,
    language: "french",
    content: `
# Réforme du Code du Travail au Bénin 2025

## Changements majeurs
- Nouvelles dispositions sur le télétravail
- Modification des conditions de licenciement
- Renforcement des droits des travailleurs
[...]
    `
  },
  {
    id: "4",
    title: "Guide des Indemnités de Licenciement au Togo",
    description: "Tout savoir sur le calcul des indemnités de licenciement selon la législation togolaise en vigueur.",
    category: "législation",
    tags: ["licenciement", "indemnités", "calcul"],
    country: ["togo"],
    type: "document",
    date: "2025-02-28",
    featured: true,
    language: "french",
    content: `[...]`
  },
  {
    id: "5",
    title: "Webinaire : Déclaration CNSS en Ligne au Bénin",
    description: "Formation pratique sur l'utilisation du nouveau portail de télédéclaration de la CNSS au Bénin.",
    category: "formation",
    tags: ["CNSS", "télédéclaration", "formation"],
    country: ["benin"],
    type: "webinar",
    date: "2025-02-15",
    featured: true,
    language: "french",
    content: `
# Webinaire : Déclaration CNSS en Ligne au Bénin

## Introduction
Ce webinaire offre un guide pratique détaillé pour la télédéclaration des cotisations sociales et des impôts sur salaires via le nouveau portail e-services de la CNSS Bénin.

## Plan du Webinaire

### 1. Accès à la Plateforme
- Procédure de connexion au portail e-services de la CNSS
- Présentation de l'interface utilisateur
- Navigation dans les différentes sections

### 2. Processus de Déclaration

#### A. Sélection du Type de Déclaration
- Accès au menu des déclarations
- Sélection de "Cotisation CNSS" dans la liste des natures d'impôt
- Choix de la période de déclaration

#### B. Remplissage du Formulaire
- Guide détaillé des champs obligatoires
- Explications des différentes sections
- Vérification des informations saisies

#### C. Gestion de l'Annexe CNSS
- Option 1 : Remplissage direct sur la plateforme
  * Saisie manuelle des informations salariales
  * Vérification des calculs automatiques
  
- Option 2 : Import via fichier Excel
  * Format requis pour le fichier CSV (valeurs séparées par des points-virgules)
  * Procédure de conversion et d'import
  * Résolution des erreurs courantes

### 3. Finalisation et Paiement

#### A. Sauvegarde et Soumission
- Enregistrement temporaire de la déclaration
- Vérification finale des données
- Procédure de soumission définitive

#### B. Paiement en Ligne
- Options de paiement disponibles
- Étapes du processus de paiement
- Confirmation et reçu de paiement

### 4. Dépannage et Support

#### Problèmes Courants
- Erreurs lors du chargement des fichiers
- Problèmes de connexion
- Solutions aux messages d'erreur fréquents

#### Ressources Supplémentaires
- Documentation technique
- Contacts support CNSS
- FAQ et guides utilisateurs

## Conclusion
Ce webinaire vise à faciliter la transition vers la déclaration en ligne pour les employeurs, en modernisant les interactions avec la Caisse Nationale de Sécurité Sociale du Bénin.

## Questions Fréquentes
1. Comment gérer les déclarations rectificatives ?
2. Que faire en cas d'erreur de saisie ?
3. Comment télécharger les attestations de paiement ?
4. Quels sont les délais de déclaration à respecter ?

Pour plus d'informations, consultez le site officiel de la CNSS Bénin ou contactez le service support.
    `
  },
  {
    id: "6",
    title: "Comparatif des Charges Sociales Bénin vs Togo",
    description: "Analyse comparative des charges sociales entre le Bénin et le Togo pour aider les entreprises dans leur stratégie d'implantation.",
    category: "comparatif",
    tags: ["charges sociales", "comparaison", "CNSS"],
    country: ["benin", "togo"],
    type: "article",
    date: "2025-02-10",
    language: "french",
    content: `[...]`
  },
  {
    id: "7",
    title: "Calculateur d'Indemnités de Congés Payés - Bénin",
    description: "Outil de calcul automatique des indemnités de congés payés selon la législation béninoise.",
    category: "outil",
    tags: ["congés payés", "calcul", "indemnités"],
    country: ["benin"],
    type: "calculator",
    date: "2025-02-01",
    language: "french",
    content: `[...]`
  },
  {
    id: "8",
    title: "Vidéo : Comment Remplir sa Déclaration IRPP au Togo",
    description: "Guide vidéo pas à pas pour compléter correctement sa déclaration d'IRPP au Togo.",
    category: "formation",
    tags: ["IRPP", "déclaration", "tutoriel"],
    country: ["togo"],
    type: "video",
    date: "2025-01-25",
    language: "french",
    content: `[...]`
  },
  {
    id: "9",
    title: "Les Conventions Collectives au Bénin",
    description: "Présentation des principales conventions collectives en vigueur au Bénin et leurs spécificités par secteur.",
    category: "législation",
    tags: ["conventions collectives", "droit social", "secteurs"],
    country: ["benin"],
    type: "document",
    date: "2025-01-15",
    language: "french",
    content: `[...]`
  },
  {
    id: "10",
    title: "Nouveautés Fiscales 2025 au Togo",
    description: "Résumé des changements fiscaux majeurs introduits au Togo pour l'année 2025.",
    category: "actualité",
    tags: ["fiscalité", "réformes", "2025"],
    country: ["togo"],
    type: "article",
    date: "2025-01-10",
    language: "french",
    content: `[...]`
  },
  {
    id: "11",
    title: "Protection Sociale des Travailleurs Indépendants au Bénin",
    description: "Guide sur les dispositifs de protection sociale pour les travailleurs indépendants et entrepreneurs individuels au Bénin.",
    category: "législation",
    tags: ["protection sociale", "indépendants", "entrepreneurs"],
    country: ["benin"],
    type: "document",
    date: "2024-12-20",
    language: "french",
    content: `[...]`
  },
  {
    id: "12",
    title: "Webinaire : Optimisation Fiscale Légale au Togo",
    description: "Session de formation sur les stratégies d'optimisation fiscale conformes à la législation togolaise.",
    category: "formation",
    tags: ["fiscalité", "optimisation", "formation"],
    country: ["togo"],
    type: "webinar",
    date: "2024-12-15",
    language: "french",
    content: `[...]`
  },
  {
    id: "13",
    title: "Guide Complet de la TVA au Bénin",
    description: "Tout savoir sur la TVA au Bénin : taux applicables, exonérations, déclarations et remboursements.",
    category: "fiscalité",
    tags: ["TVA", "taxes", "déclaration"],
    country: ["benin"],
    type: "document",
    date: "2025-01-05",
    language: "french",
    content: `[...]`
  },
  {
    id: "14",
    title: "Fiscalité des Entreprises au Togo 2025",
    description: "Guide détaillé sur l'imposition des sociétés au Togo : IS, patente, TF et autres taxes professionnelles.",
    category: "fiscalité",
    tags: ["impôt sociétés", "patente", "taxes"],
    country: ["togo"],
    type: "article",
    date: "2024-12-10",
    language: "french",
    content: `[...]`
  },
  {
    id: "15",
    title: "Calculateur d'Impôt sur les Sociétés - Bénin",
    description: "Outil de simulation pour calculer l'IS et les acomptes provisionnels au Bénin.",
    category: "fiscalité",
    tags: ["IS", "calcul", "acomptes"],
    country: ["benin"],
    type: "calculator",
    date: "2024-12-05",
    language: "french",
    content: `[...]`
  },
  {
    id: "16",
    title: "Régimes d'Imposition des TPE/PME au Togo",
    description: "Présentation des différents régimes fiscaux pour les TPE et PME au Togo : avantages et obligations.",
    category: "fiscalité",
    tags: ["TPE", "PME", "régimes fiscaux"],
    country: ["togo"],
    type: "document",
    date: "2024-11-30",
    language: "french",
    content: `[...]`
  },
  {
    id: "17",
    title: "Webinaire : Déclaration Fiscale Annuelle au Bénin",
    description: "Formation en ligne sur la préparation et le dépôt de la déclaration fiscale annuelle au Bénin.",
    category: "fiscalité",
    tags: ["déclaration", "formation", "obligations"],
    country: ["benin"],
    type: "webinar",
    date: "2024-11-25",
    language: "french",
    content: `[...]`
  },
  {
    id: "18",
    title: "Guide des Retenues à la Source au Togo",
    description: "Détails sur les différentes retenues à la source applicables au Togo : IRPP, TPS, et autres prélèvements.",
    category: "fiscalité",
    tags: ["retenues", "IRPP", "TPS"],
    country: ["togo"],
    type: "document",
    date: "2024-11-20",
    language: "french",
    content: `[...]`
  },
  {
    id: "19",
    title: "Avantages Fiscaux pour les Investisseurs au Bénin",
    description: "Présentation des dispositifs fiscaux incitatifs pour les investisseurs au Bénin.",
    category: "fiscalité",
    tags: ["investissement", "incitations", "exonérations"],
    country: ["benin"],
    type: "article",
    date: "2024-11-15",
    language: "french",
    content: `[...]`
  },
  {
    id: "20",
    title: "Vidéo : Comprendre la Patente au Togo",
    description: "Explications détaillées sur le calcul et le paiement de la patente au Togo.",
    category: "fiscalité",
    tags: ["patente", "taxes", "tutoriel"],
    country: ["togo"],
    type: "video",
    date: "2024-11-10",
    language: "french",
    content: `[...]`
  },
  {
    id: "21",
    title: "Nouvelles Mesures Sociales au Bénin - 2025",
    description: "Point sur les nouvelles mesures sociales adoptées au Bénin pour l'année 2025 : congés, protection sociale, etc.",
    category: "actualité",
    tags: ["protection sociale", "CNSS", "congés", "ARCH", "réformes 2025"],
    country: ["benin"],
    type: "article",
    date: "2025-01-01",
    featured: true,
    language: "french",
    content: `# Nouvelles Mesures Sociales au Bénin - 2025

## I. Renforcement de la Protection Sociale

La protection sociale reste une priorité majeure au Bénin en 2025, avec des efforts continus pour étendre la couverture et améliorer les prestations.

### Stratégie Nationale de Protection Sociale (2024-2028)

Approuvée fin 2024, cette stratégie est dotée d'un budget significatif de plus de 700 milliards de FCFA sur 5 ans et vise à renforcer la protection sociale des populations, en particulier les plus vulnérables. Elle comprend :

- La transformation des Centres de Promotion Sociale (CPS) en Guichets Uniques de Protection Sociale (GUPS)
- La poursuite et l'intensification des Filets de Protection Sociale Productifs (GBESSOKE)
- Distribution de cartes SIM aux bénéficiaires prévue en avril 2025

### Programme ARCH (Assurance pour le Renforcement du Capital Humain)

Ce programme phare continue d'être renforcé en 2025 et regroupe :
- L'assurance maladie
- Le volet formation
- Le crédit
- L'assurance retraite pour les populations du secteur informel et les artisans

Des appels à candidatures pour des postes clés au sein du volet formation ont été lancés en avril 2025.

### Assurance Retraite

La CNSS met l'accent sur :
- L'importance de la déclaration de tous les travailleurs, y compris les saisonniers
- Le cumul des mois de cotisation pour l'obtention d'une pension de retraite
- La révision du calcul du taux de risque professionnel pour les "prestations de services"
- L'amélioration de la gestion des carrières et la remise automatique des livrets de pension

## II. Mesures Relatives aux Congés et au Droit du Travail

### Congés Payés
- 2 jours ouvrables par mois de service (24 jours/an)
- Majorations pour ancienneté :
  * 2 jours après 15 ans
  * 4 jours après 20 ans
  * 6 jours après 25 ans
- Indemnité calculée sur la base du 1/12ème des salaires perçus

### Congé Maternité
- 14 semaines au total :
  * 6 semaines avant l'accouchement
  * 8 semaines après l'accouchement
- Prise en charge intégrale du salaire par la CNSS
- Protection contre le licenciement (sauf faute lourde)

### Autres Dispositions
- Maintien des congés spéciaux pour événements familiaux (mariage, décès, naissance)
- Obligation de déclaration des agents saisonniers à la CNSS

## III. Amélioration des Conditions de Vie et Soutien Social

### Accès au Logement
- Actualisation des modalités d'acquisition des logements économiques :
  * Durée de remboursement prolongée à 20 ans (au lieu de 17 ans)
  * Taux d'actualisation abaissé à 4,5% (au lieu de 6,5%)

### Soutien aux PME
La Loi de Finances 2025 prévoit :
- Exonération de TVA
- Exonération de droits de douane pour l'importation de matériels et équipements

### Autres Mesures
- Incitations à la déclaration fiscale spontanée
- Avantages douaniers et fiscaux pour certains secteurs
- Renforcement de la lutte contre le travail des enfants

## Conclusion

L'année 2025 marque une consolidation importante des acquis en matière de protection sociale au Bénin, avec un accent particulier sur :
- L'élargissement de la couverture sociale
- L'amélioration de l'accès aux services
- Le renforcement du programme ARCH
- Le soutien aux entreprises et aux travailleurs

Ces mesures s'inscrivent dans une vision globale visant à améliorer les conditions de vie des populations et à moderniser le système de protection sociale béninois.`
  },
  {
    id: "22",
    title: "Réforme de la CNSS au Togo - Ce qui change",
    description: "Détails sur la modernisation du système de sécurité sociale togolais et ses implications pour les entreprises.",
    category: "actualité",
    tags: ["CNSS", "réformes", "digitalisation"],
    country: ["togo"],
    type: "article",
    date: "2025-01-18",
    language: "french",
    content: `[...]`
  },
  {
    id: "23",
    title: "Nouveau Barème des Frais Professionnels au Bénin",
    description: "Publication du nouveau barème des frais professionnels déductibles pour l'année 2025.",
    category: "actualité",
    tags: ["frais professionnels", "déductions", "2025"],
    country: ["benin"],
    type: "document",
    date: "2025-01-15",
    language: "french",
    content: `[...]`
  },
  {
    id: "24",
    title: "Webinaire : Nouvelles Obligations Déclaratives au Togo",
    description: "Session d'information sur les nouvelles obligations déclaratives pour les entreprises togolaises.",
    category: "actualité",
    tags: ["obligations", "déclarations", "conformité"],
    country: ["togo"],
    type: "webinar",
    date: "2025-01-12",
    language: "french",
    content: `[...]`
  },
  {
    id: "25",
    title: "Dématérialisation des Bulletins de Paie au Bénin",
    description: "Le point sur la nouvelle réglementation concernant la dématérialisation des bulletins de paie au Bénin.",
    category: "actualité",
    tags: ["bulletins", "dématérialisation", "digital"],
    country: ["benin"],
    type: "article",
    date: "2025-01-10",
    language: "french",
    content: `[...]`
  },
  {
    id: "26",
    title: "Vidéo : Actualités Sociales du Mois - Togo",
    description: "Résumé vidéo des principales actualités sociales et fiscales du mois au Togo.",
    category: "actualité",
    tags: ["actualités", "social", "fiscal"],
    country: ["togo"],
    type: "video",
    date: "2025-01-08",
    language: "french",
    content: `[...]`
  },
];

export const getResourceById = (id: string): Resource | undefined => {
  return resourcesData.find(resource => resource.id === id);
};