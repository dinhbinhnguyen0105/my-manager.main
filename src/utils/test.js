const isValidProxy = async (proxy) => {
    try {
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

(async () => {
    const isValid = await isValidProxy('116.103.78.107:22008:khljtiNj3Kd:fdkm3nbjg45d');
    console.log({ isValid })
})();