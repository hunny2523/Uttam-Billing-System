import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getItems,
  updateItemPrice,
  createItem,
  toggleItemStatus,
} from "../services/itemService";
import { toast } from "react-toastify";
import { Card, CardContent } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";

export default function ItemsManagement() {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // New item form state
  const [newItem, setNewItem] = useState({
    labelGujarati: "",
    labelEnglish: "",
    value: "",
    price: "",
  });

  const queryClient = useQueryClient();

  // Fetch all items (including inactive for admin management)
  const { data, isLoading, error } = useQuery({
    queryKey: ["items", "all"],
    queryFn: () => getItems(true), // includeInactive = true for admin
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const items = data?.items || [];

  // Update item price mutation
  const updatePriceMutation = useMutation({
    mutationFn: ({ id, price }) => updateItemPrice(id, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Price updated successfully!");
      setEditingItemId(null);
      setEditPrice("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update price");
    },
  });

  // Create item mutation
  const createItemMutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success("Item created successfully!");
      setIsAddingItem(false);
      setNewItem({ labelGujarati: "", labelEnglish: "", value: "", price: "" });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create item");
    },
  });

  // Toggle item status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: toggleItemStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      toast.success(data.message || "Item status updated!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to toggle status");
    },
  });

  const handleEditPrice = (item) => {
    setEditingItemId(item.id);
    setEditPrice(item.price.toString());
  };

  const handleSavePrice = (itemId) => {
    const price = parseFloat(editPrice);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    updatePriceMutation.mutate({ id: itemId, price });
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditPrice("");
  };

  const handleCreateItem = (e) => {
    e.preventDefault();

    if (!newItem.labelEnglish || !newItem.value || !newItem.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const price = parseFloat(newItem.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    createItemMutation.mutate({
      ...newItem,
      price,
    });
  };

  const handleToggleStatus = (itemId) => {
    toggleStatusMutation.mutate(itemId);
  };

  // Filter items based on search term
  const filteredItems = items.filter(
    (item) =>
      item.labelGujarati.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.labelEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Error loading items. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-2">
        <CardContent className="p-2">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Items Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Manage item prices and availability
              </p>
            </div>
            <Button
              onClick={() => setIsAddingItem(true)}
              disabled={isAddingItem}
              className="w-full md:w-auto"
            >
              ➕ Add New Item
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <Input
              type="text"
              placeholder="🔍 Search items by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Add Item Form */}
          {isAddingItem && (
            <Card className="mb-6 bg-green-50">
              <CardContent className="p-2">
                <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
                <form onSubmit={handleCreateItem} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Gujarati Label <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={newItem.labelGujarati}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            labelGujarati: e.target.value,
                          })
                        }
                        placeholder="ગુજરાતી નામ"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        English Label <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={newItem.labelEnglish}
                        onChange={(e) =>
                          setNewItem({
                            ...newItem,
                            labelEnglish: e.target.value,
                          })
                        }
                        placeholder="English Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Value/Code <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={newItem.value}
                        onChange={(e) =>
                          setNewItem({ ...newItem, value: e.target.value })
                        }
                        placeholder="e.g., laal_marchu"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) =>
                          setNewItem({ ...newItem, price: e.target.value })
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      onClick={() => {
                        setIsAddingItem(false);
                        setNewItem({
                          labelGujarati: "",
                          labelEnglish: "",
                          value: "",
                          price: "",
                        });
                      }}
                      className="bg-gray-500 hover:bg-gray-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createItemMutation.isPending}
                    >
                      {createItemMutation.isPending
                        ? "Creating..."
                        : "Create Item"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Items Count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredItems.length} of {items.length} items
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gujarati Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    English Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price (₹)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No items found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className={!item.isActive ? "bg-gray-100" : ""}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {item.labelGujarati}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {item.labelEnglish}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {item.value}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {editingItemId === item.id ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24"
                            autoFocus
                          />
                        ) : (
                          <span className="font-semibold">
                            ₹{item.price.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex gap-2 justify-end">
                          {editingItemId === item.id ? (
                            <>
                              <button
                                onClick={() => handleSavePrice(item.id)}
                                disabled={updatePriceMutation.isPending}
                                className="text-green-600 hover:text-green-900"
                              >
                                ✓
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-red-600 hover:text-red-900"
                              >
                                ✕
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditPrice(item)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleToggleStatus(item.id)}
                                disabled={toggleStatusMutation.isPending}
                                className={`${
                                  item.isActive
                                    ? "text-red-600 hover:text-red-900"
                                    : "text-green-600 hover:text-green-900"
                                }`}
                              >
                                {item.isActive
                                  ? "🚫 Deactivate"
                                  : "✅ Activate"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
