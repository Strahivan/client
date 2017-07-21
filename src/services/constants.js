export const constants = {
  requestStatus: [
    'pending', 'confirmed', 'processing', 'ready', 'completed', 'verify', 'approval', 'canceled', 'delivering', 'failed', 'rejected'
  ],
  deliveryOptions: [
    'pickup', 'courier', 'post'
  ],
  defaultShippingAddress: {
    line_1: '195 Pearl’s Hill Terrace',
    line_2: '#02-03A',
    zip: 'S168976',
    city: 'Singapore'
  },
  adwordsConversionLabels: {
    buyNow: 'rt_xCOK2-XEQv4u4oAM',
    purchase: 'NArACKa5-XEQv4u4oAM'
  },
  defaultDestination: 1,
  defaultPostage: 5,
  defaultCourier: 4
};
