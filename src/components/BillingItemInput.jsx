import { Input } from "./Input";
import { Button } from "./Button";
import Search from "./Search";

export default function BillingItemInput({
  price,
  setPrice,
  weight,
  setWeight,
  priceRef,
  errors,
  selectedItem,
  setSelectedItem,
  onAddItem,
}) {
  return (
    <div className="flex flex-col gap-1">
      <Search selectedItem={selectedItem} setSelectedItem={setSelectedItem} />

      <div className="flex gap-2">
        <div className="flex flex-col flex-1">
          <Input
            type="number"
            placeholder="Weight (Kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          {errors.weight && (
            <p className="text-red-500 text-sm">{errors.weight}</p>
          )}
        </div>

        <div className="flex flex-col flex-1">
          <Input
            ref={priceRef}
            type="number"
            placeholder="Price per Kg"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          {errors.price && (
            <p className="text-red-500 text-sm">{errors.price}</p>
          )}
        </div>

        <Button onClick={onAddItem} disabled={!price || !weight}>
          Add
        </Button>
      </div>
    </div>
  );
}
