import React, { createContext, useContext, useState, useEffect } from 'react';

// All translations for the app
const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    about: 'حول',
    contact: 'اتصل بنا',
    feed: 'الصفحة الرئيسية',
    profile: 'الملف الشخصي',
    messages: 'الرسائل',
    notifications: 'الإشعارات',
    settings: 'الإعدادات',
    
    // Posts
    post: 'منشور',
    createPost: 'إنشاء منشور',
    whatOnYourMind: 'ما الذي يدور في بالك؟',
    like: 'إعجاب',
    comment: 'تعليق',
    share: 'مشاركة',
    
    // Settings
    siteSettings: 'إعدادات الموقع',
    language: 'اللغة',
    theme: 'المظهر',
    notificationsSettings: 'الإشعارات',
    privacy: 'الخصوصية',
    appearance: 'المظهر العام',
    accessibility: 'إمكانية الوصول',
    
    // Common
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    loading: 'جاري التحميل...',
    error: 'خطأ',
    success: 'نجح',
  },
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    contact: 'Contact',
    feed: 'Feed',
    profile: 'Profile',
    messages: 'Messages',
    notifications: 'Notifications',
    settings: 'Settings',
    
    // Posts
    post: 'Post',
    createPost: 'Create Post',
    whatOnYourMind: "What's on your mind?",
    like: 'Like',
    comment: 'Comment',
    share: 'Share',
    
    // Settings
    siteSettings: 'Site Settings',
    language: 'Language',
    theme: 'Theme',
    notificationsSettings: 'Notifications',
    privacy: 'Privacy',
    appearance: 'Appearance',
    accessibility: 'Accessibility',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    about: 'À propos',
    contact: 'Contact',
    feed: 'Fil d\'actualité',
    profile: 'Profil',
    messages: 'Messages',
    notifications: 'Notifications',
    settings: 'Paramètres',
    
    // Posts
    post: 'Publication',
    createPost: 'Créer une publication',
    whatOnYourMind: 'Que pensez-vous ?',
    like: 'J\'aime',
    comment: 'Commenter',
    share: 'Partager',
    
    // Settings
    siteSettings: 'Paramètres du site',
    language: 'Langue',
    theme: 'Thème',
    notificationsSettings: 'Notifications',
    privacy: 'Confidentialité',
    appearance: 'Apparence',
    accessibility: 'Accessibilité',
    
    // Common
    save: 'Enregistrer',
    cancel: 'Annuler',
    edit: 'Modifier',
    delete: 'Supprimer',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
  },
  es: {
    // Navigation
    home: 'Inicio',
    about: 'Acerca de',
    contact: 'Contacto',
    feed: 'Feed',
    profile: 'Perfil',
    messages: 'Mensajes',
    notifications: 'Notificaciones',
    settings: 'Configuración',
    
    // Posts
    post: 'Publicación',
    createPost: 'Crear publicación',
    whatOnYourMind: '¿Qué estás pensando?',
    like: 'Me gusta',
    comment: 'Comentar',
    share: 'Compartir',
    
    // Settings
    siteSettings: 'Configuración del sitio',
    language: 'Idioma',
    theme: 'Tema',
    notificationsSettings: 'Notificaciones',
    privacy: 'Privacidad',
    appearance: 'Apariencia',
    accessibility: 'Accesibilidad',
    
    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
  },
  de: {
    // Navigation
    home: 'Startseite',
    about: 'Über uns',
    contact: 'Kontakt',
    feed: 'Feed',
    profile: 'Profil',
    messages: 'Nachrichten',
    notifications: 'Benachrichtigungen',
    settings: 'Einstellungen',
    
    // Posts
    post: 'Beitrag',
    createPost: 'Beitrag erstellen',
    whatOnYourMind: 'Was denkst du?',
    like: 'Gefällt mir',
    comment: 'Kommentieren',
    share: 'Teilen',
    
    // Settings
    siteSettings: 'Website-Einstellungen',
    language: 'Sprache',
    theme: 'Design',
    notificationsSettings: 'Benachrichtigungen',
    privacy: 'Datenschutz',
    appearance: 'Aussehen',
    accessibility: 'Barrierefreiheit',
    
    // Common
    save: 'Speichern',
    cancel: 'Abbrechen',
    edit: 'Bearbeiten',
    delete: 'Löschen',
    loading: 'Wird geladen...',
    error: 'Fehler',
    success: 'Erfolg',
  },
  it: {
    // Navigation
    home: 'Home',
    about: 'Chi siamo',
    contact: 'Contatto',
    feed: 'Feed',
    profile: 'Profilo',
    messages: 'Messaggi',
    notifications: 'Notifiche',
    settings: 'Impostazioni',
    
    // Posts
    post: 'Post',
    createPost: 'Crea post',
    whatOnYourMind: 'A cosa stai pensando?',
    like: 'Mi piace',
    comment: 'Commenta',
    share: 'Condividi',
    
    // Settings
    siteSettings: 'Impostazioni sito',
    language: 'Lingua',
    theme: 'Tema',
    notificationsSettings: 'Notifiche',
    privacy: 'Privacy',
    appearance: 'Aspetto',
    accessibility: 'Accessibilità',
    
    // Common
    save: 'Salva',
    cancel: 'Annulla',
    edit: 'Modifica',
    delete: 'Elimina',
    loading: 'Caricamento...',
    error: 'Errore',
    success: 'Successo',
  },
  pt: {
    // Navigation
    home: 'Início',
    about: 'Sobre',
    contact: 'Contato',
    feed: 'Feed',
    profile: 'Perfil',
    messages: 'Mensagens',
    notifications: 'Notificações',
    settings: 'Configurações',
    
    // Posts
    post: 'Publicação',
    createPost: 'Criar publicação',
    whatOnYourMind: 'O que você está pensando?',
    like: 'Curtir',
    comment: 'Comentar',
    share: 'Compartilhar',
    
    // Settings
    siteSettings: 'Configurações do site',
    language: 'Idioma',
    theme: 'Tema',
    notificationsSettings: 'Notificações',
    privacy: 'Privacidade',
    appearance: 'Aparência',
    accessibility: 'Acessibilidade',
    
    // Common
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Excluir',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
  },
  ru: {
    // Navigation
    home: 'Главная',
    about: 'О нас',
    contact: 'Контакт',
    feed: 'Лента',
    profile: 'Профиль',
    messages: 'Сообщения',
    notifications: 'Уведомления',
    settings: 'Настройки',
    
    // Posts
    post: 'Пост',
    createPost: 'Создать пост',
    whatOnYourMind: 'О чем вы думаете?',
    like: 'Нравится',
    comment: 'Комментировать',
    share: 'Поделиться',
    
    // Settings
    siteSettings: 'Настройки сайта',
    language: 'Язык',
    theme: 'Тема',
    notificationsSettings: 'Уведомления',
    privacy: 'Конфиденциальность',
    appearance: 'Внешний вид',
    accessibility: 'Доступность',
    
    // Common
    save: 'Сохранить',
    cancel: 'Отмена',
    edit: 'Редактировать',
    delete: 'Удалить',
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успех',
  },
  zh: {
    // Navigation
    home: '首页',
    about: '关于',
    contact: '联系',
    feed: '动态',
    profile: '个人资料',
    messages: '消息',
    notifications: '通知',
    settings: '设置',
    
    // Posts
    post: '帖子',
    createPost: '创建帖子',
    whatOnYourMind: '你在想什么？',
    like: '点赞',
    comment: '评论',
    share: '分享',
    
    // Settings
    siteSettings: '网站设置',
    language: '语言',
    theme: '主题',
    notificationsSettings: '通知',
    privacy: '隐私',
    appearance: '外观',
    accessibility: '无障碍',
    
    // Common
    save: '保存',
    cancel: '取消',
    edit: '编辑',
    delete: '删除',
    loading: '加载中...',
    error: '错误',
    success: '成功',
  },
  ja: {
    // Navigation
    home: 'ホーム',
    about: '概要',
    contact: 'お問い合わせ',
    feed: 'フィード',
    profile: 'プロフィール',
    messages: 'メッセージ',
    notifications: '通知',
    settings: '設定',
    
    // Posts
    post: '投稿',
    createPost: '投稿を作成',
    whatOnYourMind: '今何を考えていますか？',
    like: 'いいね',
    comment: 'コメント',
    share: 'シェア',
    
    // Settings
    siteSettings: 'サイト設定',
    language: '言語',
    theme: 'テーマ',
    notificationsSettings: '通知',
    privacy: 'プライバシー',
    appearance: '外観',
    accessibility: 'アクセシビリティ',
    
    // Common
    save: '保存',
    cancel: 'キャンセル',
    edit: '編集',
    delete: '削除',
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
  },
  ko: {
    // Navigation
    home: '홈',
    about: '소개',
    contact: '연락처',
    feed: '피드',
    profile: '프로필',
    messages: '메시지',
    notifications: '알림',
    settings: '설정',
    
    // Posts
    post: '게시물',
    createPost: '게시물 작성',
    whatOnYourMind: '무슨 생각을 하고 계신가요?',
    like: '좋아요',
    comment: '댓글',
    share: '공유',
    
    // Settings
    siteSettings: '사이트 설정',
    language: '언어',
    theme: '테마',
    notificationsSettings: '알림',
    privacy: '개인정보',
    appearance: '외관',
    accessibility: '접근성',
    
    // Common
    save: '저장',
    cancel: '취소',
    edit: '편집',
    delete: '삭제',
    loading: '로딩 중...',
    error: '오류',
    success: '성공',
  },
  hi: {
    // Navigation
    home: 'मुख्य',
    about: 'बारे में',
    contact: 'संपर्क',
    feed: 'फीड',
    profile: 'प्रोफाइल',
    messages: 'संदेश',
    notifications: 'सूचनाएं',
    settings: 'सेटिंग्स',
    
    // Posts
    post: 'पोस्ट',
    createPost: 'पोस्ट बनाएं',
    whatOnYourMind: 'आप क्या सोच रहे हैं?',
    like: 'पसंद',
    comment: 'टिप्पणी',
    share: 'साझा करें',
    
    // Settings
    siteSettings: 'साइट सेटिंग्स',
    language: 'भाषा',
    theme: 'थीम',
    notificationsSettings: 'सूचनाएं',
    privacy: 'गोपनीयता',
    appearance: 'दिखावट',
    accessibility: 'पहुंच',
    
    // Common
    save: 'सेव करें',
    cancel: 'रद्द करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
  },
  tr: {
    // Navigation
    home: 'Ana Sayfa',
    about: 'Hakkında',
    contact: 'İletişim',
    feed: 'Akış',
    profile: 'Profil',
    messages: 'Mesajlar',
    notifications: 'Bildirimler',
    settings: 'Ayarlar',
    
    // Posts
    post: 'Gönderi',
    createPost: 'Gönderi Oluştur',
    whatOnYourMind: 'Ne düşünüyorsun?',
    like: 'Beğen',
    comment: 'Yorum',
    share: 'Paylaş',
    
    // Settings
    siteSettings: 'Site Ayarları',
    language: 'Dil',
    theme: 'Tema',
    notificationsSettings: 'Bildirimler',
    privacy: 'Gizlilik',
    appearance: 'Görünüm',
    accessibility: 'Erişilebilirlik',
    
    // Common
    save: 'Kaydet',
    cancel: 'İptal',
    edit: 'Düzenle',
    delete: 'Sil',
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
  },
  // Add more languages as needed...
  nl: {
    // Navigation
    home: 'Thuis',
    about: 'Over ons',
    contact: 'Contact',
    feed: 'Feed',
    profile: 'Profiel',
    messages: 'Berichten',
    notifications: 'Meldingen',
    settings: 'Instellingen',
    
    // Settings
    siteSettings: 'Site-instellingen',
    language: 'Taal',
    theme: 'Thema',
    
    // Common
    save: 'Opslaan',
    cancel: 'Annuleren',
    loading: 'Laden...',
  },
  sv: {
    // Navigation
    home: 'Hem',
    about: 'Om',
    contact: 'Kontakt',
    feed: 'Flöde',
    profile: 'Profil',
    messages: 'Meddelanden',
    notifications: 'Notiser',
    settings: 'Inställningar',
    
    // Settings
    siteSettings: 'Webbplatsinställningar',
    language: 'Språk',
    theme: 'Tema',
    
    // Common
    save: 'Spara',
    cancel: 'Avbryt',
    loading: 'Laddar...',
  },
  da: {
    // Navigation
    home: 'Hjem',
    about: 'Om',
    contact: 'Kontakt',
    feed: 'Feed',
    profile: 'Profil',
    messages: 'Beskeder',
    notifications: 'Notifikationer',
    settings: 'Indstillinger',
    
    // Settings
    siteSettings: 'Webstedsindstillinger',
    language: 'Sprog',
    theme: 'Tema',
    
    // Common
    save: 'Gem',
    cancel: 'Annuller',
    loading: 'Indlæser...',
  },
  no: {
    // Navigation
    home: 'Hjem',
    about: 'Om',
    contact: 'Kontakt',
    feed: 'Feed',
    profile: 'Profil',
    messages: 'Meldinger',
    notifications: 'Varsler',
    settings: 'Innstillinger',
    
    // Settings
    siteSettings: 'Nettstedinnstillinger',
    language: 'Språk',
    theme: 'Tema',
    
    // Common
    save: 'Lagre',
    cancel: 'Avbryt',
    loading: 'Laster...',
  },
  pl: {
    // Navigation
    home: 'Dom',
    about: 'O nas',
    contact: 'Kontakt',
    feed: 'Kanał',
    profile: 'Profil',
    messages: 'Wiadomości',
    notifications: 'Powiadomienia',
    settings: 'Ustawienia',
    
    // Settings
    siteSettings: 'Ustawienia strony',
    language: 'Język',
    theme: 'Motyw',
    
    // Common
    save: 'Zapisz',
    cancel: 'Anuluj',
    loading: 'Ładowanie...',
  },
  uk: {
    // Navigation
    home: 'Головна',
    about: 'Про нас',
    contact: 'Контакт',
    feed: 'Стрічка',
    profile: 'Профіль',
    messages: 'Повідомлення',
    notifications: 'Сповіщення',
    settings: 'Налаштування',
    
    // Settings
    siteSettings: 'Налаштування сайту',
    language: 'Мова',
    theme: 'Тема',
    
    // Common
    save: 'Зберегти',
    cancel: 'Скасувати',
    loading: 'Завантаження...',
  },
  cs: {
    // Navigation
    home: 'Domů',
    about: 'O nás',
    contact: 'Kontakt',
    feed: 'Kanál',
    profile: 'Profil',
    messages: 'Zprávy',
    notifications: 'Oznámení',
    settings: 'Nastavení',
    
    // Settings
    siteSettings: 'Nastavení webu',
    language: 'Jazyk',
    theme: 'Téma',
    
    // Common
    save: 'Uložit',
    cancel: 'Zrušit',
    loading: 'Načítání...',
  }
};

