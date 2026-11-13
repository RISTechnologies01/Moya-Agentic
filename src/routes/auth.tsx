import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import moyaHero from "@/assets/moya-africa-network.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [
    { title: "Sign in or join MOYA SmartRoute" },
    { name: "description", content: "Sign in to compare cross-border money transfer routes with MOYA SmartRoute." },
    { property: "og:title", content: "Sign in or join MOYA SmartRoute" },
    { property: "og:description", content: "A smarter way to move money across borders." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) void navigate({ to: "/dashboard", replace: true });
    });
    return () => { active = false; };
  }, [navigate]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: window.location.origin, data: { display_name: name.trim() } },
      });
      setBusy(false);
      if (error) { toast.error(error.message); return; }
      if (!data.session) { setConfirmation(true); return; }
      await navigate({ to: "/dashboard" });
      return;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    if (data.user) await navigate({ to: "/dashboard" });
  };

  const socialLogin = async (provider: "google" | "lovable") => {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    setBusy(false);
    if (result.error) toast.error(result.error.message);
    else if (!result.redirected) await navigate({ to: "/dashboard" });
  };

  return <main className="grid min-h-screen bg-background lg:grid-cols-[1fr_0.92fr]">
    <section className="relative hidden min-h-screen overflow-hidden bg-primary lg:block">
      <img src={moyaHero} alt="A luminous network map of Africa" width={1536} height={1024} className="absolute inset-0 size-full object-cover" />
      <div className="absolute inset-0 bg-foreground/50" />
      <div className="relative flex min-h-screen flex-col justify-between p-12 xl:p-16"><Link to="/" aria-label="MOYA home"><span className="text-xl font-semibold tracking-wide text-background">MOYA<span className="ml-2 text-xs font-medium tracking-normal text-background/65">SMARTRoute</span></span></Link><div className="max-w-xl pb-10"><p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-background/70">MONEY WITHOUT BORDERS</p><h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-background xl:text-6xl">A clearer way to care, across distance.</h1><p className="mt-6 max-w-md text-base leading-7 text-background/75">Compare routes. See every fee. Choose how your money moves.</p><div className="mt-10 flex flex-wrap gap-3">{["Transparent costs", "Purposeful transfers", "Built for Africa"].map((item) => <span key={item} className="border border-background/25 bg-background/10 px-3 py-2 text-xs text-background">{item}</span>)}</div></div><p className="text-xs text-background/55">MOYA SmartRoute · Demonstration environment</p></div>
    </section>
    <section className="flex min-h-screen flex-col px-6 py-7 sm:px-12 lg:px-14 xl:px-20">
      <div className="flex items-center justify-between"><Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to MOYA</Link><span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><LockKeyhole className="size-3.5 text-primary" />SECURE ACCESS</span></div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12"><div className="mb-8"><div className="mb-5 grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground"><svg viewBox="0 0 32 32" className="size-7" aria-hidden="true"><path d="M7 21.5 15.8 7l9.1 14.5M7 10.5l8.8 14.5 9.1-14.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7" cy="10.5" r="2.2" fill="currentColor"/><circle cx="24.9" cy="21.5" r="2.2" fill="currentColor"/></svg></div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">YOUR MONEY, YOUR CHOICE</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">{confirmation ? "Check your inbox." : mode === "signin" ? "Welcome back." : "Join the movement."}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{confirmation ? "We've sent a confirmation link. Once your email is confirmed, sign in to continue." : mode === "signin" ? "Sign in to pick up where you left off." : "Create an account to compare routes and keep your transfers together."}</p></div>
        {confirmation ? <div className="border border-primary/20 bg-primary/5 p-5"><div className="flex gap-3"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" /><div><p className="text-sm font-medium">Confirmation email sent</p><p className="mt-1 break-all text-xs text-muted-foreground">Check {email} and follow the link before signing in.</p></div></div><Button className="mt-5 w-full" onClick={() => { setConfirmation(false); setMode("signin"); }}>Go to sign in</Button></div> : <>
          <div className="mb-6 grid grid-cols-2 border-b border-border">{(["signin", "signup"] as const).map((item) => <button key={item} type="button" onClick={() => setMode(item)} className={`border-b-2 pb-3 text-sm font-medium transition-colors ${mode === item ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>{item === "signin" ? "Sign in" : "Create account"}</button>)}</div>
          <form onSubmit={(event) => void submit(event)} className="space-y-4">{mode === "signup" && <div><Label htmlFor="display-name" className="mb-2 block text-xs">Your name</Label><Input id="display-name" autoComplete="name" required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Amara Ndlovu" /></div>}<div><Label htmlFor="email" className="mb-2 block text-xs">Email address</Label><Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></div><div><Label htmlFor="password" className="mb-2 block text-xs">Password</Label><div className="relative"><Input id="password" type={showPassword ? "text" : "password"} autoComplete={mode === "signin" ? "current-password" : "new-password"} required minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="pr-11" placeholder="At least 6 characters" /><Button type="button" variant="ghost" size="icon" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)} className="absolute right-1 top-0"><span className="sr-only">Toggle password visibility</span>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</Button></div></div><Button type="submit" disabled={busy} className="h-11 w-full">{busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}<ArrowRight className="size-4" /></Button></form>
          <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-[10px] text-muted-foreground">OR CONTINUE WITH</span><div className="h-px flex-1 bg-border" /></div>
          <div className="grid gap-3 sm:grid-cols-2"><Button type="button" variant="outline" disabled={busy} className="h-11 border-input bg-background font-medium text-foreground hover:bg-muted" onClick={() => void socialLogin("google")}><svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px]"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>Continue with Google</Button><Button type="button" variant="outline" disabled={busy} className="h-11 border-input bg-background font-medium text-foreground hover:bg-muted" onClick={() => void socialLogin("lovable")}>Continue with Lovable</Button></div>
          <p className="mt-6 flex items-start gap-2 text-[10px] leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />Your saved recipients and transfers are private to your account. MOYA's rates and payment steps are simulated for this demo.</p>
        </>}
      </div><p className="pt-5 text-center text-[10px] text-muted-foreground">By continuing, you agree to use MOYA as a demonstration experience.</p>
    </section>
  </main>;
}