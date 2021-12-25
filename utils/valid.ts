import { IUserInfor } from "@/models/common";

export const validSignUp = ({ name, email, password, cf_password }: IUserInfor) => {
    if (!name || !email || !password) {
        return 'Please add all fields.'
    }

    if (!validateEmail(email)) {
        return 'Invalid emails.'
    }

    if (password.length < 6) {
        return 'Password must be at least 6 characters.'
    }

    if (password !== cf_password) {
        return 'Confirm password did not match.'
    }
}

function validateEmail(email: string) {
    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
}