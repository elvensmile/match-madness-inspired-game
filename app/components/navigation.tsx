import {Link} from "@remix-run/react";

const Navigation = () => (
    <header className="bg-blue-600 p-4 shadow-md flex justify-between items-center text-white">
        <div className="text-2xl font-bold">Language Learning</div>
        <nav>
            <ul className="flex space-x-4">
                <li>
                    <Link to="/" className="hover:text-blue-300 transition-colors px-3 py-2">
                        Home
                    </Link>
                </li>
                <li>
                    <Link to="/manage" className="hover:text-blue-300 transition-colors px-3 py-2">
                        Manage Words
                    </Link>
                </li>
            </ul>
        </nav>
    </header>
);

export default Navigation;
