"use client";

import { useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Trash2,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function SettingsPage() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      <Button
        variant="ghost"
        onClick={() => router.push("/dashboard")}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="w-8 h-8" />
          <h1 className="text-4xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Account Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your account is managed by Clerk
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium">Username</p>
              <p className="text-sm text-muted-foreground">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
            <Badge variant={user?.primaryEmailAddress?.verification.status === "verified" ? "default" : "secondary"}>
              {user?.primaryEmailAddress?.verification.status || "Unverified"}
            </Badge>
          </div>

          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium">Account ID</p>
              <p className="text-sm text-muted-foreground font-mono">
                {user?.id.slice(0, 20)}...
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.open("https://accounts.clerk.dev", "_blank")}
          >
            Manage Account in Clerk
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Notifications (Placeholder) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Manage how you receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">
                Receive updates about your models and images
              </p>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>

          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium">Model Training Complete</p>
              <p className="text-sm text-muted-foreground">
                Get notified when model training finishes
              </p>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>

          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium">Image Generation Complete</p>
              <p className="text-sm text-muted-foreground">
                Get notified when images are ready
              </p>
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Privacy & Security
          </CardTitle>
          <CardDescription>
            Manage your privacy and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://accounts.clerk.dev", "_blank")}
            >
              Configure
            </Button>
          </div>

          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-muted-foreground">
                Change your password
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://accounts.clerk.dev", "_blank")}
            >
              Change
            </Button>
          </div>

          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium">Connected Accounts</p>
              <p className="text-sm text-muted-foreground">
                Manage social login connections
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://accounts.clerk.dev", "_blank")}
            >
              Manage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Storage */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Data & Storage</CardTitle>
          <CardDescription>
            Manage your data and storage usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Your images are stored securely in Cloudflare R2
            </p>
            <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/profile")}>
              View usage statistics →
            </Button>
          </div>

          <Button variant="outline" className="w-full" disabled>
            Export My Data
            <Badge variant="outline" className="ml-2">Coming Soon</Badge>
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all your data including:
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>All trained AI models</li>
                    <li>All generated images</li>
                    <li>Account information and settings</li>
                    <li>Usage history and statistics</li>
                  </ul>
                  <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded-lg">
                    <p className="text-sm font-medium text-destructive">
                      This action is permanent and cannot be reversed!
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      toast.error("Account deletion is not yet implemented");
                      setDeleteDialogOpen(false);
                    }}
                  >
                    I understand, delete my account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Need help? Contact support before deleting your account
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
