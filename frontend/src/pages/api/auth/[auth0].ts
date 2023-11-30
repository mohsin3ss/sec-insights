import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

export default handleAuth({
    login: handleLogin({
        authorizationParams: {
            audience: process.env.AUTH0_API_AUDIENCE,
            scope: 'openid',
        }
    }),
    logout: handleLogout({
        returnTo: "/",
    }),
});
