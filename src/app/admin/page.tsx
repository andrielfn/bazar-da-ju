"use client";

import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockPasswordIcon, Loading01Icon, ShoppingBag01Icon } from "@hugeicons-pro/core-stroke-rounded";
import { login } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-accent/5" />

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md">
            <HugeiconsIcon icon={ShoppingBag01Icon} size={28} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Bazar da Ju
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Area administrativa
          </p>
        </div>

        <div className="rounded-3xl bg-card p-8 shadow-lg ring-1 ring-border/50">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <HugeiconsIcon icon={LockPasswordIcon} size={16} className="text-muted-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">Entrar na conta</span>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Digite a senha"
                required
                autoFocus
                className="h-11 rounded-xl"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full cursor-pointer rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm transition-all hover:shadow-md hover:brightness-110"
            >
              {loading ? (
                <>
                  <HugeiconsIcon icon={Loading01Icon} size={16} className="mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-xs font-medium text-muted-foreground/40">
          Acesso restrito ao administrador
        </p>
      </div>
    </div>
  );
}
