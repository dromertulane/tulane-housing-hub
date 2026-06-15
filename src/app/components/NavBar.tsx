import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Listings" },
  { href: "/reviews", label: "Reviews" },
  { href: "/sublets", label: "Sublets" },
  { href: "/login", label: "Login" },
];

export default function NavBar() {
  return (
    <nav className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4">
        <span className="font-semibold text-zinc-900 dark:text-zinc-50">
          Tulane Housing Hub
        </span>
        <ul className="flex gap-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition-colors hover:text-zinc-900 dark:hover:text-zinc-50"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
