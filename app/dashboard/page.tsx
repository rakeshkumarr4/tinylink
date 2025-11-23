 'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from "next/image";

type LinkItem = {
    id: number;
    shortcode: string;
    longUrl: string;
    createdAt?: string;
};

export default function Dashboard() {
    const [links, setLinks] = useState<LinkItem[] | null>(null);
    const [loading, setLoading] = useState(false);

    async function fetchLinks() {
        setLoading(true);
        try {
            const res = await fetch('/api/links');
            if (!res.ok) throw new Error('Failed to fetch links');
            const data = await res.json();
            setLinks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('fetchLinks error', err);
            setLinks([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchLinks();
    }, []);
    
    async function handleDelete(id: number) {
        if (!confirm('Delete this link?')) return;
        try {
            const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });
            if (!res.ok) {
                const { error } = await res.json();
                alert(error ?? 'Failed to delete');
                return;
            }
            setLinks((prev) => prev ? prev.filter((l) => l.id !== id) : prev);
        } catch (err) {
            console.error('delete error', err);
            alert('Failed to delete');
        }
    }
    async function checkIsValid(shortcode: string) {
        const res = await fetch(`/api/check/${shortcode}`);
        const {exists} = await res.json();

        if (exists) {
            alert("Shortcode already taken!");
            return false;
        } else {
            return true;
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

            const form = event.currentTarget as HTMLFormElement;
            const formData = new FormData(form);
            const url = formData.get('url') as string;
            const shortcode = formData.get('shortcode') as string;

        const isValid = await checkIsValid(shortcode);
        if (!isValid) return;

        const res = await fetch('/api/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ longUrl: url, shortcode }),
        });
        if (!res.ok) {
            const payload = await res.json().catch(() => ({}));
            if (res.status === 409) {
                alert(payload?.error ?? 'Shortcode already exists');
                return;
            }
            alert(payload?.error ?? 'Failed to create link');
            return;
        }

        await fetchLinks();
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 font-sans dark:bg-purple-950">
            <div className="flex min-h-screen w-[75%] min-w-fit flex-col items-center justify-center py-32 px-16 bg-white dark:bg-purple-900 sm:items-center">
                <div className="w-full max-w-md flex flex-col gap-3">
                    <div className="flex w-full items-end justify-between">
                        <label className="leading-10 tracking-tight text-black dark:text-zinc-50">
                            Add a URL to shorten it
                        </label>
                        <label className="leading-10 tracking-tight text-black dark:text-zinc-50">Enter Shortcode</label>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="flex w-full items-start gap-3">
                            <input
                                type="url"
                                name="url"
                                required
                                placeholder="Enter URL here"
                                className="flex-1 rounded border border-zinc-300 bg-zinc-100 px-4 py-2 text-black placeholder-zinc-500 focus:border-foreground focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-400"
                            />

                            <div className="flex w-40 flex-col">
                                <input
                                    type="text"
                                    name="shortcode"
                                    maxLength={6}
                                    placeholder="e.g. abc123"
                                    className="w-full rounded border border-zinc-300 bg-zinc-100 px-3 py-2 text-black placeholder-zinc-500 focus:border-foreground focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-400"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                aria-label="Shorten URL"
                                className="mt-3 inline-flex items-center px-6 py-2 rounded bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400"
                            >
                                Shorten
                            </button>
                        </div>
                    </form>
                </div>
                <div className="w-full max-w-md flex flex-col gap-4">
                    <div className="flex w-full items-center justify-between">
                        <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                            Your URLs
                        </h1>
                        <Link href="/dashboard/stats">
                            <button className="text-sm px-3 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-black">Show statistics</button>
                        </Link>
                    </div>

                    {loading && <p className="text-sm text-zinc-500">Loading...</p>}

                    {!loading && links && links.length === 0 && (
                        <p className="text-sm text-zinc-500">No links yet.</p>
                    )}

                    <ul>
                        {links?.map((link) => (
                            <li key={link.id} className="flex items-center justify-between rounded border border-zinc-300 bg-zinc-100 px-4 py-2 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
                                <div className="flex-1 truncate">
                                    <a href={link.longUrl} target="_blank" rel="noreferrer" className="truncate text-sm">
                                        {link.longUrl}
                                    </a>
                                    <div className="text-xs text-zinc-500">
                                        <a href={`/${link.shortcode}`} target="_blank" rel="noreferrer" className="text-xs text-zinc-500">
                                            {`tinyurl/${link.shortcode}`}
                                        </a>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(link.id)} className="ml-4 text-red-500 cursor-pointer" aria-label={`Delete ${link.shortcode}`}>
                                    <Image src="/delete-icon.svg" alt="Delete" width={16} height={16} />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}