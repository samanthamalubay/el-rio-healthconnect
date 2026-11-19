"use client";

import {useEffect, useRef, useState} from "react";
import {logout} from "@/app/actions/auth";

type ProfileMenuProps = {
    name: string;
    role: string;
};

export default function ProfileMenu({
    name,
    role,
}: ProfileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                type="button"
                aria-label="Open staff profile menu"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
            >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-800">
                    {name.charAt(0).toUpperCase()}
                </span>

                <span className="hidden text-left sm:block">
                    <span className="block text-sm font-medium text-slate-900">
                        {name}
                    </span>
                    <span className="block text-xs text-slate-500">
                        {role}
                    </span>
                </span>

                <span className="text-slate-500">⌄</span>
            </button>

            {isOpen && (
                <div
                    role="menu"
                    aria-label="Staff account"
                    className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-lg"
                >
                    <div className="border-b border-slate-100 px-3 py-3">
                        <p className="font-medium text-slate-900">
                            {name}
                        </p>
                        <p className="text-sm text-slate-500">
                            {role}
                        </p>
                    </div>

                    <form action={logout} className="mt-2">
                        <button
                            type="submit"
                            role="menuitem"
                            className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                            Sign Out
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
