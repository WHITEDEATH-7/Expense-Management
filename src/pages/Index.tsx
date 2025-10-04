import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Receipt, TrendingUp, Shield, Zap } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Receipt,
      title: 'Easy Expense Tracking',
      description: 'Submit and track expenses with OCR-powered receipt scanning',
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Get insights into spending patterns and budget utilization',
    },
    {
      icon: Shield,
      title: 'Role-Based Access',
      description: 'Secure multi-level approval workflows for every organization',
    },
    {
      icon: Zap,
      title: 'Multi-Currency Support',
      description: 'Handle expenses in any currency with automatic conversion',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto animate-slide-up">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary mb-6">
            <Receipt className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            ExpenseMan
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Simplify expense management with intelligent automation and multi-level approval workflows
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/signup')} className="text-lg px-8">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/login')} className="text-lg px-8">
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl bg-card border border-border/50 hover:shadow-lg transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center max-w-2xl mx-auto">
          <div className="p-8 rounded-2xl bg-card border border-border/50">
            <h2 className="text-3xl font-bold mb-4">Ready to streamline your expenses?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of companies managing expenses efficiently with ExpenseMan
            </p>
            <Button size="lg" onClick={() => navigate('/signup')}>
              Create Your Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
