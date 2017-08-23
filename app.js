async function initializeClient() {
    const client = await ZoomdataSDK.createClient({
        credentials: {
            key: 'KhukSxkaka'
        },
        application: {
                secure: false,
                host: 'localhost',
                port: 8080,
                path: '/zoomdata'
        }
    });
    return client;
}

const visualize = async () => {
    const client = await initializeClient();
    const query = await client.createQuery(
        {name: "My IMPALA Source"},
        {
            groups: [
                {
                    'name': 'userstate',
                    'limit': 50,
                    'sort': {
                        'dir': 'asc',
                        'name': 'userstate'
                    }
                }
            ],
            metrics: [
                {
                    name: "plannedsales",
                    func: "sum"
                }
            ]
        }
    );
    const visualization = await client.visualize({
        element: document.getElementById("visContainer"),
        query: query,
        visualization: "Bars",
        variables: {}
    });
    return visualization;
};

visualize();