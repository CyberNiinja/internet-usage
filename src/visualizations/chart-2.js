const test = () => {};

const get101 = async () => {
	const data = d3.csv('/src/data/101.csv').then((it) => console.log(it));
};

export { test, get101 };
