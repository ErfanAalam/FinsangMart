import { AuthProvider, useAuth } from "@/Contexts/AuthContexts";
import { Stack } from "expo-router";
import React from "react";
import SplashScreen from "../components/SplashScreen";
import { UserProvider } from "../Contexts/UserContext";

function AppStack() {
    const { isLoggedIn, loading } = useAuth();
    if (loading) return <SplashScreen />;
    // console.log('isloogedIn',isLoggedIn);
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#2f2f2f',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                headerShown: false,
            }}>
            {!isLoggedIn ? [
                <Stack.Screen key="index" name="index" options={{ headerShown: false }} />,
                <Stack.Screen key="login" name="Login/login" options={{ title: "Login", headerTitleAlign: "center" }} />
            ] : [
                <Stack.Screen key="tabs" name="(tabs)" options={{ headerShown: false }} />,
                <Stack.Screen key="profile" name="(tabs)/profile" options={{ presentation: 'modal', animation: 'slide_from_bottom', headerShown: false }} />
            ]}
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <AuthProvider>
            <UserProvider>
                <AppStack />
            </UserProvider>
        </AuthProvider>
    );
}