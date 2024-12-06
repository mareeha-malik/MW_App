import { useState } from "react";
import Modal from "./Modal";
import axios from "axios";

interface Product {
  id: number;
  title: string;
  description: string;
  rating: number;
  price: number;
  img: string | null;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const AddProductModal = ({
  isOpen,
  onClose,
  setProducts,
}: AddProductModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [imageURL, setImageURL] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds 10MB");
      } else {
        setError("");
        setImage(file);
        setImageURL(URL.createObjectURL(file));
      }
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title || !description || !rating || !price || !image) {
      setError("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("rating", rating);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const response = await axios.post(
        "http://localhost:8000/product/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status > 400) {
        throw new Error("Failed to add product");
      }

      const newProduct: Product = response.data;
      setProducts((prevProducts) => [...prevProducts, newProduct]);
      onClose();

      // Reset form fields
      setTitle("");
      setDescription("");
      setRating("");
      setPrice("");
      setImage(null);
      setImageURL(null);
      setError("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex justify-center items-center text-black min-h-screen p-4 bg-gray-500 bg-opacity-50">
        <div className="bg-transparent rounded-xl shadow-xl p-8 w-full sm:w-[400px]">
          <h1 className="text-2xl font-semibold mb-6 text-center text-orange-500">Add Product</h1>
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {error && <p className="text-red-500 text-center">{error}</p>}

            <label htmlFor="title" className="text-lg">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter title"
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label htmlFor="description" className="text-lg">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter description"
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>

            <label htmlFor="rating" className="text-lg">
              Rating
            </label>
            <input
              type="number"
              id="rating"
              placeholder="Enter rating"
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            />

            <label htmlFor="price" className="text-lg">
              Price
            </label>
            <input
              type="number"
              id="price"
              placeholder="Enter price"
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <label htmlFor="image" className="text-lg">
              Image
            </label>
            <input
              type="file"
              id="image"
              className="border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleFileChange}
            />

            {imageURL && (
              <div className="mt-4 text-center">
                <h3 className="text-lg mb-2">Image Preview:</h3>
                <img
                  src={imageURL}
                  alt="Preview"
                  className="max-w-[300px] h-auto mx-auto rounded-md"
                />
              </div>
            )}

            <button
              type="submit"
              className="bg-orange-500 text-white p-3 rounded-md mt-4 hover:bg-orange-600 transition-colors"
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddProductModal;
