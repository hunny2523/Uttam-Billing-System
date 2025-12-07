import React, { useState, useEffect } from "react";
import CreatableSelect from "react-select/creatable";
import { useItems } from "../hooks/useItems";

const Search = ({ selectedItem, setSelectedItem }) => {
  // Only fetch active items for billing (includeInactive = false)
  const { data, isLoading, error } = useItems(false);
  const [itemsList, setItemsList] = useState([]);

  // Update items list when data is fetched
  useEffect(() => {
    if (data?.items) {
      // Transform API data to match Select format
      const transformedItems = data.items.map((item) => ({
        label: item.labelGujarati,
        value: item.value,
        price: item.price,
        id: item.id,
        labelGujarati: item.labelGujarati,
        labelEnglish: item.labelEnglish,
      }));
      setItemsList(transformedItems);
    }
  }, [data]);

  // Function to handle selection or new entry
  const handleChange = (newValue) => {
    setSelectedItem(newValue);
  };

  // Function to add new item to the list
  const handleCreate = (inputValue) => {
    const newItem = {
      label: inputValue,
      value: inputValue.toLowerCase().replace(/\s+/g, "-"),
      // No price for custom items - user must enter manually
    };
    setItemsList([...itemsList, newItem]); // Add new item to list
    setSelectedItem(newItem); // Select the newly added item
  };

  if (error) {
    return (
      <div className="w-full mx-auto my-4">
        <div className="text-red-500 text-sm mb-2">
          Failed to load items. Using offline mode.
        </div>
        <CreatableSelect
          options={[]}
          value={selectedItem}
          onChange={handleChange}
          onCreateOption={handleCreate}
          placeholder="Type Item Name"
          isClearable
        />
      </div>
    );
  }

  return (
    <div className="w-full mx-auto my-4 ">
      <CreatableSelect
        options={itemsList}
        value={selectedItem}
        onChange={handleChange}
        onCreateOption={handleCreate}
        placeholder={isLoading ? "Loading items..." : "Type Item Name"}
        isClearable
        isLoading={isLoading}
        isDisabled={isLoading}
      />
    </div>
  );
};

export default Search;
