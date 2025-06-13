import type { RouteParams } from 'vue-router';
import type { Breadcrumb, CategoryTreeItem, Product, ProductParams } from '@plentymarkets/shop-api';
import { productGetters, categoryTreeGetters } from '@plentymarkets/shop-api';

export const validateProductParams = (params: RouteParams): boolean => {
  const itemId = params.itemId as string;
  if (!itemId) return false;

  const pieces = itemId.split('_');
  if (pieces.length === 0 || pieces.length > 2) return false;
  if (!pieces[0] || isNaN(Number(pieces[0]))) return false;
  if (pieces.length === 2 && (!pieces[1] || isNaN(Number(pieces[1])))) return false;

  return true;
};

export const createProductParams = (params: RouteParams) => {
  const productPieces = (params.itemId as string).split('_');

  const productParams: ProductParams = {
    id: productPieces[0],
  };

  if (productPieces[1]) {
    productParams.variationId = productPieces[1];
  }

  return { productParams, productId: productParams.id.toString() };
};

export const updateProductURLPathForVariation = (
  currentPath: string,
  itemId: string | number,
  variationId: string | number,
) => {
  const pathSegments = currentPath.split('/');
  let lastSegment = pathSegments.pop();
  if (!lastSegment) return currentPath;

  const lastSegmentParts = lastSegment.split('_');
  const itemIdPosition = lastSegmentParts.length - 1;

  itemId = String(itemId);
  variationId = String(variationId);

  if (lastSegmentParts[itemIdPosition] === itemId) {
    lastSegmentParts.push(variationId);
  } else {
    lastSegmentParts[itemIdPosition] = variationId;
  }

  lastSegment = lastSegmentParts.join('_');
  pathSegments.push(lastSegment);

  return pathSegments.join('/');
};

export const generateBreadcrumbs = (categoryTree: CategoryTreeItem[], product: Product, home: string): Breadcrumb[] => {
  const categoryId = productGetters.getCategoryIds(product)?.[0] ?? 0;
  const breadcrumbs = categoryTreeGetters.generateBreadcrumbFromCategory(categoryTree, Number(categoryId));
  const productName = productGetters.getName(product);

  breadcrumbs.unshift({ name: home, link: '/' });
  breadcrumbs.push({ name: productName, link: `#` });

  return breadcrumbs;
};
