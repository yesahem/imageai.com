"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  User,
  Mail,
  Calendar,
  ImageIcon,
  Layers,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface UserStats {
  totalModels: number;
  completedModels: number;
  totalImages: number;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  clerkId: string;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const response = await axios.get(`${BACKEND_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data.user);
      setStats(response.data.stats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account and view your statistics
          </p>
        </div>
        <Button onClick={() => router.push("/dashboard")}>
          Back to Dashboard
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalModels || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.completedModels || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Models
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.completedModels || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to generate images
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Generated Images
            </CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalImages || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across all models
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal details and account info</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profile?.profilePicture || user?.imageUrl || ""}
                alt={profile?.username || "User"}
              />
              <AvatarFallback className="text-2xl">
                {profile?.username ? getInitials(profile.username) : "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Username</p>
                  <p className="font-medium">{profile?.username || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile?.email || "Not set"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Activity Overview
          </CardTitle>
          <CardDescription>Your recent activity on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Total Models Created</p>
                  <p className="text-sm text-muted-foreground">
                    All time statistics
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {stats?.totalModels || 0}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium">Models Ready</p>
                  <p className="text-sm text-muted-foreground">
                    Available for image generation
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {stats?.completedModels || 0}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <ImageIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium">Images Generated</p>
                  <p className="text-sm text-muted-foreground">
                    Total AI generated images
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {stats?.totalImages || 0}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                  <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="font-medium">Models In Training</p>
                  <p className="text-sm text-muted-foreground">
                    Currently being processed
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {(stats?.totalModels || 0) - (stats?.completedModels || 0)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Button
          variant="outline"
          className="h-20 text-lg"
          onClick={() => router.push("/trainModel")}
        >
          <Layers className="mr-2 h-5 w-5" />
          Train New Model
        </Button>
        <Button
          variant="outline"
          className="h-20 text-lg"
          onClick={() => router.push("/dashboard")}
        >
          <ImageIcon className="mr-2 h-5 w-5" />
          View Gallery
        </Button>
      </div>
    </div>
  );
}
