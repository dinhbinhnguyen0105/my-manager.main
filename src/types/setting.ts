export interface SettingInterface {
    isMobile: boolean,
    proxy: string,
    process: number,
    [key: string]: unknown,
}

const initSettingState: SettingInterface = {
    isMobile: false,
    proxy: "",
    process: 1
};

export { initSettingState };