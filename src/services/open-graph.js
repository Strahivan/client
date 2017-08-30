export class OpenGraphMetadataService {
  static setMeta(meta) {
    meta.forEach(item => {
      const elem = OpenGraphMetadataService.getElementByXpath(`/html/head/meta[@property="${item.property}"]`);
      console.log(elem);
      elem.setAttribute('content', item.content);
    });
  }

  static getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  }
}
