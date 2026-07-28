export interface User {
    _id: String,
    name: String,
    lastname: string,
    password: string,
    email: string,
    status: boolean,
    avatar: string,
    role: string,
    createdAt: string,
    updatedAt: string
}

export interface ResponseUsers {
    msg: string,
    data: [User]
}