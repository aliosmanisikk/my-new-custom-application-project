import { useIntl } from 'react-intl';
import {
  Link as RouterLink,
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
import type { TFetchOrdersQuery } from '../../types/generated/ctp';
import { useOrdersFetcher } from '../../hooks/use-orders-connector';
import { getErrorMessage } from '../../helpers';
import messages from './messages';

const columns = [
  { key: 'orderNumber', label: 'Order number' },
  { key: 'createdAt', label: 'Order date' },
  { key: 'price', label: 'Order value' },
  { key: 'paymentMethod', label: 'Payment method' },
];

type TOrdersProps = {
  linkToWelcome: string;
};

const Orders = (props: TOrdersProps) => {
  const intl = useIntl();
  const { page, perPage } = usePaginationState();
  const tableSorting = useDataTableSortingState({ key: 'createdAt', order: 'desc' });
  const { ordersPaginatedResult, error, loading } = useOrdersFetcher({
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

      {ordersPaginatedResult ? (
        <Spacings.Stack scale="l">
          <DataTable<NonNullable<TFetchOrdersQuery['orders']['results']>[0]>
            isCondensed
            columns={columns}
            rows={ordersPaginatedResult.results}
            itemRenderer={(item, column) => {
              switch (column.key) {
                case 'orderNumber':
                  return item.orderNumber;
                case 'price':
                  return `${item.totalPrice.centAmount} ${item.totalPrice.currencyCode}`;
                case 'paymentMethod':
                  return item.paymentInfo?.payments?.[0]?.paymentMethodInfo?.method || '-';
                case 'createdAt':
                  return `${intl.formatDate(item.createdAt)} ${intl.formatTime(item.createdAt)}` ;
                default:
                  return null;
              }
            }}
            sortedBy={tableSorting.value.key}
            sortDirection={tableSorting.value.order}
            onSortChange={tableSorting.onChange}
          />
          <Pagination
            page={page.value}
            onPageChange={page.onChange}
            perPage={perPage.value}
            onPerPageChange={perPage.onChange}
            totalItems={ordersPaginatedResult.total}
            perPageRange="s"
          />
        </Spacings.Stack>
      ) : null}
    </Spacings.Stack>
  );
};
Orders.displayName = 'Orders';

export default Orders;
