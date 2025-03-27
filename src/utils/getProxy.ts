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

const isValidProxy = async (proxy: string | unknown): Promise<boolean> => {
    try {
        if (typeof proxy !== "string") { return false; };
        const resRaw = await fetch("https://checkproxy.vip/check_proxy.php", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                proxies: [proxy],
                format: 'host:port:username:password',
                type: 'http'
            }),
        });

        const res = await resRaw.json();
        if (res[0].status.toLowerCase().includes("live")) { return true; }
        else { return false; };
    } catch (error) {
        console.error("ERROR [isValidProxy]: ", error);
        return false;
    }
}

const getProxy = async (url: string): Promise<{ status: number, message?: string, proxy?: string } | null> => {
    try {
        if (isValidIpPort(url)) {
            return {
                status: 200,
                proxy: url,
            };
        } else {
            if (url.includes("https://proxyxoay.shop/")) {
                const resRaw = await fetch(url.trim());
                const res = await resRaw.json();
                if (res.status === 100) {
                    return {
                        status: 200,
                        proxy: res.proxyhttp,
                    };
                } else {
                    console.error("ERROR [getProxy]: ", res);
                    return null;
                };
            } else {
                console.error("Invalid host handler.");
                return null;
            };
        };
    } catch (error) {
        console.error(error);
        return null;
    };
}

export default getProxy;
export { isValidProxy };