
export interface UserInterface {
    info: {
        id: string,
        username: string,
        uid: string,
        password: string,
        twoFA: string,
        email: string,
        emailPassword: string,
        phoneNumber: string,
        birthDay: string,
        gender: string,
        avatar: string,
        group: string,
        type: string,
        note: string,
        status: string,
        createdAt: string,
        updatedAt: string,
    },
    browser: {
        name: string,
        mobile: {
            userAgent: string,
            screenHeight: number,
            screenWidth: number,
            viewportHeight: number,
            viewportWidth: number,
        },
        desktop: {
            userAgent: string,
            screenHeight: number,
            screenWidth: number,
            viewportHeight: number,
            viewportWidth: number,
        }
    },
    actions: {
        isSelected: boolean,
        [key: string]: unknown,
    }
}

const initUserState: UserInterface = {
    info: {
        id: "",
        username: "",
        uid: "",
        password: "",
        twoFA: "",
        email: "",
        emailPassword: "",
        phoneNumber: "",
        birthDay: "",
        gender: "",
        avatar: "",
        group: "",
        type: "",
        note: "",
        status: "",
        createdAt: "",
        updatedAt: "",
    },
    browser: {
        name: "",
        mobile: {
            userAgent: "",
            screenHeight: 0,
            screenWidth: 0,
            viewportHeight: 0,
            viewportWidth: 0
        },
        desktop: {
            userAgent: "",
            screenHeight: 0,
            screenWidth: 0,
            viewportHeight: 0,
            viewportWidth: 0
        }
    },
    actions: {
        isSelected: false,
    },
}

export { initUserState }