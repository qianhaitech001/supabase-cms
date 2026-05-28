import { loginAction } from "../auth-actions";

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;

  return (
    <main className="payload-login">
      <section className="payload-login-card">
        <p className="payload-eyebrow">Admin</p>
        <h1>Welcome to your dashboard!</h1>
        <p>This is where site admins log in to manage posts, products, inquiries, and migrations.</p>
        <form action={loginAction} className="payload-form">
          <div className="payload-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required />
          </div>
          <div className="payload-field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required />
          </div>
          {error && <p style={{ color: "var(--admin-danger)" }}>{error}</p>}
          <button className="payload-button" type="submit">
            Log in
          </button>
        </form>
      </section>
    </main>
  );
}
