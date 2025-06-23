"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Schéma de validation avec Zod
const signUpSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
  passwordConfirmation: z.string().min(6, "La confirmation du mot de passe est requise"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ["passwordConfirmation"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFormData, string>>>({});
  const router = useRouter();

  const handleSubmit = async () => {
    const result = signUpSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      passwordConfirmation,
    });

    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors({
        firstName: fieldErrors.firstName?._errors[0],
        lastName: fieldErrors.lastName?._errors[0],
        email: fieldErrors.email?._errors[0],
        password: fieldErrors.password?._errors[0],
        passwordConfirmation: fieldErrors.passwordConfirmation?._errors[0],
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await signUp.email({
        email,
        password,
        name: `${firstName} ${lastName}`,
        callbackURL: "/dashboard",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Inscription réussie !");
            router.push("/dashboard");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Échec de l'inscription.");
          },
          onRequest: () => setLoading(true),
          onResponse: () => setLoading(false),
        },
      });
    } catch {
      toast.error("Une erreur inattendue s'est produite.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="z-50 rounded-md rounded-t-none max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">S’inscrire</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Entrez vos informations pour créer un compte
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4">
            {/* Prénom & Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first-name">Prénom</Label>
                <Input
                  id="first-name"
                  placeholder="Max"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={cn(errors.firstName && "border-red-500")}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Nom</Label>
                <Input
                  id="last-name"
                  placeholder="Robinson"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={cn(errors.lastName && "border-red-500")}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(errors.email && "border-red-500")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(errors.password && "border-red-500")}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div className="grid gap-2">
              <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="••••••"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className={cn(errors.passwordConfirmation && "border-red-500")}
              />
              {errors.passwordConfirmation && (
                <p className="text-sm text-red-500">{errors.passwordConfirmation}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="button"
              className="w-full mt-2"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                "Créer un compte"
              )}
            </Button>
          </div>
        </CardContent>

        <CardFooter>
          <div className="flex justify-center w-full border-t py-4">
            <p className="text-center text-sm text-neutral-500">
              Vous avez déjà un compte ?{" "}
              <Link href="/auth/sign-in" className="text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}