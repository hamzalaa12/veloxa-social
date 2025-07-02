import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle, Shield, Zap, Star, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage = () => {
  const features = [
    {
      icon: Users,
      title: "تواصل ذكي",
      description: "اكتشف أصدقاء جدد وتواصل مع المجتمع بطريقة أكثر ذكاءً"
    },
    {
      icon: MessageCircle,
      title: "رسائل فورية",
      description: "نظام محادثات متطور يدعم النصوص والصور والفيديوهات"
    },
    {
      icon: Shield,
      title: "أمان متقدم",
      description: "حماية شاملة لخصوصيتك مع أعلى معايير الأمان العالمية"
    },
    {
      icon: Zap,
      title: "سرعة فائقة",
      description: "تجربة سريعة وسلسة مع تحميل فوري للمحتوى"
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "مطور برمجيات",
      content: "منصة رائعة تجمع بين البساطة والقوة. التصميم جميل والميزات مفيدة جداً",
      rating: 5
    },
    {
      name: "فاطمة أحمد",
      role: "مصممة جرافيك",
      content: "أحب كيف يمكنني مشاركة أعمالي والتفاعل مع المجتمع بسهولة",
      rating: 5
    },
    {
      name: "محمد علي",
      role: "رائد أعمال",
      content: "منصة ممتازة للتواصل مع العملاء وبناء المجتمع حول مشروعي",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-[image:var(--gradient-accent)]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
              Veloxa
            </div>
            <div className="hidden md:flex items-center space-x-8 space-x-reverse">
              <Link to="/about" className="text-foreground hover:text-primary transition-colors font-medium">
                عن المنصة
              </Link>
              <Link to="/contact" className="text-foreground hover:text-primary transition-colors font-medium">
                تواصل معنا
              </Link>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link to="/auth">
                <Button variant="ghost" size="sm">
                  تسجيل الدخول
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-[image:var(--gradient-primary)] hover:opacity-90 text-primary-foreground">
                  إنشاء حساب
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[image:var(--gradient-primary)] opacity-5 rounded-full w-96 h-96 -top-48 -right-48 blur-3xl"></div>
        <div className="absolute inset-0 bg-[image:var(--gradient-primary)] opacity-5 rounded-full w-96 h-96 -bottom-48 -left-48 blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent mb-8 leading-tight">
              شبكة التواصل
              <br />
              الذكية
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              انضم إلى مجتمع Veloxa واكتشف طريقة جديدة للتواصل والتفاعل مع الأصدقاء والعائلة. 
              منصة عربية متطورة تجمع بين البساطة والابتكار.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 sm:space-x-reverse">
              <Link to="/auth">
                <Button size="lg" className="bg-[image:var(--gradient-primary)] hover:opacity-90 text-primary-foreground px-8 py-4 rounded-xl shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 transform hover:scale-105">
                  ابدأ مجاناً الآن
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 rounded-xl transition-all duration-300">
                <Play className="w-5 h-5 ml-2" />
                شاهد العرض التوضيحي
              </Button>
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-[var(--shadow-elegant)] p-8 max-w-4xl mx-auto">
              <div className="aspect-video bg-[image:var(--gradient-secondary)] rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-[image:var(--gradient-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">واجهة المستخدم الذكية</h3>
                  <p className="text-muted-foreground">تصميم بديهي وسهل الاستخدام</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/40 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent mb-6">
              ميزات استثنائية
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اكتشف الميزات المتطورة التي تجعل من Veloxa منصة التواصل الأمثل
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-105 bg-white/60 backdrop-blur-sm border-0 text-center">
                <CardContent className="p-8">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[image:var(--gradient-primary)] rounded-full w-16 h-16 mx-auto opacity-20 blur-xl group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative w-16 h-16 mx-auto bg-[image:var(--gradient-primary)] rounded-full flex items-center justify-center">
                      <feature.icon className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent mb-6">
              ماذا يقول المستخدمون
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              تجارب حقيقية من مستخدمي Veloxa حول العالم العربي
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/60 backdrop-blur-sm border-0 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-bold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-white/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent mb-6">
            جاهز للانضمام؟
          </h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            ابدأ رحلتك مع Veloxa اليوم واكتشف عالماً جديداً من التواصل الذكي
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-[image:var(--gradient-primary)] hover:opacity-90 text-primary-foreground px-12 py-6 rounded-xl shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 transform hover:scale-105 text-lg">
              إنشاء حساب مجاني
              <ArrowLeft className="w-6 h-6 mr-3" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="text-3xl font-bold text-primary mb-4">Veloxa</div>
              <p className="text-background/70 leading-relaxed max-w-md">
                منصة التواصل الاجتماعي الذكية المصممة خصيصاً للمجتمع العربي. 
                نجمع بين الأصالة والحداثة في تجربة تواصل استثنائية.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">روابط سريعة</h3>
              <div className="space-y-2">
                <Link to="/about" className="block text-background/70 hover:text-background transition-colors">
                  عن المنصة
                </Link>
                <Link to="/contact" className="block text-background/70 hover:text-background transition-colors">
                  تواصل معنا
                </Link>
                <div className="block text-background/70 hover:text-background transition-colors cursor-pointer">
                  سياسة الخصوصية
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-4">للمطورين</h3>
              <div className="space-y-2">
                <div className="block text-background/70 hover:text-background transition-colors cursor-pointer">
                  API التطبيقات
                </div>
                <div className="block text-background/70 hover:text-background transition-colors cursor-pointer">
                  الوثائق التقنية
                </div>
                <div className="block text-background/70 hover:text-background transition-colors cursor-pointer">
                  مجتمع المطورين
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/50">
            <p>&copy; 2024 Veloxa. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;