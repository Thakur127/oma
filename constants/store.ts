export const stores = [
  {
    id: 1,
    name: "Foodie",
    description: "Eat healthy and tasty food",
    image_url:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    created_at: new Date(),
  },
  {
    id: 2,
    name: "Gadget World",
    description: "Explore the latest and greatest tech gadgets",
    image_url:
      "https://images.unsplash.com/photo-1580910051075-0098a759ae13?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
    created_at: new Date(),
  },
  {
    id: 3,
    name: "Book Haven",
    description: "Dive into the world of literature and stories",
    image_url:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
    created_at: new Date(),
  },
  {
    id: 4,
    name: "Sports Gear",
    description: "Premium sports equipment for champions",
    image_url:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
    created_at: new Date(),
  },
  {
    id: 5,
    name: "Green Thumb",
    description: "Gardening essentials and plant care products",
    image_url:
      "https://images.unsplash.com/photo-1556912990-d6f23aa168ea?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
    created_at: new Date(),
  },
  {
    id: 6,
    name: "Style Hub",
    description: "Trendy apparel for all seasons",
    image_url:
      "https://images.unsplash.com/photo-1593032465175-399817ed4483?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3",
    created_at: new Date(),
  },
  // Add 25-30 more store entries with unique details and descriptions...
];

export const products = [
  {
    id: 1,
    name: "Apple",
    price: 1.99,
    quantity: 10,
    store_id: 1,
  },
  {
    id: 2,
    name: "Banana",
    price: 0.99,
    quantity: 20,
    store_id: 1,
  },
  {
    id: 3,
    name: "Orange",
    price: 1.49,
    quantity: 15,
    store_id: 1,
  },
  {
    id: 4,
    name: "Laptop",
    price: 799.99,
    quantity: 5,
    store_id: 2,
  },
  {
    id: 5,
    name: "Smartphone",
    price: 599.99,
    quantity: 8,
    store_id: 2,
  },
  {
    id: 6,
    name: "Wireless Earbuds",
    price: 129.99,
    quantity: 25,
    store_id: 2,
  },
  {
    id: 7,
    name: "Fiction Novel",
    price: 12.99,
    quantity: 40,
    store_id: 3,
  },
  {
    id: 8,
    name: "History Book",
    price: 18.99,
    quantity: 30,
    store_id: 3,
  },
  {
    id: 9,
    name: "Soccer Ball",
    price: 25.99,
    quantity: 15,
    store_id: 4,
  },
  {
    id: 10,
    name: "Yoga Mat",
    price: 19.99,
    quantity: 10,
    store_id: 4,
  },
  {
    id: 11,
    name: "Flower Pot",
    price: 5.99,
    quantity: 50,
    store_id: 5,
  },
  {
    id: 12,
    name: "Fertilizer",
    price: 8.99,
    quantity: 20,
    store_id: 5,
  },
  {
    id: 13,
    name: "Casual T-Shirt",
    price: 14.99,
    quantity: 30,
    store_id: 6,
  },
  {
    id: 14,
    name: "Winter Jacket",
    price: 49.99,
    quantity: 10,
    store_id: 6,
  },
  // Add 20-30 more product entries across various stores...
];

export const orders = [
  {
    id: 1,
    items: [
      {
        id: 1,
        name: "Apple",
        price: 1.99,
        quantity: 1,
      },
      {
        id: 2,
        name: "Banana",
        price: 0.99,
        quantity: 2,
      },
    ],
    quantity: 3,
    total: 3.97,
    status: "pending",
  },
  {
    id: 2,
    items: [
      {
        id: 4,
        name: "Laptop",
        price: 799.99,
        quantity: 1,
      },
    ],
    quantity: 1,
    total: 799.99,
    status: "fulfilled",
  },
  {
    id: 3,
    items: [
      {
        id: 13,
        name: "Casual T-Shirt",
        price: 14.99,
        quantity: 2,
      },
    ],
    quantity: 2,
    total: 29.98,
    status: "pending",
  },
  {
    id: 4,
    items: [
      {
        id: 9,
        name: "Soccer Ball",
        price: 25.99,
        quantity: 1,
      },
    ],
    quantity: 1,
    total: 25.99,
    status: "fulfilled",
  },
  {
    id: 5,
    items: [
      {
        id: 11,
        name: "Flower Pot",
        price: 5.99,
        quantity: 5,
      },
    ],
    quantity: 5,
    total: 29.95,
    status: "pending",
  },
  // Add 15-20 more order entries with unique items and details...
];
