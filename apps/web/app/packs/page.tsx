"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Package, Search, Sparkles, Layers } from "lucide-react";
import { useRouter } from "next/navigation";

interface Pack {
  id: string;
  name: string;
}

export default function PacksPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [packs, setPacks] = useState<Pack[]>([]);
  const [filteredPacks, setFilteredPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPacks();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = packs.filter((pack) =>
        pack.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPacks(filtered);
    } else {
      setFilteredPacks(packs);
    }
  }, [searchQuery, packs]);

  const fetchPacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/pack/bulk`);
      setPacks(response.data.data || []);
      setFilteredPacks(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching packs:", error);
      toast.error("Failed to load packs");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-6" />
        <Skeleton className="h-12 w-full max-w-md mb-8" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-10 h-10" />
          <div>
            <h1 className="text-4xl font-bold">Prompt Packs</h1>
            <p className="text-muted-foreground">
              Browse and use pre-made prompt collections
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search packs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Packs Grid */}
      {filteredPacks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "No packs found" : "No packs available"}
            </h3>
            <p className="text-muted-foreground text-center">
              {searchQuery
                ? "Try adjusting your search query"
                : "Prompt packs will appear here when available"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {filteredPacks.length} pack{filteredPacks.length !== 1 ? "s" : ""}
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPacks.map((pack) => (
              <Card
                key={pack.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => router.push(`/packs/${pack.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {pack.name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Click to view all prompts in this pack
                      </CardDescription>
                    </div>
                    <Package className="w-8 h-8 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/packs/${pack.id}`);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/dashboard?pack=${pack.id}`);
                      }}
                      className="flex-1"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Use Pack
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Info Section */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle>What are Prompt Packs?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Prompt packs are curated collections of AI prompts designed for specific use
            cases. Each pack contains multiple prompts that work well together to generate
            consistent, high-quality images.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Quick Generation</h4>
                <p className="text-sm text-muted-foreground">
                  Generate multiple images with one click
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Themed Collections</h4>
                <p className="text-sm text-muted-foreground">
                  Prompts grouped by style and purpose
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium mb-1">Pre-tested Quality</h4>
                <p className="text-sm text-muted-foreground">
                  Prompts optimized for best results
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
