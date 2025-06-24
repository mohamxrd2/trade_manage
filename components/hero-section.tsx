"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogOutIcon, Menu, X } from "lucide-react";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { signOutAction } from "@/app/actions";

type User = {
  id: string;
  name: string;
  emailVerified: boolean;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
};

type HeroSectionProps = {
  user: User;
};

export default function HeroSection({ user }: HeroSectionProps) {
  const [menuState, setMenuState] = useState(false);

  const logos = [
    {
      name: "Nvidia",
      src: "https://html.tailus.io/blocks/customers/nvidia.svg",
      height: 20,
    },
    {
      name: "Column",
      src: "https://html.tailus.io/blocks/customers/column.svg",
      height: 16,
    },
    {
      name: "GitHub",
      src: "https://html.tailus.io/blocks/customers/github.svg",
      height: 16,
    },
    {
      name: "Nike",
      src: "https://html.tailus.io/blocks/customers/nike.svg",
      height: 20,
    },
    {
      name: "Laravel",
      src: "https://html.tailus.io/blocks/customers/laravel.svg",
      height: 16,
    },
    {
      name: "Lilly",
      src: "https://html.tailus.io/blocks/customers/lilly.svg",
      height: 28,
    },
    {
      name: "Lemon Squeezy",
      src: "https://html.tailus.io/blocks/customers/lemonsqueezy.svg",
      height: 20,
    },
    {
      name: "OpenAI",
      src: "https://html.tailus.io/blocks/customers/openai.svg",
      height: 24,
    },
    {
      name: "Tailwind CSS",
      src: "https://html.tailus.io/blocks/customers/tailwindcss.svg",
      height: 16,
    },
    {
      name: "Vercel",
      src: "https://html.tailus.io/blocks/customers/vercel.svg",
      height: 20,
    },
    {
      name: "Zapier",
      src: "https://html.tailus.io/blocks/customers/zapier.svg",
      height: 20,
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const logoContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const logoItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <>
      <header>
        <nav
          data-state={menuState ? "active" : ""}
          className="fixed z-30 w-full border-b bg-white/90 backdrop-blur-md dark:bg-zinc-950/70 lg:dark:bg-transparent"
        >
          <div className="mx-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-4 py-3 lg:gap-0 lg:py-4">
              <a
                href="#"
                className="flex items-center gap-2 text-xl font-semibold"
              >
                <IconInnerShadowTop className="size-5" />
                Trade Manage (MM)
              </a>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Fermer le menu" : "Ouvrir le menu"}
                className="relative z-20 block cursor-pointer p-2 lg:hidden"
              >
                <Menu
                  className={`absolute m-auto size-6 transition-all ${menuState ? "scale-0 opacity-0" : "scale-100 opacity-100"}`}
                />
                <X
                  className={`absolute m-auto size-6 transition-all ${menuState ? "scale-100 opacity-100" : "scale-0 opacity-0"}`}
                />
              </button>

              <div
                className={`w-full overflow-hidden rounded-2xl border  shadow-lg transition-all duration-300 lg:static lg:block lg:w-auto lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none ${
                  menuState ? "max-h-96 p-6" : "max-h-0 lg:max-h-fit"
                }`}
              >
                <div className="flex flex-col space-y-4 text-center lg:flex-row lg:space-x-4 lg:space-y-0 lg:text-left">
                  {user ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-3 px-3 py-1 rounded-md hover:bg-accent transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary">
                          <Avatar className="h-8 w-8 border border-border">
                            <AvatarImage
                              src={user.image ?? undefined}
                              alt={user.name || "Avatar"}
                            />
                            <AvatarFallback>
                              {user.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="hidden sm:inline-block font-medium text-sm truncate max-w-[120px]">
                            {user.name || user.email.split("@")[0]}
                          </span>
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        className="w-56 p-2 rounded-md shadow-lg bg-popover border border-border animate-in fade-in slide-in-from-top-1"
                      >
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          Connecté en tant que
                          <br />
                          <span
                            className="font-semibold text-black dark:text-white truncate block mt-1"
                            title={user.email}
                          >
                            {user.email}
                          </span>
                        </div>
                        <DropdownMenuSeparator className="my-1 h-px bg-border" />
                        <form action={signOutAction} className="w-full">
                          <button
                            type="submit"
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-red-500 hover:text-red-600 rounded-md transition-colors duration-150 hover:bg-destructive/5"
                          >
                            <LogOutIcon className="h-4 w-4 shrink-0" />
                            <span>Déconnexion</span>
                          </button>
                        </form>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <>
                      <Button
                        asChild
                        variant="outline"
                     
                      >
                        <Link href="/auth/sign-in">Se connecter</Link>
                      </Button>
                      <Button asChild >
                        <Link href="/auth/sign-up">S’inscrire</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 hidden opacity-30 lg:block"
      >
        <div className="absolute left-0 top-0 h-[320px] w-[140px] -translate-y-[35%] rotate-[-45deg] rounded-full bg-gradient-radial to-zinc-200 dark:to-zinc-800"></div>
        <div className="absolute left-0 top-0 h-[320px] w-[60px] -translate-y-[50%] translate-x-[5%] rotate-[-45deg] rounded-full bg-gradient-radial to-zinc-200 dark:to-zinc-800"></div>
      </div>

      {/* Hero Section */}
      <section className="overflow-hidden bg-white pt-28 pb-32 dark:bg-transparent sm:pt-32 md:pt-40">
        <div className="mx-auto max-w-5xl px-6">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 className="text-4xl font-semibold leading-tight md:text-5xl lg:text-6xl">
              Gérez votre stock et vos finances en temps réel
            </motion.h1>

            <motion.p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
              Une solution complète pour suivre vos produits, contrôler vos
              stocks et gérer vos finances facilement.
            </motion.p>

            <motion.div className="mt-8">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Commencer <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="bg-background relative z-10 py-16 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="text-center text-lg font-medium">
            Des entreprises qui nous font confiance
          </h2>

          <motion.div
            className="mx-auto mt-12 flex flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12"
            variants={logoContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {logos.map((logo) => (
              <motion.div key={logo.name} variants={logoItemVariants}>
                <Image
                  src={logo.src}
                  alt={`${logo.name} Logo`}
                  width={logo.height * 2}
                  height={logo.height}
                  className="h-auto w-fit dark:invert"
                  unoptimized
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
