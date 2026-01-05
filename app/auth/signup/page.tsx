"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import styles from "../auth.module.css";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const { signUp } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        const { error } = await signUp(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
        }
    };

    if (success) {
        return (
            <div className={styles.authPage}>
                <div className={styles.authCard}>
                    <h1 className={styles.title}>Check Your Email</h1>
                    <p className={styles.subtitle}>
                        We&apos;ve sent a confirmation link to <strong>{email}</strong>
                    </p>
                    <p className={styles.infoText}>
                        Click the link in the email to activate your account, then come back to sign in.
                    </p>
                    <Link href="/auth/login" className={styles.submitBtn}>
                        Back to Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.authPage}>
            <div className={styles.authCard}>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Start tracking your focus sessions</p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            className={styles.input}
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className={styles.submitBtn}
                    >
                        {loading ? "Creating account..." : "Create Account"}
                    </button>
                </form>

                <p className={styles.switchText}>
                    Already have an account?{" "}
                    <Link href="/auth/login" className={styles.link}>
                        Sign in
                    </Link>
                </p>

                <div className={styles.divider}>
                    <span>or</span>
                </div>

                <Link href="/timer" className={styles.guestLink}>
                    Continue as guest
                </Link>
            </div>
        </div>
    );
}
