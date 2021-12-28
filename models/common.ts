import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";

export type NextPageWithLayout = NextPage<any> & {
    getLayout?: (page: ReactElement) => ReactNode,
    typeAuth?: "notLoged" | "loged"
}

export type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export interface IUserInfor {
    name?: string,
    email?: string,
    password?: string,
    cf_password?: string,
    role?: string,
    root?: boolean
    [index: string]: any
}

export interface IMessage {
    description: string,
    status: "success" | "error" | "info" | "warning"
}

export interface IProduct {
    checked?: boolean,
    inStock: number,
    sold: number,
    title: string,
    price: number,
    description?: string,
    content?: string,
    category?: string,
    [index: string]: any
}

export interface Iorder {
    address: string,
    cart: IProduct[],
    createdAt: string,
    delivered: boolean,
    mobile: string,
    total: number,
    user: IUserInfor,
    paid: boolean,
    dateOfPayment?: string,
    paymentId: string,
    method: string
    [index: string]: any
}