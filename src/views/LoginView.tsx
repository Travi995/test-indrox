import { zodResolver } from "@hookform/resolvers/zod";
import { motion, useReducedMotion } from "framer-motion";
import { Apple, Chrome, Eye, EyeOff, KeyRound, Mail, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
} from "../components/sui";
import { Input } from "../components/ui/input";
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

  const springTransition = { type: "spring" as const, stiffness: 55, damping: 18, mass: 1.1 };
  const springSoft = { type: "spring" as const, stiffness: 45, damping: 16, mass: 1.2 };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.14, delayChildren: 0.28 },
    },
  };
  const staggerItem = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.section
      className="relative min-h-screen overflow-hidden bg-slate-950"
      initial={shouldReduceMotion ? undefined : { opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1 }}
      transition={shouldReduceMotion ? undefined : { duration: 0.55 }}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl"
        initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.6 }}
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: 1, scale: 1, x: [0, 34, 0], y: [0, -16, 0] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : { opacity: { duration: 1.4 }, scale: { duration: 1.4 }, x: { duration: 14, repeat: Infinity, ease: "easeInOut" }, y: { duration: 14, repeat: Infinity, ease: "easeInOut" } }
        }
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/4 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl"
        initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.5 }}
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: 1, scale: 1, x: [0, -30, 0], y: [0, 20, 0] }
        }
        transition={
          shouldReduceMotion
            ? undefined
            : { opacity: { duration: 1.5, delay: 0.35 }, scale: { duration: 1.5, delay: 0.35 }, x: { duration: 16, repeat: Infinity, ease: "easeInOut" }, y: { duration: 16, repeat: Infinity, ease: "easeInOut" } }
        }
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-brand-300/20 blur-3xl"
        initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.6 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: [0, -18, 0] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { opacity: { duration: 1.35, delay: 0.5 }, scale: { duration: 1.35, delay: 0.5 }, y: { duration: 10, repeat: Infinity, ease: "easeInOut" } }
        }
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.2),transparent_42%),radial-gradient(circle_at_80%_25%,rgba(192,38,211,0.18),transparent_40%),linear-gradient(to_bottom,rgba(15,23,42,0.4),rgba(2,6,23,0.85))]"
      />

      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, x: -120, scale: 0.88, filter: "blur(8px)" }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
          transition={shouldReduceMotion ? undefined : { ...springTransition, delay: 0.35 }}
          className="hidden lg:block"
        >
          <motion.div
            className="max-w-xl"
            variants={staggerContainer}
            initial="hidden"
            animate={shouldReduceMotion ? undefined : "visible"}
          >
            <motion.p
              variants={staggerItem}
              className="inline-flex rounded-full border border-brand-200/40 bg-brand-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-50 shadow-lg shadow-brand-700/20"
            >
              Plataforma empresarial
            </motion.p>
            <motion.h1
              variants={staggerItem}
              className="mt-6 text-4xl font-semibold leading-tight text-white xl:text-5xl"
            >
              <span className="bg-gradient-to-r from-white via-brand-100 to-accent-200 bg-clip-text text-transparent">
                Gestiona tickets y procesos ERP
              </span>{" "}
              en una sola vista.
            </motion.h1>
            <motion.p
              variants={staggerItem}
              className="mt-5 max-w-lg text-base leading-relaxed text-slate-200"
            >
              Un acceso seguro para equipos de soporte, operaciones y administracion.
            </motion.p>
            <motion.div
              aria-hidden
              variants={staggerItem}
              className="mt-8 h-1 w-56 rounded-full bg-gradient-to-r from-brand-400 via-brand-500 to-accent-400"
              animate={shouldReduceMotion ? undefined : { opacity: [0.6, 1, 0.6], x: [0, 8, 0] }}
              transition={shouldReduceMotion ? undefined : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 72, scale: 0.88, filter: "blur(6px)" }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={shouldReduceMotion ? undefined : { ...springSoft, delay: 0.55 }}
          className="mx-auto w-full max-w-md"
        >
          <Card className="border-brand-200/20 bg-slate-900/45 p-6 shadow-[0_24px_60px_-18px_rgba(2,6,23,0.95)] sm:p-7">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 rounded-sm bg-gradient-to-b from-white/15 via-brand-300/5 to-transparent"
            />
            <CardHeader className="space-y-1">
              <CardTitle className="text-center text-slate-50">Iniciar sesión</CardTitle>
            </CardHeader>

            <CardContent className="pt-4">
              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                variants={staggerContainer}
                initial="hidden"
                animate={shouldReduceMotion ? undefined : "visible"}
              >
                <motion.div className="space-y-1.5" variants={staggerItem}>
                  <Label htmlFor="email" className="text-slate-200">
                    Correo
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="tu.correo@empresa.com"
                    className="h-11 w-full rounded-sm border-slate-500/70 bg-slate-950/50 text-slate-50 placeholder:text-slate-400 focus:border-brand-400 focus:ring-brand-300/30"
                    {...register("email")}
                  />
                  {errors.email ? <p className="text-xs text-red-300">{errors.email.message}</p> : null}
                </motion.div>

                <motion.div className="space-y-1.5" variants={staggerItem}>
                  <Label htmlFor="password" className="text-slate-200">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Ingresa tu contraseña"
                      className="h-11 w-full rounded-sm border-slate-500/70 bg-slate-950/50 pr-10 text-slate-50 placeholder:text-slate-400 focus:border-brand-400 focus:ring-brand-300/30"
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
                </motion.div>

                {formError ? <p className="text-xs text-red-300">{formError}</p> : null}

                <motion.div className="flex justify-end" variants={staggerItem}>
                  <Button
                    type="button"
                    disabled
                    variant="secondary"
                    size="default"
                    className="gap-1.5 border-0 bg-transparent text-slate-400 shadow-none"
                  >
                    <KeyRound size={14} />
                    ¿Ha olvidado su contraseña?
                  </Button>
                </motion.div>

                <motion.div variants={staggerItem}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  size="lg"
                  className="w-full rounded-sm bg-brand-700 text-white hover:bg-brand-800"
                >
                  {isSubmitting ? "Ingresando..." : "Ingresar"}
                </Button>
                </motion.div>

                <motion.div className="flex justify-center" variants={staggerItem}>
                  <Button
                    type="button"
                    disabled
                    variant="secondary"
                    size="default"
                    className="gap-1.5 border-0 bg-transparent text-slate-400 shadow-none"
                  >
                    <UserPlus size={14} />
                    ¿No tiene cuenta? Regístrese aquí
                  </Button>
                </motion.div>

                <motion.div className="flex items-center gap-3 py-2" variants={staggerItem}>
                  <span className="flex-1 border-t border-slate-600" aria-hidden />
                  <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    o continuar con
                  </span>
                  <span className="flex-1 border-t border-slate-600" aria-hidden />
                </motion.div>

                <motion.div className="grid gap-2 sm:grid-cols-3" variants={staggerItem}>
                  <Button
                    type="button"
                    disabled
                    variant="secondary"
                    size="lg"
                    className="w-full gap-2 text-slate-400"
                  >
                    <Chrome size={18} />
                    Google
                  </Button>
                  <Button
                    type="button"
                    disabled
                    variant="secondary"
                    size="lg"
                    className="w-full gap-2 text-slate-400"
                  >
                    <Mail size={18} />
                    Correo
                  </Button>
                  <Button
                    type="button"
                    disabled
                    variant="secondary"
                    size="lg"
                    className="w-full gap-2 text-slate-400"
                  >
                    <Apple size={18} />
                    Apple
                  </Button>
                </motion.div>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.section>
  );
}
