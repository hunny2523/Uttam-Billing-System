import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CreatableSelect from "react-select/creatable";
import {
  getItems,
  updateItem,
  createItem,
  toggleItemStatus,
} from "../services/itemService";
import { toast } from "react-toastify";
import { Card, CardContent } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";

export default function ItemsManagement() {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [categoryGujaratiOptions, setCategoryGujaratiOptions] = useState([]);

  // New item form state
  const [newItem, setNewItem] = useState({
    labelGujarati: "",
    labelEnglish: "",
    value: "",
    price: "",
    category: "",
    categoryGujarati: "",
  });

  const queryClient = useQueryClient();

  // Fetch all items (including inactive for admin management)
  const { data, isLoading, error } = useQuery({
    queryKey: ["items", "all"],
    queryFn: () => getItems(true), // includeInactive = true for admin
    staleTime: 0, // Always refetch to show latest updates
    gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
  });

  const items = data?.items || [];

  // Extract unique categories from items for dropdown options
  useEffect(() => {
    if (items.length > 0) {
      // Get unique English categories
      const uniqueCategories = [
        ...new Set(
          items
            .map((item) => item.category)
            .filter((cat) => cat && cat.trim() !== ""),
        ),
      ];
      const categoryOpts = uniqueCategories.map((cat) => ({
        label: cat,
        value: cat,
      }));
      setCategoryOptions(categoryOpts);

      // Get unique Gujarati categories
      const uniqueCategoriesGujarati = [
        ...new Set(
          items
            .map((item) => item.categoryGujarati)
            .filter((cat) => cat && cat.trim() !== ""),
        ),
      ];
      const categoryGujaratiOpts = uniqueCategoriesGujarati.map((cat) => ({
        label: cat,
        value: cat,
      }));
      setCategoryGujaratiOptions(categoryGujaratiOpts);
    }
  }, [items]);

  // Update item mutation
  const updateItemMutation = useMutation({
    mutationFn: ({ id, itemData }) => updateItem(id, itemData),
    onSuccess: async (data) => {
      // Force immediate refetch with type: 'active' to ignore staleTime
      await queryClient.refetchQueries({
        queryKey: ["items"],
        type: "active",
        exact: false,
      });
      toast.success("Item updated successfully!");
      setIsEditDialogOpen(false);
      setEditingItem(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update item");
    },
  });

  // Create item mutation
  const createItemMutation = useMutation({
    mutationFn: createItem,
    onSuccess: async () => {
      // Force immediate refetch with type: 'active' to ignore staleTime
      await queryClient.refetchQueries({
        queryKey: ["items"],
        type: "active",
        exact: false,
      });
      toast.success("Item created successfully!");
      setIsAddingItem(false);
      setNewItem({
        labelGujarati: "",
        labelEnglish: "",
        value: "",
        price: "",
        category: "",
        categoryGujarati: "",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create item");
    },
  });

  // Toggle item status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: toggleItemStatus,
    onSuccess: async (data) => {
      // Force immediate refetch with type: 'active' to ignore staleTime
      await queryClient.refetchQueries({
        queryKey: ["items"],
        type: "active",
        exact: false,
      });
      toast.success(data.message || "Item status updated!");
      setIsEditDialogOpen(false);
      setEditingItem(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to toggle status");
    },
  });

  const handleRowClick = (item) => {
    setEditingItem({
      id: item.id,
      labelGujarati: item.labelGujarati,
      labelEnglish: item.labelEnglish,
      value: item.value,
      price: item.price.toString(),
      category: item.category || "",
      categoryGujarati: item.categoryGujarati || "",
      isActive: item.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();

    if (!editingItem.labelEnglish || !editingItem.value || !editingItem.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    const price = parseFloat(editingItem.price);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    updateItemMutation.mutate({
      id: editingItem.id,
      itemData: {
        labelGujarati: editingItem.labelGujarati,
        labelEnglish: editingItem.labelEnglish,
        value: editingItem.value,
        price,
        category: editingItem.category || null,
        categoryGujarati: editingItem.categoryGujarati || null,
      },
    });
  };

  const handleToggleStatus = () => {
    if (editingItem) {
      toggleStatusMutation.mutate(editingItem.id);
    }
  };

  // Handle category selection/creation
  const handleCategoryChange = (newValue) => {
    setEditingItem({
      ...editingItem,
      category: newValue ? newValue.value : "",
    });
  };

  const handleCategoryCreate = (inputValue) => {
    const newCategory = { label: inputValue, value: inputValue };
    setCategoryOptions([...categoryOptions, newCategory]);
    setEditingItem({
      ...editingItem,
      category: inputValue,
    });
  };

  const handleCategoryGujaratiChange = (newValue) => {
    setEditingItem({
      ...editingItem,
      categoryGujarati: newValue ? newValue.value : "",
    });
  };

  const handleCategoryGujaratiCreate = (inputValue) => {
    const newCategory = { label: inputValue, value: inputValue };
    setCategoryGujaratiOptions([...categoryGujaratiOptions, newCategory]);
    setEditingItem({
      ...editingItem,
      categoryGujarati: inputValue,
    });
  };

  // Handle category selection/creation for new item
  const handleNewItemCategoryChange = (newValue) => {
    setNewItem({
      ...newItem,
      category: newValue ? newValue.value : "",
    });
  };

  const handleNewItemCategoryCreate = (inputValue) => {
    const newCategory = { label: inputValue, value: inputValue };
    setCategoryOptions([...categoryOptions, newCategory]);
    setNewItem({
      ...newItem,
      category: inputValue,
    });
  };

  const handleNewItemCategoryGujaratiChange = (newValue) => {
    setNewItem({
      ...newItem,
      categoryGujarati: newValue ? newValue.value : "",
    });
  };

  const handleNewItemCategoryGujaratiCreate = (inputValue) => {
    const newCategory = { label: inputValue, value: inputValue };
    setCategoryGujaratiOptions([...categoryGujaratiOptions, newCategory]);
    setNewItem({
      ...newItem,
      categoryGujarati: inputValue,
    });
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
      category: newItem.category || null,
      categoryGujarati: newItem.categoryGujarati || null,
    });
  };

  // Filter items based on search term
  const filteredItems = items.filter(
    (item) =>
      item.labelGujarati.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.labelEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase()),
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
                    Price (₹)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No items found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleRowClick(item)}
                      className={`cursor-pointer transition-colors hover:bg-blue-50 ${
                        !item.isActive ? "bg-gray-100" : ""
                      }`}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-800 underline">
                        {item.labelGujarati}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {item.labelEnglish}
                      </td>

                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <span className="font-semibold">
                          ₹{item.price.toFixed(2)}
                        </span>
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Item Dialog */}
      {isEditDialogOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Edit Item</h2>
                <button
                  onClick={handleCloseDialog}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Gujarati Label <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={editingItem.labelGujarati}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
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
                      value={editingItem.labelEnglish}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
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
                      value={editingItem.value}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          value: e.target.value,
                        })
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
                      value={editingItem.price}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          price: e.target.value,
                        })
                      }
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category (Gujarati)
                    </label>
                    <CreatableSelect
                      value={
                        editingItem.categoryGujarati
                          ? {
                              label: editingItem.categoryGujarati,
                              value: editingItem.categoryGujarati,
                            }
                          : null
                      }
                      onChange={handleCategoryGujaratiChange}
                      onCreateOption={handleCategoryGujaratiCreate}
                      options={categoryGujaratiOptions}
                      placeholder="કેટેગરી પસંદ કરો અથવા બનાવો"
                      isClearable
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category (English)
                    </label>
                    <CreatableSelect
                      value={
                        editingItem.category
                          ? {
                              label: editingItem.category,
                              value: editingItem.category,
                            }
                          : null
                      }
                      onChange={handleCategoryChange}
                      onCreateOption={handleCategoryCreate}
                      options={categoryOptions}
                      placeholder="Select or create category"
                      isClearable
                    />
                  </div>
                </div>

                {/* Status Display */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Current Status:{" "}
                      </span>
                      <span
                        className={`ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          editingItem.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {editingItem.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <Button
                      type="button"
                      onClick={handleToggleStatus}
                      disabled={toggleStatusMutation.isPending}
                      className={`${
                        editingItem.isActive
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {toggleStatusMutation.isPending
                        ? "Updating..."
                        : editingItem.isActive
                          ? "🚫 Deactivate"
                          : "✅ Activate"}
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    onClick={handleCloseDialog}
                    className="bg-gray-500 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateItemMutation.isPending}>
                    {updateItemMutation.isPending
                      ? "Saving..."
                      : "💾 Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Add Item Dialog */}
      {isAddingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Add New Item
                </h2>
                <button
                  onClick={() => {
                    setIsAddingItem(false);
                    setNewItem({
                      labelGujarati: "",
                      labelEnglish: "",
                      value: "",
                      price: "",
                      category: "",
                      categoryGujarati: "",
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

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
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category (Gujarati)
                    </label>
                    <CreatableSelect
                      value={
                        newItem.categoryGujarati
                          ? {
                              label: newItem.categoryGujarati,
                              value: newItem.categoryGujarati,
                            }
                          : null
                      }
                      onChange={handleNewItemCategoryGujaratiChange}
                      onCreateOption={handleNewItemCategoryGujaratiCreate}
                      options={categoryGujaratiOptions}
                      placeholder="કેટેગરી પસંદ કરો અથવા બનાવો"
                      isClearable
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category (English)
                    </label>
                    <CreatableSelect
                      value={
                        newItem.category
                          ? {
                              label: newItem.category,
                              value: newItem.category,
                            }
                          : null
                      }
                      onChange={handleNewItemCategoryChange}
                      onCreateOption={handleNewItemCategoryCreate}
                      options={categoryOptions}
                      placeholder="Select or create category"
                      isClearable
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    type="button"
                    onClick={() => {
                      setIsAddingItem(false);
                      setNewItem({
                        labelGujarati: "",
                        labelEnglish: "",
                        value: "",
                        price: "",
                        category: "",
                        categoryGujarati: "",
                      });
                    }}
                    className="bg-gray-500 hover:bg-gray-600"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createItemMutation.isPending}>
                    {createItemMutation.isPending
                      ? "Creating..."
                      : "➕ Create Item"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
