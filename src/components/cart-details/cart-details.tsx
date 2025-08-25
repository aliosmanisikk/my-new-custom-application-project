import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { InfoModalPage } from '@commercetools-frontend/application-components';
import Grid from '@commercetools-uikit/grid';
import Spacings from '@commercetools-uikit/spacings';


type TCartDetailsProps = {
  goToCartList: () => void;
};

const CartDetails = (props: TCartDetailsProps) => {
  const params = useParams<{id: string}>();

  return (
    <InfoModalPage
      isOpen
      title={
         'Cart Details'
      }
      onClose={props.goToCartList}
    >
    <Spacings.Stack scale="xl">
        <Spacings.Stack scale="l">
          
            <Grid
              gridGap="16px"
              gridAutoColumns="1fr"
              gridTemplateColumns="repeat(2, 1fr)"
            >
              <iframe  width="2240" height="2240" src={`https://io-whitelabel-testing.grandvision.io/cart?cartId=${params.id}`} title="Cart details"></iframe>
            </Grid>

        </Spacings.Stack>
    </Spacings.Stack>
    </InfoModalPage>
  );
};
CartDetails.displayName = 'CartDetails';
CartDetails.propTypes = {
  goToCartList: PropTypes.func.isRequired,
};

export default CartDetails;
