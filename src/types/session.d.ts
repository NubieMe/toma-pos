export type Session = {
    id: string;
    username: string;
    role: {
        id?: string;
        name?: string;
    };
    profile: {
        picture: string | null;
    }
}