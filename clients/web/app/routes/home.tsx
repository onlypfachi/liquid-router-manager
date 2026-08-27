import type { Route } from "./+types/home";
import { LoginForm } from "../components/forms/login";
import { ThemeToggle } from "../theme/theme-toggle";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Liquid Router Manager" },
    { name: "description", content: "Liquid Router Manager gives you full control over your Liquid router." },
  ];
}

export default function Home() {
  return (
    <main className="relative flex min-h-svh items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm space-y-6">
        <header className="space-y-1 text-center">
          <h1 className="text-xl font-semibold text-foreground">
            Liquid Router Manager
          </h1>
          <p className="text-sm text-muted">
            Sign in to manage your router
          </p>
        </header>

        <LoginForm />
      </div>
    </main>
  );
}
