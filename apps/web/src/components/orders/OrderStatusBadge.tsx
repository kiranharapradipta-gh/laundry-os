import type { OrderStatus } from "../../types/order";
import { ORDER_STATUS_CLASS, ORDER_STATUS_LABEL } from "../../utils/order";

interface Props {
  status: OrderStatus;
}

export default function OrderStatusBadge({ status }: Props) {
  return (
    <span className={`order-status-badge ${ORDER_STATUS_CLASS[status]}`}>
      <span className="order-status-dot" />
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}