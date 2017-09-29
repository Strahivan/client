export function setOpenGraphElements(type, data) {
  const openGraphData = getOpenGraphData(type, data);
  setOpenGraphData(openGraphData);
}

function getOpenGraphData(type, data) {
  switch (type) {
    case 'collection': {
      return getGraphObject(data.name, data.picture, data.description);
    }
    case 'product': {
      return getGraphObject(data.name, data.gallery[0], data.description);
    }
  }
}

function getGraphObject(name, picture, description) {
  return [
    {
      property: 'og:title',
      content: name
    },
    {
      property: 'og:image',
      content: picture
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:description',
      content: description
    },
    {
      property: 'og:url',
      content: window.location.href
    }
  ];
}

function setOpenGraphData(meta) {
  meta.forEach(item => {
    const elem = getElementByXpath(`/html/head/meta[@property="${item.property}"]`);
    elem.setAttribute('content', item.content);
  });
}

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

export function setProductJsonLd(data, container) {
  const jsonLdData = getProductJsonLd(data);
  setJsonLd(jsonLdData, 'productld', container);
}

function getProductJsonLd(product) {
  return {
    '@context': 'http://schema.org/',
    '@type': 'Product',
    'name': product.name,
    'image': product.gallery,
    'description': product.description,
    'brand': {
      '@type': 'Thing',
      'name': product.brand && product.brand.name
    },
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'SGD',
      'price': product.price,
      'priceValidUntil': '2020-11-05',
      'itemCondition': 'http://schema.org/NewCondition',
      'availability': 'http://schema.org/InStock',
      'seller': {
        '@type': 'Organization',
        'name': 'Novelship'
      }
    }
  };
}

export function setProductBreadCrumb(data, container) {
  const jsonLdData = getProductBreadCrumb(data);
  setJsonLd(jsonLdData, 'productBreadCrumb', container);
}

function getProductBreadCrumb(product, container) {
  return {
    '@context': 'http://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'item': {
          '@id': `https://www.novelship.com/categories/${product.category_id}`,
          'name': product.category.name
        }
      }, {
        '@type': 'ListItem',
        'position': 2,
        'item': {
          '@id': `https://www.novelship.com/brands/${product.brand_id}`,
          'name': product.brand.name,
          'image': product.brand.logo
        }
      }, {
        '@type': 'ListItem',
        'position': 3,
        'item': {
          '@id': `https://www.novelship.com/products/${product.id}`,
          'name': product.name,
          'image': product.gallery[0]
        }
      }
    ]
  };
}

function setJsonLd(content, jsonldId, container) {
  let jsonldElement = document.getElementById(jsonldId);
  if (!jsonldElement) {
    jsonldElement = document.createElement('script');
    jsonldElement.type = 'application/ld+json';
    jsonldElement.id = jsonldId;
    container.appendChild(jsonldElement);
  }
  jsonldElement.text = JSON.stringify(content);
}

