// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios from "axios";

declare module "axios" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface AxiosResponse<T = unknown> extends Promise<T> { }
}