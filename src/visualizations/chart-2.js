import { responsivefy } from './helper.js';

const chartTwo = () => {
	const abs = document.getElementById('internet-purchases__filter__result');
	const age = document.getElementById('internet-purchases__filter__age');
	const gender = document.getElementById('internet-purchases__filter__gender');

	abs.addEventListener('change', () => {
		chart(abs.value, age.value, gender.value);
	});
	age.addEventListener('change', () => {
		chart(abs.value, age.value, gender.value);
	});
	gender.addEventListener('change', () => {
		chart(abs.value, value, age.value, gender.value);
	});
	chart(abs.value, age.value, gender.value);
};
// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 60 },
	width = 460 - margin.left - margin.right,
	height = 250 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg1 = d3
	.select('#chart-2-1')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.call(responsivefy)
	.append('g')
	.attr('transform', `translate(${margin.left},${margin.top})`);
const svg2 = d3
	.select('#chart-2-2')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.call(responsivefy)
	.append('g')
	.attr('transform', `translate(${margin.left},${margin.top})`);
const svg3 = d3
	.select('#chart-2-3')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.call(responsivefy)
	.append('g')
	.attr('transform', `translate(${margin.left},${margin.top})`);
const svg4 = d3
	.select('#chart-2-4')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.call(responsivefy)
	.append('g')
	.attr('transform', `translate(${margin.left},${margin.top})`);

const chart = async (abs, age, gender) => {
	d3.selectAll('#chart-2-1 > svg > g > *').remove();
	d3.selectAll('#chart-2-2 > svg > g > *').remove();
	d3.selectAll('#chart-2-3 > svg > g > *').remove();
	d3.selectAll('#chart-2-4 > svg > g > *').remove();
	// Load the data file
	const data = await d3.csv('./src/data/104.csv', (d) => {
		if (
			d['Resultat'] == 'Wert' &&
			d['Absolut / relativ'] == abs &&
			d['Altersklasse'] == age &&
			d['Geschlecht'] == gender &&
			d['Bildungsstand'] == 'Bildungsstand - Total'
		) {
			return {
				value: d['num'],
				year: d3.timeParse('%Y')(d['Jahr']),
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
	const dat = d3
		.nest()
		.key((d) => d.ecommerce)
		.entries(
			data.filter(
				(d) =>
					d.ecommerce == 'Einkäufe im Internet in den letzten drei Monaten' ||
					d.ecommerce == ' Einkäufe im Internet in den letzten zwölf Monaten'
			)
		);

	// SETTING UP Chart 2
	// Add X axis
	const x = d3
		.scaleTime()
		.domain(d3.extent(data, (x) => x.year))
		.range([0, width]);
	svg1
		.append('g')
		.attr('transform', `translate(0, ${height})`)
		.call(d3.axisBottom(x));

	// Add Y axis
	const y = d3
		.scaleLinear()
		.domain([0, d3.max(data, (d) => +d.value)])
		.range([height, 0]);
	svg1.append('g').call(d3.axisLeft(y));

	//colors
	const res = dat.map((d) => d.key);

	// https://d3-graph-gallery.com/graph/line_several_group.html
	// Add the line
	svg1
		.selectAll('.line')
		.data(sumstat)
		.enter()
		.append('path')
		.attr('fill', 'none')
		.attr('stroke', function (d) {
			return color(d.key);
		})
		.attr('stroke-width', 1.5)
		.attr('d', function (d) {
			return d3
				.line()
				.x(function (d) {
					return x(d.year);
				})
				.y(function (d) {
					return y(+d.n);
				})(d.values);
		});
};

export { chartTwo };
