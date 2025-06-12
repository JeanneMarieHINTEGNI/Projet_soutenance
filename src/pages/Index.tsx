import { Link } from "react-router-dom";
import { useState, useRef, ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Check,
  BarChart3,
  Shield,
  Clock,
  Calculator,
  ChevronRight,
  Users,
  Building,
  Sparkles,
  Globe,
  ArrowUpRight,
  Play,
  LineChart,
  PieChart,
  UserCircle,
  Calendar,
  DollarSign,
  Settings,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { useCountry } from "@/hooks/use-country";

interface FadeInWhenVisibleProps {
  children: ReactNode;
  delay?: number;
}

const FadeInWhenVisible = ({ children, delay = 0 }: FadeInWhenVisibleProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

const DashboardPreview = () => {
  const { country } = useCountry();

  return (
    <div className="relative bg-white/80 dark:bg-gray-900/50 backdrop-blur-lg rounded-xl p-6 shadow-2xl transition-all duration-300">
      <div className="grid grid-cols-12 gap-4">
        {/* Sidebar */}
        <div className="col-span-3 bg-gray-100/80 dark:bg-gray-900/80 rounded-lg p-4 transition-all duration-300">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-900 dark:text-white/90 p-2 bg-benin-green/10 dark:bg-benin-green/20 rounded-lg transition-all duration-300">
              <LineChart className="h-5 w-5" />
              <span className="text-sm font-medium">Dashboard</span>
            </div>
            {[
              { icon: <Users className="h-5 w-5" />, label: "Employés" },
              { icon: <Calendar className="h-5 w-5" />, label: "Présence" },
              { icon: <DollarSign className="h-5 w-5" />, label: "Paie" },
              { icon: <PieChart className="h-5 w-5" />, label: "Rapports" }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3 text-gray-600 dark:text-white/60 p-2 hover:bg-gray-200/50 dark:hover:bg-white/5 rounded-lg cursor-pointer transition-all duration-300">
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center bg-gray-100/50 dark:bg-gray-900/30 rounded-lg p-4 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-benin-green/10 dark:bg-benin-green/20 flex items-center justify-center transition-all duration-300">
                <UserCircle className="h-5 w-5 text-gray-900 dark:text-white" />
              </div>
              <div>
                <h3 className="text-gray-900 dark:text-white text-sm font-medium transition-colors duration-300">Entreprise SARL</h3>
                <p className="text-gray-600 dark:text-white/60 text-xs transition-colors duration-300">Dashboard principal</p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Employés actifs", value: "124", icon: <Users className="h-4 w-4" />, color: "bg-blue-500/20" },
              { label: "Masse salariale", value: "12.4M", icon: <DollarSign className="h-4 w-4" />, color: "bg-green-500/20" },
              { label: "Bulletins", value: "372", icon: <FileText className="h-4 w-4" />, color: "bg-purple-500/20" }
            ].map((stat, index) => (
              <div key={index} className="bg-gray-100/50 dark:bg-gray-900/30 rounded-lg p-4 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full ${stat.color} flex items-center justify-center text-gray-900 dark:text-white transition-colors duration-300`}>
                    {stat.icon}
                  </div>
                  <span className="text-gray-600 dark:text-white/60 text-xs transition-colors duration-300">{stat.label}</span>
                </div>
                <p className="text-gray-900 dark:text-white text-lg font-semibold transition-colors duration-300">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Chart Preview */}
          <div className="bg-gray-100/50 dark:bg-gray-900/30 rounded-lg p-4 transition-all duration-300">
            <div className="h-32 flex items-end justify-between gap-2">
              {[40, 65, 45, 75, 55, 80, 60].map((height, index) => (
                <div key={index} className="w-full">
                  <div 
                    className="bg-benin-green/20 dark:bg-benin-green/40 rounded-t-sm transition-all duration-300" 
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Country Badge */}
      <div className="absolute -top-4 -right-4 bg-benin-green text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all duration-300">
        {country === "benin" ? (
          <>
            <span className="text-lg">🇧🇯</span>
            <span>Bénin</span>
          </>
        ) : (
          <>
            <span className="text-lg">🇹🇬</span>
            <span>Togo</span>
          </>
        )}
      </div>

      {/* Feature Badge */}
      <motion.div 
        className="absolute -bottom-4 -right-4 bg-gradient-to-r from-violet-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300"
        whileHover={{ scale: 1.05, rotate: 1 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          delay: 1,
          scale: {
            type: "spring",
            stiffness: 300
          }
        }}
      >
        <div className="relative">
          <Sparkles className="h-5 w-5 animate-pulse" />
          <motion.div
            className="absolute -inset-1 bg-white/20 rounded-full blur-sm"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        <span className="font-medium">IA Intelligente Pro</span>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
      </motion.div>
    </div>
  );
};

const Index = () => {
  const { country } = useCountry();
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Gestion de la paie simplifiée",
      description: "Automatisez vos calculs de paie et générez des fiches de paie en quelques clics."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Conformité garantie",
      description: "Restez à jour avec les réglementations fiscales du Bénin et du Togo."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Gain de temps",
      description: "Réduisez le temps consacré à la gestion de la paie de plusieurs jours à quelques heures."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Gestion des employés",
      description: "Gérez facilement les informations et les documents de vos employés."
    }
  ];

  const stats = [
    { number: "2000+", label: "Entreprises" },
    { number: "50k+", label: "Fiches de paie" },
    { number: "99.9%", label: "Précision" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <Layout>
            {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl bg-benin-green/10 dark:bg-benin-green/20 animate-float-slow"></div>
          <div className="absolute top-1/2 -left-20 w-60 h-60 rounded-full blur-2xl bg-blue-400/10 dark:bg-togo-yellow/20 animate-float"></div>
          <div className="absolute bottom-20 right-1/3 w-40 h-40 rounded-full blur-xl bg-violet-400/10 dark:bg-purple-400/20 animate-float-reverse"></div>
                  </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                La gestion de paie
                <span className="text-benin-green"> réinventée</span> pour l'Afrique
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 dark:text-gray-300 mb-8 transition-colors duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Simplifiez vos processus de paie, assurez la conformité et gagnez du temps avec notre solution adaptée aux entreprises africaines.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4 justify-center lg:justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link to="/register" className="btn-primary group">
                  <span>Commencer gratuitement</span>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/simulation" className="btn-secondary group">
                  <span>Simuler un salaire</span>
                  <Play className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Link>
              </motion.div>
            </div>

            <motion.div 
              className="relative hidden lg:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="relative">
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 overflow-hidden">
                  {/* Dashboard Preview */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 flex items-center justify-center">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Assistant IA</h3>
                          <p className="text-white/60 text-sm">Analyse en cours...</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-green-500 text-sm">En ligne</span>
                      </div>
                    </div>

                    {/* AI Analysis Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <motion.div 
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <LineChart className="h-5 w-5 text-violet-400" />
                          <span className="text-white/90">Prévisions Salariales</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-violet-400/30 rounded-full w-3/4"></div>
                          <div className="h-2 bg-violet-400/20 rounded-full w-1/2"></div>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-5 w-5 text-blue-400" />
                          <span className="text-white/90">Analyse RH</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-blue-400/30 rounded-full w-2/3"></div>
                          <div className="h-2 bg-blue-400/20 rounded-full w-5/6"></div>
                        </div>
                      </motion.div>
                    </div>

                    {/* AI Chat Interface */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white/90 text-sm">
                            J'ai analysé les données de paie du mois dernier. Voici mes recommandations pour optimiser la gestion salariale...
                          </p>
                          <div className="mt-2 flex gap-2">
                            <span className="inline-block px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs">
                              Optimisation fiscale
                            </span>
                            <span className="inline-block px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                              Conformité
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Animated Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-600/20 to-blue-500/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-violet-600/20 rounded-full blur-2xl"></div>
                  </div>
                </div>

                {/* AI Badge */}
                <motion.div 
                  className="absolute -bottom-4 -right-4 bg-gradient-to-r from-violet-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/20"
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Sparkles className="h-5 w-5 animate-pulse" />
                      <motion.div
                        className="absolute -inset-1 bg-white/20 rounded-full blur-sm"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    <span className="font-medium">IA Intelligente Pro</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.1}>
                <div className="text-center">
                  <h3 className="text-4xl font-bold text-benin-green mb-2">{stat.number}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <FadeInWhenVisible>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Tout ce dont vous avez besoin pour gérer votre paie
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une solution complète qui s'adapte à vos besoins spécifiques
              </p>
            </div>
          </FadeInWhenVisible>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FadeInWhenVisible key={index} delay={index * 0.2}>
                <motion.div
                  className="feature-card group cursor-pointer"
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className={`feature-icon ${activeFeature === index ? 'bg-benin-green text-white' : 'bg-benin-green/10 text-benin-green'}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  <ChevronRight className="h-5 w-5 text-benin-green mt-4 group-hover:translate-x-2 transition-transform" />
                </motion.div>
              </FadeInWhenVisible>
            ))}
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeInWhenVisible>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Une interface intuitive pour une gestion efficace
                </h2>
                <div className="space-y-6">
                  <motion.div 
                    className="flex items-start gap-4"
                    whileHover={{ x: 10 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-benin-green/10 flex items-center justify-center">
                      <Check className="h-5 w-5 text-benin-green" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Calculs automatisés</h3>
                      <p className="text-gray-600">
                        Finis les calculs manuels complexes. Notre système gère tout automatiquement.
                      </p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-start gap-4"
                    whileHover={{ x: 10 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-benin-green/10 flex items-center justify-center">
                      <Building className="h-5 w-5 text-benin-green" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Multi-entreprises</h3>
                      <p className="text-gray-600">
                        Gérez plusieurs entreprises depuis une seule interface.
                      </p>
                    </div>
                  </motion.div>
                  <motion.div 
                    className="flex items-start gap-4"
                    whileHover={{ x: 10 }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-benin-green/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-benin-green" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Support local</h3>
                      <p className="text-gray-600">
                        Une équipe locale à votre disposition pour vous accompagner.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </FadeInWhenVisible>
            
            <FadeInWhenVisible delay={0.3}>
              <div className="relative">
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-6 overflow-hidden">
                  {/* Dashboard Preview */}
                  <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 flex items-center justify-center">
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">Assistant IA</h3>
                          <p className="text-white/60 text-sm">Analyse en cours...</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-green-500 text-sm">En ligne</span>
                      </div>
                    </div>

                    {/* AI Analysis Cards */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <motion.div 
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <LineChart className="h-5 w-5 text-violet-400" />
                          <span className="text-white/90">Prévisions Salariales</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-violet-400/30 rounded-full w-3/4"></div>
                          <div className="h-2 bg-violet-400/20 rounded-full w-1/2"></div>
                        </div>
                      </motion.div>

                      <motion.div 
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-5 w-5 text-blue-400" />
                          <span className="text-white/90">Analyse RH</span>
                        </div>
                        <div className="space-y-2">
                          <div className="h-2 bg-blue-400/30 rounded-full w-2/3"></div>
                          <div className="h-2 bg-blue-400/20 rounded-full w-5/6"></div>
                        </div>
                      </motion.div>
                    </div>

                    {/* AI Chat Interface */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white/90 text-sm">
                            J'ai analysé les données de paie du mois dernier. Voici mes recommandations pour optimiser la gestion salariale...
                          </p>
                          <div className="mt-2 flex gap-2">
                            <span className="inline-block px-2 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs">
                              Optimisation fiscale
                            </span>
                            <span className="inline-block px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                              Conformité
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Animated Elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-600/20 to-blue-500/20 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-violet-600/20 rounded-full blur-2xl"></div>
                  </div>
                </div>

                {/* AI Badge */}
                <motion.div 
                  className="absolute -bottom-4 -right-4 bg-gradient-to-r from-violet-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-lg backdrop-blur-sm border border-white/20"
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Sparkles className="h-5 w-5 animate-pulse" />
                      <motion.div
                        className="absolute -inset-1 bg-white/20 rounded-full blur-sm"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    <span className="font-medium">IA Intelligente Pro</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
                  </div>
                </motion.div>
              </div>
            </FadeInWhenVisible>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-benin-green to-benin-green/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <FadeInWhenVisible>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à moderniser votre gestion de paie ?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Rejoignez les entreprises qui font confiance à PayeAfrique pour leur gestion de paie.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/register" className="bg-white text-benin-green px-8 py-4 rounded-lg font-medium shadow-lg">
                  Essayer gratuitement
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link to="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-medium transition-all hover:bg-white/10">
                  Contacter l'équipe
                </Link>
              </motion.div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
