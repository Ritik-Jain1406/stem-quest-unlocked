export const translations = {
  en: {
    // Common
    login: 'Login',
    logout: 'Logout', 
    email: 'Email',
    password: 'Password',
    name: 'Name',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    loading: 'Loading...',
    
    // Navigation
    dashboard: 'Dashboard',
    profile: 'Profile',
    settings: 'Settings',
    
    // Roles
    teacher: 'Teacher',
    student: 'Student',
    
    // Quiz
    quiz: 'Quiz',
    question: 'Question',
    answer: 'Answer',
    score: 'Score',
    complete: 'Complete',
    startQuiz: 'Start Quiz',
    
    // Settings
    theme: 'Theme',
    language: 'Language',
    batterySaver: 'Battery Saver Mode',
    
    // Messages
    welcomeMessage: 'Welcome to ZEINTH LEARN!',
    noQuestions: 'No questions available',
    quizComplete: 'Quiz Complete!',
    
    // Teacher Dashboard
    createQuiz: 'Create Quiz',
    manageQuizes: 'Manage Quizzes',
    studentProgress: 'Student Progress',
    uploadQuestions: 'Upload Questions',
    
    // Student Dashboard
    availableQuizes: 'Available Quizzes',
    myProgress: 'My Progress',
    completedQuizes: 'Completed Quizzes'
  },
  
  hi: {
    // Common
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'नाम',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    delete: 'डिलीट करें',
    edit: 'एडिट करें',
    create: 'बनाएं',
    loading: 'लोड हो रहा है...',
    
    // Navigation
    dashboard: 'डैशबोर्ड',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    
    // Roles
    teacher: 'शिक्षक',
    student: 'छात्र',
    
    // Quiz
    quiz: 'क्विज़',
    question: 'प्रश्न',
    answer: 'उत्तर',
    score: 'स्कोर',
    complete: 'पूरा करें',
    startQuiz: 'क्विज़ शुरू करें',
    
    // Settings
    theme: 'थीम',
    language: 'भाषा',
    batterySaver: 'बैटरी सेवर मोड',
    
    // Messages
    welcomeMessage: 'ZEINTH LEARN में आपका स्वागत है!',
    noQuestions: 'कोई प्रश्न उपलब्ध नहीं है',
    quizComplete: 'क्विज़ पूरी हुई!',
    
    // Teacher Dashboard
    createQuiz: 'क्विज़ बनाएं',
    manageQuizes: 'क्विज़ मैनेज करें',
    studentProgress: 'छात्र प्रगति',
    uploadQuestions: 'प्रश्न अपलोड करें',
    
    // Student Dashboard
    availableQuizes: 'उपलब्ध क्विज़ेस',
    myProgress: 'मेरी प्रगति',
    completedQuizes: 'पूरी की गई क्विज़ेस'
  },
  
  es: {
    // Common
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    email: 'Correo electrónico',
    password: 'Contraseña',
    name: 'Nombre',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    create: 'Crear',
    loading: 'Cargando...',
    
    // Navigation
    dashboard: 'Panel',
    profile: 'Perfil',
    settings: 'Configuración',
    
    // Roles
    teacher: 'Profesor',
    student: 'Estudiante',
    
    // Quiz
    quiz: 'Cuestionario',
    question: 'Pregunta',
    answer: 'Respuesta',
    score: 'Puntuación',
    complete: 'Completar',
    startQuiz: 'Iniciar Cuestionario',
    
    // Settings
    theme: 'Tema',
    language: 'Idioma',
    batterySaver: 'Modo Ahorro de Batería',
    
    // Messages
    welcomeMessage: '¡Bienvenido a ZEINTH LEARN!',
    noQuestions: 'No hay preguntas disponibles',
    quizComplete: '¡Cuestionario Completado!',
    
    // Teacher Dashboard
    createQuiz: 'Crear Cuestionario',
    manageQuizes: 'Gestionar Cuestionarios',
    studentProgress: 'Progreso del Estudiante',
    uploadQuestions: 'Subir Preguntas',
    
    // Student Dashboard
    availableQuizes: 'Cuestionarios Disponibles',
    myProgress: 'Mi Progreso',
    completedQuizes: 'Cuestionarios Completados'
  },
  
  fr: {
    // Common
    login: 'Se connecter',
    logout: 'Se déconnecter',
    email: 'E-mail',
    password: 'Mot de passe',
    name: 'Nom',
    save: 'Sauvegarder',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    create: 'Créer',
    loading: 'Chargement...',
    
    // Navigation
    dashboard: 'Tableau de bord',
    profile: 'Profil',
    settings: 'Paramètres',
    
    // Roles
    teacher: 'Enseignant',
    student: 'Étudiant',
    
    // Quiz
    quiz: 'Quiz',
    question: 'Question',
    answer: 'Réponse',
    score: 'Score',
    complete: 'Terminer',
    startQuiz: 'Commencer le Quiz',
    
    // Settings
    theme: 'Thème',
    language: 'Langue',
    batterySaver: 'Mode Économie de Batterie',
    
    // Messages
    welcomeMessage: 'Bienvenue sur ZEINTH LEARN !',
    noQuestions: 'Aucune question disponible',
    quizComplete: 'Quiz Terminé !',
    
    // Teacher Dashboard
    createQuiz: 'Créer un Quiz',
    manageQuizes: 'Gérer les Quiz',
    studentProgress: 'Progrès des Étudiants',
    uploadQuestions: 'Télécharger des Questions',
    
    // Student Dashboard
    availableQuizes: 'Quiz Disponibles',
    myProgress: 'Mon Progrès',
    completedQuizes: 'Quiz Terminés'
  }
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;