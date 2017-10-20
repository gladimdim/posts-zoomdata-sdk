async function initMetaThread() {
    const client = await ZoomdataSDK.createClient({
        credentials: {
            key: "KVKWiD8kUl"
        },
        application: {
            secure: true,
            host: "developer.zoomdata.com",
            port: 443,
            path: "/zoomdata-2.6"
        }
    });
    const metaThread = await client.createMetaThread({});
    const metaData = await metaThread.requestMetaDataForSourceId("59e9dbbfbd565be80baaccd8");
    return metaData;
}

const initApp = async () => {
    const meta = await initMetaThread();
    console.log('Received meta data for source: ', meta);
}

initApp();