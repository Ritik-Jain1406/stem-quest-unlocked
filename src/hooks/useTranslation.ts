import { useAppContext } from '@/contexts/AppContext';
import { translations, TranslationKey } from '@/translations';

export function useTranslation() {
  const { settings } = useAppContext();
  
  const t = (key: TranslationKey): string => {
    return translations[settings.language][key] || translations.en[key] || key;
  };
  
  return { t, language: settings.language };
}