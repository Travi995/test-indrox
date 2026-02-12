import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "../components/sui";
import { authService } from "../services";
import { useAuthStore } from "../stores";

const loginSchema = z.object({
  email: z.email("Ingresa un correo valido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginView() {
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((state) => state.setSession);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated());
  const from = (location.state as { from?: string } | null)?.from ?? "/app/tickets";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      const response = await authService.login(values);
      setSession({ user: response.user, token: response.accessToken });
      toast.success(`Bienvenido, ${response.user.name}`);
      navigate(from, { replace: true });
    } catch {
      toast.error("Usuario o contraseña incorrectas. Verifique sus credenciales.");
      setFormError("Usuario o contraseña incorrectas. Verifique sus credenciales.");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/app/tickets" replace />;
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-slate-950">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl"
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, 34, 0], y: [0, -16, 0], scale: [1, 1.08, 1] }
        }
        transition={shouldReduceMotion ? undefined : { duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl"
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, -30, 0], y: [0, 20, 0], scale: [1, 1.12, 1] }
        }
        transition={shouldReduceMotion ? undefined : { duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-brand-300/20 blur-3xl"
        animate={shouldReduceMotion ? undefined : { y: [0, -18, 0], opacity: [0.35, 0.6, 0.35] }}
        transition={shouldReduceMotion ? undefined : { duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.2),transparent_42%),radial-gradient(circle_at_80%_25%,rgba(192,38,211,0.18),transparent_40%),linear-gradient(to_bottom,rgba(15,23,42,0.4),rgba(2,6,23,0.85))]"
      />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, x: -36, y: 14, scale: 0.97 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.7, ease: "easeOut" }}
          className="hidden lg:block"
        >
          <div className="max-w-xl">
            <p className="inline-flex rounded-full border border-brand-200/40 bg-brand-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-50 shadow-lg shadow-brand-700/20">
              Plataforma empresarial
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white xl:text-5xl">
              <span className="bg-gradient-to-r from-white via-brand-100 to-accent-200 bg-clip-text text-transparent">
                Gestiona tickets y procesos ERP
              </span>{" "}
              en una sola vista.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-200">
              Un acceso seguro para equipos de soporte, operaciones y administracion.
            </p>
            <motion.div
              aria-hidden
              className="mt-8 h-1 w-56 rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-accent-400"
              animate={shouldReduceMotion ? undefined : { opacity: [0.6, 1, 0.6], x: [0, 8, 0] }}
              transition={shouldReduceMotion ? undefined : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24, scale: 0.98 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.5, ease: "easeOut", delay: 0.08 }}
          className="mx-auto w-full max-w-md"
        >
          <Card className="border-brand-200/20 bg-slate-900/45 p-6 shadow-[0_24px_60px_-18px_rgba(2,6,23,0.95)] sm:p-7">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-b from-white/15 via-brand-300/5 to-transparent"
            />
            <CardHeader className="space-y-1">
              <CardTitle className="text-slate-50">Iniciar sesión</CardTitle>
              <CardDescription className="text-slate-300">
                Usa tu correo y contraseña para continuar.
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-200">
                    Correo
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu.correo@empresa.com"
                    className="border-slate-500/70 bg-slate-950/50 text-slate-50 placeholder:text-slate-400 focus:border-brand-400 focus:ring-brand-300/30"
                    {...register("email")}
                  />
                  {errors.email ? <p className="text-xs text-red-300">{errors.email.message}</p> : null}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-slate-200">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Ingresa tu contraseña"
                      className="border-slate-500/70 bg-slate-950/50 pr-10 text-slate-50 placeholder:text-slate-400 focus:border-brand-400 focus:ring-brand-300/30"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 right-0 inline-flex w-10 items-center justify-center text-slate-300 transition hover:text-slate-100"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password ? <p className="text-xs text-red-300">{errors.password.message}</p> : null}
                </div>

                {formError ? <p className="text-xs text-red-300">{formError}</p> : null}

                <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
                  {isSubmitting ? "Ingresando..." : "Ingresar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
