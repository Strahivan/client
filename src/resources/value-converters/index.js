const valueConverters = [
  'cast-to-date',
  'to-array',
  'to-number',
  'to-date',
  'markdown',
  'to-currency',
  'to-list'
];

export default valueConverters.map(vc => `./value-converters/${vc}`);

