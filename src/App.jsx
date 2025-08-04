import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, AlertTriangle, ExternalLink, Search, ChevronDown, ChevronRight, MessageSquare, FileText, Link, HelpCircle, Settings, Globe } from 'lucide-react';

// Error Boundary
class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    this.setState({ error, info });
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur d'application</h2>
            <p className="text-gray-600 mb-4">Une erreur inattendue s'est produite.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const GMCMasteryApp = () => {
  const [checkedItems, setCheckedItems] = useState({});
  const [itemStatus, setItemStatus] = useState({});
  const [userNotes, setUserNotes] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [language, setLanguage] = useState('fr');

  // Traductions
  const translations = {
    fr: {
      title: "GMC Mastery - Checklist Professionnelle",
      subtitle: "Solution complète pour éviter les suspensions Google Merchant Center",
      completion: "complétés",
      searchPlaceholder: "Rechercher...",
      allCategories: "Toutes catégories",
      criticalOnly: "Critique seulement",
      details: "Détails",
      myNotes: "Mes notes",
      addNote: "Ajouter une note personnelle...",
      status: "Statut",
      todo: "À faire",
      review: "À revoir", 
      done: "Terminé",
      resources: "Ressources",
      templates: "Modèles",
      faq: "Questions Fréquentes",
      criticalPoints: "Points Critiques GMC - Approfondis"
    },
    en: {
      title: "GMC Mastery - Professional Checklist",
      subtitle: "Complete solution to avoid Google Merchant Center suspensions",
      completion: "completed",
      searchPlaceholder: "Search...",
      allCategories: "All categories",
      criticalOnly: "Critical only",
      details: "Details",
      myNotes: "My notes",
      addNote: "Add a personal note...",
      status: "Status",
      todo: "To do",
      review: "Review",
      done: "Done",
      resources: "Resources",
      templates: "Templates",
      faq: "Frequently Asked Questions",
      criticalPoints: "Critical GMC Points - In-depth"
    }
  };

  const t = translations[language];

  // Données complètes extraites du CSV
  const checklistData = {
    "demarrage": {
      title: "🚀 Démarrage",
      color: "bg-blue-50 border-blue-200",
      items: [
        {
          id: "community",
          text: "S'inscrire à la communauté gratuite",
          description: "Inscrivez-vous à la communauté gratuite pour accéder aux tutoriels vidéo (avec le même email que celui avec lequel vous avez acheté le framework)",
          resources: ["https://robtronicmedia.com/community/?fcom_action=auth&form=register"],
          comment: "Votre email sera automatiquement connecté au module GMC Framework où vous pourrez y accéder",
          priority: "high"
        },
        {
          id: "login_existing",
          text: "Connexion compte existant",
          description: "Si vous avez déjà un compte, vous pouvez vous connecter ici",
          resources: ["https://robtronicmedia.com/community/?fcom_action=auth"],
          priority: "medium"
        },
        {
          id: "video1",
          text: "Regarder Vidéo 1 - Importante",
          description: "Regardez cette vidéo importante sur la plateforme communautaire",
          comment: "« Vidéo 1 - Regardez cette vidéo importante »",
          priority: "high"
        },
        {
          id: "video2",
          text: "Regarder Vidéo 2 - Étape par étape",
          description: "Regardez cette vidéo importante sur la plateforme communautaire",
          comment: "« Vidéo 2 - Explication étape par étape »",
          priority: "high"
        },
        {
          id: "copy_sheet",
          text: "Dupliquer la feuille de travail",
          description: "Choses importantes à savoir",
          comment: "Vous pouvez dupliquer cette feuille en allant dans « Fichier > Faire une copie » afin de pouvoir l'utiliser comme feuille de travail.",
          priority: "medium"
        },
        {
          id: "understand_concept",
          text: "Comprendre l'idée principale",
          description: "L'objectif principal de Google",
          comment: "L'objectif principal de Google est d'afficher les entreprises fiables dans les résultats de recherche afin d'offrir aux visiteurs les meilleurs résultats possibles. L'objectif de Google est de s'assurer que les utilisateurs utilisent à nouveau la plateforme de recherche. C'est pourquoi Google utilise des algorithmes et des experts pour garantir la qualité et la sécurité d'un site web. Une fausse déclaration signifie qu'un élément du site web ne répond pas aux normes de qualité de la plateforme. C'est pourquoi nous devons identifier les éléments à supprimer ou à ajouter afin de respecter les règles.",
          priority: "critical"
        }
      ]
    },
    "controles_generaux": {
      title: "🔍 Contrôles Généraux",
      color: "bg-red-50 border-red-200",
      items: [
        {
          id: "email_validity",
          text: "Validité commerciale",
          description: "Vérifiez si votre e-mail de service client est joignable avec succès et fonctionne",
          resources: ["https://email-checker.net/"],
          priority: "critical"
        },
        {
          id: "broken_links",
          text: "Pages brisées",
          description: "Analysez votre site Web pour voir si vous avez des liens brisés pointant vers des pages d'erreur 404",
          resources: ["https://www.deadlinkchecker.com/"],
          priority: "critical"
        },
        {
          id: "pagespeed",
          text: "Score Google Pagespeed",
          description: "La mesure la plus importante ici est le score de vitesse de la page",
          comment: "GMC n'approuve pas les sites Web lents car cela nuit à l'expérience client",
          resources: ["https://pagespeed.web.dev/"],
          priority: "critical"
        },
        {
          id: "malware",
          text: "Logiciel malveillant pour site Web",
          description: "Analysez votre site Web pour voir si vous avez des logiciels malveillants indésirables",
          resources: ["https://www.virustotal.com/gui/home/url"],
          priority: "critical"
        },
        {
          id: "ssl_https",
          text: "Domaine HTTPS + certificat SSL",
          description: "Vérifiez si le domaine de votre site Web fonctionne sur HTTPS avec un certificat SSL",
          resources: ["https://www.sslshopper.com/ssl-checker.html"],
          priority: "critical"
        },
        {
          id: "customer_service",
          text: "Service client",
          description: "Email professionnel requis",
          comment: "Une adresse personnelle @gmail.com ne peut pas être utilisée car un site Web représente une entreprise",
          priority: "critical"
        },
        {
          id: "business_phone",
          text: "Numéro de téléphone professionnel",
          description: "Optionnel mais fortement recommandé",
          comment: "Ceci est facultatif mais fortement recommandé pour la confiance : si vous avez un numéro de téléphone, assurez-vous qu'il fonctionne",
          priority: "medium"
        },
        {
          id: "business_address_format",
          text: "Adresse de l'entreprise (suivre le format)",
          description: "Format d'adresse correct",
          comment: "Suivez le format mentionné dans l'onglet modèles au bas de ce cadre",
          priority: "critical"
        },
        {
          id: "business_location",
          text: "Localisation de l'entreprise",
          description: "Pour magasins physiques seulement",
          comment: "Uniquement si vous disposez d'un emplacement de magasin physique (géré dans « Google My Business » + connecté à GMC)",
          priority: "medium"
        },
        {
          id: "main_menu",
          text: "Menu principal",
          description: "Visible sur mobile et ordinateur",
          priority: "high"
        },
        {
          id: "footer_menu",
          text: "Menu de pied de page",
          description: "Visible sur mobile et ordinateur",
          priority: "high"
        },
        {
          id: "remove_old_tracking",
          text: "Supprimer l'ancien code de suivi",
          description: "Nettoyer les anciens codes",
          comment: "De nombreux entrepreneurs dupliquent leur thème Shopify plusieurs fois, y compris les anciens codes Google Analytics, de vérification Merchant Center et Google Ads. Cela peut entraîner des erreurs, car le fichier dupliqué « déforme » l'image d'une autre entreprise aux yeux de Google. Assurez-vous de supprimer tout l'ancien code de votre thème Shopify et de ne conserver que le suivi qui vous appartient sur votre site web actuel.",
          priority: "high"
        }
      ]
    },
    "header_website": {
      title: "🎯 L'en-tête du site Web contient",
      color: "bg-green-50 border-green-200",
      items: [
        {
          id: "website_logo",
          text: "Logo du site Web",
          description: "Clairement visible avec un bon contraste sur la couleur de fond",
          priority: "high"
        },
        {
          id: "homepage",
          text: "Page d'accueil",
          description: "Cliquable et menant à la page d'accueil",
          priority: "high"
        },
        {
          id: "product_collections",
          text: "Collections de produits",
          description: "Navigation vers les collections",
          comment: "Cliquable et menant à toutes les pages de collection ou à toutes les sélections de produits (les collections ne peuvent pas être vides). Chaque collection doit contenir au moins six produits.",
          priority: "critical"
        },
        {
          id: "about_us",
          text: "À propos de nous",
          description: "Page À propos complète",
          comment: "Incluez les détails de votre entreprise à partir du modèle dans la ligne 142.",
          priority: "critical"
        },
        {
          id: "contact_us",
          text: "Contactez-nous",
          description: "Page de contact",
          comment: "Utilisez le modèle de la ligne 143.",
          priority: "critical"
        },
        {
          id: "track_order",
          text: "Suivez votre commande",
          description: "Système de suivi",
          comment: "Utilisez toujours l'application Track 123 sur Shopify",
          resources: ["https://apps.shopify.com/track123"],
          priority: "high"
        }
      ]
    },
    "homepage": {
      title: "🏠 Page d'accueil",
      color: "bg-yellow-50 border-yellow-200",
      items: [
        {
          id: "banner",
          text: "Bannière",
          description: "Implémentez une bannière de site Web avec un bouton d'appel à l'action",
          priority: "high"
        },
        {
          id: "collections_homepage",
          text: "Collections de produits",
          description: "Afficher n'importe quelle catégorie ou collection sur la page d'accueil",
          priority: "high"
        },
        {
          id: "homepage_buttons",
          text: "Boutons de la page d'accueil",
          description: "Test de fonctionnement",
          comment: "Assurez-vous de tester tous les boutons de la page d'accueil (s'ils ne fonctionnent pas, cela apparaîtra également lors de l'analyse des liens brisés)",
          priority: "critical"
        },
        {
          id: "homepage_sections",
          text: "Nombre de sections de la page d'accueil",
          description: "Structure de la page",
          comment: "Votre page d'accueil doit comporter au moins cinq sections. Ne la réduisez pas trop.",
          priority: "medium"
        }
      ]
    },
    "product_page": {
      title: "📦 Page produit",
      color: "bg-purple-50 border-purple-200",
      items: [
        {
          id: "compliant_products",
          text: "Tous les produits (non contraire à la politique)",
          description: "Produits conformes",
          comment: "(facultatif mais fortement recommandé)",
          priority: "critical"
        },
        {
          id: "trigger_words",
          text: "Mots déclencheurs",
          description: "Éviter les mots problématiques",
          comment: "Évitez les mots déclencheurs tels que : « Garantie, 100 %, relation, toute allégation de santé, noms des personnes décédées, mots liés à la finance ». Consultez la liste complète des mots déclencheurs ici",
          resources: ["https://docs.google.com/document/d/1XC8sCcxgvh53reoT_hyVrjqJUMtlqK3Pb3okUAEX6JE/edit?usp=sharing"],
          priority: "critical"
        },
        {
          id: "safe_product_import",
          text: "Comment ajouter des produits au site en toute sécurité",
          description: "Méthode d'importation sécurisée",
          comment: "Nous avons constaté que la meilleure façon de télécharger des produits sans provoquer de fausses déclarations est de les importer manuellement ou d'utiliser l'application Catalister. L'utilisation d'applications comme Poky ou Kopy pour importer des données back-end peut entraîner des problèmes avec GMC, comme des liens brisés redirigeant vers des sites web tiers, des images de mauvaise qualité avec des noms répétitifs, etc. Ces problèmes peuvent entraîner une fausse déclaration, difficile à résoudre et susceptible d'affecter la visibilité de vos produits et la santé de votre compte.",
          resources: ["https://docs.google.com/document/d/13_LO-RCI0Ns5vf0A1nOEtDAXLaRGCxIAN78apaLkyeM/edit?tab=t.0#heading=h.al7ie741t4d2"],
          priority: "critical"
        }
      ]
    },
    "collection_page": {
      title: "📋 Page de collection",
      color: "bg-indigo-50 border-indigo-200",
      items: [
        {
          id: "non_empty_collection",
          text: "Page de collection",
          description: "Collections avec produits",
          comment: "Si vous faites une collection, elle ne peut pas être vide sans les produits présentés sur le site.",
          priority: "critical"
        },
        {
          id: "product_quantity",
          text: "Quantité de produit",
          description: "Minimum de produits par collection",
          comment: "J'ai constaté de meilleurs résultats avec un minimum de 5 produits affichés dans chaque collection présentée sur le site Web.",
          priority: "high"
        }
      ]
    },
    "website_pages": {
      title: "📄 Pages du site Web",
      color: "bg-pink-50 border-pink-200",
      items: [
        {
          id: "customer_contact",
          text: "Contact du service client",
          description: "Options de contact multiples",
          comment: "Vous devez proposer au moins deux options de contact aux visiteurs de votre site web : e-mail, adresse, formulaire de contact, chat en direct, numéro de téléphone.",
          priority: "critical"
        },
        {
          id: "business_contact_format",
          text: "Coordonnées de l'entreprise (format correct)",
          description: "Format standardisé",
          comment: "Suivez le format mentionné dans l'onglet modèles",
          priority: "critical"
        },
        {
          id: "customer_availability",
          text: "Disponibilité du service client",
          description: "Horaires de service",
          comment: "Modèle : « Notre service client est disponible du lundi au vendredi de 9h00 à 17h00. »",
          priority: "high"
        },
        {
          id: "response_speed",
          text: "Vitesse de réponse du service client",
          description: "Délai de réponse",
          comment: "Modèle : « Le service client répond dans les 24/48 heures pendant les jours ouvrables. »",
          priority: "high"
        },
        {
          id: "faq_links",
          text: "Liens vers la page FAQ",
          description: "Référence FAQ",
          comment: "Modèle : « Si vous avez des questions, assurez-vous de lire notre « Page FAQ HYPERLIEN ».",
          priority: "medium"
        },
        {
          id: "contact_form",
          text: "Formulaire de contact",
          description: "Formulaire fonctionnel",
          comment: "Implémentez un formulaire de contact sur la page Contactez-nous afin que Google voie que le client peut facilement nous contacter.",
          priority: "critical"
        }
      ]
    }
  };

  // Templates et modèles
  const templates = {
    business_info: {
      title: "Informations commerciales",
      content: `Nom du site Web : .....
Nom de l'entreprise : ..... (N'utilisez pas de type d'entreprise comme LTD / LLC / BV / ETC)
Adresse : [Rue + Numéro], [Ville], [Région/État/Province], [Code postal], [Pays]
E-mail : .....
Formulaire de contact : .....
Téléphone : .....
Numéro d'entreprise : .....
Numéro fiscal : .....
Service client : du lundi au vendredi de 9h00 à 17h00.`
    },
    contact_page: {
      title: "Page de contact",
      description: "Utilisez mon modèle comme référence et remplacez les informations [TEMPLATE] par vos coordonnées.",
      resource: "https://docs.google.com/document/d/1ANe8apgLbBe0zK-YVfpx5GShjMoWFMni4gGZtTKvH7E/edit?usp=sharing"
    },
    refund_policy: {
      title: "Politique de remboursement",
      description: "Utilisez mon modèle comme référence et remplacez les informations [TEMPLATE] par vos coordonnées.",
      resource: "https://docs.google.com/document/d/10Ag9Vnq9sZmsj78uUP0gmnnSOckDPPV5gahZeET3DoM/edit?usp=sharing"
    },
    shipping_policy: {
      title: "Politique d'expédition",
      description: "Utilisez mon modèle comme référence et remplacez les informations [TEMPLATE] par vos coordonnées.",
      resource: "https://docs.google.com/document/d/1PSna8o7WHTCcsd7xoBg_aOIDzKXkm1jcY5umOBEQj0I/edit?usp=sharing"
    },
    terms_conditions: {
      title: "Conditions d'utilisation",
      description: "Utilisez mon modèle comme référence et remplacez les informations [TEMPLATE] par vos coordonnées.",
      resource: "https://docs.google.com/document/d/1Old12ZKb0____vKxrVjVEF6YDs72zuFkaZVrCCEaGSw/edit?usp=sharing"
    },
    privacy_policy: {
      title: "Politique de confidentialité",
      description: "Utilisez mon modèle comme référence et remplacez les informations [TEMPLATE] par vos coordonnées.",
      resource: "https://docs.google.com/document/d/1DxJHI7RQ0q4-a1FniV0FvSyON2PfKdkjmtD0yJ1Lpng/edit?usp=sharing"
    },
    payment_options: {
      title: "Options de paiement",
      description: "Utilisez mon modèle comme référence et remplacez les informations [TEMPLATE] par vos coordonnées.",
      resource: "https://docs.google.com/document/d/1pDCWplBELS6bRXN1eaSMHkJo8xy6LYDFr9xzewi096A/edit?usp=sharing"
    }
  };

  // FAQ
  const faqData = [
    {
      id: 1,
      question: "Pourquoi suis-je confronté à un problème de fausse déclaration ?",
      answer: "Parce que l'algorithme de Merchant Centers a analysé votre site web et a trouvé quelque chose, ou quelque chose qui manque, qui devrait s'y trouver. Ils protègent les visiteurs de Google et bloquent donc votre compte."
    },
    {
      id: 2,
      question: "Suis-je banni de l'ombre parce que mon centre marchand est confronté à une erreur de fausse déclaration ?",
      answer: "Non. Conformément aux politiques de Merchant Center, votre site web et les informations de votre entreprise ne sont pas correctement formulés, et vos produits ne sont donc pas acceptés pour les publicités."
    },
    {
      id: 3,
      question: "Est-ce à cause du dropshipping que je suis confronté à ce problème de fausses déclarations ?",
      answer: "Non, Google ne sait pas comment vous gérez votre processus d'expédition. Il analyse uniquement votre site web et les données tierces, telles que les plateformes d'avis et les données qu'il a déjà obtenues auprès de vous."
    },
    {
      id: 4,
      question: "Puis-je soumettre un avis pour que Google vérifie mon site Web et qu'ils suppriment le problème ?",
      answer: "Envoyer un avis à Google sans modifier votre site web ne servira à rien. Je pense qu'il est préférable de corriger le problème détecté avant de soumettre un avis."
    },
    {
      id: 5,
      question: "Ai-je besoin des coordonnées de l'entreprise pour résoudre le problème de fausse déclaration dans mon Merchant Center ?",
      answer: "Oui, bien sûr. Comme son nom l'indique, « Marchand », vous devez fournir une entreprise active avec une adresse pour vérifier votre compte. Sans ces informations, vos chances d'approbation sont très faibles."
    },
    {
      id: 6,
      question: "Est-ce important si mon entreprise est enregistrée dans le pays X mais que je souhaite vendre dans le pays Y ?",
      answer: "Non, peu importe que X et Y soient des pays différents. Google vérifie vos informations et votre site web ; c'est pourquoi nous devons nous assurer que les deux sont formulés correctement."
    },
    {
      id: 7,
      question: "Mon entreprise porte un nom différent de mon nom de domaine. Pensez-vous que cela pourrait avoir un impact ?",
      answer: "Bonne question, cela ne devrait pas être un problème."
    },
    {
      id: 8,
      question: "Le nom de la LLC doit-il être inclus dans la ligne d'adresse 1, comme « Nom Web par nom de LLC », suivi de l'adresse ?",
      answer: "Cela devrait être inclus dans les pages de politique, mais pas nécessaire dans les détails du GMC."
    }
  ];

  // Points critiques approfondis
  const criticalPoints = [
    {
      title: "Email Professionnel Obligatoire",
      description: "Google vérifie la crédibilité de votre entreprise. Un email @gmail.com personnel nuit à votre image professionnelle.",
      impact: "Suspension immédiate si détecté",
      solution: "Utilisez un email avec votre nom de domaine (contact@monsite.com)"
    },
    {
      title: "Pages Légales Complètes",
      description: "Toutes les pages légales doivent être présentes ET détaillées selon les standards e-commerce.",
      impact: "Fausse déclaration garantie sans ces pages",
      solution: "Utilisez nos templates et adaptez-les à votre business"
    },
    {
      title: "Cohérence GMC ↔ Site Web",
      description: "Chaque information dans GMC doit correspondre EXACTEMENT à ce qui est sur votre site.",
      impact: "Algorithme détecte les incohérences automatiquement",
      solution: "Vérifiez ligne par ligne : adresse, politique retour, expédition"
    },
    {
      title: "Vitesse et Sécurité du Site",
      description: "Google privilégie l'expérience utilisateur. Sites lents = mauvaise expérience = suspension.",
      impact: "PageSpeed < 70 = risque élevé de rejet",
      solution: "Optimisez images, utilisez CDN, certificat SSL valide"
    },
    {
      title: "Mots Déclencheurs Interdits",
      description: "Certains mots triggent l'algorithme GMC instantanément.",
      impact: "Suspension automatique en quelques heures",
      solution: "Évitez : '100% garanti', allégations santé, noms de célébrités décédées"
    }
  ];

  const getTotalItems = () => {
    return Object.values(checklistData).reduce((total, category) => total + category.items.length, 0);
  };

  const getCompletedItems = () => {
    return Object.keys(checkedItems).filter(key => checkedItems[key]).length;
  };

  const getCompletionPercentage = () => {
    const total = getTotalItems();
    const completed = getCompletedItems();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const toggleItem = (itemId) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const updateItemStatus = (itemId, status) => {
    setItemStatus(prev => ({
      ...prev,
      [itemId]: status
    }));
  };

  const updateUserNote = (itemId, note) => {
    setUserNotes(prev => ({
      ...prev,
      [itemId]: note
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-red-100 text-red-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredData = Object.entries(checklistData).reduce((acc, [key, category]) => {
    const filteredItems = category.items.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || 
        (selectedCategory === 'critical' && item.priority === 'critical') ||
        (selectedCategory === 'incomplete' && !checkedItems[item.id]);
      
      return matchesSearch && matchesCategory;
    });

    if (filteredItems.length > 0) {
      acc[key] = { ...category, items: filteredItems };
    }
    return acc;
  }, {});

  return (
    <AppErrorBoundary>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  {t.subtitle}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                  </select>
                </div>
                
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {getCompletionPercentage()}%
                  </div>
                  <div className="text-sm text-gray-500">
                    {getCompletedItems()}/{getTotalItems()} {t.completion}
                  </div>
                </div>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${getCompletionPercentage()}%` }}
              ></div>
            </div>

            {/* Contrôles */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t.allCategories}</option>
                <option value="critical">{t.criticalOnly}</option>
                <option value="incomplete">Non terminés</option>
              </select>
            </div>
          </div>

          {/* Points Critiques Approfondis */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              {t.criticalPoints}
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {criticalPoints.map((point, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold text-red-900 mb-2">{point.title}</h3>
                  <p className="text-sm text-red-700 mb-2">{point.description}</p>
                  <div className="text-xs">
                    <div className="text-red-600 font-medium mb-1">Impact: {point.impact}</div>
                    <div className="text-green-700">Solution: {point.solution}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-6">
            {Object.entries(filteredData).map(([categoryKey, category]) => (
              <div key={categoryKey} className={`bg-white rounded-lg shadow-sm border-l-4 ${category.color}`}>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-between">
                    {category.title}
                    <span className="text-sm font-normal text-gray-500">
                      {category.items.filter(item => checkedItems[item.id]).length}/{category.items.length}
                    </span>
                  </h2>

                  <div className="space-y-4">
                    {category.items.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg">
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleItem(item.id)}
                              className="flex-shrink-0 mt-1"
                            >
                              {checkedItems[item.id] ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400 hover:text-blue-600" />
                              )}
                            </button>

                            <div className="flex-grow">
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-grow">
                                  <h3 className={`font-medium ${checkedItems[item.id] ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                    {item.text}
                                  </h3>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {item.description}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {item.priority && (
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(item.priority)}`}>
                                      {item.priority.toUpperCase()}
                                    </span>
                                  )}
                                  
                                  <button
                                    onClick={() => toggleExpanded(item.id)}
                                    className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                                  >
                                    {expandedItems[item.id] ? (
                                      <ChevronDown className="w-4 h-4" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {/* Panel détails étendu */}
                              {expandedItems[item.id] && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                                  {/* Commentaires détaillés */}
                                  {item.comment && (
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        {t.details}
                                      </h4>
                                      <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                                        {item.comment}
                                      </p>
                                    </div>
                                  )}

                                  {/* Ressources */}
                                  {item.resources && item.resources.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                        <Link className="w-4 h-4" />
                                        {t.resources}
                                      </h4>
                                      <div className="space-y-2">
                                        {item.resources.map((resource, index) => (
                                          <a
                                            key={index}
                                            href={resource}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm bg-white p-2 rounded border hover:border-blue-300 transition-colors"
                                          >
                                            <ExternalLink className="w-4 h-4" />
                                            {new URL(resource).hostname}
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Statut */}
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                      <Settings className="w-4 h-4" />
                                      {t.status}
                                    </h4>
                                    <div className="flex gap-2">
                                      {['todo', 'review', 'done'].map((status) => (
                                        <button
                                          key={status}
                                          onClick={() => updateItemStatus(item.id, status)}
                                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                            itemStatus[item.id] === status 
                                              ? getStatusColor(status)
                                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                          }`}
                                        >
                                          {t[status]}
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Notes personnelles */}
                                  <div>
                                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                                      <MessageSquare className="w-4 h-4" />
                                      {t.myNotes}
                                    </h4>
                                    <textarea
                                      value={userNotes[item.id] || ''}
                                      onChange={(e) => updateUserNote(item.id, e.target.value)}
                                      placeholder={t.addNote}
                                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                      rows="3"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Templates */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t.templates}
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(templates).map(([key, template]) => (
                <div key={key} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{template.title}</h3>
                  {template.content && (
                    <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
                      {template.content}
                    </pre>
                  )}
                  {template.description && (
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                  )}
                  {template.resource && (
                    <a
                      href={template.resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Voir le modèle
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              {t.faq}
            </h2>
            
            <div className="space-y-4">
              {faqData.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Q{faq.id}: {faq.question}
                  </h3>
                  <p className="text-sm text-gray-700">
                    R: {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppErrorBoundary>
  );
};

export default GMCMasteryApp;
