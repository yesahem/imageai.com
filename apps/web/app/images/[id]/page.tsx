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
import {
  ArrowLeft,
  Download,
  Trash2,
  Share2,
  Copy,
  Sparkles,
  Calendar,
  Layers,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageData {
  id: string;
  imageUrl: string;
  prompt: string;
  status: string;
  createdAt: string;
  userId: string;
  modelId: string;
  model: {
    id: string;
    name: string;
    type: string;
    age: number;
    ethnicity: string;
    eyeColor: string;
    trainingStatus: string;
  };
}

export default function ImageDetailPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const imageId = params.id as string;

  const [image, setImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (imageId) {
      fetchImage();
    }
  }, [imageId]);

  const fetchImage = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const response = await axios.get(`${BACKEND_URL}/images/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setImage(response.data.image);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching image:", error);
      toast.error("Failed to load image");
      setLoading(false);
      router.push("/dashboard");
    }
  };

  const downloadImage = async () => {
    if (!image?.imageUrl) return;

    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${image.prompt.slice(0, 30)}.png`;
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

  const copyPrompt = () => {
    if (!image?.prompt) return;
    navigator.clipboard.writeText(image.prompt);
    toast.success("Prompt copied to clipboard!");
  };

  const shareImage = async () => {
    if (!image) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "AI Generated Image",
          text: image.prompt,
          url: window.location.href,
        });
        toast.success("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const deleteImage = async () => {
    if (!image) return;

    try {
      setDeleting(true);
      const token = await getToken();

      await axios.delete(`${BACKEND_URL}/images/${image.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Image deleted successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!image) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard")}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Display */}
        <div className="space-y-4">
          <Card className="overflow-hidden">
            <div className="relative aspect-square w-full">
              {image.status === "Generated" && image.imageUrl ? (
                <Image
                  src={image.imageUrl}
                  alt={image.prompt}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">{image.status}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={downloadImage} className="w-full" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={shareImage}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          <Button
            onClick={() => setDeleteDialogOpen(true)}
            variant="destructive"
            className="w-full"
            size="lg"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Image
          </Button>
        </div>

        {/* Image Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">Image Details</h1>
              <Badge
                variant={image.status === "Generated" ? "default" : "secondary"}
              >
                {image.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Created {new Date(image.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Prompt Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Prompt</CardTitle>
              <CardDescription>The text used to generate this image</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <p className="text-sm leading-relaxed mb-4">{image.prompt}</p>
                <Button
                  onClick={copyPrompt}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Prompt
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Model Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Model Information
              </CardTitle>
              <CardDescription>The AI model used for generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="font-medium">{image.model.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <span className="font-medium">{image.model.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Age</span>
                  <span className="font-medium">{image.model.age} years</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ethnicity</span>
                  <span className="font-medium">{image.model.ethnicity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Eye Color</span>
                  <span className="font-medium">{image.model.eyeColor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge
                    className={
                      image.model.trainingStatus === "Completed"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }
                  >
                    {image.model.trainingStatus}
                  </Badge>
                </div>
              </div>

              <Button
                onClick={() => router.push(`/models/${image.model.id}`)}
                variant="outline"
                className="w-full mt-4"
              >
                View Model Details
              </Button>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Image ID</span>
                  <span className="font-mono text-xs">{image.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model ID</span>
                  <span className="font-mono text-xs">
                    {image.modelId.slice(0, 8)}...
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>
                    {new Date(image.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the image
              from your gallery.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteImage}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
