import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon, Sun, Monitor, Battery, Globe } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from '@/hooks/useTranslation';

export function Settings() {
  const { settings, updateSettings } = useAppContext();
  const { t } = useTranslation();

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">{t('settings')}</h1>
      
      <div className="space-y-6">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              {t('theme')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={settings.theme} 
              onValueChange={(value: 'light' | 'dark' | 'system') => 
                updateSettings({ theme: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    System
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('language')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={settings.language} 
              onValueChange={(value: 'en' | 'hi' | 'es' | 'fr') => 
                updateSettings({ language: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिन्दी</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Battery Saver */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="h-5 w-5" />
              {t('batterySaver')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="battery-saver"
                checked={settings.batterySaver}
                onCheckedChange={(checked) => updateSettings({ batterySaver: checked })}
              />
              <Label htmlFor="battery-saver">
                Enable battery saver mode (reduces animations and background processes)
              </Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}