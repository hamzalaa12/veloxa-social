import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle, Shield, Zap, Heart, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const features = [
    {
      icon: Users,
      title: "شبكة تفاعلية",
      description: "تواصل مع الأصدقاء والعائلة بطريقة أكثر ذكاءً وتفاعلية"
    },
    {
      icon: MessageCircle,
      title: "محادثات فورية",
      description: "نظام رسائل متطور يدعم الملفات والوسائط المتعددة"
    },
    {
      icon: Shield,
      title: "أمان وخصوصية",
      description: "حماية شاملة لبياناتك مع أعلى معايير الأمان"
    },
    {
      icon: Zap,
      title: "أداء سريع",
      description: "تجربة سريعة وسلسة مع أحدث التقنيات"
    },
    {
      icon: Heart,
      title: "تفاعل ممتع",
      description: "ميزات تفاعلية متنوعة لجعل التواصل أكثر متعة"
    },
    {
      icon: Globe,
      title: "عالمي ومحلي",
      description: "تواصل عالمي مع دعم كامل للغة العربية"
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

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-[image:var(--gradient-primary)] rounded-full w-32 h-32 mx-auto opacity-20 blur-3xl"></div>
            <h1 className="relative text-5xl font-bold bg-[image:var(--gradient-primary)] bg-clip-text text-transparent mb-6">
              عن Veloxa
            </h1>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            منصة التواصل الاجتماعي الذكية التي تجمع بين البساطة والقوة، مصممة خصيصاً للمستخدمين العرب 
            لتوفير تجربة تواصل استثنائية مع أحدث التقنيات والميزات المبتكرة.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
            ميزات استثنائية
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative group hover:shadow-[var(--shadow-elegant)] transition-all duration-300 hover:scale-105 bg-white/60 backdrop-blur-sm border-0">
                <CardContent className="p-8 text-center">
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

      {/* Mission Section */}
      <section className="py-20 px-6 bg-white/40 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
            رؤيتنا ورسالتنا
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">رؤيتنا</h3>
              <p className="text-muted-foreground leading-relaxed">
                أن نكون المنصة الرائدة في التواصل الاجتماعي للمجتمع العربي، 
                نوفر بيئة آمنة ومبتكرة تجمع الناس وتقرب المسافات.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-foreground">رسالتنا</h3>
              <p className="text-muted-foreground leading-relaxed">
                تطوير تقنيات متقدمة تخدم المجتمع العربي وتساعد في بناء جسور 
                التواصل الحقيقي مع احترام الخصوصية والقيم الثقافية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
            ابدأ رحلتك معنا اليوم
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            انضم إلى مجتمع Veloxa واكتشف طريقة جديدة للتواصل والتفاعل
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-[image:var(--gradient-primary)] hover:opacity-90 text-primary-foreground px-8 py-4 rounded-xl shadow-[var(--shadow-elegant)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 transform hover:scale-105">
              إنشاء حساب مجاني
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;