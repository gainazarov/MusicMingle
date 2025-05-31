import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/register", { email, password, firstName, lastName }) as { success: boolean; message?: string };
      if (res.success) {
        toast({ title: "Регистрация успешна!" });
        navigate("/login");
      } else {
        toast({ title: "Ошибка", description: res?.message || "Не удалось зарегистрироваться", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Ошибка", description: "Ошибка регистрации", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 bg-zinc-900 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Регистрация</h2>
        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required />
        <Input type="text" placeholder="Имя" value={firstName} onChange={e => setFirstName(e.target.value)} required />
        <Input type="text" placeholder="Фамилия" value={lastName} onChange={e => setLastName(e.target.value)} required />
        <Button type="submit" className="w-full" disabled={loading}>{loading ? "Регистрация..." : "Зарегистрироваться"}</Button>
        <div className="text-sm text-center mt-2">
          Уже есть аккаунт? <a href="/login" className="text-blue-400 hover:underline">Войти</a>
        </div>
      </form>
    </div>
  );
}
