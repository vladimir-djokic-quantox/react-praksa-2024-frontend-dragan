import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
            <Footer />
        </div>
    );
};

export default Layout;
