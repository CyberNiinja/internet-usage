import { responsivefy } from './helper.js';

const chartTwo = async () => {
	// set the dimensions and margins of the graph
	const margin = { top: 10, right: 30, bottom: 10, left: 30 },
		width = 600 - margin.left - margin.right,
		height = 350 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	const svg = d3
		.select('#chart-2')
		.append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.call(responsivefy)
		.append('g')
		.attr('transform', `translate(${margin.left},${margin.top})`);

	// Load the data file
	const data = await d3.csv('/src/data/107.csv', (d) => {
		if (
			d['Resultat'] == 'Wert' &&
			d['Absolut / relativ'] == 'Anzahl Personen' &&
			d['Altersklasse'] == 'Altersklasse - Total'
		) {
			return {
				value: d['num'],
				year: d['Jahr'],
				ecommerce: d['E-commerce: gekaufte Produkte'],
				gender: d['Geschlecht'],
				age: d['Altersklasse'],
				education: d['Bildungsstand'],
				absolutivity: d['Absolut / relativ'],
				valueType: d['Resultat'],
			};
		}
	});

	console.log(data);
	// SETTING UP THE CHART
	// Add X axis
	const x = d3
		.scaleBand()
		.range([0, width])
		.domain(data.map((d) => d.Jahr));
	svg
		.append('g')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom(x));

	// Add Y axis
	const y = d3
		.scaleLinear()
		.domain([0, d3.max(data, (d) => d.value)])
		.range([height, 0]);
	svg.append('g').call(d3.axisLeft(y));

	//add bar
	svg
		.append('path')
		.datum(data)
		.attr('fill', 'none')
		.attr('stroke', 'steelblue')
		.attr('stroke-width', 1.5)
		.attr(
			'd',
			d3.bar().x((d) => d.date)
		);
};

export { chartTwo };
