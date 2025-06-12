// src/pages/Contact.tsx
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
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
          className="max-w-5xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h1 className="text-4xl font-bold mb-6">Contactez-nous</h1>
              <p className="text-xl text-gray-600 mb-8">
                Notre équipe est là pour répondre à toutes vos questions.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-benin-green/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-benin-green" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-gray-600">contact@payeafrique.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-benin-green/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-benin-green" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Téléphone</h3>
                    <p className="text-gray-600">+229 XX XX XX XX</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-benin-green/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-benin-green" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Adresse</h3>
                    <p className="text-gray-600">
                      Cotonou, Bénin<br />
                      Quartier XX, Rue XX
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <Input type="text" placeholder="Votre nom" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input type="email" placeholder="votre@email.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet
                  </label>
                  <Input type="text" placeholder="Sujet de votre message" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea 
                    placeholder="Votre message..." 
                    className="min-h-[150px]"
                  />
                </div>
                <Button className="w-full">Envoyer le message</Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Contact;