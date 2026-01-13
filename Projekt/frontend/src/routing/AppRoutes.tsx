import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import UserLayout from "../user/components/UserLayout";
import CollectionPage from "../collection/pages/CollectionPage";
import { useAuth } from "../context/AuthContext";
import ModifyCD from "../collection/components/ModifyCd";
import CreateCD from "../collection/components/CreateCd";

interface ModifyLocationState {
    fromCollection: boolean;
    editingCD: number;
    email: string;
}

const ProtectedModifyRoute = () => {
    const location = useLocation();
    const state = location.state as ModifyLocationState | null;

    if (!state?.fromCollection || state.editingCD == null) {
        return <Navigate to="/collection" replace />;
    }

    return <ModifyCD editingCD={state.editingCD} email={state.email} />;
};

const AppRoutes: React.FC = () => {
    const { isAuthenticated } = useAuth();

    return(
        <Routes>
            <Route 
                path="/login" 
                element={
                    isAuthenticated ? <Navigate to="/collection" replace /> : <UserLayout />
                } 
                />
            <Route
                path="/collection"
                element={
                isAuthenticated ? <CollectionPage /> : <Navigate to="/login" replace />
                }
            />

            <Route
                path="/create"
                element={
                isAuthenticated ? <CreateCD /> : <Navigate to="/login" replace />
                }
            />

            <Route 
                path="/" 
                element={
                    isAuthenticated ? <Navigate to="/collection" replace /> : <Navigate to="/login" replace />
                } 
            />

            <Route path="/modify" element={<ProtectedModifyRoute />} />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;

