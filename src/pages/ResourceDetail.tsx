import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getResourceById } from "@/data/resources";
import ReactMarkdown from "react-markdown";

const ResourceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const resource = getResourceById(id || "");

  if (!resource) {
    return (
      <Layout>
        <div className="container px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Ressource non trouvée</h1>
            <Button onClick={() => navigate("/resources")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Retour aux ressources
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container px-4 py-8">
        {/* Header with navigation */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => navigate("/resources")}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Retour aux ressources
          </Button>
        </div>

        {/* Resource metadata */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-benin-green">
              {resource.type === "article"
                ? "Article"
                : resource.type === "document"
                ? "Document"
                : resource.type === "video"
                ? "Vidéo"
                : resource.type === "webinar"
                ? "Webinaire"
                : "Calculateur"}
            </Badge>
            <div className="flex space-x-1">
              {resource.country.includes("benin") && (
                <span className="text-lg" title="Bénin">
                  🇧🇯
                </span>
              )}
              {resource.country.includes("togo") && (
                <span className="text-lg" title="Togo">
                  🇹🇬
                </span>
              )}
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            {resource.title}
          </h1>

          <p className="text-muted-foreground mb-4">{resource.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            Publié le{" "}
            {new Date(resource.date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>

        {/* Resource content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {resource.content ? (
            <ReactMarkdown>{resource.content}</ReactMarkdown>
          ) : (
            <p className="text-muted-foreground">
              Le contenu de cette ressource n'est pas encore disponible.
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ResourceDetail; 