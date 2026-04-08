export type User = {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    phone_number: string;
    email: string;
    create_date: string; // ISO timestamp
    sex: string;
    birthdate: string; // ISO date
    is_active: boolean;
    picture_id: number | null;
    role: string;
  };
  
export type LoginRequest = {
    username: string;
    password: string;
}

export type LoginResponse = {
    username: UserInfo;
    role: string;
    expiryTime: number;
    access_token: string;
}

export type RegisterRequest = {
    first_name: string;
    last_name: string;
    username: string;
    password: string;
    phone_number?: string;
    email: string;
    sex: string;
    birthdate?: string;
}

export type UserInfo = {
    userId: number;
    username: string;
    role?: string;
  };

  