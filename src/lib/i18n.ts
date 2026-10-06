export type Language = "en" | "es" | "fr" | "de" | "hi";

export interface Translations {
  appName: string;
  tagline: string;
  feed: string;
  trending: string;
  favorites: string;
  analytics: string;
  settings: string;
  searchPlaceholder: string;
  filterAll: string;
  filterNews: string;
  filterRecommendations: string;
  filterSocial: string;
  reorderFeed: string;
  reorderFeedHelp: string;
  resetOrder: string;
  saveChanges: string;
  liveUpdates: string;
  newArticlesAvailable: string;
  readMore: string;
  markFavorite: string;
  removeFavorite: string;
  noContentFound: string;
  noFavoritesYet: string;
  darkMode: string;
  lightMode: string;
  systemMode: string;
  categories: string;
  sources: string;
  preferencesSaved: string;
  loadMore: string;
  page: string;
  of: string;
  profile: string;
  login: string;
  logout: string;
  itemsPerPage: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "PulseHub",
    tagline: "Personalized Content Dashboard",
    feed: "My Feed",
    trending: "Trending",
    favorites: "Favorites",
    analytics: "Insights",
    settings: "Preferences",
    searchPlaceholder: "Search news, movies, discussions...",
    filterAll: "All Streams",
    filterNews: "News",
    filterRecommendations: "Recommendations",
    filterSocial: "Social Feed",
    reorderFeed: "Reorder Feed",
    reorderFeedHelp: "Drag cards to customize your reading layout",
    resetOrder: "Reset Order",
    saveChanges: "Save Preferences",
    liveUpdates: "Live Stream Active",
    newArticlesAvailable: "New updates available - click to view",
    readMore: "Read Details",
    markFavorite: "Save to Favorites",
    removeFavorite: "Remove Favorite",
    noContentFound: "No content matched your current filters.",
    noFavoritesYet: "No saved favorites yet. Click the bookmark icon on any card to save it here!",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    systemMode: "System Theme",
    categories: "Preferred Categories",
    sources: "Active Content Sources",
    preferencesSaved: "Settings updated successfully!",
    loadMore: "Load More Stories",
    page: "Page",
    of: "of",
    profile: "Profile",
    login: "Sign In",
    logout: "Sign Out",
    itemsPerPage: "Items Per Page",
  },
  es: {
    appName: "PulseHub",
    tagline: "Panel de Contenido Personalizado",
    feed: "Mi Feed",
    trending: "Tendencias",
    favorites: "Favoritos",
    analytics: "Estadísticas",
    settings: "Preferencias",
    searchPlaceholder: "Buscar noticias, películas, debates...",
    filterAll: "Todos",
    filterNews: "Noticias",
    filterRecommendations: "Recomendaciones",
    filterSocial: "Redes Sociales",
    reorderFeed: "Reordenar Feed",
    reorderFeedHelp: "Arrastra las tarjetas para personalizar tu diseño",
    resetOrder: "Restablecer Orden",
    saveChanges: "Guardar Preferencias",
    liveUpdates: "En Vivo Activo",
    newArticlesAvailable: "Nuevas actualizaciones - clic para ver",
    readMore: "Leer Más",
    markFavorite: "Guardar en Favoritos",
    removeFavorite: "Eliminar Favorito",
    noContentFound: "No se encontraron contenidos con tus filtros.",
    noFavoritesYet: "Aún no tienes favoritos. ¡Guarda tarjetas aquí con el botón de marcador!",
    darkMode: "Modo Oscuro",
    lightMode: "Modo Claro",
    systemMode: "Tema del Sistema",
    categories: "Categorías Preferidas",
    sources: "Fuentes de Contenido",
    preferencesSaved: "¡Preferencias guardadas con éxito!",
    loadMore: "Cargar Más",
    page: "Página",
    of: "de",
    profile: "Perfil",
    login: "Iniciar Sesión",
    logout: "Cerrar Sesión",
    itemsPerPage: "Artículos por página",
  },
  fr: {
    appName: "PulseHub",
    tagline: "Tableau de Bord Personnalisé",
    feed: "Mon Flux",
    trending: "Tendances",
    favorites: "Favoris",
    analytics: "Statistiques",
    settings: "Préférences",
    searchPlaceholder: "Rechercher actualités, films, débats...",
    filterAll: "Tous les flux",
    filterNews: "Actualités",
    filterRecommendations: "Recommandations",
    filterSocial: "Réseaux Sociaux",
    reorderFeed: "Réorganiser",
    reorderFeedHelp: "Faites glisser les cartes pour réorganiser votre vue",
    resetOrder: "Réinitialiser",
    saveChanges: "Enregistrer",
    liveUpdates: "En Direct Actif",
    newArticlesAvailable: "Nouvelles mises à jour disponibles",
    readMore: "Lire la suite",
    markFavorite: "Ajouter aux Favoris",
    removeFavorite: "Retirer des Favoris",
    noContentFound: "Aucun contenu correspondant trouvé.",
    noFavoritesYet: "Aucun favori enregistré. Cliquez sur le signet pour en ajouter !",
    darkMode: "Mode Sombre",
    lightMode: "Mode Clair",
    systemMode: "Thème Système",
    categories: "Catégories Préférées",
    sources: "Sources de Contenu",
    preferencesSaved: "Préférences enregistrées avec succès !",
    loadMore: "Charger Plus",
    page: "Page",
    of: "sur",
    profile: "Profil",
    login: "Connexion",
    logout: "Déconnexion",
    itemsPerPage: "Articles par page",
  },
  de: {
    appName: "PulseHub",
    tagline: "Personalisiertes Content-Dashboard",
    feed: "Mein Feed",
    trending: "Trends",
    favorites: "Favoriten",
    analytics: "Statistiken",
    settings: "Einstellungen",
    searchPlaceholder: "Nachrichten, Filme, Diskussionen suchen...",
    filterAll: "Alle Feeds",
    filterNews: "Nachrichten",
    filterRecommendations: "Empfehlungen",
    filterSocial: "Soziales",
    reorderFeed: "Feed anordnen",
    reorderFeedHelp: "Karten ziehen, um das Layout anzupassen",
    resetOrder: "Zurücksetzen",
    saveChanges: "Einstellungen speichern",
    liveUpdates: "Live-Stream Aktiv",
    newArticlesAvailable: "Neue Updates verfügbar - klicken zum Anzeigen",
    readMore: "Mehr lesen",
    markFavorite: "Zu Favoriten hinzufügen",
    removeFavorite: "Favorit entfernen",
    noContentFound: "Kein Inhalt für diese Filter gefunden.",
    noFavoritesYet: "Noch keine Favoriten gespeichert.",
    darkMode: "Dunkler Modus",
    lightMode: "Heller Modus",
    systemMode: "Systemdesign",
    categories: "Bevorzugte Kategorien",
    sources: "Aktive Quellen",
    preferencesSaved: "Einstellungen erfolgreich gespeichert!",
    loadMore: "Mehr laden",
    page: "Seite",
    of: "von",
    profile: "Profil",
    login: "Anmelden",
    logout: "Abmelden",
    itemsPerPage: "Einträge pro Seite",
  },
  hi: {
    appName: "PulseHub",
    tagline: "व्यक्तिगत सामग्री डैशबोर्ड",
    feed: "मेरा फ़ीड",
    trending: "ट्रेंडिंग",
    favorites: "पसंदीदा",
    analytics: "आँकड़े",
    settings: "सेटिंग्स",
    searchPlaceholder: "समाचार, फ़िल्में, चर्चाएँ खोजें...",
    filterAll: "सभी स्रोत",
    filterNews: "समाचार",
    filterRecommendations: "सिफारिशें",
    filterSocial: "सोशल मीडिया",
    reorderFeed: "फ़ीड पुनर्व्यवस्थित करें",
    reorderFeedHelp: "कार्ड को खींचकर अपना क्रम बदलें",
    resetOrder: "रीसेट करें",
    saveChanges: "सहेजें",
    liveUpdates: "लाइव अपडेट सक्रिय",
    newArticlesAvailable: "नई सामग्री उपलब्ध है - देखने के लिए क्लिक करें",
    readMore: "विस्तार से पढ़ें",
    markFavorite: "पसंदीदा में जोड़ें",
    removeFavorite: "पसंदीदा से हटाएं",
    noContentFound: "वर्तमान फ़िल्टर के लिए कोई सामग्री नहीं मिली।",
    noFavoritesYet: "अभी तक कोई पसंदीदा सहेजा नहीं गया है।",
    darkMode: "डार्क मोड",
    lightMode: "लाइट मोड",
    systemMode: "सिस्टम थीम",
    categories: "पसंदीदा श्रेणियां",
    sources: "सामग्री स्रोत",
    preferencesSaved: "सेटिंग्स सफलतापूर्वक सहेजी गईं!",
    loadMore: "और लोड करें",
    page: "पृष्ठ",
    of: "का",
    profile: "प्रोफ़ाइल",
    login: "लॉग इन करें",
    logout: "लॉग आउट करें",
    itemsPerPage: "प्रति पृष्ठ आइटम",
  },
};
