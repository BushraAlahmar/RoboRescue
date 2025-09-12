export const routeName = {
    home: "/",
    signIn: "/sign-in",
    signUp: "/sign-up",
    learn: "/learn",
    challenges: "/challenges",
    community: "/community",
    about: "/about",
} as const;

export type RoutePath = (typeof routeName)[keyof typeof routeName];
