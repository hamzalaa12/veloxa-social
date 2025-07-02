
import React, { useState, useEffect } from 'react';
import { X, Globe, Bell, Shield, Palette, Languages, Eye, Volume2, Type, Moon, Accessibility, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface SiteSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SiteSettings: React.FC<SiteSettingsProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const { t, currentLanguage, setLanguage, languages } = useLanguage();
  const [settings, setSettings] = useState({
    language: currentLanguage,
    theme: 'auto',
    fontSize: 16,
    lineHeight: 1.5,
    reducedMotion: false,
    highContrast: false,
    colorBlindMode: 'none',
    
    // Notifications
    notifications: true,
    emailNotifications: true,
    pushNotifications: true,
    soundEffects: true,
    vibration: true,
    
    // Privacy & Security
    autoSave: true,
    showOnlineStatus: true,
    dataCollection: true,
    analyticsTracking: true,
    locationSharing: false,
    twoFactorAuth: false,
    
    // Appearance
    darkMode: 'auto',
    compactMode: false,
    animationsEnabled: true,
    backgroundBlur: true,
    customAccentColor: '#8b5cf6',
    
    // Accessibility
    screenReader: false,
    keyboardNavigation: true,
    voiceControl: false,
    magnifier: false
  });

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    // Apply language change
    if (settings.language !== currentLanguage) {
      setLanguage(settings.language);
    }
    
    // Apply font size
    document.documentElement.style.fontSize = `${settings.fontSize}px`;
    
    // Apply other settings to document
    document.documentElement.style.setProperty('--line-height', settings.lineHeight.toString());
    
    if (settings.reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }
    
    toast({
      title: t('success'),
      description: t('settingsSaved') || 'Settings saved successfully'
    });

    onClose();
  };

  useEffect(() => {
    // Load saved settings
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings({ ...settings, ...parsed, language: currentLanguage });
    }
    
    // Apply current font size and other settings
    const fontSize = localStorage.getItem('fontSize');
    if (fontSize) {
      document.documentElement.style.fontSize = `${fontSize}px`;
    }
  }, [currentLanguage]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t('siteSettings')}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-8 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Language & Localization */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Languages className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">{t('language')}</Label>
              </div>
              <div className="space-y-3">
                <Label className="text-sm">{t('language')}</Label>
                <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Theme & Appearance */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Palette className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">{t('appearance')}</Label>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm">{t('theme')}</Label>
                <Select value={settings.theme} onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">فاتح / Light</SelectItem>
                    <SelectItem value="dark">داكن / Dark</SelectItem>
                    <SelectItem value="auto">تلقائي / Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="compactMode" className="text-sm">وضع مضغوط / Compact Mode</Label>
                <Switch
                  id="compactMode"
                  checked={settings.compactMode}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, compactMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="animationsEnabled" className="text-sm">تفعيل الرسوم المتحركة / Animations</Label>
                <Switch
                  id="animationsEnabled"
                  checked={settings.animationsEnabled}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, animationsEnabled: checked }))}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Typography */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Type className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">الطباعة / Typography</Label>
              </div>
              
              <div className="space-y-3">
                <Label className="text-sm">حجم الخط / Font Size: {settings.fontSize}px</Label>
                <Slider
                  value={[settings.fontSize]}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, fontSize: value[0] }))}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm">ارتفاع السطر / Line Height: {settings.lineHeight}</Label>
                <Slider
                  value={[settings.lineHeight]}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, lineHeight: value[0] }))}
                  max={2}
                  min={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Accessibility */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Accessibility className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">{t('accessibility')}</Label>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reducedMotion" className="text-sm">تقليل الحركة / Reduced Motion</Label>
                  <Switch
                    id="reducedMotion"
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, reducedMotion: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="highContrast" className="text-sm">تباين عالي / High Contrast</Label>
                  <Switch
                    id="highContrast"
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, highContrast: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="keyboardNavigation" className="text-sm">التنقل بلوحة المفاتيح / Keyboard Navigation</Label>
                  <Switch
                    id="keyboardNavigation"
                    checked={settings.keyboardNavigation}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, keyboardNavigation: checked }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">وضع عمى الألوان / Color Blind Mode</Label>
                  <Select value={settings.colorBlindMode} onValueChange={(value) => setSettings(prev => ({ ...prev, colorBlindMode: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">عادي / Normal</SelectItem>
                      <SelectItem value="protanopia">Protanopia</SelectItem>
                      <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
                      <SelectItem value="tritanopia">Tritanopia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Notifications */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Bell className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">{t('notificationsSettings')}</Label>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications" className="text-sm">تفعيل الإشعارات / Enable Notifications</Label>
                  <Switch
                    id="notifications"
                    checked={settings.notifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications" className="text-sm">إشعارات البريد الإلكتروني / Email</Label>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="pushNotifications" className="text-sm">الإشعارات المنبثقة / Push Notifications</Label>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="soundEffects" className="text-sm">الأصوات / Sound Effects</Label>
                  <Switch
                    id="soundEffects"
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundEffects: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="vibration" className="text-sm">الاهتزاز / Vibration</Label>
                  <Switch
                    id="vibration"
                    checked={settings.vibration}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, vibration: checked }))}
                  />
                </div>
              </div>
            </div>

            {/* Privacy & Security */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Shield className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">{t('privacy')}</Label>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="autoSave" className="text-sm">الحفظ التلقائي / Auto Save</Label>
                  <Switch
                    id="autoSave"
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSave: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="showOnlineStatus" className="text-sm">إظهار الحالة / Show Online Status</Label>
                  <Switch
                    id="showOnlineStatus"
                    checked={settings.showOnlineStatus}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showOnlineStatus: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="dataCollection" className="text-sm">جمع البيانات / Data Collection</Label>
                  <Switch
                    id="dataCollection"
                    checked={settings.dataCollection}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, dataCollection: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="analyticsTracking" className="text-sm">تتبع التحليلات / Analytics Tracking</Label>
                  <Switch
                    id="analyticsTracking"
                    checked={settings.analyticsTracking}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, analyticsTracking: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="locationSharing" className="text-sm">مشاركة الموقع / Location Sharing</Label>
                  <Switch
                    id="locationSharing"
                    checked={settings.locationSharing}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, locationSharing: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="twoFactorAuth" className="text-sm">المصادقة الثنائية / 2FA</Label>
                  <Switch
                    id="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, twoFactorAuth: checked }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save & Cancel Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button onClick={handleSave} className="flex-1 bg-[image:var(--gradient-primary)] text-white hover:opacity-90">
              {t('save')} {t('siteSettings')}
            </Button>
            <Button variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
