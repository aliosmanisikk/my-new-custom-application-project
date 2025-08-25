import { lazy } from 'react';

const CartDetails = lazy(
  () => import('./cart-details' /* webpackChunkName: "carts" */)
);

export default CartDetails;
