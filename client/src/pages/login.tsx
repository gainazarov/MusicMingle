import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/login", { email, password }) as { token?: string; message?: string };
      if (res.token) {
        localStorage.setItem("token", res.token);
        toast({ title: "Успешный вход!" });
        navigate("/");
      } else {
        toast({ title: "Ошибка", description: res.message || "Неверные данные", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Ошибка", description: "Ошибка входа", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 bg-zinc-900 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Вход</h2>
        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Вход..." : "Войти"}</Button>
        <div className="text-sm text-center mt-2">
          Нет аккаунта? <a href="/register" className="text-blue-400 hover:underline">Зарегистрироваться</a>
        </div>
        <div className="text-sm text-center mt-4">
          <button type="button" className="text-blue-400 hover:underline" onClick={() => {
            localStorage.removeItem("token");
            toast({ title: "Выход выполнен" });
            navigate("/login");
          }}>Выйти</button>
        </div>
      </form>
    </div>
  );
}
