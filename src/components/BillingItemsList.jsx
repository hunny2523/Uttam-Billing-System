import { CardContent } from "./Card";
import CloseIcon from "../icons/CloseIcon";
import { formatWeight } from "../utils/helper";

export default function BillingItemsList({ items, onRemoveItem }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="my-4">
      {items.map((item, index) => (
        <CardContent
          key={index}
          className="flex justify-between bg-gray-50 p-2 mb-2 rounded-lg"
        >
          <span>{item.name}</span>
          <span>
            {item.price} x {formatWeight(item.weight)}
          </span>
          <span className="font-bold">₹{item.total.toFixed(2)}</span>
          <div
            onClick={() => onRemoveItem(index)}
            className="cursor-pointer hover:opacity-70"
          >
            <CloseIcon />
          </div>
        </CardContent>
      ))}
    </div>
  );
}
