"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowLeft, Download, Loader2, Sparkles } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Model {
  id: string;
  name: string;
  type: string;
  age: number;
  ethnicity: string;
  eyeColor: string;
  bald: boolean;
  trainingStatus: string;
  tensorPath: string | null;
  createdAt: string;
}

interface OutputImage {
  id: string;
  imageUrl: string;
  prompt: string;
  status: string;
  createdAt: string;
  modelId: string;
}

interface Pack {
  id: string;
  name: string;
}

export default function ModelDetailPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const modelId = params.id as string;

  const [model, setModel] = useState<Model | null>(null);
  const [images, setImages] = useState<OutputImage[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [selectedPack, setSelectedPack] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (modelId) {
      fetchModelData();
    }
  }, [modelId]);

  const fetchModelData = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      // Fetch all user models and find the specific one
      const modelsResponse = await axios.get(`${BACKEND_URL}/models/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const foundModel = modelsResponse.data.models.find(
        (m: Model) => m.id === modelId
      );
      
      if (!foundModel) {
        toast.error("Model not found");
        router.push("/dashboard");
        return;
      }
      
      setModel(foundModel);

      // Fetch images for this model
      const imagesResponse = await axios.get(`${BACKEND_URL}/images/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const modelImages = imagesResponse.data.images.filter(
        (img: OutputImage) => img.modelId === modelId
      );
      setImages(modelImages);

      // Fetch packs
      const packsResponse = await axios.get(`${BACKEND_URL}/pack/bulk`);
      setPacks(packsResponse.data.data || []);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching model data:", error);
      toast.error("Failed to load model data");
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!model || !prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    try {
      setGenerationLoading(true);
      const token = await getToken();

      await axios.post(
        `${BACKEND_URL}/ai/generate`,
        {
          prompt: prompt,
          modelId: model.id,
          imageUrl: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Image generation started!");
      setPrompt("");
      setDialogOpen(false);
      
      setTimeout(() => {
        fetchModelData();
      }, 2000);
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    } finally {
      setGenerationLoading(false);
    }
  };

  const handleGenerateFromPack = async () => {
    if (!model || !selectedPack) {
      toast.error("Please select a pack");
      return;
    }

    try {
      setGenerationLoading(true);
      const token = await getToken();

      const response = await axios.post(
        `${BACKEND_URL}/pack/generate`,
        {
          modelId: model.id,
          packId: selectedPack,
          imageUrl: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Generated ${response.data.images.length} images from pack!`);
      setSelectedPack("");
      setDialogOpen(false);
      
      setTimeout(() => {
        fetchModelData();
      }, 2000);
    } catch (error) {
      console.error("Error generating from pack:", error);
      toast.error("Failed to generate images from pack");
    } finally {
      setGenerationLoading(false);
    }
  };

  const downloadImage = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${prompt.slice(0, 30)}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Error downloading image:", error);
      toast.error("Failed to download image");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!model) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard")}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl font-bold">{model.name}</h1>
            <Badge
              className={
                model.trainingStatus === "Completed"
                  ? "bg-green-500"
                  : model.trainingStatus === "Training"
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              }
            >
              {model.trainingStatus}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {model.type} • {model.age} years • {model.ethnicity} • {model.eyeColor} eyes
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Created {new Date(model.createdAt).toLocaleDateString()}
          </p>
        </div>

        {model.trainingStatus === "Completed" && model.tensorPath && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Sparkles className="w-4 h-4" />
                Generate Images
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Generate Images</DialogTitle>
                <DialogDescription>
                  Create new images using your trained model
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="prompt">Custom Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe the image you want to generate..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={4}
                  />
                  <Button
                    onClick={handleGenerateImage}
                    disabled={generationLoading || !prompt.trim()}
                    className="w-full"
                  >
                    {generationLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or use a pack
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pack-select">Select Pack</Label>
                  <Select value={selectedPack} onValueChange={setSelectedPack}>
                    <SelectTrigger id="pack-select">
                      <SelectValue placeholder="Choose a prompt pack" />
                    </SelectTrigger>
                    <SelectContent>
                      {packs.map((pack) => (
                        <SelectItem key={pack.id} value={pack.id}>
                          {pack.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleGenerateFromPack}
                    disabled={generationLoading || !selectedPack}
                    className="w-full"
                    variant="outline"
                  >
                    {generationLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate from Pack"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">
          Generated Images ({images.length})
        </h2>
      </div>

      {images.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkles className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No images yet</h3>
            <p className="text-muted-foreground text-center mb-4">
              Generate your first image with this model
            </p>
            {model.trainingStatus === "Completed" && model.tensorPath && (
              <Button onClick={() => setDialogOpen(true)}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Now
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden group">
              <div className="relative aspect-square">
                {image.status === "Generated" && image.imageUrl ? (
                  <>
                    <Image
                      src={image.imageUrl}
                      alt={image.prompt}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => downloadImage(image.imageUrl, image.prompt)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">{image.status}</p>
                    </div>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {image.prompt}
                </p>
                <div className="flex justify-between items-center">
                  <Badge
                    variant={image.status === "Generated" ? "default" : "secondary"}
                  >
                    {image.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(image.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
