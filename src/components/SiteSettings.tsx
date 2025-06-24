
import React, { useState, useEffect } from 'react';
import { X, Globe, Bell, Shield, Palette, Languages } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface SiteSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SiteSettings: React.FC<SiteSettingsProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    language: 'ar',
    theme: 'light',
    notifications: true,
    emailNotifications: true,
    soundEffects: true,
    autoSave: true,
    showOnlineStatus: true
  });

  const handleSave = () => {
    // حفظ الإعدادات في localStorage أو قاعدة البيانات
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    
    toast({
      title: "تم الحفظ",
      description: "تم حفظ إعدادات الموقع بنجاح"
    });

    onClose();
  };

  useEffect(() => {
    // تحميل الإعدادات المحفوظة
    const savedSettings = localStorage.getItem('siteSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Globe className="w-5 h-5" />
            إعدادات الموقع
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          {/* إعدادات اللغة */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4" />
              <Label className="text-sm font-medium">اللغة</Label>
            </div>
            <Select value={settings.language} onValueChange={(value) => setSettings(prev => ({ ...prev, language: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* إعدادات المظهر */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <Label className="text-sm font-medium">المظهر</Label>
            </div>
            <Select value={settings.theme} onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">فاتح</SelectItem>
                <SelectItem value="dark">داكن</SelectItem>
                <SelectItem value="auto">تلقائي</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* إعدادات الإشعارات */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <Label className="text-sm font-medium">الإشعارات</Label>
            </div>
            
            <div className="space-y-3 mr-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-sm">تفعيل الإشعارات</Label>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, notifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications" className="text-sm">إشعارات البريد الإلكتروني</Label>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="soundEffects" className="text-sm">الأصوات</Label>
                <Switch
                  id="soundEffects"
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundEffects: checked }))}
                />
              </div>
            </div>
          </div>

          {/* إعدادات الخصوصية */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <Label className="text-sm font-medium">الخصوصية</Label>
            </div>
            
            <div className="space-y-3 mr-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoSave" className="text-sm">الحفظ التلقائي</Label>
                <Switch
                  id="autoSave"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoSave: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showOnlineStatus" className="text-sm">إظهار الحالة عبر الإنترنت</Label>
                <Switch
                  id="showOnlineStatus"
                  checked={settings.showOnlineStatus}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, showOnlineStatus: checked }))}
                />
              </div>
            </div>
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleSave} className="flex-1">
              حفظ الإعدادات
            </Button>
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
