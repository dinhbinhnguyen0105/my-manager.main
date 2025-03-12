// getProxy.ts

const isValidIpPort = (input: string): boolean => {
    const isValidPort = (port: number): boolean => !isNaN(port) && port >= 0 && port <= 65535;
    const isValidIp = (ip: string): boolean => {
        const ipParts = ip.split('.');
        if (ipParts.length !== 4) {
            return false;
        };

        for (const part of ipParts) {
            const num = parseInt(part, 10);
            if (isNaN(num) || num < 0 || num > 255) {
                return false;
            };
        };
        return true;
    };

    if (typeof input !== "string") return false;
    const parts = input.split(':');
    if (parts.length < 2) {
        return false;
    };
    const ip = parts[0];
    const port = parseInt(parts[1], 10);
    if (!isValidIp(ip) || !isValidPort(port)) {
        return false;
    };
    return true;
}

const getProxy = (urls: string[]): Promise<{ status: number, proxy: string }> => {
    return new Promise(async (resolve, reject) => {
        // const urlSplitted =url.split("|");
        for (let url of urls) {
            if (isValidIpPort(url)) { resolve({ status: 200, proxy: url }); };
            if (url.includes("https://proxyxoay.shop/")) {
                const resRaw = await fetch(url.trim());
                const res = await resRaw.json();
                console.log(res);
                if (res.status === 100) {
                    resolve({
                        status: 200,
                        proxy: res.proxyhttp,
                    });
                } else if (res.status === 101) {
                    resolve({
                        status: 300,
                        proxy: "",
                    });
                } else {
                    //
                };
            } else {
                ///
            };
        };
        reject({
            status: 500,
            message: "Failed to fetch proxy from server",
        });
    });
};

export default getProxy;