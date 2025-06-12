"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, X } from "lucide-react";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";

export default function HeroSection() {
  const [menuState, setMenuState] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <header>
        <nav
          data-state={menuState && "active"}
          className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent"
        >
          <div className="m-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full justify-between lg:w-auto">
                <a href="#" className="flex items-center">
                  <IconInnerShadowTop className="!size-5" />
                  <span className="text-base font-semibold">Trade Manage (MM)</span>
                </a>

                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState ? "Fermer le menu" : "Ouvrir le menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                  <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>
              </div>

              <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                  {isLoaded &&
                    (isSignedIn ? (
                      <div className="flex items-center gap-2">
                        <UserButton />
                        <span>{user.fullName ?? user.firstName ?? "Utilisateur"}</span>
                      </div>
                    ) : (
                      <>
                        <Button asChild variant="outline" size="sm">
                          <Link href="/sign-in">
                            <span>Se connecter</span>
                          </Link>
                        </Button>
                        <Button asChild size="sm">
                          <Link href="/sign-up">
                            <span>S&apos;inscrire</span>
                          </Link>
                        </Button>
                      </>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div
          aria-hidden
          className="z-2 absolute inset-0 isolate hidden opacity-50 contain-strict lg:block"
        >
          {/* Arrière-plan décoratif */}
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>

        <section className="overflow-hidden bg-white dark:bg-transparent">
      <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-24">
        <motion.div
          className="relative z-10 mx-auto max-w-2xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-balance text-4xl font-semibold md:text-5xl lg:text-6xl"
          >
            Gérez votre stock et vos finances en temps réel
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mx-auto my-8 max-w-2xl text-xl"
          >
            Une solution complète pour suivre vos produits, contrôler vos stocks et gérer vos finances facilement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <Button asChild size="lg">
              <Link href="/dashboard">
                <span className="btn-label flex items-center gap-2">
                  Commencer <ArrowRight />
                </span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>

        <section className="bg-background relative z-10 py-16">
          <div className="m-auto max-w-5xl px-6">
            <h2 className="text-center text-lg font-medium">
              Des entreprises qui nous font confiance
            </h2>
            <div className="mx-auto mt-20 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
              {/* Logos des clients ou partenaires */}
              <img
                className="h-5 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/nvidia.svg" 
                alt="Nvidia Logo"
                height="20"
                width="auto"
              />
              <img
                className="h-4 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/column.svg" 
                alt="Column Logo"
                height="16"
                width="auto"
              />
              <img
                className="h-4 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/github.svg" 
                alt="GitHub Logo"
                height="16"
                width="auto"
              />
              <img
                className="h-5 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/nike.svg" 
                alt="Nike Logo"
                height="20"
                width="auto"
              />
              <img
                className="h-4 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/laravel.svg" 
                alt="Laravel Logo"
                height="16"
                width="auto"
              />
              <img
                className="h-7 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/lilly.svg" 
                alt="Lilly Logo"
                height="28"
                width="auto"
              />
              <img
                className="h-5 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg" 
                alt="Lemon Squeezy Logo"
                height="20"
                width="auto"
              />
              <img
                className="h-6 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/openai.svg" 
                alt="OpenAI Logo"
                height="24"
                width="auto"
              />
              <img
                className="h-4 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/tailwindcss.svg" 
                alt="Tailwind CSS Logo"
                height="16"
                width="auto"
              />
              <img
                className="h-5 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/vercel.svg" 
                alt="Vercel Logo"
                height="20"
                width="auto"
              />
              <img
                className="h-5 w-fit dark:invert"
                src="https://html.tailus.io/blocks/customers/zapier.svg" 
                alt="Zapier Logo"
                height="20"
                width="auto"
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}