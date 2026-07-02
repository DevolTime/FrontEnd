export interface User{
    
            role: string,
            _id: string,
            name: string,
            lastname: string,
            password: string,
            email: string,
            status: boolean,
            avatar: string ,
            createdAt: string,
            updatedAt: string
}

export interface ResponseUsers{
    msg: string,
    data:[User]
}

