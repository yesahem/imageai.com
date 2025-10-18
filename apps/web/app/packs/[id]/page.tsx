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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ArrowLeft,
  Copy,
  Sparkles,
  Loader2,
  Package,
  FileText,
} from "lucide-react";

interface PackPrompt {
  id: string;
  prompt: string;
  packId: string;
}

interface PackDetail {
  id: string;
  name: string;
  prompt: PackPrompt[];
}

interface Model {
  id: string;
  name: string;
  type: string;
  trainingStatus: string;
  tensorPath: string | null;
}

export default function PackDetailPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const packId = params.id as string;

  const [pack, setPack] = useState<PackDetail | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [loading, setLoading] = useState(true);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (packId) {
      fetchPackDetails();
      fetchUserModels();
    }
  }, [packId]);

  const fetchPackDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/pack/${packId}`);
      setPack(response.data.pack);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pack:", error);
      toast.error("Failed to load pack details");
      setLoading(false);
      router.push("/packs");
    }
  };

  const fetchUserModels = async () => {
    try {
      const token = await getToken();
      const response = await axios.get(`${BACKEND_URL}/models/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const completedModels = response.data.models.filter(
        (m: Model) => m.trainingStatus === "Completed" && m.tensorPath
      );
      setModels(completedModels);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied to clipboard!");
  };

  const generateFromPack = async () => {
    if (!selectedModel || !pack) {
      toast.error("Please select a model");
      return;
    }

    try {
      setGenerationLoading(true);
      const token = await getToken();

      const response = await axios.post(
        `${BACKEND_URL}/pack/generate`,
        {
          modelId: selectedModel,
          packId: pack.id,
          imageUrl: "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`Generated ${response.data.images.length} images from pack!`);
      setDialogOpen(false);
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error generating from pack:", error);
      toast.error("Failed to generate images from pack");
    } finally {
      setGenerationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-64 mb-4" />
        <Skeleton className="h-6 w-full max-w-md mb-8" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (!pack) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      <Button
        variant="ghost"
        onClick={() => router.push("/packs")}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Packs
      </Button>

      {/* Pack Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{pack.name}</h1>
              <p className="text-muted-foreground">
                Contains {pack.prompt.length} prompt
                {pack.prompt.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Generate from Pack
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Images</DialogTitle>
                <DialogDescription>
                  Select a model to generate {pack.prompt.length} image
                  {pack.prompt.length !== 1 ? "s" : ""} from this pack
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="model-select">Select Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger id="model-select">
                      <SelectValue placeholder="Choose a trained model" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          No completed models available
                        </div>
                      ) : (
                        models.map((model) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {models.length === 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      You need at least one completed model to use this pack.
                    </p>
                    <Button
                      variant="link"
                      className="p-0 h-auto mt-2"
                      onClick={() => router.push("/trainModel")}
                    >
                      Train a model now
                    </Button>
                  </div>
                )}

                <Button
                  onClick={generateFromPack}
                  disabled={generationLoading || !selectedModel || models.length === 0}
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
                      Generate {pack.prompt.length} Images
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium mb-1">About this pack</p>
                <p className="text-sm text-muted-foreground">
                  This pack contains {pack.prompt.length} carefully crafted prompts
                  designed to work together. Generate all of them at once to create a
                  cohesive collection of images.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prompts List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Prompts in this Pack</h2>
        {pack.prompt.map((promptItem, index) => (
          <Card key={promptItem.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge variant="outline">#{index + 1}</Badge>
                    Prompt {index + 1}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyPrompt(promptItem.prompt)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {promptItem.prompt}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Tips */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Usage Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">1</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Make sure you have a completed model before using this pack
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">2</span>
            </div>
            <p className="text-sm text-muted-foreground">
              All {pack.prompt.length} images will be generated at once
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold">3</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Check your dashboard to see the generated images once they're ready
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
