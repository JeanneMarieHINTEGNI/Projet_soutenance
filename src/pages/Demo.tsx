import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Demo = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-6">Démonstration interactive</h1>
          <p className="text-xl text-gray-600 mb-8">
            Découvrez comment PayeAfrique peut simplifier votre gestion de paie.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Version de démonstration</h2>
              <p className="text-gray-600 mb-6">
                Accédez à une version de démonstration complète de notre plateforme avec des données fictives.
              </p>
              <Button className="w-full">Lancer la démo</Button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Vidéo de présentation</h2>
              <p className="text-gray-600 mb-6">
                Regardez notre vidéo de présentation pour comprendre les fonctionnalités clés.
              </p>
              <div className="aspect-video bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Demo; 