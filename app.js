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

const initApp = async () => {
    const visualization = await visualize();
    visualization.query.validationErrors.subscribeOnNext((err) => {
        console.log(err);
    });
    const rootDom = document.getElementById("controls");
    const metaData = visualization.metaThread.getLatestResponse();
    const aggrs = metaData.getAttrAggregations().filter((aggr) => {
        return aggr.getType() === "TERMS";
    });
    const aggrsNames = aggrs.map((aggr) => {
        return aggr.getName();
    });
    const control = createControl(aggrsNames);

    control.addEventListener("change", (e) => {
        console.log(e.target.value)
        const firstAggregation = visualization.query.getAggregations(0);

        firstAggregation[0].field.name = e.target.value;
        visualization.query.setAggregation(0, 0, firstAggregation[0]);
    });
    rootDom.appendChild(control);
}

const createControl = (aggrNames) => {
    const rootElement = document.createElement("select");
    rootElement.setAttribute("name", "aggregations");
    for (let name of aggrNames) {
        const optionElement = document.createElement("option");
        optionElement.textContent = name;
        rootElement.appendChild(
            optionElement
        );
    }
    return rootElement;
}

initApp();