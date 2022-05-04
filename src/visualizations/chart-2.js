import { responsivefy } from './helper.js';

const chartTwo = async () => {
	// set the dimensions and margins of the graph
	const margin = { top: 10, right: 30, bottom: 30, left: 60 },
		width = 460 - margin.left - margin.right,
		height = 250 - margin.top - margin.bottom;

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
	const data = await d3.csv('./src/data/104.csv', (d) => {
		if (
			d['Resultat'] == 'Wert' &&
			d['Absolut / relativ'] == 'Anzahl Personen' &&
			d['Altersklasse'] == 'Altersklasse - Total' &&
			d['E-commerce und E-banking'] ==
				' Einkäufe im Internet in den letzten zwölf Monaten' &&
			d['Geschlecht'] == 'Geschlecht - Total' &&
			d['Bildungsstand'] == 'Bildungsstand - Total'
		) {
			return {
				value: d['num'],
				year: d['Jahr'],
				ecommerce: d['E-commerce und E-banking'],
				gender: d['Geschlecht'],
				age: d['Altersklasse'],
				education: d['Bildungsstand'],
				absolutivity: d['Absolut / relativ'],
				valueType: d['Resultat'],
			};
		}
	});
	// sort data
	data.sort((a, b) => a.year - b.year);

	// SETTING UP THE CHART
	// Add X axis
	const x = d3
		.scaleBand()
		.range([0, width])
		.domain(data.map((d) => d.year))
		.padding(0.2);
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
		.selectAll()
		.data(data)
		.enter()
		.append('rect')
		.attr('x', (d) => x(d.year))
		.attr('y', (d) => y(d.value))
		.attr('width', x.bandwidth())
		.attr('height', (d) => height - y(d.value))
		.attr('fill', 'steelblue');
};

export { chartTwo };
