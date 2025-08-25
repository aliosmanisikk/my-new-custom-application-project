import { useIntl } from 'react-intl';
import {
  Link as RouterLink,
  Switch,
} from 'react-router-dom';
import {
  usePaginationState,
  useDataTableSortingState,
} from '@commercetools-uikit/hooks';
import { BackIcon } from '@commercetools-uikit/icons';
import Constraints from '@commercetools-uikit/constraints';
import FlatButton from '@commercetools-uikit/flat-button';
import LoadingSpinner from '@commercetools-uikit/loading-spinner';
import DataTable from '@commercetools-uikit/data-table';
import { ContentNotification } from '@commercetools-uikit/notifications';
import { Pagination } from '@commercetools-uikit/pagination';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import type { TFetchCartsQuery } from '../../types/generated/ctp';
import { useCartsFetcher } from '../../hooks/use-carts-connector';
import { getErrorMessage } from '../../helpers';
import messages from './messages';
import PropTypes from 'prop-types';

const columns = [
  { key: 'id', label: 'Cart Id' },
  { key: 'createdAt', label: 'Cart date' },
  { key: 'price', label: 'Cart value' },
  { key: 'state', label: 'Cart state' },
  { key: 'shippingMethod', label: 'Shipping method' },
];

type TCartsProps = {
  linkToWelcome: string;
  goToCartDetails: (id: string) => void;
  children: React.ReactNode;
};

const Carts = (props: TCartsProps) => {
  const intl = useIntl();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'createdAt', order: 'desc' });
  const { cartsPaginatedResult, error, loading } = useCartsFetcher({
    page,
    perPage,
    tableSorting,
  });

  if (error) {
    return (
      <ContentNotification type="error">
        <Text.Body>{getErrorMessage(error)}</Text.Body>
      </ContentNotification>
    );
  }

  return (
    <Spacings.Stack scale="xl">
      <Spacings.Stack scale="xs">
        <FlatButton
          as={RouterLink}
          to={props.linkToWelcome}
          label={intl.formatMessage(messages.backToWelcome)}
          icon={<BackIcon />}
        />
        <Text.Headline as="h2" intlMessage={messages.title} />
      </Spacings.Stack>

      <Constraints.Horizontal max={13}>
        <ContentNotification type="info">
          <Text.Body intlMessage={messages.demoHint} />
        </ContentNotification>
      </Constraints.Horizontal>

      {loading && <LoadingSpinner />}

      {cartsPaginatedResult ? (
        <Spacings.Stack scale="l">
          <DataTable<NonNullable<TFetchCartsQuery['carts']['results']>[0]>
            isCondensed
            columns={columns}
            rows={cartsPaginatedResult.results}
            itemRenderer={(item, column) => {
              switch (column.key) {
                case 'id':
                  return item.id;
                case 'price':
                  return `${item.totalPrice.centAmount / 100} ${item.totalPrice.currencyCode}`;
                case 'state':
                  return item.cartState;
                case 'shippingMethod':
                  return item.shippingInfo?.shippingMethodName || 'N/A';
                case 'createdAt':
                  return `${intl.formatDate(item.createdAt)} ${intl.formatTime(item.createdAt)}` ;
                default:
                  return null;
              }
            }}
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
              onRowClick={({ id }) => {
                props.goToCartDetails(id);
              }}

          />
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={cartsPaginatedResult.total}
            perPageRange="s"
          />
        </Spacings.Stack>
      ) : null}
      <Switch>
  {props.children}
</Switch>

    </Spacings.Stack>
  );
};
Carts.displayName = 'Carts';
Carts.propTypes = {
  goToCartDetails: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Carts;
