"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Replace with your actual authentication logic
      // For now, just simulate a login and redirect
      console.log("Logging in with:", { username, password });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to homepage after login
      router.push("/");
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col w-full min-h-screen" style={{ backgroundColor: "#E6E6FA" }}>
      <Header />
      
      <div className="flex-grow flex items-center justify-center w-full px-4 py-12">
        <Card className="w-full max-w-md shadow-lg" style={{ backgroundColor: "white" }}>
          <CardHeader className="space-y-1" style={{ backgroundColor: "#A37CF0" }}>
            <CardTitle className="text-2xl font-bold text-center text-white">Welcome back</CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6">
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-purple-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                style={{ backgroundColor: "#A37CF0", color: "white" }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-purple-600 hover:underline">
                Create an account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <Footer />
    </main>
  );
}