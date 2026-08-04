import { goBack } from "../../auth/actions";

export default function Skippage (){
    return(
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="flex flex-col items-center bg-gray-900 rounded-lg px-8 py-6 w-96">
                <div className="flex items-center justify-between w-full mb-4">
                    <div className="text-xl font-semibold text-white">
                        Insert Repo Link
                    </div>
                    <form action={goBack}>
                        <button
                            type="submit"
                            className="text-sm text-gray-400 hover:text-gray-200 transition-colors duration-300"
                        >
                            Go back
                        </button>
                    </form>
                </div>
                <input
                    placeholder="https://github.com/username/repo"
                    className="bg-gray-50 w-full h-8 text-gray-900 px-2 rounded-md"
                />
            </div>
        </div>
    );
}