const languages = [
  { code: 'ar', name: 'العربية', direction: 'rtl' },
  { code: 'en', name: 'English', direction: 'ltr' },
  { code: 'fr', name: 'Français', direction: 'ltr' },
  { code: 'es', name: 'Español', direction: 'ltr' },
  { code: 'de', name: 'Deutsch', direction: 'ltr' },
  { code: 'it', name: 'Italiano', direction: 'ltr' },
  { code: 'pt', name: 'Português', direction: 'ltr' },
  { code: 'ru', name: 'Русский', direction: 'ltr' },
  { code: 'zh', name: '中文', direction: 'ltr' },
  { code: 'ja', name: '日本語', direction: 'ltr' },
  { code: 'ko', name: '한국어', direction: 'ltr' },
  { code: 'hi', name: 'हिन्दी', direction: 'ltr' },
  { code: 'tr', name: 'Türkçe', direction: 'ltr' },
  { code: 'nl', name: 'Nederlands', direction: 'ltr' },
  { code: 'sv', name: 'Svenska', direction: 'ltr' },
  { code: 'da', name: 'Dansk', direction: 'ltr' },
  { code: 'no', name: 'Norsk', direction: 'ltr' },
  { code: 'pl', name: 'Polski', direction: 'ltr' },
  { code: 'uk', name: 'Українська', direction: 'ltr' },
  { code: 'cs', name: 'Čeština', direction: 'ltr' }
];

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  languages: typeof languages;
  direction: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('language') || 'ar';
  });

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Update document direction and lang
    const currentLang = languages.find(l => l.code === lang);
    if (currentLang) {
      document.documentElement.dir = currentLang.direction;
      document.documentElement.lang = lang;
    }
  };

  const t = (key: string): string => {
    const currentTranslations = translations[currentLanguage as keyof typeof translations];
    return currentTranslations?.[key as keyof typeof currentTranslations] || key;
  };

  const direction = languages.find(l => l.code === currentLanguage)?.direction || 'rtl';

  useEffect(() => {
    // Set initial direction and lang
    const currentLang = languages.find(l => l.code === currentLanguage);
    if (currentLang) {
      document.documentElement.dir = currentLang.direction;
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      t,
      languages,
      direction
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};