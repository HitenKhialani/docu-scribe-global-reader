import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Languages } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
];

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const LanguageSelector = ({ selectedLanguage, onLanguageChange }: LanguageSelectorProps) => {
  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange(languageCode);
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Languages className="h-5 w-5 text-blue-600" />
          <span>Language Selection</span>
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {(() => {
            const language = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage);
            return language ? (
              <Badge key={language.code} variant="default" className="bg-blue-100 text-blue-800">
                {language.flag} {language.name}
              </Badge>
            ) : null;
          })()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUPPORTED_LANGUAGES.map((language) => (
            <div key={language.code} className="flex items-center space-x-3">
              <input
                type="radio"
                id={language.code}
                name="language"
                checked={selectedLanguage === language.code}
                onChange={() => handleLanguageSelect(language.code)}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <label
                htmlFor={language.code}
                className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{language.flag}</span>
                  <div>
                    <div className="font-medium">{language.name}</div>
                    <div className="text-xs text-gray-500">{language.nativeName}</div>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 <strong>Tip:</strong> Only one language can be selected at a time.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
