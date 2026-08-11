import { useAuth0 } from "@auth0/auth0-react";

function AuthButtons() {
    console.log("useAuth0", useAuth0());

    const { loginWithRedirect, logout, isAuthenticated, isLoading, user, error } = useAuth0();

    if (isLoading) {
        return <p>Checking authentication...</p>;
    }

    return (
        <>
            <div>
                {error && <p>{error.message}</p>}

                {isAuthenticated ? (
                    <div>
                       
                        <p>{user?.email}</p>
                        <button
                            onClick={() =>
                                logout({
                                    logoutParams: {
                                        returnTo: window.location.origin,
                                    },
                                })
                            }
                        >
                           
                        </button>
                    </div>
                ) : (
                    <div>
                        <button onClick={() => loginWithRedirect()}>Login</button>
                        <button
                            onClick={() =>
                                loginWithRedirect({
                                    authorizationParams: {
                                        screen_hint: "signup",
                                    },
                                })
                            }
                        >
                            Sign Up
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default AuthButtons;