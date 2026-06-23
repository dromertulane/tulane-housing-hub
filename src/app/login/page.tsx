import AuthForm from "./auth-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <section>
      <h1 className="text-3xl font-semibold tracking-tight">Log in or sign up</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Sign up is open to Tulane students with an @tulane.edu email address.
      </p>
      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      )}
      <div className="mt-8">
        <AuthForm />
      </div>
    </section>
  );
}
