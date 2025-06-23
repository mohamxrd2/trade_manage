"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import {
  LucideUser,
  Mail,
  Shield,
  Camera,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import Wrapper from "./wrapper";

type User = {
  id: string;
  name: string;
  emailVerified: boolean;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

type ProfileProps = {
  user?: User;
};

export default function ProfilePage({ user }: ProfileProps) {
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSave = () => {
    console.log("Enregistrer profil :", profileForm);
    setEditingProfile(false);
  };

  const handlePasswordSave = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    console.log("Changer mot de passe");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setEditingPassword(false);
  };

  const handleProfileCancel = () => {
    setProfileForm({
      name: user?.name ?? "",
      email: user?.email ?? "",
    });
    setEditingProfile(false);
  };

  const handlePasswordCancel = () => {
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setEditingPassword(false);
  };

  return (
    <Wrapper user={user}>
      <div className="min-h-screen bg-gradient-to-br  p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Overview Card */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={user?.image ?? undefined} />
                    <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 shadow-lg"
                    variant="secondary"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-center md:text-left space-y-2">
                  <h2 className="text-2xl font-bold text-primary">
                    {user?.name}
                  </h2>
                  <p className="text-muted-foreground flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Badge
                      variant={user?.emailVerified ? "default" : "secondary"}
                      className="gap-1"
                    >
                      <Shield className="w-3 h-3" />
                      {user?.emailVerified
                        ? "Email vérifié"
                        : "Email non vérifié"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <LucideUser className="w-4 h-4" />
                Informations personnell es
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Sécurité
              </TabsTrigger>
            </TabsList>

            {/* Profile Information Tab */}
            <TabsContent value="profile">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        Informations personnelles
                      </CardTitle>
                      <p className="text-sm text-muted-foreground  mt-1">
                        Modifiez vos informations de profil
                      </p>
                    </div>
                    {!editingProfile && (
                      <Button
                        onClick={() => setEditingProfile(true)}
                        variant="outline"
                      >
                        Modifier
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Nom complet
                      </Label>
                      {editingProfile ? (
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              name: e.target.value,
                            })
                          }
                          className="h-11 text-accent-foreground"
                        />
                      ) : (
                        <div className="h-11 px-3 py-2 border rounded-md text-accent-foreground flex items-center">
                          <span className="text-muted-foreground ">
                            {user?.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Adresse email
                      </Label>
                      {editingProfile ? (
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              email: e.target.value,
                            })
                          }
                          className="h-11"
                        />
                      ) : (
                        <div className="h-11 px-3 py-2 border rounded-md flex items-center">
                          <span className="text-muted-foreground">
                            {user?.email}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Statut de vérification
                      </Label>
                      <div className="h-11 px-3 py-2 border rounded-md flex items-center">
                        <Badge
                          variant={
                            user?.emailVerified ? "default" : "secondary"
                          }
                        >
                          {user?.emailVerified
                            ? "Email vérifié "
                            : "Email non vérifié "}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {editingProfile && (
                    <>
                      <Separator />
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={handleProfileCancel}>
                          <X className="w-4 h-4 mr-2" />
                          Annuler
                        </Button>
                        <Button onClick={handleProfileSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Enregistrer
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        Sécurité du compte
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Modifiez votre mot de passe pour sécuriser votre compte
                      </p>
                    </div>
                    {!editingPassword && (
                      <Button
                        onClick={() => setEditingPassword(true)}
                        variant="outline"
                      >
                        Changer le mot de passe
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {editingPassword ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="current-password"
                          className="text-sm font-medium"
                        >
                          Mot de passe actuel
                        </Label>
                        <div className="relative">
                          <Input
                            id="current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                currentPassword: e.target.value,
                              })
                            }
                            className="h-11 pr-10"
                            placeholder="Entrez votre mot de passe actuel"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="new-password"
                          className="text-sm font-medium"
                        >
                          Nouveau mot de passe
                        </Label>
                        <div className="relative">
                          <Input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value,
                              })
                            }
                            className="h-11 pr-10"
                            placeholder="Entrez votre nouveau mot de passe"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="confirm-password"
                          className="text-sm font-medium"
                        >
                          Confirmer le nouveau mot de passe
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="h-11 pr-10"
                            placeholder="Confirmez votre nouveau mot de passe"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <Separator />
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={handlePasswordCancel}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Annuler
                        </Button>
                        <Button onClick={handlePasswordSave}>
                          <Save className="w-4 h-4 mr-2" />
                          Changer le mot de passe
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Shield className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                      <h3 className="text-lg font-medium text-primary mb-2">
                        Mot de passe sécurisé
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Votre mot de passe est protégé. Cliquez sur
                        &quot;Changer le mot de passe&quot; pour le modifier.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Wrapper>
  );
}
