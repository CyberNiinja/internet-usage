import { responsivefy } from './helper.js';

const chartTwo = () => {
	const age = document.getElementById('internet-purchases__filter__age');
	const gender = document.getElementById('internet-purchases__filter__gender');
	age.addEventListener('change', () => {
		chart(age.value, gender.value);
	});
	gender.addEventListener('change', () => {
		chart(age.value, gender.value);
	});
	chart(age.value, gender.value);
};
// set the dimensions and margins of the graph
const margin = { top: 10, right: 30, bottom: 30, left: 30 },
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

const chart = async (age, gender) => {
	d3.selectAll('#chart-2-1 > svg > g > *').remove();
	d3.selectAll('#chart-2-2 > svg > g > *').remove();
	d3.selectAll('#chart-2-3 > svg > g > *').remove();
	d3.selectAll('#chart-2-4 > svg > g > *').remove();
	// Load the data file
	const data = await d3.csv('./src/data/104.csv', (d) => {
		if (
			d['num'] !== '"""....."""' &&
			d['Resultat'] == 'Wert' &&
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
	const filtered = data.filter(
		(d) =>
			(d.ecommerce == 'Einkäufe im Internet in den letzten drei Monaten' ||
				d.ecommerce == ' Einkäufe im Internet in den letzten zwölf Monaten' ||
				d.ecommerce ==
					' Mindestens einmal im Leben einen Einkauf im Internet getätigt') &&
			d.absolutivity == 'Anteil (in % der Gesamtbevölkerung)'
	);
	filtered.sort((a, b) => a.year - b.year);
	const tooltip = d3
		.select('#chart-2-1')
		.append('div')
		.style('opacity', 0)
		.attr('class', 'tooltip');

	const mouseover = (e, d) => {
		tooltip
			.html('Percentage: ' + d.value)
			.style('opacity', 1)
			.style('left', e.pageX - 60 + 'px')
			.style('top', e.pageY - 60 + 'px');
		d3.select(this).style('stroke', 'black');
	};

	const mouseleave = function (d) {
		tooltip.transition().duration(200).style('opacity', 0);
		d3.select(this).style('stroke', 'none');
	};

	const priceline = d3
		.line()
		.x((d) => x(d.year))
		.y((d) => y(d.value));

	const groupsOne = Array.from(
		d3.group(filtered, (d) => d.ecommerce),
		([key, value]) => ({ key, value })
	);
	const color = d3.scaleOrdinal(d3.schemeCategory10);

	// create axes
	const x = d3
		.scaleTime()
		.range([0, width])
		.domain(d3.extent(filtered, (x) => x.year));
	const y = d3.scaleLinear().range([height, 0]).domain([0, 100]);

	// add lines and circles
	groupsOne.forEach((d, i) => {
		svg1
			.append('path')
			.style('fill', 'none')
			.style('stroke', () => (d.color = color(d.key)))
			.attr('d', priceline(d.value));
		d.value.forEach((n) => {
			svg1
				.append('circle')
				.style('fill', () => (d.color = color(d.key)))
				.style('stroke', 'none')
				.attr('cx', x(n.year))
				.attr('cy', y(n.value))
				.attr('r', 3)
				.on('mouseover', (e, d) => mouseover(e, n))
				.on('mouseleave', mouseleave);
		});
		svg1
			.append('text')
			.attr('x', 8)
			.attr('y', 8 * i)
			.style('font-size', '8px')
			.style('fill', () => (d.color = color(d.key)))
			.text(d.key);
	});

	// add axes
	svg1
		.append('g')
		.attr('transform', `translate(0, ${height})`)
		.attr('stroke', 'hsl(0,0,0)')
		.call(d3.axisBottom(x));
	svg1.append('g').attr('stroke', 'hsl(0,0,0)').call(d3.axisLeft(y));
};

export { chartTwo };
