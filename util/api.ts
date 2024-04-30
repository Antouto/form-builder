import fetch from "node-fetch";
import { Replacer } from "./template";
import { FormAndOpenFormTypeBuilder } from "./types";

export interface CustomFormData {
    type: "array" | "string";
    /**
     * The property name of the json.
     */
    dataName: string;
    /**
     * The property name of the object in dataName.
     */
    dataSelection: string;
}

export interface CreateFormData {
    data: FormAndOpenFormTypeBuilder;
    name: string;
    description: string;
    approved: false,
    official: boolean;
    options: CustomFormData[];
    downloadOnly: boolean;
    highlighted?: boolean;
    replacers: () => Replacer[];
}

export interface FormDataResponse extends CreateFormData {
    id: string;
}

export interface ResponseBase {
    hasError: () => this is ResponseError;
}

export interface ResponseError extends ResponseBase {
    message: string;
}

export interface ResponseData<T> extends ResponseBase {
    data: T;
}

export class Api {
    public API_URI = process.env.API_URI;

    constructor(uri: string) {
        this.API_URI = uri;
    }

    private async makeRequest<T = any>(path: string, requestBody: object, method: "GET" | "PUT" = "GET"): Promise<ResponseError | ResponseData<T>> {
        let urlParams = "";
        Object.entries(requestBody).forEach(([key, value]) => {
            urlParams += `${urlParams == "" ? "?" : "&"}${encodeURIComponent(key)}=${encodeURI(value)} `
        });

        let err = null;
        const fetched = await fetch(`${this.API_URI}${path}${urlParams} `, {
            method: method
        }).catch((e) => err = e.message) as Response;

        if (fetched.status != 200 || err != null) return {
            hasError: () => true,
            message: err ?? fetched.statusText
        };

        return {
            hasError: () => false,
            data: await fetched.json() as any
        };
    }

    public getForm(id: string): Promise<ResponseData<FormDataResponse> | ResponseError> {
        return this.makeRequest("/app", {
            id
        }, "GET");
    }

    public getForms(): Promise<ResponseData<FormDataResponse[]> | ResponseError> {
        return this.makeRequest("/app", {}, "GET");
    }

    public createForm(data: CreateFormData): Promise<ResponseData<FormDataResponse> | ResponseError> {
        return this.makeRequest<FormDataResponse>("/app", data, "PUT");
    }
}