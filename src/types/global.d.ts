export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IUser {
        email: string;
        phone: string;
        fullName: string;
        role: string;
        avatar: string;
        id: string;
    }

    interface IFetchAccount {
        user: IUser;
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
        access_token: string;
        user: IUser;
    }
    interface IRegister {
        _id: string;
        email: string;
        fullName: string;
    }

    interface IUserTable {
        _id: string;
        email: string;
        fullName: string;
        phone: string;
        role: string;
        avatar: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface IResponseImport {
        countSuccess: number;
        countError: number;
        detail: unknown;
    }

    interface IBookTable {
        _id: string;
        thumbnail: any;
        slider: any;
        mainText: string;
        author: string;
        price: number;
        sold: number;
        quantity: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
    }

    interface ICart {
        _id: string;
        book: IBookTable;
        quantity: number;
    }

    interface IOrder {
        name: string;
        address: string;
        phone: string;
        totalPrice: number;
        type: string;
        detail: [
            {
                _id: string;
                bookName: string;
                quantity: number;
            }
        ]
        paymentRef?: string;
    }

    interface IOrderHistory {
        _id: string;
        name: string;
        type: string;
        email: string;
        phone: string;
        userId: string;
        detail: [
            {
                bookName: string;
                quantity: number;
                _id: string;
            }
        ]
        totalPrice: number;
        createdAt: Date;
        updatedAt: Date;
        paymentRef?: string;
        paymentStatus?: string;
    }
}
