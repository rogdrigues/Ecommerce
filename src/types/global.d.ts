export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IUser {
        user: {
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
            id: string;
        }
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        results: T[]
    }
    interface ILogin {
        accessToken: string;
        user: IUser;
    }
    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }


}
