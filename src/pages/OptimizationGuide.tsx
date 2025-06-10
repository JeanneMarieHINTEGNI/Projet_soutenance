import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, MessageCircle, PieChart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const OptimizationGuide = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            className="mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Guide d'Optimisation des Coûts Employeur</h1>
            <p className="text-muted-foreground">
              Découvrez les stratégies légales pour optimiser vos charges sociales et fiscales
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimisation des Charges Sociales et Fiscales</CardTitle>
                <CardDescription>
                  Explorez les dispositifs légaux pour réduire vos charges
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Incitations à l'emploi</h3>
                  <p className="text-sm text-muted-foreground">
                    Profitez des dispositifs gouvernementaux qui encouragent l'embauche avec des exonérations 
                    partielles ou totales de charges pour certaines catégories de personnel.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Statuts spécifiques</h3>
                  <p className="text-sm text-muted-foreground">
                    Explorez les avantages des contrats d'apprentissage et de professionnalisation 
                    qui offrent des cadres sociaux et fiscaux plus avantageux.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Plafonds et seuils</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimisez l'assiette des cotisations en respectant les plafonds et seuils légaux 
                    pour certaines contributions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Structuration des Avantages Sociaux</CardTitle>
                <CardDescription>
                  Optimisez la composition de vos packages de rémunération
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Avantages en nature vs. primes</h3>
                  <p className="text-sm text-muted-foreground">
                    Comparez l'impact fiscal des avantages en nature (véhicule, logement, repas) 
                    par rapport aux primes en numéraire.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Prévoyance et mutuelle</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimisez vos régimes de prévoyance et de complémentaire santé collective 
                    pour bénéficier d'avantages fiscaux.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Épargne salariale</h3>
                  <p className="text-sm text-muted-foreground">
                    Implémentez des dispositifs d'intéressement, participation et plans d'épargne 
                    avec des exonérations de charges.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Politique de Rémunération Globale</CardTitle>
                <CardDescription>
                  Optimisez votre stratégie de rémunération
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Équilibre brut/net/coût employeur</h3>
                  <p className="text-sm text-muted-foreground">
                    Analysez l'impact des composantes de la rémunération sur le coût total 
                    et le net perçu par l'employé.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Subventions à la formation</h3>
                  <p className="text-sm text-muted-foreground">
                    Identifiez les possibilités de financement pour vos programmes de formation 
                    et réduisez les coûts de développement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notre Accompagnement</CardTitle>
                <CardDescription>
                  Comment nous pouvons vous aider
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <PieChart className="h-5 w-5 mr-2 text-benin-green" />
                    <span className="text-sm">Identification des optimisations applicables à votre situation</span>
                  </li>
                  <li className="flex items-start">
                    <BookOpen className="h-5 w-5 mr-2 text-benin-green" />
                    <span className="text-sm">Modélisation de l'impact sur vos masses salariales futures</span>
                  </li>
                  <li className="flex items-start">
                    <MessageCircle className="h-5 w-5 mr-2 text-benin-green" />
                    <span className="text-sm">Mise en relation avec nos experts partenaires</span>
                  </li>
                </ul>

                <div className="pt-4 space-y-3">
                  <Button className="w-full">
                    Demander un diagnostic personnalisé
                  </Button>
                  <Button variant="outline" className="w-full">
                    Parler à un expert
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Économies Potentielles</CardTitle>
                <CardDescription>
                  Estimation des réductions de coûts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Charges sociales</span>
                      <span className="font-medium text-benin-green">Jusqu'à 15%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                      <div className="bg-benin-green h-full rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Avantages sociaux</span>
                      <span className="font-medium text-benin-green">Jusqu'à 10%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                      <div className="bg-benin-green h-full rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Formation</span>
                      <span className="font-medium text-benin-green">Jusqu'à 8%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
                      <div className="bg-benin-green h-full rounded-full" style={{ width: "40%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OptimizationGuide; 