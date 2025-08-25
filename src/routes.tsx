import { useCallback, type ReactNode } from 'react';
import { Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import Spacings from '@commercetools-uikit/spacings';
import Orders from './components/orders';
import Carts from './components/carts';
import Welcome from './components/welcome';
import CartDetails from './components/cart-details';

type ApplicationRoutesProps = {
  children?: ReactNode;
};
const ApplicationRoutes = (_props: ApplicationRoutesProps) => {
  const match = useRouteMatch();
  const history = useHistory();

  const goToCartList = useCallback(() => {
    history.push(`${match.url}/carts`);
  }, [history, match.url]);
  const goToCartDetails = useCallback(
    (id: string) => {
      history.push(`${match.url}/carts/${id}`);
    },
    [history, match.url]
  );

  /**
   * When using routes, there is a good chance that you might want to
   * restrict the access to a certain route based on the user permissions.
   * You can evaluate user permissions using the `useIsAuthorized` hook.
   * For more information see https://docs.commercetools.com/merchant-center-customizations/development/permissions
   *
   * NOTE that by default the Custom Application implicitly checks for a "View" permission,
   * otherwise it won't render. Therefore, checking for "View" permissions here
   * is redundant and not strictly necessary.
   */

  return (
    <Spacings.Inset scale="l">
      <Switch>
        <Route path={`${match.path}/orders`}>
          <Orders linkToWelcome={match.url} />
        </Route>
        <Route path={`${match.path}/carts`}>
          <Carts linkToWelcome={match.url}  goToCartDetails={goToCartDetails}>
            <Route path={`${match.path}/carts/:id`}>
              <CartDetails
                goToCartList={goToCartList}
              />
            </Route>
          </Carts>
        </Route>   
        <Route>
          <Welcome />
        </Route>
      </Switch>
    </Spacings.Inset>
  );
};
ApplicationRoutes.displayName = 'ApplicationRoutes';

export default ApplicationRoutes;
