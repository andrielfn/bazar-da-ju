import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  MapPinIcon,
  CreditCardIcon,
  ShoppingBag01Icon,
  ArrowRight01Icon,
  DeliveryBox01Icon,
} from "@hugeicons-pro/core-stroke-rounded";

export default function SobrePage() {
  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-50 bg-background/90 px-4 shadow-sm ring-1 ring-border/50 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-xl items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            Voltar ao catálogo
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-xl px-4 py-14">
        {/* Hero */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md">
            <HugeiconsIcon icon={ShoppingBag01Icon} size={28} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Bazar da <span className="text-primary">Jú</span>
          </h1>
          <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-muted-foreground">
            Estamos de mudança para outro estado e desapegando
            de vários itens. Alguns à venda, outros doando.
            Tudo para retirar no Campeche.
          </p>
        </div>

        {/* Info cards */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          <InfoCard
            icon={<HugeiconsIcon icon={MapPinIcon} size={20} />}
            title="Retirada"
          >
            Os itens devem ser retirados no <strong>Campeche</strong>.
            Combinamos o melhor horário pelo WhatsApp.
          </InfoCard>

          <InfoCard
            icon={<HugeiconsIcon icon={CreditCardIcon} size={20} />}
            title="Pagamento"
          >
            Pagamentos via <strong>Pix</strong> no momento da retirada.
          </InfoCard>

          <InfoCard
            icon={<HugeiconsIcon icon={DeliveryBox01Icon} size={20} />}
            title="Sem entrega"
          >
            Não fazemos entrega. Todos os itens devem ser retirados presencialmente no <strong>Campeche</strong>.
          </InfoCard>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:shadow-lg hover:brightness-110"
          >
            Ver itens do bazar
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-card p-5 shadow-sm ring-1 ring-border/50">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
      </div>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
