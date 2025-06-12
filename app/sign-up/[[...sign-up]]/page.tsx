import { SignUp } from "@clerk/nextjs";
import { IconInnerShadowTop } from "@tabler/icons-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        {/* Logo personnalisé */}
        <div className="flex justify-center mb-6">
          {/* Remplace par ton logo */}
          
          <div className="flex items-center space-x-2">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Trade Manage(MM).</span>
              </div>
        </div>

        {/* Formulaire d'inscription */}
        <SignUp
          // Options visuelles
          appearance={{
            elements: {
              card: "bg-transparent border-none shadow-none",
              headerTitle: "text-2xl font-semibold text-center",
              headerSubtitle: "text-sm text-center text-gray-500 dark:text-gray-400",
              formButtonPrimary:
                "bg-blue-600 hover:bg-blue-700 text-white rounded-lg",
              formFieldInput:
                "border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500",
              footerActionText: "text-sm text-center text-gray-600 dark:text-gray-400",
              footerActionLink:
                "text-blue-600 hover:underline dark:text-blue-400",
            },
            layout: {
              logoPlacement: "none", // On utilise notre propre logo
            },
          }}
          // Redirection après inscription réussie
          afterSignUpUrl="/dashboard"
          signInFallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}