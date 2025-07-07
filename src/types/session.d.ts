export type Session = {
    id: string;
    // name: string;
    username: string;
    role: {
        id?: string;
        name?: string;
    };
}