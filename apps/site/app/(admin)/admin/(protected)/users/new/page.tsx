import Link from "next/link";
import { createUserAction } from "@/app/(admin)/admin/actions";
import { requireAdminRole } from "@/lib/auth";
import { isSupabaseServiceRoleConfigured } from "@/lib/supabase";
import type { UserRole } from "@global-trade/core";

const roles: UserRole[] = ["owner", "admin", "editor", "sales", "viewer"];

export default async function NewUserPage() {
  const session = await requireAdminRole(["owner", "admin"]);
  const hasServiceRole = isSupabaseServiceRoleConfigured();
  const roleOptions = session.profile.role === "owner" ? roles : roles.filter((role) => role !== "owner");

  return (
    <div>
      <div className="payload-page-header">
        <div>
          <h1>New User</h1>
          <p>Create an email/password admin account and assign its permission level.</p>
        </div>
        <Link className="payload-button payload-button--ghost" href="/admin/users">
          Back to Users
        </Link>
      </div>

      {!hasServiceRole && (
        <div className="payload-alert payload-alert--warning">
          <strong>Service role key missing.</strong>
          <span>Set SUPABASE_SERVICE_ROLE_KEY on the server before creating users.</span>
        </div>
      )}

      <form action={createUserAction} className="payload-form">
        <section className="payload-form-section">
          <h2>Account</h2>
          <div className="payload-field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" required type="email" />
          </div>
          <div className="payload-field">
            <label htmlFor="fullName">Full name</label>
            <input id="fullName" name="fullName" />
          </div>
          <div className="payload-field">
            <label htmlFor="password">Password</label>
            <input id="password" minLength={8} name="password" required type="password" />
          </div>
          <div className="payload-field">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" defaultValue="viewer">
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </section>
        <button className="payload-button" disabled={!hasServiceRole} type="submit">
          Create user
        </button>
      </form>
    </div>
  );
}
