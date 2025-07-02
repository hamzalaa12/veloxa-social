import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "تم إرسال رسالتك بنجاح!",
      description: "سنتواصل معك في أقرب وقت ممكن"
    });
    
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      value: "support@veloxa.com",
      link: "mailto:support@veloxa.com"
    },
    {
      icon: Phone,
      title: "الهاتف",
      value: "+966 11 123 4567",
      link: "tel:+966111234567"
    },
    {
      icon: MapPin,
      title: "العنوان",
      value: "الرياض، المملكة العربية السعودية",
      link: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-accent)]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 space-x-reverse">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 ml-2" />
                العودة للرئيسية
              </Button>
            </Link>
            <div className="text-2xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
              Veloxa
            </div>
          </div>
        </div>
      </header>

      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent mb-6">
              تواصل معنا
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              نحن هنا لمساعدتك. لا تتردد في التواصل معنا لأي استفسار أو اقتراح
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="text-2xl bg-[image:var(--gradient-primary)] bg-clip-text text-transparent flex items-center">
                    <MessageCircle className="w-6 h-6 ml-3 text-primary" />
                    أرسل لنا رسالة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          الاسم الكامل
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="أدخل اسمك الكامل"
                          required
                          className="h-12 bg-white/80 border-2 border-border focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          البريد الإلكتروني
                        </label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="أدخل بريدك الإلكتروني"
                          required
                          className="h-12 bg-white/80 border-2 border-border focus:border-primary transition-colors"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        الموضوع
                      </label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="موضوع الرسالة"
                        required
                        className="h-12 bg-white/80 border-2 border-border focus:border-primary transition-colors"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        الرسالة
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="اكتب رسالتك هنا..."
                        required
                        rows={6}
                        className="bg-white/80 border-2 border-border focus:border-primary transition-colors resize-none"
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-14 bg-[image:var(--gradient-primary)] hover:opacity-90 text-primary-foreground font-semibold rounded-xl shadow-[var(--shadow-elegant)] transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
                    >
                      {loading ? (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                          <span>جاري الإرسال...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Send className="w-5 h-5" />
                          <span>إرسال الرسالة</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="text-xl bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
                    معلومات التواصل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4 space-x-reverse group">
                      <div className="w-12 h-12 bg-[image:var(--gradient-primary)] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <info.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {info.title}
                        </h3>
                        {info.link !== "#" ? (
                          <a 
                            href={info.link}
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-muted-foreground">{info.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* FAQ Quick Links */}
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="text-xl bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
                    روابط مفيدة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/about" className="block p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="font-medium text-foreground">عن Veloxa</div>
                    <div className="text-sm text-muted-foreground">تعرف على منصتنا ورؤيتنا</div>
                  </Link>
                  <div className="block p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="font-medium text-foreground">الأسئلة الشائعة</div>
                    <div className="text-sm text-muted-foreground">إجابات للأسئلة الأكثر شيوعاً</div>
                  </div>
                  <div className="block p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer">
                    <div className="font-medium text-foreground">سياسة الخصوصية</div>
                    <div className="text-sm text-muted-foreground">كيف نحمي بياناتك</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;