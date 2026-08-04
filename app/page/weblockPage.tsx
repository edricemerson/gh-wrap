"use client";

import { signIn } from "next-auth/react";
import { skipLogin } from "../auth/actions";

export default function Weblockpage() {
    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="flex flex-col items-center animate-fade-in-up">
                    <div>
                        <svg viewBox="0 0 24 24"
                            className="h-20 w-20 fill-current mb-5"
                            aria-label="GitHub logo"
                        >
                            <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 
                                11.385 0.6 0.113 0.82-0.258 0.82-0.577 0-0.285-0.01-1.04-0.015-2.04-3.338
                                0.724-4.042-1.61-4.042-1.61-0.546-1.385-1.333-1.755-1.333-1.755-1.089-0.744 
                                0.084-0.729 0.084-0.729 1.205 0.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 
                                1.305 3.492 0.998 0.108-0.776 0.418-1.305 0.762-1.605-2.665-0.3-5.466-1.332-5.466-5.93
                                0-1.31 0.465-2.38 1.235-3.22-0.135-0.303-0.54-1.523 0.105-3.176 0 0 1.005-0.322 3.3 1.23 
                                0.96-0.267 1.98-0.399 3-0.405 1.02 0.006 2.04 0.138 3 0.405 2.28-1.552 3.285-1.23 3.285-1.23 
                                0.645 1.653 0.24 2.873 0.12 3.176 0.765 0.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92 
                                0.42 0.36 0.81 1.096 0.81 2.22 0 1.606-0.015 2.896-0.015 3.286 0 0.315 0.21 0.69 0.825 0.57 
                                4.765-1.588 8.2-6.084 8.2-11.385 0-6.627-5.373-12-12-12z" 
                            />

                        </svg>
                    </div>
                    <div className="text-4xl font-bold mb-5">
                        Github login page
                    </div>

                    <button onClick={() => signIn("github", { callbackUrl: "/" })}
                        className="flex items-center gap-2 w-80 h-9 justify-center
                        rounded-md bg-gray-900 text-white font-semibold hover:bg-zinc-800
                        transition-colors duration-300"
                    >
                        Sign in with GitHub
                    </button>

                    <button
                        onClick={() => skipLogin()}
                        className="mt-4 text-gray-400 border-b-2 border-transparent hover:border-current hover:text-gray-200 transition-colors duration-300"
                    >
                        Skip
                    </button>
                </div>
            </div>
        </>
    );
}
