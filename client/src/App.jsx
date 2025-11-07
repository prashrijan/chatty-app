import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import Spinner from "./components/Spinner";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

function App() {
    const { authUser, checkAuth, isAuthChecking } = useAuthStore();
    const { theme } = useThemeStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isAuthChecking && !authUser) {
        return <Spinner />;
    }
    console.log(authUser);

    return (
        <div data-theme={theme}>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={
                        authUser ? <HomePage /> : <Navigate to="/signin" />
                    }
                />
                <Route
                    path="/signup"
                    element={authUser ? <Navigate to="/" /> : <SignUpPage />}
                />
                <Route
                    path="/signin"
                    element={authUser ? <Navigate to="/" /> : <SignInPage />}
                />
                <Route
                    path="/profile"
                    element={
                        authUser ? <ProfilePage /> : <Navigate to="/signin" />
                    }
                />
                <Route path="/settings" element={<SettingsPage />} />
            </Routes>

            <Toaster position="top-center" />
        </div>
    );
}

export default App;
