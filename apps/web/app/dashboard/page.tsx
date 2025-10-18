"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ImageIcon, Loader2, Plus, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

export default function DashboardPage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [models, setModels] = useState<Model[]>([]);
  const [images, setImages] = useState<OutputImage[]>([]);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [selectedPack, setSelectedPack] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      // Fetch user's models
      const modelsResponse = await axios.get(`${BACKEND_URL}/models/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModels(modelsResponse.data.models || []);
      
      // Fetch user's images
      const imagesResponse = await axios.get(`${BACKEND_URL}/images/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setImages(imagesResponse.data.images || []);
      
      // Fetch packs
      const packsResponse = await axios.get(`${BACKEND_URL}/pack/bulk`);
      setPacks(packsResponse.data.data || []);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!selectedModel || !prompt.trim()) {
      toast.error("Please select a model and enter a prompt");
      return;
    }

    if (selectedModel.trainingStatus !== "Completed" || !selectedModel.tensorPath) {
      toast.error("Model is not ready yet. Please wait for training to complete.");
      return;
    }

    try {
      setGenerationLoading(true);
      const token = await getToken();
      
      const response = await axios.post(
        `${BACKEND_URL}/ai/generate`,
        {
          prompt: prompt,
          modelId: selectedModel.id,
          imageUrl: "", // Will be filled by webhook
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Image generation started! Check back in a few moments.");
      setPrompt("");
      // Refresh images list after a delay
      setTimeout(() => {
        fetchData();
      }, 2000);
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    } finally {
      setGenerationLoading(false);
    }
  };

  const handleGenerateFromPack = async () => {
    if (!selectedModel || !selectedPack) {
      toast.error("Please select a model and a pack");
      return;
    }

    if (selectedModel.trainingStatus !== "Completed" || !selectedModel.tensorPath) {
      toast.error("Model is not ready yet. Please wait for training to complete.");
      return;
    }

    try {
      setGenerationLoading(true);
      const token = await getToken();
      
      const response = await axios.post(
        `${BACKEND_URL}/pack/generate`,
        {
          modelId: selectedModel.id,
          packId: selectedPack,
          imageUrl: "", // Will be filled by webhook
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Generated ${response.data.images.length} images from pack!`);
      setSelectedPack("");
      // Refresh images list after a delay
      setTimeout(() => {
        fetchData();
      }, 2000);
    } catch (error) {
      console.error("Error generating from pack:", error);
      toast.error("Failed to generate images from pack");
    } finally {
      setGenerationLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-500";
      case "Training":
        return "bg-yellow-500";
      case "Pending":
        return "bg-blue-500";
      case "Failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[200px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your AI models and generated images
          </p>
        </div>
        <Button
          onClick={() => router.push("/trainModel")}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Train New Model
        </Button>
      </div>

      <Tabs defaultValue="models" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="models">My Models</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {models.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No models yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Train your first AI model to start generating images
                  </p>
                  <Button onClick={() => router.push("/trainModel")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Train Your First Model
                  </Button>
                </CardContent>
              </Card>
            ) : (
              models.map((model) => (
                <Card key={model.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{model.name}</CardTitle>
                      <Badge className={getStatusColor(model.trainingStatus)}>
                        {model.trainingStatus}
                      </Badge>
                    </div>
                    <CardDescription>
                      {model.type} • {model.age} years • {model.ethnicity}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Eye Color:</span>
                        <span>{model.eyeColor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bald:</span>
                        <span>{model.bald ? "Yes" : "No"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{new Date(model.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {model.trainingStatus === "Completed" && model.tensorPath && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          className="flex-1"
                          onClick={() => router.push(`/models/${model.id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          className="flex-1"
                          variant="outline"
                          onClick={() => {
                            setSelectedModel(model);
                            // Switch to generate tab
                            document.querySelector('[value="generate"]')?.dispatchEvent(
                              new MouseEvent('click', { bubbles: true })
                            );
                          }}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Generate
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="generate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate Images</CardTitle>
              <CardDescription>
                Create stunning images using your trained models
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="model-select">Select Model</Label>
                <Select
                  value={selectedModel?.id || ""}
                  onValueChange={(value) => {
                    const model = models.find((m) => m.id === value);
                    setSelectedModel(model || null);
                  }}
                >
                  <SelectTrigger id="model-select">
                    <SelectValue placeholder="Choose a trained model" />
                  </SelectTrigger>
                  <SelectContent>
                    {models
                      .filter(
                        (m) => m.trainingStatus === "Completed" && m.tensorPath
                      )
                      .map((model) => (
                        <SelectItem key={model.id} value={model.id}>
                          {model.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Custom Prompt</h3>
                  <div className="space-y-2">
                    <Label htmlFor="prompt">Your Prompt</Label>
                    <Textarea
                      id="prompt"
                      placeholder="Describe the image you want to generate..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <Button
                    onClick={handleGenerateImage}
                    disabled={generationLoading || !selectedModel || !prompt.trim()}
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

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Use a Pack</h3>
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
                  </div>
                  <Button
                    onClick={handleGenerateFromPack}
                    disabled={generationLoading || !selectedModel || !selectedPack}
                    className="w-full"
                    variant="outline"
                  >
                    {generationLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Generate from Pack
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No images yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Generate your first image to see it here
                  </p>
                  <Button
                    onClick={() => {
                      document.querySelector('[value="generate"]')?.dispatchEvent(
                        new MouseEvent('click', { bubbles: true })
                      );
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Generating
                  </Button>
                </CardContent>
              </Card>
            ) : (
              images.map((image) => (
                <Card
                  key={image.id}
                  className="overflow-hidden group cursor-pointer"
                  onClick={() => router.push(`/images/${image.id}`)}
                >
                  <div className="relative aspect-square">
                    {image.status === "Generated" && image.imageUrl ? (
                      <Image
                        src={image.imageUrl}
                        alt={image.prompt}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {image.prompt}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant={image.status === "Generated" ? "default" : "secondary"}>
                        {image.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
