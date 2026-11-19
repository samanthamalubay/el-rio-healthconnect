import Link from "next/link";

export const instant = false;

export default function UnauthorizedPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
            <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900">
                    Access Denied
                </h1>

                <p className="mt-4 text-slate-600">
                    You do not have permission to access this page.
                    Please contact your administrator if you believe
                    this is an error.
                </p>

                <Link
                    href="/patients"
                    className="mt-6 inline-block rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
                >
                    Back to Patient Search
                </Link>
            </div>
        </main>
    );
}
