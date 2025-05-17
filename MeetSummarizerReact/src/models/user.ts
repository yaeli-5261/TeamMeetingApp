export interface User {
    id?: string;
    userName: string;
    email?: string;
    password: string;
    role?: string;
    token?: string;
    teamId?: number;
    meetingId?: number;
}